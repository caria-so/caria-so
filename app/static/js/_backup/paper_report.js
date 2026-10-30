/**
 * paper_report.js — quick mock visualizations for fingerprint report sections.
 */
(function (global) {
  'use strict';

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  /** Regime residual — distance from literature centroid = innovation territory. */
  function renderRegimeResidual(containerId, rows) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var claims = (rows || []).filter(function (r) { return r.is_claim; });
    if (!claims.length) {
      container.innerHTML = '<p class="ip-viz-empty">No regime distances in this fingerprint.</p>';
      return;
    }

    claims.sort(function (a, b) { return (b.distance || 0) - (a.distance || 0); });

    var wrap = el('div', 'ip-regime-chart');
    claims.forEach(function (row) {
      var dist = row.distance != null ? row.distance : (1 - (row.similarity || 0));
      var pct = Math.round(dist * 100);
      var rowEl = el('div', 'ip-regime-row');
      rowEl.appendChild(el('span', 'ip-regime-label', row.label));

      var barBg = el('div', 'ip-regime-bar-bg');
      var fill = el('div', 'ip-regime-bar-fill');
      fill.style.width = pct + '%';
      if (dist > 0.3) fill.style.background = 'var(--hatch-ai)';
      else if (dist > 0.22) fill.style.background = 'var(--hatch-ux)';
      else fill.style.background = 'var(--hatch-ecommerce)';
      barBg.appendChild(fill);
      rowEl.appendChild(barBg);

      rowEl.appendChild(el('span', 'ip-regime-val', dist.toFixed(3)));

      if (row.nearest && row.nearest[0]) {
        var hint = el('div', 'ip-regime-hint');
        hint.textContent = 'nearest: ' + (row.nearest[0].title || '').slice(0, 55) + '…';
        rowEl.appendChild(hint);
      }
      wrap.appendChild(rowEl);
    });

    container.innerHTML = '';
    var note = el('p', 'ip-viz-note');
    note.textContent = 'Higher residual = farther from the literature centroid — more innovative territory.';
    container.appendChild(note);
    container.appendChild(wrap);
  }

  /** Pipeline loops — vertical step timeline from node_end events. */
  function renderPipelineLoops(containerId, loops, gradient) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (!loops || !loops.length) {
      container.innerHTML = '<p class="ip-viz-empty">Single-pass run — no loop history logged.</p>';
      return;
    }

    container.innerHTML = '';
    loops.forEach(function (loopBlock) {
      var block = el('div', 'ip-loop-block');
      block.appendChild(el('span', 'ip-loop-label', 'Loop ' + loopBlock.loop));

      var steps = el('div', 'ip-loop-steps');
      (loopBlock.steps || []).forEach(function (step) {
        var stepEl = el('div', 'ip-loop-step');
        var head = el('div', 'ip-loop-step-head');
        head.appendChild(el('strong', null, step.node || '?'));
        if (step.elapsed_s != null) {
          head.appendChild(el('span', 'ip-loop-elapsed', step.elapsed_s.toFixed(0) + 's'));
        }
        stepEl.appendChild(head);

        var meta = [];
        if (step.references != null) meta.push(step.references + ' refs');
        if (step.claims_active != null) meta.push(step.claims_active + ' claims');
        if (step.simulations != null) meta.push(step.simulations + ' sims');
        if (step.verdict) meta.push(step.verdict);
        if (meta.length) stepEl.appendChild(el('span', 'ip-loop-meta', meta.join(' · ')));

        steps.appendChild(stepEl);
      });
      block.appendChild(steps);
      container.appendChild(block);
    });

    if (gradient && gradient.length) {
      var gWrap = el('div', 'ip-gradient-mini');
      gWrap.appendChild(el('span', 'ip-gradient-title', 'Epistemic pressure by loop'));
      gradient.forEach(function (g) {
        var bar = el('div', 'ip-gradient-row');
        bar.appendChild(el('span', null, 'L' + g.loop));
        var track = el('div', 'ip-gradient-track');
        var fill = el('div', 'ip-gradient-fill');
        fill.style.width = Math.min(100, Math.round((g.epistemic_pressure || 0) * 400)) + '%';
        track.appendChild(fill);
        bar.appendChild(track);
        bar.appendChild(el('span', 'ip-gradient-dir', g.direction || ''));
        gWrap.appendChild(bar);
      });
      container.appendChild(gWrap);
    }
  }

  /** Mini simulation verdict strip. */
  function renderSimulationStrip(containerId, sims) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (!sims || !sims.length) {
      container.innerHTML = '<p class="ip-viz-empty">No simulations in this run.</p>';
      return;
    }

    container.innerHTML = '';
    sims.forEach(function (sim) {
      var card = el('div', 'ip-sim-card ip-sim-card--' + (sim.verdict || 'unknown'));
      card.appendChild(el('span', 'ip-sim-id', sim.simulation_id || sim.gap_id));
      card.appendChild(el('span', 'ip-sim-verdict', sim.verdict || '—'));
      if (sim.primary_result && sim.primary_result.statistic) {
        card.appendChild(el('span', 'ip-sim-stat',
          sim.primary_result.statistic + ': ' + sim.primary_result.value));
      }
      container.appendChild(card);
    });
  }

  /** Regime diversity — embedding distances + novelty elements (v2 fingerprints). */
  function renderRegimeDiversity(containerId, rd) {
    var container = document.getElementById(containerId);
    if (!container || !rd) return;

    container.innerHTML = '';
    var emb = rd.embedding || {};
    var summary = rd.summary || {};

    if (emb.thesis_similarity != null) {
      var theta = el('p', 'ip-viz-note');
      theta.textContent = 'θ = ' + emb.thesis_similarity.toFixed(3) + ' thesis similarity to parent regime';
      container.appendChild(theta);
    }

    var metrics = [
      { label: 'thesis', value: emb.thesis_distance },
      { label: 'claims', value: emb.claim_avg_similarity != null ? (1 - emb.claim_avg_similarity) : null },
      { label: 'residual', value: emb.residual_distance_to_centroid },
      { label: 'structural', value: rd.structural_distance_score },
      { label: 'novelty', value: summary.novelty_ratio },
    ].filter(function (m) { return m.value != null; });

    if (metrics.length) {
      var wrap = el('div', 'ip-regime-chart');
      metrics.forEach(function (row) {
        var dist = row.value;
        var pct = Math.round(dist * 100);
        var rowEl = el('div', 'ip-regime-row');
        rowEl.appendChild(el('span', 'ip-regime-label', row.label));
        var barBg = el('div', 'ip-regime-bar-bg');
        var fill = el('div', 'ip-regime-bar-fill');
        fill.style.width = pct + '%';
        fill.style.background = dist > 0.35 ? 'var(--hatch-ai)' : dist > 0.2 ? 'var(--hatch-ux)' : 'var(--hatch-ecommerce)';
        barBg.appendChild(fill);
        rowEl.appendChild(barBg);
        rowEl.appendChild(el('span', 'ip-regime-val', dist.toFixed(3)));
        wrap.appendChild(rowEl);
      });
      container.appendChild(wrap);
    }

    if (summary.level_a != null) {
      var chips = el('div', 'ip-novelty-chips');
      ['A', 'B', 'C', 'D'].forEach(function (lvl) {
        var key = 'level_' + lvl.toLowerCase();
        if (summary[key] == null) return;
        var chip = el('span', 'ip-novelty-chip ip-novelty-chip--' + lvl.toLowerCase(),
          lvl + ' · ' + summary[key]);
        chips.appendChild(chip);
      });
      container.appendChild(chips);
    }

    (rd.elements || []).slice(0, 6).forEach(function (item) {
      var row = el('div', 'ip-rd-element');
      row.appendChild(el('span', 'ip-rd-level ip-rd-level--' + (item.novelty_level || 'c').toLowerCase(),
        item.novelty_level || '?'));
      row.appendChild(el('span', 'ip-rd-text', item.element || ''));
      container.appendChild(row);
    });

    if (rd.residual_hypothesis) {
      var hyp = el('p', 'ip-viz-note');
      hyp.textContent = rd.residual_hypothesis;
      container.appendChild(hyp);
    }
  }

  global.renderRegimeResidual = renderRegimeResidual;
  global.renderRegimeDiversity = renderRegimeDiversity;
  global.renderPipelineLoops = renderPipelineLoops;
  global.renderSimulationStrip = renderSimulationStrip;
})(typeof window !== 'undefined' ? window : this);
