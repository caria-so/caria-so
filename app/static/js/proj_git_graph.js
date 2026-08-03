/**
 * proj_git_graph.js — animated git log --graph for projects hero
 */
(function () {
  'use strict';

  var MAIN_X = 14;
  var BRANCH_X = 38;
  var ROW_H = 38;
  var TOP = 22;

  function laneX(lane) {
    return lane === 1 ? BRANCH_X : MAIN_X;
  }

  function connectorPath(y1, lane1, y2, lane2) {
    var x1 = laneX(lane1);
    var x2 = laneX(lane2);
    if (lane1 === lane2) {
      return 'M' + x1 + ' ' + y1 + ' V' + y2;
    }
    if (lane1 === 0 && lane2 === 1) {
      var mid = (y1 + y2) / 2;
      return 'M' + x1 + ' ' + y1 +
        ' V' + (mid - 4) +
        ' C' + x1 + ' ' + (mid + 6) + ', ' + x2 + ' ' + (mid - 6) + ', ' + x2 + ' ' + y2;
    }
    var mid2 = (y1 + y2) / 2;
    return 'M' + x1 + ' ' + y1 +
      ' C' + x1 + ' ' + (y1 + 12) + ', ' + x2 + ' ' + (mid2 + 4) + ', ' + x2 + ' ' + mid2 +
      ' V' + y2;
  }

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function renderGraph(container, commits, detailBase) {
    if (!commits.length) return;

    var panel = el('div', 'proj-git-panel');
    panel.appendChild(el('div', 'proj-git-chrome', [
      '<span class="proj-git-dot proj-git-dot--r"></span>',
      '<span class="proj-git-dot proj-git-dot--y"></span>',
      '<span class="proj-git-dot proj-git-dot--g"></span>',
      '<span class="proj-git-title">caria-lab — git log --graph --oneline</span>',
    ].join('')));

    var body = el('div', 'proj-git-body');
    var graphCol = el('div', 'proj-git-graph-col');
    var logCol = el('div', 'proj-git-log');

    var height = TOP + commits.length * ROW_H + 16;
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'proj-git-svg');
    svg.setAttribute('viewBox', '0 0 52 ' + height);
    svg.setAttribute('aria-hidden', 'true');

    var pathsG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pathsG.setAttribute('class', 'proj-git-paths');

    for (var i = 0; i < commits.length - 1; i++) {
      var y1 = TOP + i * ROW_H;
      var y2 = TOP + (i + 1) * ROW_H;
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', connectorPath(y1, commits[i].lane, y2, commits[i + 1].lane));
      path.setAttribute('class', 'proj-git-line');
      path.style.animationDelay = (i * 0.12) + 's';
      pathsG.appendChild(path);
    }
    svg.appendChild(pathsG);

    var nodesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesG.setAttribute('class', 'proj-git-nodes');
    commits.forEach(function (c, i) {
      var y = TOP + i * ROW_H;
      var x = laneX(c.lane);
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', i === 0 ? 5 : 4);
      circle.setAttribute('class', 'proj-git-node' + (i === 0 ? ' proj-git-node--head' : ''));
      circle.setAttribute('data-index', String(i));
      circle.style.setProperty('--node-accent', 'var(--' + c.accent + ')');
      circle.style.animationDelay = (0.25 + i * 0.1) + 's';
      nodesG.appendChild(circle);

      if (i === 0) {
        var ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', x);
        ring.setAttribute('cy', y);
        ring.setAttribute('r', 9);
        ring.setAttribute('class', 'proj-git-head-ring');
        ring.style.setProperty('--node-accent', 'var(--' + c.accent + ')');
        nodesG.appendChild(ring);
      }
    });
    svg.appendChild(nodesG);

    graphCol.appendChild(svg);
    body.appendChild(graphCol);

    commits.forEach(function (c, i) {
      var row = el('a', 'proj-git-row');
      row.href = detailBase + c.slug;
      row.style.animationDelay = (0.15 + i * 0.1) + 's';
      row.dataset.index = String(i);
      if (i === 0) row.classList.add('proj-git-row--head');

      var graphChars = el('span', 'proj-git-glyphs', i === 0 ? '* ' : (c.lane === 1 ? '| * ' : '| * '));
      var hash = el('span', 'proj-git-hash', c.hash);
      var msg = el('span', 'proj-git-msg', c.msg);
      if (c.status) {
        var tag = el('span', 'proj-git-tag', c.status);
        row.appendChild(graphChars);
        row.appendChild(hash);
        row.appendChild(msg);
        row.appendChild(tag);
      } else {
        row.appendChild(graphChars);
        row.appendChild(hash);
        row.appendChild(msg);
      }
      logCol.appendChild(row);
    });

    var cursor = el('div', 'proj-git-cursor-line', '<span class="proj-git-prompt">$</span> git push origin main<span class="proj-git-cursor"></span>');
    logCol.appendChild(cursor);

    body.appendChild(logCol);
    panel.appendChild(body);
    container.appendChild(panel);

    var active = 0;
    function setActive(idx) {
      active = idx;
      logCol.querySelectorAll('.proj-git-row').forEach(function (row, i) {
        row.classList.toggle('proj-git-row--active', i === idx);
      });
      svg.querySelectorAll('.proj-git-node').forEach(function (node, i) {
        node.classList.toggle('proj-git-node--active', i === idx);
      });
    }

    setActive(0);
    var tick = setInterval(function () {
      setActive((active + 1) % commits.length);
    }, 2800);

    panel.addEventListener('mouseenter', function () { clearInterval(tick); });
    panel.addEventListener('mouseleave', function () {
      tick = setInterval(function () {
        setActive((active + 1) % commits.length);
      }, 2800);
    });
  }

  function init() {
    var dataEl = document.getElementById('proj-git-data');
    var container = document.getElementById('proj-git-viz');
    if (!dataEl || !container) return;

    var payload;
    try {
      payload = JSON.parse(dataEl.textContent);
    } catch (e) {
      return;
    }

    renderGraph(container, payload.commits || [], payload.detailBase || '/project/');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
