/**
 * regime_diversity_radar.js — dual-scale regime diversity radar (SVG).
 * Parent = literature baseline at origin; child = iteration divergence.
 */
(function (global) {
  'use strict';

  var AXIS_LABELS = {
    thesis_distance: 'Thesis',
    claim_divergence: 'Claims',
    residual_distance: 'Residual',
    novelty_ratio: 'Novelty',
    structural_distance: 'Structure',
    new_variables: 'New vars',
    claim_count_shift: 'Claims #',
  };

  function scale(v, scaleMax) {
    return Math.min(1, v / scaleMax);
  }

  function polar(cx, cy, r, angleRad) {
    return { x: cx + r * Math.sin(angleRad), y: cy - r * Math.cos(angleRad) };
  }

  function polygonPoints(values, scaleMax, cx, cy, maxR, n) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var angle = (Math.PI * 2 * i) / n;
      var r = scale(values[i], scaleMax) * maxR;
      var p = polar(cx, cy, r, angle);
      pts.push(p.x.toFixed(1) + ',' + p.y.toFixed(1));
    }
    return pts.join(' ');
  }

  function renderRegimeRadar(containerId, payload) {
    var container = document.getElementById(containerId);
    if (!container || !payload || !payload.axes) return;

    var axes = payload.axes;
    var n = axes.length;
    var scaleMax = payload.scale_max || 0.41;
    var rawMax = payload.raw_max || scaleMax;
    var W = 420, H = 420, cx = W / 2, cy = H / 2, maxR = 150;

    var parentVals = axes.map(function (a) { return a.parent; });
    var childVals = axes.map(function (a) { return a.child; });

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', '100%');
    svg.style.maxWidth = '420px';
    svg.style.display = 'block';
    svg.style.margin = '0 auto';

    var bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('width', W);
    bg.setAttribute('height', H);
    bg.setAttribute('fill', '#0f0f23');
    bg.setAttribute('rx', '12');
    svg.appendChild(bg);

    // Spokes
    for (var i = 0; i < n; i++) {
      var angle = (Math.PI * 2 * i) / n;
      var outer = polar(cx, cy, maxR, angle);
      var spoke = document.createElementNS(ns, 'line');
      spoke.setAttribute('x1', cx);
      spoke.setAttribute('y1', cy);
      spoke.setAttribute('x2', outer.x);
      spoke.setAttribute('y2', outer.y);
      spoke.setAttribute('stroke', '#333');
      spoke.setAttribute('stroke-width', '1');
      svg.appendChild(spoke);

      var lbl = document.createElementNS(ns, 'text');
      var lp = polar(cx, cy, maxR + 18, angle);
      lbl.setAttribute('x', lp.x);
      lbl.setAttribute('y', lp.y);
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('dominant-baseline', 'middle');
      lbl.setAttribute('fill', '#ccc');
      lbl.setAttribute('font-size', '10');
      lbl.textContent = axes[i].label.split(' ')[0];
      svg.appendChild(lbl);
    }

    // Scale rings
    var outerRing = document.createElementNS(ns, 'circle');
    outerRing.setAttribute('cx', cx);
    outerRing.setAttribute('cy', cy);
    outerRing.setAttribute('r', maxR);
    outerRing.setAttribute('fill', 'none');
    outerRing.setAttribute('stroke', '#444');
    outerRing.setAttribute('stroke-width', '1');
    svg.appendChild(outerRing);

    var trueMaxR = scale(rawMax, scaleMax) * maxR;
    var trueRing = document.createElementNS(ns, 'circle');
    trueRing.setAttribute('cx', cx);
    trueRing.setAttribute('cy', cy);
    trueRing.setAttribute('r', Math.max(trueMaxR, 8));
    trueRing.setAttribute('fill', 'none');
    trueRing.setAttribute('stroke', '#666');
    trueRing.setAttribute('stroke-width', '1');
    trueRing.setAttribute('stroke-dasharray', '4 3');
    svg.appendChild(trueRing);

    var scaleLabel = document.createElementNS(ns, 'text');
    scaleLabel.setAttribute('x', cx + trueMaxR + 4);
    scaleLabel.setAttribute('y', cy - 4);
    scaleLabel.setAttribute('fill', '#888');
    scaleLabel.setAttribute('font-size', '8');
    scaleLabel.textContent = rawMax.toFixed(2) + ' max';
    svg.appendChild(scaleLabel);

    // Parent polygon (baseline — near origin on most axes)
    var parentPoly = document.createElementNS(ns, 'polygon');
    parentPoly.setAttribute('points', polygonPoints(parentVals, scaleMax, cx, cy, maxR, n));
    parentPoly.setAttribute('fill', 'url(#parentGrad)');
    parentPoly.setAttribute('stroke', '#16213e');
    parentPoly.setAttribute('stroke-width', '1');
    parentPoly.setAttribute('opacity', '0.85');
    svg.appendChild(parentPoly);

    // Child polygon
    var childPoly = document.createElementNS(ns, 'polygon');
    childPoly.setAttribute('points', polygonPoints(childVals, scaleMax, cx, cy, maxR, n));
    childPoly.setAttribute('fill', 'rgba(233, 69, 96, 0.35)');
    childPoly.setAttribute('stroke', '#e94560');
    childPoly.setAttribute('stroke-width', '2');
    svg.appendChild(childPoly);

    // Vertex labels + dots for child
    for (var j = 0; j < n; j++) {
      var ang = (Math.PI * 2 * j) / n;
      var cp = polar(cx, cy, scale(childVals[j], scaleMax) * maxR, ang);
      var dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', cp.x);
      dot.setAttribute('cy', cp.y);
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', '#e94560');
      svg.appendChild(dot);

      var valT = document.createElementNS(ns, 'text');
      valT.setAttribute('x', cp.x + 4);
      valT.setAttribute('y', cp.y - 4);
      valT.setAttribute('fill', '#e94560');
      valT.setAttribute('font-size', '8');
      valT.textContent = childVals[j].toFixed(3);
      svg.appendChild(valT);
    }

    // Center dot
    var center = document.createElementNS(ns, 'circle');
    center.setAttribute('cx', cx);
    center.setAttribute('cy', cy);
    center.setAttribute('r', '3');
    center.setAttribute('fill', '#fff');
    svg.appendChild(center);

    var defs = document.createElementNS(ns, 'defs');
    var grad = document.createElementNS(ns, 'radialGradient');
    grad.setAttribute('id', 'parentGrad');
    grad.setAttribute('cx', '50%');
    grad.setAttribute('cy', '50%');
    grad.setAttribute('r', '50%');
    var s1 = document.createElementNS(ns, 'stop');
    s1.setAttribute('offset', '0%');
    s1.setAttribute('stop-color', '#1a1a2e');
    var s2 = document.createElementNS(ns, 'stop');
    s2.setAttribute('offset', '100%');
    s2.setAttribute('stop-color', '#16213e');
    grad.appendChild(s1);
    grad.appendChild(s2);
    defs.appendChild(grad);
    svg.insertBefore(defs, svg.firstChild.nextSibling);

    container.innerHTML = '';
    container.appendChild(svg);

    var legend = document.createElement('div');
    legend.className = 'rd-legend';
    legend.innerHTML =
      '<span class="rd-leg-parent">■ parent regime</span>' +
      '<span class="rd-leg-child">■ iteration</span>' +
      (payload.thesis_similarity != null
        ? '<span class="rd-theta">θ = ' + Number(payload.thesis_similarity).toFixed(3) + '</span>'
        : '');
    container.appendChild(legend);
  }

  global.renderRegimeRadar = renderRegimeRadar;
})(typeof window !== 'undefined' ? window : this);
