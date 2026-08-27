window.initCariaMolecule = function (container) {
    if (!container || container.dataset.cariaMoleculeReady) return;
    container.dataset.cariaMoleculeReady = '1';

    var pid = (container.id || 'caria-molecule') + '-';
    function gid(name) { return pid + name; }

    var W = 400, H = 400;
    var CX = W / 2, CY = H / 2;
    var PERSPECTIVE = 580;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var palette = {
        nigredo:    { main: '#09090B', mid: '#27272A', light: '#3F3F46', highlight: '#52525B' },
        albedo:     { main: '#F4F4F5', mid: '#FAFAFA', light: '#FFFFFF', highlight: '#FFFFFF' },
        citrinitas: { main: '#D97706', mid: '#F59E0B', light: '#FBBF24', highlight: '#FDE68A' },
        rubedo:     { main: '#B02C35', mid: '#D33F49', light: '#E8546A', highlight: '#F8D9DB' },
    };

    var bonds = [[0, 1], [1, 2], [2, 3]];

    var nodes = [
        { id: 'nigredo',    bx: -70, by:  50, bz: -40, x: -70, y:  50, z: -40, vx: 0, vy: 0, vz: 0, r: 38, color: 'nigredo' },
        { id: 'albedo',     bx:  -5, by: -20, bz:  50, x:  -5, y: -20, z:  50, vx: 0, vy: 0, vz: 0, r: 32, color: 'albedo' },
        { id: 'citrinitas', bx:  50, by: -65, bz: -30, x:  50, y: -65, z: -30, vx: 0, vy: 0, vz: 0, r: 34, color: 'citrinitas' },
        { id: 'rubedo',     bx:  55, by:  55, bz:  30, x:  55, y:  55, z:  30, vx: 0, vy: 0, vz: 0, r: 44, color: 'rubedo' },
    ];

    var restLengths = bonds.map(function (b) {
        var a = nodes[b[0]], c = nodes[b[1]];
        var dx = c.bx - a.bx, dy = c.by - a.by, dz = c.bz - a.bz;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    });

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Magnum opus molecule');

    var defs = document.createElementNS(ns, 'defs');
    var bondGradEls = [];

    Object.keys(palette).forEach(function (key) {
        var g = palette[key];
        var grad = document.createElementNS(ns, 'radialGradient');
        grad.id = gid('g3d-' + key);
        grad.setAttribute('cx', '32%');
        grad.setAttribute('cy', '28%');
        grad.setAttribute('r', '72%');
        [
            ['0%', g.light],
            ['38%', g.mid],
            ['72%', g.main],
            ['100%', darken(g.main, 0.38)],
        ].forEach(function (stop) {
            var el = document.createElementNS(ns, 'stop');
            el.setAttribute('offset', stop[0]);
            el.setAttribute('stop-color', stop[1]);
            grad.appendChild(el);
        });
        defs.appendChild(grad);

        var rim = document.createElementNS(ns, 'radialGradient');
        rim.id = gid('rim3d-' + key);
        rim.setAttribute('cx', '50%');
        rim.setAttribute('cy', '58%');
        rim.setAttribute('r', '52%');
        var r0 = document.createElementNS(ns, 'stop');
        r0.setAttribute('offset', '58%');
        r0.setAttribute('stop-color', darken(g.main, 0.5));
        r0.setAttribute('stop-opacity', '0');
        var r1 = document.createElementNS(ns, 'stop');
        r1.setAttribute('offset', '100%');
        r1.setAttribute('stop-color', darken(g.main, 0.5));
        r1.setAttribute('stop-opacity', '0.5');
        rim.appendChild(r0);
        rim.appendChild(r1);
        defs.appendChild(rim);

        var ao = document.createElementNS(ns, 'radialGradient');
        ao.id = gid('ao3d-' + key);
        ao.setAttribute('cx', '62%');
        ao.setAttribute('cy', '68%');
        ao.setAttribute('r', '58%');
        var ao0 = document.createElementNS(ns, 'stop');
        ao0.setAttribute('offset', '0%');
        ao0.setAttribute('stop-color', darken(g.main, 0.55));
        ao0.setAttribute('stop-opacity', '0');
        var ao1 = document.createElementNS(ns, 'stop');
        ao1.setAttribute('offset', '100%');
        ao1.setAttribute('stop-color', darken(g.main, 0.55));
        ao1.setAttribute('stop-opacity', key === 'albedo' ? '0.28' : '0.42');
        ao.appendChild(ao0);
        ao.appendChild(ao1);
        defs.appendChild(ao);
    });

    var grainFilter = document.createElementNS(ns, 'filter');
    grainFilter.id = gid('grain-filter');
    grainFilter.setAttribute('x', '0%');
    grainFilter.setAttribute('y', '0%');
    grainFilter.setAttribute('width', '100%');
    grainFilter.setAttribute('height', '100%');
    var turb = document.createElementNS(ns, 'feTurbulence');
    turb.setAttribute('type', 'fractalNoise');
    turb.setAttribute('baseFrequency', '0.68');
    turb.setAttribute('numOctaves', '5');
    turb.setAttribute('seed', '11');
    turb.setAttribute('stitchTiles', 'stitch');
    grainFilter.appendChild(turb);
    defs.appendChild(grainFilter);

    var grainPattern = document.createElementNS(ns, 'pattern');
    grainPattern.id = gid('sphere-grain');
    grainPattern.setAttribute('patternUnits', 'userSpaceOnUse');
    grainPattern.setAttribute('width', '56');
    grainPattern.setAttribute('height', '56');
    var grainRect = document.createElementNS(ns, 'rect');
    grainRect.setAttribute('width', '56');
    grainRect.setAttribute('height', '56');
    grainRect.setAttribute('filter', 'url(#' + gid('grain-filter') + ')');
    grainRect.setAttribute('opacity', '0.88');
    grainPattern.appendChild(grainRect);
    defs.appendChild(grainPattern);

    var depthShadowFilter = document.createElementNS(ns, 'filter');
    depthShadowFilter.id = gid('sphere-depth-shadow');
    depthShadowFilter.setAttribute('x', '-40%');
    depthShadowFilter.setAttribute('y', '-40%');
    depthShadowFilter.setAttribute('width', '180%');
    depthShadowFilter.setAttribute('height', '180%');
    var drop = document.createElementNS(ns, 'feDropShadow');
    drop.setAttribute('dx', '0');
    drop.setAttribute('dy', '2');
    drop.setAttribute('stdDeviation', '3');
    drop.setAttribute('flood-color', '#09090B');
    drop.setAttribute('flood-opacity', '0.16');
    depthShadowFilter.appendChild(drop);
    defs.appendChild(depthShadowFilter);

    bonds.forEach(function (b, i) {
        var fromKey = nodes[b[0]].color;
        var toKey = nodes[b[1]].color;
        var grad = document.createElementNS(ns, 'linearGradient');
        grad.id = gid('bg3d-' + i);
        grad.setAttribute('gradientUnits', 'userSpaceOnUse');
        setBondGradientStops(grad, fromKey, toKey);
        defs.appendChild(grad);
        bondGradEls.push({ el: grad, fromKey: fromKey, toKey: toKey });
    });

    var shadowGrad = document.createElementNS(ns, 'radialGradient');
    shadowGrad.id = gid('sphere-shadow-grad');
    shadowGrad.setAttribute('cx', '50%');
    shadowGrad.setAttribute('cy', '50%');
    shadowGrad.setAttribute('r', '50%');
    [
        [0, 0.18],
        [0.35, 0.08],
        [0.68, 0.028],
        [1, 0],
    ].forEach(function (stop) {
        var el = document.createElementNS(ns, 'stop');
        el.setAttribute('offset', (stop[0] * 100) + '%');
        el.setAttribute('stop-color', '#09090B');
        el.setAttribute('stop-opacity', stop[1]);
        shadowGrad.appendChild(el);
    });
    defs.appendChild(shadowGrad);

    var shadowFilter = document.createElementNS(ns, 'filter');
    shadowFilter.id = gid('sphere-shadow-blur');
    shadowFilter.setAttribute('x', '-100%');
    shadowFilter.setAttribute('y', '-100%');
    shadowFilter.setAttribute('width', '300%');
    shadowFilter.setAttribute('height', '300%');
    var blur = document.createElementNS(ns, 'feGaussianBlur');
    blur.setAttribute('stdDeviation', '5');
    blur.setAttribute('edgeMode', 'duplicate');
    shadowFilter.appendChild(blur);
    defs.appendChild(shadowFilter);

    svg.appendChild(defs);
    container.appendChild(svg);

    var state = { rotY: -18, rotX: 14 };

    function project(x, y, z) {
        var scale = PERSPECTIVE / (PERSPECTIVE + z);
        return {
            x: CX + x * scale,
            y: CY + y * scale,
            scale: scale,
            z: z,
        };
    }

    function rotateY(x, y, z, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        return { x: x * cos - z * sin, y: y, z: x * sin + z * cos };
    }

    function rotateX(x, y, z, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        return { x: x, y: y * cos - z * sin, z: y * sin + z * cos };
    }

    function darken(hex, amount) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        r = Math.round(r * (1 - amount));
        g = Math.round(g * (1 - amount));
        b = Math.round(b * (1 - amount));
        return '#' + [r, g, b].map(function (c) {
            return c.toString(16).padStart(2, '0');
        }).join('');
    }

    function mixColor(c1, c2, t) {
        var a = parseInt(c1.slice(1, 3), 16);
        var b = parseInt(c1.slice(3, 5), 16);
        var c = parseInt(c1.slice(5, 7), 16);
        var r = parseInt(c2.slice(1, 3), 16);
        var g = parseInt(c2.slice(3, 5), 16);
        var bl = parseInt(c2.slice(5, 7), 16);
        return '#' + [
            Math.round(a + (r - a) * t),
            Math.round(b + (g - b) * t),
            Math.round(c + (bl - c) * t),
        ].map(function (v) {
            return v.toString(16).padStart(2, '0');
        }).join('');
    }

    function setBondGradientStops(grad, fromKey, toKey) {
        var from = palette[fromKey];
        var to = palette[toKey];
        while (grad.firstChild) grad.removeChild(grad.firstChild);
        [
            [0, from.light, 0.55],
            [0.1, from.main, 0.82],
            [0.28, mixColor(from.main, to.main, 0.22), 0.9],
            [0.5, mixColor(from.main, to.main, 0.5), 1],
            [0.72, mixColor(from.main, to.main, 0.78), 0.9],
            [0.9, to.main, 0.82],
            [1, to.light, 0.55],
        ].forEach(function (stop) {
            var el = document.createElementNS(ns, 'stop');
            el.setAttribute('offset', (stop[0] * 100) + '%');
            el.setAttribute('stop-color', stop[1]);
            el.setAttribute('stop-opacity', stop[2]);
            grad.appendChild(el);
        });
    }

    function bondTaper(t) {
        var u = Math.abs(t - 0.5) * 2;
        return 0.5 + 0.62 * Math.pow(u, 0.68);
    }

    function bondSegments(clipped, from, to, bondIndex, steps) {
        var segs = [];
        var i;
        for (i = 0; i < steps; i += 1) {
            var t0 = i / steps;
            var t1 = (i + 1) / steps;
            var tm = (t0 + t1) / 2;
            segs.push({
                x1: clipped.x1 + (clipped.x2 - clipped.x1) * t0,
                y1: clipped.y1 + (clipped.y2 - clipped.y1) * t0,
                x2: clipped.x1 + (clipped.x2 - clipped.x1) * t1,
                y2: clipped.y1 + (clipped.y2 - clipped.y1) * t1,
                z: from.z + (to.z - from.z) * tm,
                tm: tm,
                bondIndex: bondIndex,
                first: i === 0,
                last: i === steps - 1,
            });
        }
        return segs;
    }

    function bondDirection(clipped) {
        var dx = clipped.x2 - clipped.x1;
        var dy = clipped.y2 - clipped.y1;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        return { nx: dx / dist, ny: dy / dist, dist: dist };
    }

    function clipBond(from, to, fromR, toR) {
        var dx = to.px - from.px;
        var dy = to.py - from.py;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        var nx = dx / dist;
        var ny = dy / dist;
        var insetFrom = Math.min(fromR * 0.8, dist * 0.36);
        var insetTo = Math.min(toR * 0.8, dist * 0.36);
        return {
            x1: from.px + nx * insetFrom,
            y1: from.py + ny * insetFrom,
            x2: to.px - nx * insetTo,
            y2: to.py - ny * insetTo,
        };
    }

    function startMotion() {
        if (reduceMotion || typeof anime === 'undefined') return;

        anime({
            targets: state,
            rotY: state.rotY + 360,
            duration: 34000,
            easing: 'linear',
            loop: true,
        });

        anime({
            targets: state,
            rotX: [10, 20],
            duration: 8200,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: true,
        });

        nodes.forEach(function (n, i) {
            var easings = ['easeInOutSine', 'easeInOutQuad', 'easeInOutCubic'];

            function drift() {
                anime({
                    targets: n,
                    x: n.bx + (Math.random() - 0.5) * 14,
                    y: n.by + (Math.random() - 0.5) * 14,
                    z: n.bz + (Math.random() - 0.5) * 11,
                    duration: 2600 + Math.random() * 3800,
                    easing: easings[Math.floor(Math.random() * easings.length)],
                    complete: drift,
                });
            }
            setTimeout(drift, 400 + Math.random() * 2200 + i * 180);
        });
    }

    function render() {
        var radY = state.rotY * Math.PI / 180;
        var radX = state.rotX * Math.PI / 180;

        var projected = nodes.map(function (n) {
            var rot = rotateY(n.x, n.y, n.z, radY);
            rot = rotateX(rot.x, rot.y, rot.z, radX);
            var p = project(rot.x, rot.y, rot.z);
            return {
                px: p.x,
                py: p.y,
                scale: p.scale,
                z: rot.z,
                r: n.r,
                color: n.color,
            };
        });

        var bondData = bonds.map(function (b, i) {
            var from = projected[b[0]];
            var to = projected[b[1]];
            var fromR = from.r * from.scale;
            var toR = to.r * to.scale;
            var clipped = clipBond(from, to, fromR, toR);
            var gradMeta = bondGradEls[i];
            var grad = gradMeta.el;
            grad.setAttribute('x1', clipped.x1);
            grad.setAttribute('y1', clipped.y1);
            grad.setAttribute('x2', clipped.x2);
            grad.setAttribute('y2', clipped.y2);
            return {
                index: i,
                clipped: clipped,
                from: from,
                to: to,
            };
        });

        while (svg.children.length > 1) {
            svg.removeChild(svg.lastChild);
        }

        projected.slice().sort(function (a, b) { return b.z - a.z; }).forEach(drawShadow);

        bondData.slice().sort(function (a, b) {
            return Math.max(b.from.z, b.to.z) - Math.max(a.from.z, a.to.z);
        }).forEach(drawBondShaft);

        projected.slice().sort(function (a, b) { return b.z - a.z; }).forEach(function (p, idx) {
            drawSphere(p, idx, bondData);
        });
    }

    function drawBondShaft(bd) {
        var avgScale = (bd.from.scale + bd.to.scale) / 2;
        var baseThick = Math.max(7, 13 * avgScale);

        bondSegments(bd.clipped, bd.from, bd.to, bd.index, 16).forEach(function (seg) {
            drawBondSegment(seg, baseThick);
        });
    }

    function drawBondSegment(seg, baseThick) {
        var thick = Math.max(5, baseThick * bondTaper(seg.tm));

        var line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', seg.x1);
        line.setAttribute('y1', seg.y1);
        line.setAttribute('x2', seg.x2);
        line.setAttribute('y2', seg.y2);
        line.setAttribute('stroke-width', thick);
        line.setAttribute('stroke', 'url(#' + gid('bg3d-' + seg.bondIndex) + ')');
        line.setAttribute('stroke-linecap', seg.first || seg.last ? 'round' : 'butt');
        svg.appendChild(line);

        var highlight = document.createElementNS(ns, 'line');
        highlight.setAttribute('x1', seg.x1);
        highlight.setAttribute('y1', seg.y1);
        highlight.setAttribute('x2', seg.x2);
        highlight.setAttribute('y2', seg.y2);
        highlight.setAttribute('stroke-width', Math.max(1.5, thick * 0.22));
        highlight.setAttribute('stroke', 'rgba(255,255,255,0.2)');
        highlight.setAttribute('stroke-linecap', seg.first || seg.last ? 'round' : 'butt');
        svg.appendChild(highlight);
    }

    function drawBondSocket(socket, parent) {
        var x = socket.x;
        var y = socket.y;
        var size = socket.size;
        var col = palette[socket.color];
        var angle = Math.atan2(socket.ny, socket.nx) * 180 / Math.PI;
        var g = document.createElementNS(ns, 'g');
        g.setAttribute('transform', 'rotate(' + angle + ' ' + x + ' ' + y + ')');

        var flare = document.createElementNS(ns, 'ellipse');
        flare.setAttribute('cx', x + size * 0.2);
        flare.setAttribute('cy', y);
        flare.setAttribute('rx', size * 1.28);
        flare.setAttribute('ry', size * 0.88);
        flare.setAttribute('fill', col.mid);
        flare.setAttribute('opacity', '0.94');
        g.appendChild(flare);

        var grip = document.createElementNS(ns, 'ellipse');
        grip.setAttribute('cx', x);
        grip.setAttribute('cy', y);
        grip.setAttribute('rx', size * 0.92);
        grip.setAttribute('ry', size * 0.66);
        grip.setAttribute('fill', col.main);
        g.appendChild(grip);

        var lip = document.createElementNS(ns, 'ellipse');
        lip.setAttribute('cx', x - size * 0.14);
        lip.setAttribute('cy', y);
        lip.setAttribute('rx', size * 0.58);
        lip.setAttribute('ry', size * 0.42);
        lip.setAttribute('fill', darken(col.main, 0.22));
        lip.setAttribute('opacity', '0.55');
        g.appendChild(lip);

        (parent || svg).appendChild(g);
    }

    function drawShadow(p) {
        var r = p.r * p.scale;
        var shadow = document.createElementNS(ns, 'ellipse');
        shadow.setAttribute('cx', p.px + r * 0.06);
        shadow.setAttribute('cy', p.py + r * 0.72);
        shadow.setAttribute('rx', r * 0.38);
        shadow.setAttribute('ry', r * 0.11);
        shadow.setAttribute('fill', 'url(#' + gid('sphere-shadow-grad') + ')');
        shadow.setAttribute('filter', 'url(#' + gid('sphere-shadow-blur') + ')');
        svg.appendChild(shadow);
    }

    function drawSphere(p, nodeIdx, bondData) {
        var r = p.r * p.scale;
        var g = document.createElementNS(ns, 'g');
        var grainOpacity = p.color === 'albedo' ? 0.34 : p.color === 'nigredo' ? 0.44 : 0.38;

        bondData.forEach(function (bd) {
            var ends = bonds[bd.index];
            if (ends[0] !== nodeIdx && ends[1] !== nodeIdx) return;
            var dir = bondDirection(bd.clipped);
            var avgScale = (bd.from.scale + bd.to.scale) / 2;
            var endThick = Math.max(7, 13 * avgScale) * bondTaper(0) * 0.62;
            if (ends[0] === nodeIdx) {
                drawBondSocket({
                    x: bd.clipped.x1,
                    y: bd.clipped.y1,
                    nx: dir.nx,
                    ny: dir.ny,
                    size: endThick,
                    color: bd.from.color,
                }, g);
            }
            if (ends[1] === nodeIdx) {
                drawBondSocket({
                    x: bd.clipped.x2,
                    y: bd.clipped.y2,
                    nx: -dir.nx,
                    ny: -dir.ny,
                    size: endThick,
                    color: bd.to.color,
                }, g);
            }
        });

        var circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', p.px);
        circle.setAttribute('cy', p.py);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', 'url(#' + gid('g3d-' + p.color) + ')');
        circle.setAttribute('filter', 'url(#' + gid('sphere-depth-shadow') + ')');
        g.appendChild(circle);

        var rim = document.createElementNS(ns, 'circle');
        rim.setAttribute('cx', p.px);
        rim.setAttribute('cy', p.py);
        rim.setAttribute('r', r);
        rim.setAttribute('fill', 'url(#' + gid('rim3d-' + p.color) + ')');
        g.appendChild(rim);

        var ao = document.createElementNS(ns, 'circle');
        ao.setAttribute('cx', p.px);
        ao.setAttribute('cy', p.py);
        ao.setAttribute('r', r);
        ao.setAttribute('fill', 'url(#' + gid('ao3d-' + p.color) + ')');
        g.appendChild(ao);

        var grain = document.createElementNS(ns, 'circle');
        grain.setAttribute('cx', p.px);
        grain.setAttribute('cy', p.py);
        grain.setAttribute('r', r);
        grain.setAttribute('fill', 'url(#' + gid('sphere-grain') + ')');
        grain.setAttribute('opacity', grainOpacity);
        grain.setAttribute('style', 'mix-blend-mode: overlay');
        g.appendChild(grain);

        var spec = document.createElementNS(ns, 'ellipse');
        spec.setAttribute('cx', p.px - r * 0.26);
        spec.setAttribute('cy', p.py - r * 0.3);
        spec.setAttribute('rx', r * 0.28);
        spec.setAttribute('ry', r * 0.2);
        spec.setAttribute('fill', palette[p.color].highlight);
        spec.setAttribute('opacity', p.color === 'albedo' ? '0.72' : '0.4');
        g.appendChild(spec);

        svg.appendChild(g);
    }

    function frame() {
        render();
        requestAnimationFrame(frame);
    }

    startMotion();
    frame();
};

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-caria-molecule]').forEach(function (el) {
        initCariaMolecule(el);
    });
});

if (document.readyState !== 'loading') {
    document.querySelectorAll('[data-caria-molecule]').forEach(function (el) {
        initCariaMolecule(el);
    });
}
