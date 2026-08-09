(function () {
	function parseServicesMeta() {
		var el = document.getElementById('proj-services-data');
		if (!el) return {};
		try {
			return JSON.parse(el.textContent) || {};
		} catch (e) {
			return {};
		}
	}

	function readServiceFromUrl() {
		return new URLSearchParams(window.location.search).get('service') || '';
	}

	function initProjServiceFilter(root) {
		var list = root.querySelector('.proj-list');
		var filters = root.querySelector('.proj-service-filters[data-client-filter]');
		if (!list || !filters) return;

		var cards = Array.from(list.querySelectorAll('.proj-card'));
		var empty = root.querySelector('.proj-empty--filter');
		var emptyLabel = root.querySelector('#proj-empty-service-label');
		var eyebrow = document.getElementById('proj-hero-eyebrow');
		var title = document.getElementById('proj-hero-title');
		var body = document.getElementById('proj-hero-body');
		var servicesMeta = parseServicesMeta();
		var totalCount = cards.length;
		var defaultHero = {
			eyebrow: eyebrow ? (eyebrow.dataset.defaultText || eyebrow.textContent) : '',
			title: title ? (title.dataset.defaultText || title.textContent) : '',
			body: body ? (body.dataset.defaultText || body.textContent) : '',
		};

		function setActivePill(service) {
			root.querySelectorAll('.proj-service-filter[data-service]').forEach(function (pill) {
				var pillService = pill.getAttribute('data-service') || '';
				var active = pillService === (service || '');
				pill.classList.toggle('is-active', active);
				pill.setAttribute('aria-pressed', active ? 'true' : 'false');
			});
		}

		function countVisible() {
			return cards.filter(function (card) {
				return !card.classList.contains('is-filtered-out');
			}).length;
		}

		function updateHero(service) {
			if (!eyebrow || !title || !body) return;

			if (!service || !servicesMeta[service]) {
				eyebrow.textContent = defaultHero.eyebrow;
				title.textContent = defaultHero.title;
				body.textContent = defaultHero.body;
				return;
			}

			var meta = servicesMeta[service];
			eyebrow.textContent = 'Projects · ' + meta.label;
			title.textContent = meta.title;
			body.textContent = 'Case studies tagged under ' + meta.label.toLowerCase() + ' — '
				+ countVisible() + ' of ' + totalCount + ' project' + (totalCount === 1 ? '' : 's') + '.';
		}

		function syncUrl(service, mode) {
			var url = new URL(window.location.href);
			if (service) url.searchParams.set('service', service);
			else url.searchParams.delete('service');

			if (mode === 'push') window.history.pushState({ service: service || '' }, '', url);
			else if (mode === 'replace') window.history.replaceState({ service: service || '' }, '', url);
		}

		function applyFilter(service, options) {
			options = options || {};
			service = (service || '').trim().toLowerCase();
			if (service && !servicesMeta[service]) service = '';

			var visible = 0;
			cards.forEach(function (card) {
				var cardServices = (card.dataset.services || '').split(/\s+/).filter(Boolean);
				var show = !service || cardServices.indexOf(service) !== -1;
				card.classList.toggle('is-filtered-out', !show);
				if (show) visible += 1;
			});

			if (empty) empty.hidden = visible > 0;
			if (emptyLabel && service && servicesMeta[service]) {
				emptyLabel.textContent = servicesMeta[service].label.toLowerCase();
			}

			setActivePill(service);
			updateHero(service);

			if (options.syncUrl === 'push') syncUrl(service, 'push');
			else if (options.syncUrl === 'replace') syncUrl(service, 'replace');

			if (window.initProjTechRows) window.initProjTechRows(list);
		}

		root.addEventListener('click', function (event) {
			var pill = event.target.closest('.proj-service-filter[data-service]');
			if (!pill || !root.contains(pill)) return;
			event.preventDefault();
			applyFilter(pill.getAttribute('data-service') || '', { syncUrl: 'push' });
		});

		window.addEventListener('popstate', function () {
			applyFilter(readServiceFromUrl());
		});

		var initial = readServiceFromUrl().trim().toLowerCase();
		applyFilter(initial, { syncUrl: initial ? 'replace' : false });
	}

	function boot() {
		document.querySelectorAll('[data-proj-service-filter-root]').forEach(initProjServiceFilter);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}
})();
