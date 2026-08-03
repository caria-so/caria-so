(function () {
    const dataEl = document.getElementById('mtd-data');
    if (!dataEl) return;

    const catalog = JSON.parse(dataEl.textContent);
    const methods = catalog.methods || [];
    const methodsById = catalog.methods_by_id || {};
    const dimensions = (catalog.meta && catalog.meta.dimensions) || {};

    const state = {
        search: '',
        phase: new Set(),
        answers: new Set(),
        category: new Set(),
        effort: '',
        budget: '',
        participants: '',
        ai_only: false,
        selected: null,
    };

    const grid = document.getElementById('mtd-grid');
    const countEl = document.getElementById('mtd-count');
    const drawer = document.getElementById('mtd-drawer');
    const drawerBackdrop = document.getElementById('mtd-drawer-backdrop');
    const drawerClose = document.getElementById('mtd-drawer-close');
    const clearBtn = document.getElementById('mtd-clear');

    function label(key) {
        return key.replace(/_/g, ' ');
    }

    function uniqueValues(field, multi = false) {
        const values = new Set();
        methods.forEach((m) => {
            const val = m[field];
            if (multi && Array.isArray(val)) {
                val.forEach((v) => values.add(v));
            } else if (val) {
                values.add(val);
            }
        });
        return [...values].sort();
    }

    function buildChips(containerId, field, multi) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const values = uniqueValues(field, multi);
        const labels = dimensions[field] || {};

        values.forEach((value) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'mtd-chip';
            btn.dataset.value = value;
            btn.textContent = labels[value] ? value.replace(/_/g, ' ') : label(value);
            btn.title = labels[value] || '';
            btn.addEventListener('click', () => toggleChip(field, value, btn, multi));
            container.appendChild(btn);
        });
    }

    function toggleChip(field, value, btn, multi) {
        const set = state[field];
        if (!set) return;

        if (set.has(value)) {
            set.delete(value);
            btn.classList.remove('is-active');
        } else {
            set.add(value);
            btn.classList.add('is-active');
        }
        render();
    }

    function matches(method) {
        if (state.ai_only && !method.ai_specific) return false;
        if (state.effort && method.effort !== state.effort) return false;
        if (state.budget && method.budget !== state.budget) return false;
        if (state.participants && method.participants !== state.participants) return false;

        if (state.phase.size && !method.phase.some((p) => state.phase.has(p))) return false;
        if (state.answers.size && !method.answers.some((a) => state.answers.has(a))) return false;
        if (state.category.size && !state.category.has(method.category)) return false;

        if (state.search) {
            const q = state.search.toLowerCase();
            const hay = [
                method.name,
                method.description,
                method.when,
                method.category,
                ...(method.phase || []),
                ...(method.answers || []),
            ].join(' ').toLowerCase();
            if (!hay.includes(q)) return false;
        }

        return true;
    }

    function hasActiveFilters() {
        return (
            state.search ||
            state.phase.size ||
            state.answers.size ||
            state.category.size ||
            state.effort ||
            state.budget ||
            state.participants ||
            state.ai_only
        );
    }

    function openDrawer() {
        drawer.hidden = false;
        drawer.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                drawer.classList.add('is-open');
            });
        });
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        state.selected = null;
        window.setTimeout(() => {
            if (!drawer.classList.contains('is-open')) {
                drawer.hidden = true;
            }
        }, 340);
        renderCardsOnly();
    }

    function renderMetaPills(method, container) {
        container.innerHTML = '';
        (method.phase || []).forEach((p) => {
            const pill = document.createElement('span');
            pill.className = 'mtd-pill';
            pill.textContent = p;
            container.appendChild(pill);
        });
        ['effort', 'budget', 'participants', 'duration'].forEach((key) => {
            if (!method[key]) return;
            const pill = document.createElement('span');
            pill.className = 'mtd-pill';
            pill.textContent = method[key] + ' ' + key;
            container.appendChild(pill);
        });
        if (method.ai_specific) {
            const pill = document.createElement('span');
            pill.className = 'mtd-pill mtd-pill--ai';
            pill.textContent = 'ai-specific';
            container.appendChild(pill);
        }
    }

    function showDetail(method) {
        if (!method) {
            closeDrawer();
            return;
        }

        document.getElementById('mtd-detail-title').textContent = method.name;
        document.getElementById('mtd-detail-desc').textContent = method.description || '';
        document.getElementById('mtd-detail-when').textContent = method.when || '';
        document.getElementById('mtd-detail-watch').textContent = method.watch_out || '';
        renderMetaPills(method, document.getElementById('mtd-detail-meta'));

        const pairsWrap = document.getElementById('mtd-detail-pairs-wrap');
        const pairsEl = document.getElementById('mtd-detail-pairs');
        pairsEl.innerHTML = '';

        const pairs = method.pairs_well_with || [];
        if (!pairs.length) {
            pairsWrap.hidden = true;
        } else {
            pairsWrap.hidden = false;
            pairs.forEach((pairId) => {
                const pair = methodsById[pairId];
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'mtd-pair-link';
                btn.textContent = pair ? pair.name : label(pairId);
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openMethod(pairId);
                });
                pairsEl.appendChild(btn);
            });
        }

        if (!drawer.classList.contains('is-open')) {
            openDrawer();
        }
    }

    function renderCard(method) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'mtd-card' + (state.selected === method.id ? ' is-selected' : '');
        card.dataset.id = method.id;
        card.setAttribute('role', 'listitem');

        const title = document.createElement('h3');
        title.className = 'mtd-card-name';
        title.textContent = method.name;

        const desc = document.createElement('p');
        desc.className = 'mtd-card-desc';
        desc.textContent = method.description;

        const meta = document.createElement('div');
        meta.className = 'mtd-card-meta';

        (method.phase || []).forEach((p) => {
            const pill = document.createElement('span');
            pill.className = 'mtd-pill';
            pill.textContent = p;
            meta.appendChild(pill);
        });

        if (method.effort) {
            const pill = document.createElement('span');
            pill.className = 'mtd-pill';
            pill.textContent = method.effort + ' effort';
            meta.appendChild(pill);
        }

        if (method.ai_specific) {
            const pill = document.createElement('span');
            pill.className = 'mtd-pill mtd-pill--ai';
            pill.textContent = 'ai';
            meta.appendChild(pill);
        }

        card.append(title, desc, meta);
        card.addEventListener('click', () => openMethod(method.id));
        return card;
    }

    function renderCardsOnly() {
        const filtered = methods.filter(matches);
        grid.innerHTML = '';

        if (!filtered.length) {
            const empty = document.createElement('p');
            empty.className = 'mtd-empty';
            empty.textContent = 'No methods match these filters.';
            grid.appendChild(empty);
        } else {
            filtered.forEach((m) => grid.appendChild(renderCard(m)));
        }

        countEl.textContent = filtered.length + ' of ' + methods.length + ' methods';
        clearBtn.hidden = !hasActiveFilters();
    }

    function openMethod(id) {
        const method = methodsById[id];
        if (!method || !matches(method)) return;
        state.selected = id;
        renderCardsOnly();
        showDetail(method);
    }

    function render() {
        renderCardsOnly();

        const selected = state.selected ? methodsById[state.selected] : null;
        if (selected && !matches(selected)) {
            closeDrawer();
        }
    }

    function clearFilters() {
        state.search = '';
        state.phase.clear();
        state.answers.clear();
        state.category.clear();
        state.effort = '';
        state.budget = '';
        state.participants = '';
        state.ai_only = false;

        document.getElementById('mtd-search').value = '';
        document.getElementById('mtd-effort').value = '';
        document.getElementById('mtd-budget').value = '';
        document.getElementById('mtd-participants').value = '';
        document.getElementById('mtd-ai-only').checked = false;
        document.querySelectorAll('.mtd-chip.is-active').forEach((el) => el.classList.remove('is-active'));
        closeDrawer();
        render();
    }

    function init() {
        buildChips('mtd-phase', 'phase', true);
        buildChips('mtd-answers', 'answers', true);
        buildChips('mtd-category', 'category', false);

        document.getElementById('mtd-search').addEventListener('input', (e) => {
            state.search = e.target.value.trim();
            render();
        });

        ['mtd-effort', 'mtd-budget', 'mtd-participants'].forEach((id) => {
            document.getElementById(id).addEventListener('change', (e) => {
                const field = e.target.dataset.filter;
                state[field] = e.target.value;
                render();
            });
        });

        document.getElementById('mtd-ai-only').addEventListener('change', (e) => {
            state.ai_only = e.target.checked;
            render();
        });

        clearBtn.addEventListener('click', clearFilters);
        drawerBackdrop.addEventListener('click', closeDrawer);
        drawerClose.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
                closeDrawer();
            }
        });

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
