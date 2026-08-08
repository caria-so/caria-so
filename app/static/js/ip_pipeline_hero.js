(function () {
    'use strict';

    var MAX_LEVEL = 5;

    // Agents a weak dimension can pull in: `core` always joins,
    // `extra` fills the rest of a config whose size varies per cycle.
    var ROUTING = {
        coverage: {
            core: ['literature', 'formalize'],
            extra: ['simulate', 'dataset', 'review'],
        },
        evidence: {
            core: ['dataset', 'simulate'],
            extra: ['rederive', 'literature', 'stress'],
        },
        corroboration: {
            core: ['counter', 'rederive'],
            extra: ['review', 'simulate', 'stress'],
        },
        review: {
            core: ['stress', 'review'],
            extra: ['counter', 'rederive', 'formalize'],
        },
        novelty: {
            core: ['formalize', 'literature'],
            extra: ['counter', 'simulate', 'rederive'],
        },
    };

    var MIN_AGENTS = 2;
    var MAX_AGENTS = 5;
    var MOBILE_MQ = window.matchMedia('(max-width: 960px)');

    var DIM_IDS = ['coverage', 'evidence', 'corroboration', 'review', 'novelty'];

    function agentLimits() {
        if (MOBILE_MQ.matches) return { min: 4, max: 4 };
        return { min: MIN_AGENTS, max: MAX_AGENTS };
    }

    function clamp(n, lo, hi) {
        return Math.max(lo, Math.min(hi, n));
    }

    function sleep(ms) {
        return new Promise(function (resolve) {
            window.setTimeout(resolve, ms);
        });
    }

    function shuffle(list) {
        var a = list.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i];
            a[i] = a[j];
            a[j] = t;
        }
        return a;
    }

    /**
     * FLIP — capture positions, then animate cards from where they were
     * to wherever the new config put them.
     */
    function captureRects(els) {
        var map = new Map();
        els.forEach(function (el) {
            map.set(el, el.getBoundingClientRect());
        });
        return map;
    }

    function playFlip(els, first, duration) {
        var moved = false;
        els.forEach(function (el) {
            var a = first.get(el);
            var b = el.getBoundingClientRect();
            var dx = a.left - b.left;
            var dy = a.top - b.top;
            if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
            moved = true;
            el.style.transition = 'none';
            el.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        });
        if (!moved) return sleep(120);

        // Force reflow so the offset sticks before we animate it away
        els[0].getBoundingClientRect();

        els.forEach(function (el) {
            el.style.transition = 'transform ' + duration + 'ms cubic-bezier(0.22, 1, 0.36, 1)';
            el.style.transform = '';
        });

        return sleep(duration + 60).then(function () {
            els.forEach(function (el) {
                el.style.transition = '';
                el.style.transform = '';
            });
        });
    }

    function init(root) {
        if (root.dataset.ipPipelineReady === 'true') return;

        var grid = root.querySelector('[data-ipx-grid]');
        var config = root.querySelector('.ipx-config');
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-ipx-agent]'));
        var phaseEl = root.querySelector('[data-ipx-phase]');
        var seedEl = root.querySelector('[data-ipx-seed]');
        var printEl = root.querySelector('[data-ipx-print]');
        var evalEl = root.querySelector('[data-ipx-eval]');
        var deltasEl = root.querySelector('[data-ipx-deltas]');
        var nextEl = root.querySelector('[data-ipx-next]');
        if (!grid || !cards.length) return;

        var cardMap = {};
        cards.forEach(function (card) {
            cardMap[card.getAttribute('data-ipx-agent')] = card;
        });

        // Readiness levels — start uneven so the first pick is meaningful
        var levels = {
            coverage: 3,
            evidence: 1,
            corroboration: 2,
            review: 3,
            novelty: 2,
        };

        var chain = [];
        var weak = 'evidence';
        var live = false;
        var reduced = window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function phase(text) {
            if (phaseEl) phaseEl.textContent = text;
        }

        function weakest() {
            var best = DIM_IDS[0];
            DIM_IDS.forEach(function (id) {
                if (levels[id] < levels[best]) best = id;
            });
            return best;
        }

        /**
         * Draw a config for a dimension: variable size, core agents always in,
         * the rest sampled, and the running order shuffled so no two cycles
         * fire the same sequence.
         */
        function buildConfig(dim) {
            var route = ROUTING[dim] || ROUTING.coverage;
            var limits = agentLimits();
            var size = limits.min + Math.floor(Math.random() * (limits.max - limits.min + 1));
            var picked = shuffle(route.core).slice(0, Math.min(route.core.length, size));

            shuffle(route.extra).forEach(function (id) {
                if (picked.length < size && picked.indexOf(id) === -1) picked.push(id);
            });

            // Pad from anything still idle if the route ran dry
            if (picked.length < size) {
                shuffle(Object.keys(cardMap)).forEach(function (id) {
                    if (picked.length < size && picked.indexOf(id) === -1) picked.push(id);
                });
            }

            return shuffle(picked);
        }

        /** Clear only the run state — the config stays until it is rebuilt. */
        function clearRun() {
            cards.forEach(function (card) {
                card.classList.remove('is-lit', 'is-done');
            });
        }

        /** Reorder the grid so this cycle's agents lead, then FLIP into place. */
        function applyConfig(ids) {
            var first = captureRects(cards);

            cards.forEach(function (card) {
                card.classList.remove('is-active', 'is-lit', 'is-done');
                var slot = card.querySelector('[data-ipx-slot]');
                if (slot) slot.textContent = '—';
                card.style.order = '10';
            });

            ids.forEach(function (id, i) {
                var card = cardMap[id];
                if (!card) return;
                card.classList.add('is-active');
                card.style.order = String(i);
                var slot = card.querySelector('[data-ipx-slot]');
                if (slot) slot.textContent = '0' + (i + 1);
            });

            chain = ids.slice();
            return playFlip(cards, first, 720);
        }

        async function runChain() {
            // Keep total run time roughly even whatever the config size
            var step = chain.length >= 4 ? 460 : 640;
            for (var i = 0; i < chain.length; i++) {
                if (!live) return;
                var card = cardMap[chain[i]];
                if (!card) continue;
                card.classList.add('is-lit');
                phase('run · ' + chain[i]);
                await sleep(step);
                card.classList.remove('is-lit');
                card.classList.add('is-done');
            }
        }

        function renderDeltas(changes) {
            if (!deltasEl) return;
            deltasEl.textContent = '';
            changes.forEach(function (change, i) {
                var chip = document.createElement('span');
                chip.className = 'ipx-delta ipx-delta--' + (change.delta > 0 ? 'up' : 'down');
                chip.textContent = change.id + ' ' + (change.delta > 0 ? '+' : '−') + Math.abs(change.delta);
                deltasEl.appendChild(chip);
                window.setTimeout(function () {
                    chip.classList.add('is-in');
                }, 90 * i + 60);
            });
        }

        /**
         * The run raises what it targeted, and opening one front tends to
         * expose another — so other dimensions drift too.
         */
        function evaluate() {
            var changes = [];

            var gain = 1 + (Math.random() < 0.4 ? 1 : 0);
            var before = levels[weak];
            levels[weak] = clamp(levels[weak] + gain, 0, MAX_LEVEL);
            if (levels[weak] !== before) {
                changes.push({ id: weak, delta: levels[weak] - before });
            }

            var others = shuffle(DIM_IDS.filter(function (id) { return id !== weak; }));
            var touch = 1 + Math.floor(Math.random() * 2);
            others.slice(0, touch).forEach(function (id) {
                var dir = Math.random() < 0.65 ? -1 : 1;
                var prev = levels[id];
                levels[id] = clamp(prev + dir, 0, MAX_LEVEL);
                if (levels[id] !== prev) {
                    changes.push({ id: id, delta: levels[id] - prev });
                }
            });

            renderDeltas(changes);
            weak = weakest();
            if (nextEl) nextEl.textContent = weak;
        }

        async function cycle() {
            while (live) {
                // 1 — read the seed
                phase('read seed');
                if (seedEl) seedEl.classList.add('is-on');
                await sleep(900);
                if (!live) return;

                // 2 — rebuild the agent config around the weak dimension
                var next = buildConfig(weak);
                phase('reassemble · ' + weak + ' ×' + next.length);
                if (config) config.classList.add('is-rebuilding');
                await applyConfig(next);
                if (!live) return;
                await sleep(400);
                if (config) config.classList.remove('is-rebuilding');
                if (seedEl) seedEl.classList.remove('is-on');
                if (!live) return;

                // 3 — run the assembled agents
                await runChain();
                if (!live) return;

                // 4 — evaluate: scores move, a new weakest emerges
                phase('evaluate');
                if (evalEl) evalEl.classList.add('is-on');
                evaluate();
                await sleep(1500);
                if (!live) return;
                if (evalEl) evalEl.classList.remove('is-on');

                // 5 — file the fingerprint, then start over with a new config
                phase('fingerprint');
                if (printEl) printEl.classList.add('is-on');
                await sleep(1100);
                if (!live) return;
                if (printEl) printEl.classList.remove('is-on');

                phase('idle');
                clearRun();
                await sleep(700);
            }
        }

        function start() {
            if (live) return;
            live = true;
            cycle();
        }

        function stop() {
            live = false;
        }

        weak = weakest();
        if (nextEl) nextEl.textContent = weak;

        function primeConfig(ids) {
            ids.forEach(function (id, i) {
                var card = cardMap[id];
                if (!card) return;
                card.classList.add('is-active');
                card.style.order = String(i);
                var slot = card.querySelector('[data-ipx-slot]');
                if (slot) slot.textContent = '0' + (i + 1);
            });
            cards.forEach(function (card) {
                if (!card.classList.contains('is-active')) card.style.order = '10';
            });
            chain = ids.slice();
        }

        if (reduced) {
            primeConfig(buildConfig(weak));
            phase('assembled');
            root.dataset.ipPipelineReady = 'true';
            return;
        }

        if (MOBILE_MQ.matches) {
            primeConfig(buildConfig(weak));
        }

        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) start();
                    else stop();
                });
            }, { threshold: 0.2 });
            io.observe(root);
        } else {
            start();
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) stop();
            else start();
        });

        root.dataset.ipPipelineReady = 'true';
    }

    function boot() {
        document.querySelectorAll('[data-ip-pipeline]').forEach(init);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
