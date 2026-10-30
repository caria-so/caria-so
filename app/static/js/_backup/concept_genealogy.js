/**
 * concept_genealogy.js  v2
 *
 * Renders an interactive concept genealogy from a v2 fingerprint.
 * Reads real data: concept_genealogy, claims.final, evidence_graph.
 *
 *   renderGenealogy('container-id', fingerprintJSON);
 *
 * Data consumed:
 *   fp.concept_genealogy   → concepts with timeline, key_transitions, cross_field_gaps
 *   fp.claims.final        → claims with depends_on, supported_by, type
 *   fp.evidence_graph      → supporting/challenging paper counts per claim
 *   fp.literature.references → paper metadata (title, year, author)
 */

(function (global) {
  'use strict';

  var TRANSITION_STYLES = {
    builds_on:              { stroke: '#5DCAA5', dash: '',       label: 'builds on' },
    anomaly_ignored:        { stroke: '#F0997B', dash: '4 3',   label: 'anomaly ignored' },
    independent_convergence:{ stroke: '#AFA9EC', dash: '6 2',   label: 'convergence' },
    enables:                { stroke: '#85B7EB', dash: '',       label: 'enables' },
    synthesis:              { stroke: '#EF9F27', dash: '2 2',   label: 'synthesis' },
  };

  var CLAIM_TYPE_COLORS = {
    foundational: { fill: '#E1F5EE', stroke: '#5DCAA5', text: '#085041', label: '#0F6E56' },
    derived:      { fill: '#E6F1FB', stroke: '#85B7EB', text: '#0C447C', label: '#185FA5' },
    speculative:  { fill: '#FAEEDA', stroke: '#EF9F27', text: '#633806', label: '#854F0B' },
  };
  var DEFAULT_CLAIM_COLOR = { fill: '#F1EFE8', stroke: '#B4B2A9', text: '#444441', label: '#5F5E5A' };
  var DOMAIN_STYLE = { fill: '#EEEDFE', stroke: '#AFA9EC', text: '#3C3489', label: '#534AB7' };

  /* ── Extract and connect ── */

  function extractData(fp) {
    // Concepts
    var cgRaw = fp.concept_genealogy || {};
    var concepts = Object.keys(cgRaw).map(function (slug) {
      var d = cgRaw[slug];
      return {
        id: slug,
        label: humanize(slug),
        concept: d.concept || '',
        timeline: d.timeline || [],
        transitions: d.key_transitions || [],
        fields: d.fields_involved || [],
        gaps: d.cross_field_gaps || [],
        paperIds: extractPaperIds(d),
      };
    });

    // Claims
    var claimsRaw = (fp.claims && fp.claims.final) ? fp.claims.final : (fp.final_claims || []);
    var evGraph = fp.evidence_graph || {};

    var claims = claimsRaw.map(function (c) {
      var supported = new Set(c.supported_by || []);
      if (supported.size === 0 && evGraph[c.id]) {
        var eg = evGraph[c.id];
        ['supporting', 'challenging'].forEach(function (side) {
          var sideData = eg[side] || {};
          Object.keys(sideData).forEach(function (key) {
            (sideData[key] || []).forEach(function (pid) { supported.add(pid); });
          });
        });
      }
      return {
        id: c.id,
        type: c.type || 'derived',
        statement: c.statement || '',
        shortLabel: shortClaim(c.statement),
        dependsOn: c.depends_on || [],
        supportedBy: supported,
      };
    });

    // Concept → claim edges via shared papers
    var edges = [];
    concepts.forEach(function (con) {
      claims.forEach(function (cl) {
        var shared = [];
        con.paperIds.forEach(function (pid) {
          if (cl.supportedBy.has(pid)) shared.push(pid);
        });
        if (shared.length > 0) {
          edges.push({ from: con.id, to: cl.id, weight: shared.length, papers: shared });
        }
      });
    });

    // Paper lookup
    var paperLookup = {};
    var refs = (fp.literature && fp.literature.references) ? fp.literature.references : [];
    refs.forEach(function (r) {
      paperLookup[r.id] = { title: r.title, year: r.year, authors: r.authors };
    });

    return { concepts: concepts, claims: claims, edges: edges, paperLookup: paperLookup, evGraph: evGraph };
  }

  function extractPaperIds(conceptData) {
    var ids = new Set();
    (conceptData.timeline || []).forEach(function (t) { if (t.paper_id) ids.add(t.paper_id); });
    (conceptData.key_transitions || []).forEach(function (tr) {
      if (tr.from) ids.add(tr.from);
      if (tr.to) ids.add(tr.to);
    });
    return ids;
  }

  function humanize(slug) {
    return slug.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }).slice(0, 40);
  }

  function shortClaim(statement) {
    if (!statement) return '';
    var w = statement.split(/\s+/).slice(0, 6).join(' ');
    return w.length > 35 ? w.slice(0, 33) + '…' : w;
  }

  /* ── Render ── */

  function renderGenealogy(containerId, fingerprint) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var data = extractData(fingerprint);
    if (data.concepts.length === 0 && data.claims.length === 0) {
      container.innerHTML = '<p style="color:#666;font-size:14px;">No genealogy data.</p>';
      return;
    }

    // Layout
    var W = 680, PAD = 36;
    var CON_CX = 130, CON_RX = 90, CON_RY = 22;
    var CL_X = 460, CL_W = 180, CL_H = 28;

    var conSpacing = Math.max(48, Math.min(68, 420 / Math.max(data.concepts.length, 1)));
    var clSpacing = Math.max(38, Math.min(56, 420 / Math.max(data.claims.length, 1)));
    var conStartY = PAD + 16;
    var clStartY = PAD + 16;

    var conPos = {};
    data.concepts.forEach(function (c, i) { conPos[c.id] = { cx: CON_CX, cy: conStartY + i * conSpacing }; });
    var clPos = {};
    data.claims.forEach(function (c, i) { clPos[c.id] = { x: CL_X, y: clStartY + i * clSpacing }; });

    var maxY = Math.max(
      conStartY + data.concepts.length * conSpacing,
      clStartY + data.claims.length * clSpacing
    );
    var H = maxY + 50;

    // SVG
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('role', 'img');
    var titleEl = document.createElementNS(ns, 'title');
    titleEl.textContent = 'Concept genealogy';
    svg.appendChild(titleEl);

    // Defs
    var defs = document.createElementNS(ns, 'defs');
    var marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id', 'cg-arr');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '8'); marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '5'); marker.setAttribute('markerHeight', '5');
    marker.setAttribute('orient', 'auto-start-reverse');
    var mp = document.createElementNS(ns, 'path');
    mp.setAttribute('d', 'M2 1L8 5L2 9');
    mp.setAttribute('fill', 'none');
    mp.setAttribute('stroke', '#888');
    mp.setAttribute('stroke-width', '1.5');
    mp.setAttribute('stroke-linecap', 'round');
    marker.appendChild(mp);
    defs.appendChild(marker);
    svg.appendChild(defs);

    function appendEdges() {
      var edgesG = document.createElementNS(ns, 'g');
      data.edges.forEach(function (e) {
        var cp = conPos[e.from];
        var clp = clPos[e.to];
        if (!cp || !clp) return;
        var cy = clp.y + CL_H / 2;
        var sw = Math.min(2.5, 0.8 + e.weight * 0.35);
        var claim = data.claims.find(function (c) { return c.id === e.to; });
        var col = (CLAIM_TYPE_COLORS[claim ? claim.type : ''] || DEFAULT_CLAIM_COLOR).stroke;
        var path = document.createElementNS(ns, 'path');
        path.setAttribute('d', 'M' + (cp.cx + CON_RX) + ' ' + cp.cy +
          ' C' + (cp.cx + CON_RX + 80) + ' ' + cp.cy +
          ', ' + (clp.x - 80) + ' ' + cy +
          ', ' + clp.x + ' ' + cy);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', col);
        path.setAttribute('stroke-width', String(sw));
        path.setAttribute('opacity', '0.55');
        path.setAttribute('marker-end', 'url(#cg-arr)');
        path.setAttribute('class', 'cg-edge');
        path.setAttribute('data-from', e.from);
        path.setAttribute('data-to', e.to);
        edgesG.appendChild(path);
      });
      svg.appendChild(edgesG);
    }

    // Concept nodes
    var consG = document.createElementNS(ns, 'g');
    data.concepts.forEach(function (c) {
      var p = conPos[c.id];
      var g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'cg-node');
      g.setAttribute('data-id', c.id);
      g.style.cursor = 'pointer';

      var ell = document.createElementNS(ns, 'ellipse');
      ell.setAttribute('cx', p.cx); ell.setAttribute('cy', p.cy);
      ell.setAttribute('rx', CON_RX); ell.setAttribute('ry', CON_RY);
      ell.setAttribute('fill', DOMAIN_STYLE.fill);
      ell.setAttribute('stroke', DOMAIN_STYLE.stroke);
      ell.setAttribute('stroke-width', '0.5');
      g.appendChild(ell);

      // Two-line label
      var words = c.label.split(' ');
      var mid = Math.ceil(words.length / 2);
      var l1 = words.slice(0, mid).join(' ');
      var l2 = words.slice(mid).join(' ');

      var t1 = document.createElementNS(ns, 'text');
      t1.setAttribute('x', p.cx); t1.setAttribute('y', l2 ? p.cy - 6 : p.cy);
      t1.setAttribute('text-anchor', 'middle');
      t1.setAttribute('dominant-baseline', 'central');
      t1.setAttribute('font-size', '10'); t1.setAttribute('font-weight', '500');
      t1.setAttribute('fill', DOMAIN_STYLE.text);
      t1.textContent = l1;
      g.appendChild(t1);

      if (l2) {
        var t2 = document.createElementNS(ns, 'text');
        t2.setAttribute('x', p.cx); t2.setAttribute('y', p.cy + 7);
        t2.setAttribute('text-anchor', 'middle');
        t2.setAttribute('dominant-baseline', 'central');
        t2.setAttribute('font-size', '9');
        t2.setAttribute('fill', DOMAIN_STYLE.label);
        t2.textContent = l2;
        g.appendChild(t2);
      }
      consG.appendChild(g);
    });
    svg.appendChild(consG);

    // Claim nodes
    var clsG = document.createElementNS(ns, 'g');
    data.claims.forEach(function (c) {
      var p = clPos[c.id];
      var col = CLAIM_TYPE_COLORS[c.type] || DEFAULT_CLAIM_COLOR;
      var g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'cg-node');
      g.setAttribute('data-id', c.id);
      g.style.cursor = 'pointer';

      var rect = document.createElementNS(ns, 'rect');
      rect.setAttribute('x', p.x); rect.setAttribute('y', p.y);
      rect.setAttribute('width', CL_W); rect.setAttribute('height', CL_H);
      rect.setAttribute('rx', '4');
      rect.setAttribute('fill', col.fill);
      rect.setAttribute('stroke', col.stroke);
      rect.setAttribute('stroke-width', '0.5');
      g.appendChild(rect);

      var idT = document.createElementNS(ns, 'text');
      idT.setAttribute('x', p.x + 8); idT.setAttribute('y', p.y + CL_H / 2);
      idT.setAttribute('dominant-baseline', 'central');
      idT.setAttribute('font-size', '10'); idT.setAttribute('font-weight', '500');
      idT.setAttribute('fill', col.text);
      idT.textContent = c.id;
      g.appendChild(idT);

      var lT = document.createElementNS(ns, 'text');
      lT.setAttribute('x', p.x + 28); lT.setAttribute('y', p.y + CL_H / 2);
      lT.setAttribute('dominant-baseline', 'central');
      lT.setAttribute('font-size', '9');
      lT.setAttribute('fill', col.label);
      lT.textContent = c.shortLabel;
      g.appendChild(lT);

      clsG.appendChild(g);
    });
    svg.appendChild(clsG);

    appendEdges();

    // Legend
    var legendDiv = document.createElement('div');
    legendDiv.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;margin:0 0 8px;font-size:12px;color:var(--c-text-secondary,#666)';
    [
      [CLAIM_TYPE_COLORS.foundational.stroke, 'Foundational'],
      [CLAIM_TYPE_COLORS.derived.stroke, 'Derived'],
      [CLAIM_TYPE_COLORS.speculative.stroke, 'Speculative'],
      [DOMAIN_STYLE.stroke, 'Literature concept'],
    ].forEach(function (pair) {
      var span = document.createElement('span');
      span.innerHTML = '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:' + pair[0] + ';vertical-align:-1px;margin-right:3px"></span>' + pair[1];
      legendDiv.appendChild(span);
    });

    // Detail panel
    var detailDiv = document.createElement('div');
    detailDiv.style.cssText = 'padding:12px 16px;background:var(--c-background-gray,#f4f4f5);border-radius:8px;margin-top:10px;font-size:13px;color:var(--c-text-secondary,#666);line-height:1.7;max-height:320px;overflow-y:auto';
    detailDiv.innerHTML = 'Click any node to see its genealogy.';

    // Style
    var style = document.createElement('style');
    style.textContent = [
      '#' + containerId + ' .cg-edge{transition:opacity .25s,stroke-width .25s}',
      '#' + containerId + ' .cg-node{transition:opacity .25s}',
      '#' + containerId + '.dimmed .cg-edge{opacity:0.04!important}',
      '#' + containerId + '.dimmed .cg-node{opacity:0.18!important}',
      '#' + containerId + '.dimmed .cg-edge.lit{opacity:1!important}',
      '#' + containerId + '.dimmed .cg-node.lit{opacity:1!important}',
    ].join('\n');

    // Assemble
    container.innerHTML = '';
    container.appendChild(legendDiv);
    container.appendChild(svg);
    container.appendChild(detailDiv);
    container.appendChild(style);

    // Interaction
    var selected = null;
    container.addEventListener('click', function (ev) {
      var nodeG = ev.target.closest('.cg-node');
      if (!nodeG) return;
      var id = nodeG.dataset.id;

      if (selected === id) {
        container.classList.remove('dimmed');
        container.querySelectorAll('.lit').forEach(function (n) { n.classList.remove('lit'); });
        detailDiv.innerHTML = 'Click any node to see its genealogy.';
        selected = null;
        return;
      }
      selected = id;
      container.querySelectorAll('.lit').forEach(function (n) { n.classList.remove('lit'); });
      container.classList.add('dimmed');
      nodeG.classList.add('lit');

      // Highlight connected
      container.querySelectorAll('.cg-edge').forEach(function (edge) {
        if (edge.dataset.from === id || edge.dataset.to === id) {
          edge.classList.add('lit');
          var oid = edge.dataset.from === id ? edge.dataset.to : edge.dataset.from;
          var on = container.querySelector('.cg-node[data-id="' + oid + '"]');
          if (on) on.classList.add('lit');
        }
      });

      // Build detail
      var concept = data.concepts.find(function (c) { return c.id === id; });
      if (concept) {
        detailDiv.innerHTML = buildConceptDetail(concept, data);
      } else {
        var claim = data.claims.find(function (c) { return c.id === id; });
        if (claim) detailDiv.innerHTML = buildClaimDetail(claim, data);
      }
    });
  }

  /* ── Detail builders ── */

  function buildConceptDetail(concept, data) {
    var html = '<div style="font-weight:500;color:var(--c-text-primary,#111);margin-bottom:6px">' + concept.label + '</div>';
    html += '<div style="margin-bottom:8px">' + concept.concept + '</div>';

    // Timeline
    if (concept.timeline.length > 0) {
      html += '<div style="font-weight:500;color:var(--c-text-primary,#111);margin:8px 0 4px;font-size:12px">Timeline</div>';
      concept.timeline.forEach(function (t) {
        var author = t.author || '?';
        var year = t.year || '?';
        var contrib = (t.contribution || '').slice(0, 140);
        if ((t.contribution || '').length > 140) contrib += '…';
        html += '<div style="padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:12px">';
        html += '<span style="font-weight:500;color:var(--c-text-primary,#111)">' + year + ' · ' + author + '</span> — ' + contrib;
        html += '</div>';
      });
    }

    // Transitions
    if (concept.transitions.length > 0) {
      html += '<div style="font-weight:500;color:var(--c-text-primary,#111);margin:10px 0 4px;font-size:12px">Key transitions</div>';
      concept.transitions.forEach(function (tr) {
        var ts = TRANSITION_STYLES[tr.type] || { stroke: '#999', label: tr.type };
        var note = (tr.note || '').slice(0, 120);
        if ((tr.note || '').length > 120) note += '…';
        html += '<div style="padding:3px 0;font-size:11px;display:flex;align-items:flex-start;gap:6px">';
        html += '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + ts.stroke + ';flex-shrink:0;margin-top:3px"></span>';
        html += '<span><b style="color:var(--c-text-primary,#111)">' + ts.label + '</b> — ' + note + '</span>';
        html += '</div>';
      });
    }

    // Cross-field gaps
    if (concept.gaps.length > 0) {
      html += '<div style="font-weight:500;color:var(--c-text-primary,#111);margin:10px 0 4px;font-size:12px">Cross-field gaps</div>';
      concept.gaps.slice(0, 3).forEach(function (g) {
        var txt = (typeof g === 'string') ? g : JSON.stringify(g);
        html += '<div style="padding:3px 0;font-size:11px;color:#993C1D">' + txt.slice(0, 150) + (txt.length > 150 ? '…' : '') + '</div>';
      });
    }

    return html;
  }

  function buildClaimDetail(claim, data) {
    var col = CLAIM_TYPE_COLORS[claim.type] || DEFAULT_CLAIM_COLOR;
    var html = '<div style="font-weight:500;color:var(--c-text-primary,#111);margin-bottom:4px">' + claim.id + ' <span style="font-size:11px;color:' + col.label + '">(' + claim.type + ')</span></div>';
    html += '<div style="font-size:12px;margin-bottom:8px">' + claim.statement.slice(0, 300);
    if (claim.statement.length > 300) html += '…';
    html += '</div>';

    if (claim.dependsOn.length > 0) {
      html += '<div style="font-size:11px;margin-top:4px"><b>Depends on:</b> ' + claim.dependsOn.join(', ') + '</div>';
    }

    // Evidence graph
    var eg = data.evGraph[claim.id];
    if (eg) {
      html += '<div style="font-size:11px;margin-top:4px"><b>Evidence:</b> ' + eg.total_support + ' supporting, ' + eg.total_challenge + ' challenging</div>';
    }

    // Connected concepts
    var connConcepts = [];
    data.edges.forEach(function (e) {
      if (e.to === claim.id) {
        var con = data.concepts.find(function (c) { return c.id === e.from; });
        if (con) connConcepts.push(con.label + ' (' + e.weight + ' papers)');
      }
    });
    if (connConcepts.length > 0) {
      html += '<div style="font-size:11px;margin-top:4px"><b>Literature threads:</b> ' + connConcepts.join(', ') + '</div>';
    }

    return html;
  }

  global.renderGenealogy = renderGenealogy;

})(typeof window !== 'undefined' ? window : this);