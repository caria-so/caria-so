// ============================================================
// DATA LOADING & DASHBOARD RENDER
// ============================================================
function uxoCssVar(name, fallback) {
  const root = document.querySelector('.tool-page--ux-observatory');
  if (!root) return fallback;
  const v = getComputedStyle(root).getPropertyValue(name).trim();
  return v || fallback;
}

function uxoChartColors() {
  return {
    accent: uxoCssVar('--uxo-accent', '#0d9488'),
    accent2: uxoCssVar('--uxo-accent-2', '#0891b2'),
    green: uxoCssVar('--uxo-green', '#059669'),
    amber: uxoCssVar('--uxo-amber', '#d97706'),
    red: uxoCssVar('--uxo-red', '#dc2626'),
    teal: uxoCssVar('--uxo-accent', '#0d9488'),
    cyan: uxoCssVar('--uxo-accent-2', '#0891b2'),
    pink: '#db2777',
    indigo: '#4f46e5',
    orange: '#ea580c',
    lime: '#65a30d',
    rose: '#e11d48',
    blue: uxoCssVar('--uxo-accent', '#0d9488'),
    purple: uxoCssVar('--uxo-accent-2', '#0891b2'),
  };
}

let COLORS = uxoChartColors();

function getPlatformColor(platform) {
  const c = uxoChartColors();
  const map = {
    Magento: c.accent,
    Shopify: c.green,
    WooCommerce: c.accent2,
    'Custom/Unknown': c.amber,
    Shopware: c.teal,
    WordPress: c.orange,
    PrestaShop: c.pink,
    'Salesforce Commerce Cloud': c.cyan,
    BigCommerce: c.rose,
    'Not scanned': uxoCssVar('--c-text-tertiary', '#71717A'),
  };
  return map[platform] || uxoCssVar('--c-text-tertiary', '#71717A');
}

const UNDETECTED_PLATFORMS = new Set(['Custom/Unknown', 'Not scanned']);

// The scraper defaults html_platform to Custom/Unknown even when the HTML
// phase never ran, so unscanned sites must be split out before counting.
function platformOf(site) {
  if (!site.html_done) return 'Not scanned';
  return site.html_platform || 'Custom/Unknown';
}

let allSites = [];
let filteredSites = [];

function configureChartDefaults() {
  if (typeof Chart === 'undefined') {
    throw new Error('Chart.js failed to load (check network or CDN).');
  }
  COLORS = uxoChartColors();
  Chart.defaults.color = uxoCssVar('--c-text-tertiary', '#71717A');
  Chart.defaults.borderColor = uxoCssVar('--uxo-border', '#3D3D47');
  Chart.defaults.font.family = getComputedStyle(document.documentElement)
    .getPropertyValue('--font-sans').trim()
    || "Inter, system-ui, sans-serif";
}

function updateUxoHero({ subtitle, meta }) {
  const subEl = document.getElementById('uxo-hero-sub');
  const metaEl = document.getElementById('uxo-hero-meta');
  if (subEl && subtitle) subEl.textContent = subtitle;
  if (metaEl) {
    if (meta) {
      metaEl.textContent = meta;
      metaEl.hidden = false;
    } else {
      metaEl.textContent = '';
      metaEl.hidden = true;
    }
  }
}

function normalizeSitesPayload(data) {
  if (!data || typeof data !== 'object') return { sites: [] };
  let sites = data.sites;
  if (Array.isArray(sites)) {
    return data;
  }
  if (sites && typeof sites === 'object') {
    return { ...data, sites: Object.values(sites) };
  }
  return { ...data, sites: [] };
}

async function fetchUxObservatoryData() {
  const cfgEl = document.getElementById('ux-observatory-config');
  const { dataUrl } = JSON.parse(cfgEl?.textContent || '{}');
  if (!dataUrl) throw new Error('Missing dashboard data URL');

  const res = await fetch(dataUrl, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`${dataUrl} → HTTP ${res.status}`);
  return normalizeSitesPayload(await res.json());
}

async function bootUxObservatoryDashboard() {
  let data;
  try {
    data = await fetchUxObservatoryData();
  } catch (err) {
    showUxObservatoryLoadError(err.message);
    return;
  }
  try {
    configureChartDefaults();
    data = normalizeSitesPayload(data);
    allSites = (data.sites || []).map(s => ({ ...s, html_platform: platformOf(s) }));
    filteredSites = allSites;
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
    if (!allSites.length) {
      showUxObservatoryEmptyState(data);
      return;
    }
    renderDashboard(data);
  } catch (err) {
    showUxObservatoryLoadError(err.message);
  }
}

function showUxObservatoryLoadError(message) {
  const loading = document.getElementById('loading');
  if (!loading) return;
  loading.innerHTML = `<p class="uxo-load-error">Error loading data: ${message}</p>`;
  updateUxoHero({ subtitle: 'Could not load dashboard data', meta: '' });
}

function showUxObservatoryEmptyState(data) {
  const app = document.getElementById('app');
  if (!app) return;
  const hint = data.error
    || 'No sites in the dataset. Check app/static/data/ux_observatory/dashboard_data.json.';
  updateUxoHero({ subtitle: 'No site records loaded', meta: hint });
  app.innerHTML = `
    <div class="card">
      <p style="color:var(--c-text-secondary);font-size:0.875rem;line-height:1.6;">
        Ensure <code>app/static/data/ux_observatory/dashboard_data.json</code> exists and reload this page.
      </p>
    </div>`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootUxObservatoryDashboard);
} else {
  bootUxObservatoryDashboard();
}

function pct(count, total) { return total > 0 ? (count / total * 100) : 0; }
function avg(arr) { return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function count(arr, fn) { return arr.filter(fn).length; }

function renderDashboard(data) {
  const S = allSites;
  const N = S.length;
  const app = document.getElementById('app');
  // Dynamic title
  const niche = data.niche || 'Italian E-Commerce';
  const session = data.session || '';
  const sessionDate = session.match(/(\d{8})_(\d{6})$/)
    ? (() => { const m = session.match(/(\d{8})_(\d{6})$/); return `${m[1].slice(0,4)}-${m[1].slice(4,6)}-${m[1].slice(6,8)}`; })()
    : (data.metadata && data.metadata.last_updated ? data.metadata.last_updated.slice(0,10) : '');

  // Compute aggregates
  const avgPerf = avg(S.filter(s => s.lh_performance_score > 0).map(s => s.lh_performance_score));
  const avgA11y = avg(S.filter(s => s.lh_accessibility_score > 0).map(s => s.lh_accessibility_score));
  const avgSeo = avg(S.filter(s => s.lh_seo_score > 0).map(s => s.lh_seo_score));
  const withSearch = count(S, s => s.html_has_search);
  const withHttps = count(S, s => s.lh_https);
  const platforms = {};
  S.forEach(s => {
    const p = s.html_platform || 'Unknown';
    platforms[p] = (platforms[p] || 0) + 1;
  });
  const detectedSites = S.filter(s => !UNDETECTED_PLATFORMS.has(s.html_platform));
  const topPlatform = Object.entries(platforms)
    .filter(([p]) => !UNDETECTED_PLATFORMS.has(p))
    .sort((a, b) => b[1] - a[1])[0] || ['—', 0];
  updateUxoHero({
    subtitle: `${niche} — ${N} sites analyzed`,
    meta: sessionDate
      ? `Data collected ${sessionDate} · HTML + Lighthouse + structure + sitemap analysis`
      : 'HTML + Lighthouse + structure + sitemap analysis',
  });

  app.innerHTML = `
    <!-- KPI ROW -->
    <div class="kpi-grid">
      <div class="card kpi">
        <div class="value accent">${N}</div>
        <div class="label">Sites Analyzed</div>
        <div class="sub">Italian e-commerce</div>
      </div>
      <div class="card kpi">
        <div class="value ${avgPerf >= 0.7 ? 'green' : avgPerf >= 0.5 ? 'amber' : 'red'}">${(avgPerf * 100).toFixed(0)}</div>
        <div class="label">Avg Performance</div>
        <div class="sub">Lighthouse score</div>
      </div>
      <div class="card kpi">
        <div class="value ${avgA11y >= 0.8 ? 'green' : avgA11y >= 0.6 ? 'amber' : 'red'}">${(avgA11y * 100).toFixed(0)}</div>
        <div class="label">Avg Accessibility</div>
        <div class="sub">Lighthouse score</div>
      </div>
      <div class="card kpi">
        <div class="value ${avgSeo >= 0.8 ? 'green' : avgSeo >= 0.6 ? 'amber' : 'red'}">${(avgSeo * 100).toFixed(0)}</div>
        <div class="label">Avg SEO</div>
        <div class="sub">Lighthouse score</div>
      </div>
      <div class="card kpi">
        <div class="value accent2">${topPlatform[0]}</div>
        <div class="label">Top Platform</div>
        <div class="sub">${topPlatform[1]} of ${detectedSites.length} detected sites</div>
      </div>
      <div class="card kpi">
        <div class="value ${pct(withSearch, N) > 70 ? 'green' : 'amber'}">${pct(withSearch, N).toFixed(0)}%</div>
        <div class="label">Have Search Bar</div>
        <div class="sub">${withSearch} of ${N}</div>
      </div>
    </div>

    <!-- PLATFORM + FEATURES -->
    <div class="section-title"><span class="dot" style="background:${COLORS.blue}"></span> Platform & Feature Landscape</div>
    <div class="chart-row">
      <div class="card">
        <h3>Platform Distribution</h3>
        <div class="chart-container"><canvas id="platformChart"></canvas></div>
      </div>
      <div class="card">
        <h3>Feature Adoption Rate</h3>
        <div class="chart-container tall" id="featureChartWrap"><canvas id="featureChart"></canvas></div>
      </div>
    </div>
    <!-- PERFORMANCE -->
    <div class="section-title"><span class="dot" style="background:${COLORS.green}"></span> Performance</div>
    <div class="chart-row-3">
      <div class="card">
        <h3>Performance Score Distribution</h3>
        <div class="chart-container"><canvas id="perfDist"></canvas></div>
      </div>
      <div class="card">
        <h3>Largest Contentful Paint (LCP)</h3>
        <div class="chart-container"><canvas id="lcpDist"></canvas></div>
      </div>
      <div class="card">
        <h3>Cumulative Layout Shift (CLS)</h3>
        <div class="chart-container"><canvas id="clsDist"></canvas></div>
      </div>
    </div>

    <!-- ACCESSIBILITY -->
    <div class="section-title"><span class="dot" style="background:${COLORS.amber}"></span> Accessibility Audit Results</div>
    <div class="full-width card">
      <h3>Pass / Fail Rates Across ${N} Sites</h3>
      <div class="a11y-grid" id="a11yGrid"></div>
    </div>

    <!-- PLATFORM COMPARISON RADAR -->
    <div class="section-title"><span class="dot" style="background:${COLORS.purple}"></span> Platform Comparison</div>
    <div class="chart-row">
      <div class="card">
        <h3>Average Scores by Platform</h3>
        <div class="chart-container"><canvas id="radarChart"></canvas></div>
      </div>
      <div class="card">
        <h3>Feature Adoption by Platform</h3>
        <div class="chart-container"><canvas id="platformFeatures"></canvas></div>
      </div>
    </div>

    <!-- CHAT PROVIDERS + CAROUSEL WCAG + NAV DEPTH -->
    <div class="section-title"><span class="dot" style="background:${COLORS.teal}"></span> UX Detail: Chat · Carousel · Navigation</div>
    <div class="chart-row-3">
      <div class="card">
        <h3>Chat / Support Widget Providers</h3>
        <div class="chart-container"><canvas id="chatChart"></canvas></div>
      </div>
      <div class="card">
        <h3>Carousel Autoplay & WCAG Violations</h3>
        <div class="chart-container"><canvas id="carouselChart"></canvas></div>
        <div id="wcagWarning" class="uxo-warn"></div>
      </div>
      <div class="card">
        <h3>Navigation Depth Distribution</h3>
        <div class="chart-container"><canvas id="navDepthChart"></canvas></div>
      </div>
    </div>

    <!-- SITEMAP SECTION (shown only if sitemap data present) -->
    <div id="sitemapSection" style="display:none">
      <div class="section-title"><span class="dot" style="background:${COLORS.cyan}"></span> Sitemap (URL-Path Trie)</div>
      <div class="chart-row-3">
        <div class="card kpi" id="smAvgLinks">
          <div class="value teal" id="smAvgLinksVal">—</div>
          <div class="label">Avg Internal Links</div>
          <div class="sub">per homepage</div>
        </div>
        <div class="card kpi">
          <div class="value cyan" id="smAvgDepthVal">—</div>
          <div class="label">Avg Max Path Depth</div>
          <div class="sub">URL segments</div>
        </div>
        <div class="card kpi">
          <div class="value purple" id="smAvgPathsVal">—</div>
          <div class="label">Avg Unique Paths</div>
          <div class="sub">per site</div>
        </div>
      </div>
      <div class="chart-row">
        <div class="card">
          <h3>Path Depth Distribution</h3>
          <div class="chart-container"><canvas id="smDepthDist"></canvas></div>
        </div>
        <div class="card">
          <h3>External Links per Site</h3>
          <div class="chart-container"><canvas id="smExtDist"></canvas></div>
        </div>
      </div>
    </div>

    <!-- SITE TABLE -->
    <div class="section-title"><span class="dot" style="background:${COLORS.teal}"></span> Site Explorer</div>
    <div class="full-width card">
      <div class="table-controls">
        <input type="text" id="searchInput" placeholder="Search sites by name, URL, or platform...">
        <select id="platformFilter">
          <option value="">All Platforms</option>
          ${Object.keys(platforms).sort().map(p => `<option value="${p}">${p} (${platforms[p]})</option>`).join('')}
        </select>
      </div>
      <div class="site-table-wrap">
        <table class="site-table" id="siteTable">
          <thead><tr id="tableHead"></tr></thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>
      <div style="padding:12px 0;color:var(--text-muted);font-size:12px;" id="tableCount"></div>
    </div>
  `;

  // ============ CHARTS ============

  // Platform Donut
  const platformEntries = Object.entries(platforms).sort((a, b) => b[1] - a[1]);
  new Chart(document.getElementById('platformChart'), {
    type: 'doughnut',
    data: {
      labels: platformEntries.map(p => p[0]),
      datasets: [{
        data: platformEntries.map(p => p[1]),
        backgroundColor: platformEntries.map(p => getPlatformColor(p[0])),
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: '65%',
      plugins: {
        legend: { position: 'right', labels: { padding: 12, usePointStyle: true, pointStyle: 'circle', font: { size: 12 } } },
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw} sites (${pct(ctx.raw, N).toFixed(1)}%)` } }
      }
    }
  });

  // Feature Adoption Horizontal Bar
  const features = [
    ['HTTPS', count(S, s => s.lh_https)],
    ['Responsive Design', count(S, s => s.has_responsive_design)],
    ['Search Bar', count(S, s => s.html_has_search)],
    ['Main Navigation', count(S, s => s.nav_found)],
    ['Footer Found', count(S, s => s.footer_found)],
    ['Phone Number', count(S, s => s.html_has_phone)],
    ['Newsletter Signup', count(S, s => s.html_has_newsletter)],
    ['Chat Widget', count(S, s => s.html_has_chat_widget)],
    ['Payment Methods Shown', count(S, s => s.html_payment_methods_visible)],
    ['Carousel/Slider', count(S, s => s.html_has_carousel)],
    ['Security Badges', count(S, s => s.html_has_security_badges)],
    ['FAQ Link', count(S, s => s.html_has_faq)],
    ['Contact Page', count(S, s => s.html_has_contact_page)],
    ['Return/Refund Link', count(S, s => s.html_has_return_link)],
    ['Customer Service Link', count(S, s => s.html_has_customer_service)],
    ['Order Tracking Link', count(S, s => s.html_has_order_tracking)],
    ['Email Visible', count(S, s => s.html_has_email)],
    ['Prices on Homepage', count(S, s => s.html_prices_found > 0)],
  ].sort((a, b) => b[1] - a[1]);

  new Chart(document.getElementById('featureChart'), {
    type: 'bar',
    data: {
      labels: features.map(f => f[0]),
      datasets: [{
        data: features.map(f => pct(f[1], N)),
        backgroundColor: features.map((f, i) => {
          const p = pct(f[1], N);
          return p >= 70 ? COLORS.green : p >= 40 ? COLORS.amber : COLORS.red;
        }),
        borderWidth: 0,
        borderRadius: 4,
        barThickness: 18,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: { max: 100, ticks: { callback: v => v + '%' }, grid: { color: '#1e2230' } },
        y: { ticks: { font: { size: 11 } }, grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.raw.toFixed(1)}% (${features[ctx.dataIndex][1]}/${N} sites)` } }
      }
    }
  });

  // Performance Score Distribution
  buildHistogram('perfDist', S.map(s => s.lh_performance_score * 100).filter(v => v > 0),
    [0, 20, 40, 60, 80, 100], 'Performance Score', COLORS.green);

  // LCP Distribution
  buildHistogram('lcpDist', S.map(s => s.lh_lcp_value / 1000).filter(v => v > 0 && v < 30),
    [0, 1, 2, 2.5, 4, 6, 10, 15, 30], 'LCP (seconds)', COLORS.blue,
    ['<1s', '1-2s', '2-2.5s', '2.5-4s', '4-6s', '6-10s', '10-15s', '15-30s']);

  // CLS Distribution
  buildHistogram('clsDist', S.map(s => s.lh_cls_value).filter(v => v >= 0),
    [0, 0.05, 0.1, 0.25, 0.5, 1, 5], 'CLS', COLORS.teal,
    ['<0.05', '0.05-0.1', '0.1-0.25', '0.25-0.5', '0.5-1', '>1']);

  // Accessibility Grid
  const a11yChecks = [
    ['Image Alt Text', 'lh_image_alt_pass'],
    ['Color Contrast', 'lh_color_contrast_pass'],
    ['Heading Order', 'lh_heading_order_pass'],
    ['Tap Targets', 'lh_tap_targets_pass'],
    ['Skip Navigation', 'lh_bypass_blocks_pass'],
    ['HTML Lang Attr', 'lh_html_has_lang'],
    ['Document Title', 'lh_document_title'],
    ['Meta Description', 'lh_meta_description'],
    ['Font Size OK', 'lh_font_size_pass'],
    ['Is Crawlable', 'lh_is_crawlable'],
  ];
  const a11yGrid = document.getElementById('a11yGrid');
  a11yChecks.forEach(([label, key]) => {
    const total = count(S, s => s.lighthouse_done);
    const passed = count(S, s => s[key] === true);
    const p = pct(passed, total);
    const cls = p >= 70 ? 'good' : p >= 40 ? 'ok' : 'bad';
    a11yGrid.innerHTML += `
      <div class="a11y-item">
        <div class="a11y-ring ${cls}">${p.toFixed(0)}%</div>
        <div class="a11y-label">${label}<span>${passed}/${total} pass</span></div>
      </div>
    `;
  });

  // Platform Comparison Radar
  const topPlatforms = platformEntries.filter(p => p[1] >= 10 && p[0] !== 'Not scanned').slice(0, 5);
  const radarLabels = ['Performance', 'Accessibility', 'SEO', 'Best Practices', 'Feature Count'];
  const radarDatasets = topPlatforms.map((plat, idx) => {
    const ps = S.filter(s => s.html_platform === plat[0]);
    const featureCount = ps.map(s => {
      let fc = 0;
      if (s.html_has_search) fc++;
      if (s.html_has_phone) fc++;
      if (s.html_has_chat_widget) fc++;
      if (s.html_has_order_tracking) fc++;
      if (s.html_has_return_link) fc++;
      if (s.html_has_newsletter) fc++;
      if (s.html_has_security_badges) fc++;
      if (s.html_payment_methods_visible) fc++;
      if (s.html_has_faq) fc++;
      if (s.html_has_contact_page) fc++;
      return fc / 10 * 100;
    });
    return {
      label: `${plat[0]} (${plat[1]})`,
      data: [
        avg(ps.filter(s => s.lh_performance_score > 0).map(s => s.lh_performance_score * 100)),
        avg(ps.filter(s => s.lh_accessibility_score > 0).map(s => s.lh_accessibility_score * 100)),
        avg(ps.filter(s => s.lh_seo_score > 0).map(s => s.lh_seo_score * 100)),
        avg(ps.filter(s => s.lh_best_practices_score > 0).map(s => s.lh_best_practices_score * 100)),
        avg(featureCount),
      ],
      borderColor: getPlatformColor(plat[0]),
      backgroundColor: getPlatformColor(plat[0]) + '33',
      borderWidth: 2,
      pointRadius: 3,
    };
  });
  new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: { labels: radarLabels, datasets: radarDatasets },
    options: {
      responsive: true,
      scales: { r: { beginAtZero: true, max: 100, grid: { color: '#1e2230' }, angleLines: { color: '#1e2230' }, ticks: { display: false } } },
      plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 11 } } } }
    }
  });

  // Platform Feature Adoption Grouped Bar
  const featureKeys = [
    ['Search', s => s.html_has_search],
    ['Tracking', s => s.html_has_order_tracking],
    ['Returns', s => s.html_has_return_link],
    ['Phone', s => s.html_has_phone],
    ['Chat', s => s.html_has_chat_widget],
    ['Badges', s => s.html_has_security_badges],
  ];
  new Chart(document.getElementById('platformFeatures'), {
    type: 'bar',
    data: {
      labels: featureKeys.map(f => f[0]),
      datasets: topPlatforms.map((plat, idx) => {
        const ps = S.filter(s => s.html_platform === plat[0]);
        return {
          label: plat[0],
          data: featureKeys.map(([, fn]) => pct(count(ps, fn), ps.length)),
          backgroundColor: getPlatformColor(plat[0]) + 'cc',
          borderRadius: 4,
          barPercentage: 0.8,
        };
      })
    },
    options: {
      responsive: true,
      scales: {
        x: { grid: { display: false } },
        y: { max: 100, ticks: { callback: v => v + '%' }, grid: { color: '#1e2230' } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 12, font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%` } }
      }
    }
  });

  // ============ CHAT PROVIDERS ============
  const chatProviders = {};
  S.filter(s => s.html_has_chat_widget).forEach(s => {
    const p = s.html_chat_provider || 'Unknown';
    chatProviders[p] = (chatProviders[p] || 0) + 1;
  });
  const noChatCount = count(S, s => !s.html_has_chat_widget);
  chatProviders['No Chat'] = noChatCount;
  const chatEntries = Object.entries(chatProviders).sort((a, b) => b[1] - a[1]);
  const chatColors = [COLORS.blue, COLORS.green, COLORS.purple, COLORS.teal, COLORS.orange, COLORS.pink,
                      COLORS.cyan, COLORS.amber, COLORS.indigo, COLORS.rose, '#6b7280'];
  new Chart(document.getElementById('chatChart'), {
    type: 'doughnut',
    data: {
      labels: chatEntries.map(e => e[0]),
      datasets: [{ data: chatEntries.map(e => e[1]), backgroundColor: chatEntries.map((_, i) => chatColors[i % chatColors.length]), borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true, cutout: '60%',
      plugins: {
        legend: { position: 'right', labels: { padding: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw} (${pct(ctx.raw, N).toFixed(1)}%)` } }
      }
    }
  });

  // ============ CAROUSEL WCAG ============
  const withCarousel = count(S, s => s.html_has_carousel);
  const autoplay = count(S, s => s.html_carousel_autoplay);
  const hasPause = count(S, s => s.html_carousel_autoplay && s.html_carousel_pause_control);
  const wcagViolation = count(S, s => s.html_wcag_carousel_violation);
  new Chart(document.getElementById('carouselChart'), {
    type: 'bar',
    data: {
      labels: ['Have Carousel', 'Autoplay On', 'Has Pause Ctrl', 'WCAG Violation'],
      datasets: [{
        data: [withCarousel, autoplay, hasPause, wcagViolation],
        backgroundColor: [COLORS.blue, COLORS.amber, COLORS.green, COLORS.red],
        borderWidth: 0, borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: { x: { grid: { display: false } }, y: { grid: { color: '#1e2230' } } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.raw} sites (${pct(ctx.raw, N).toFixed(1)}%)` } }
      }
    }
  });
  if (wcagViolation > 0) {
    document.getElementById('wcagWarning').textContent =
      `⚠ ${wcagViolation} sites have autoplay carousel without pause control (WCAG 2.1 §2.2.2)`;
  }

  // ============ NAV DEPTH DISTRIBUTION ============
  const navDepths = S.filter(s => s.nav_found && s.nav_max_depth > 0).map(s => s.nav_max_depth);
  const maxDepth = Math.max(...navDepths, 1);
  const depthBuckets = Array.from({length: maxDepth}, (_, i) => i + 1);
  const depthCounts = depthBuckets.map(d => count(navDepths, v => v === d));
  new Chart(document.getElementById('navDepthChart'), {
    type: 'bar',
    data: {
      labels: depthBuckets.map(d => `Depth ${d}`),
      datasets: [{
        data: depthCounts,
        backgroundColor: depthBuckets.map((d, i) => i === 0 ? COLORS.amber : i === 1 ? COLORS.green : i <= 3 ? COLORS.blue : COLORS.purple),
        borderWidth: 0, borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: { x: { grid: { display: false } }, y: { grid: { color: '#1e2230' } } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.raw} sites with nav depth ${depthBuckets[ctx.dataIndex]}` } }
      }
    }
  });

  // ============ SITEMAP SECTION ============
  const smSites = S.filter(s => s.sitemap_done);
  if (smSites.length > 0) {
    document.getElementById('sitemapSection').style.display = '';
    document.getElementById('smAvgLinksVal').textContent = avg(smSites.map(s => s.sitemap_internal_links)).toFixed(0);
    document.getElementById('smAvgDepthVal').textContent = avg(smSites.map(s => s.sitemap_max_depth)).toFixed(1);
    document.getElementById('smAvgPathsVal').textContent = avg(smSites.map(s => s.sitemap_unique_paths)).toFixed(0);

    buildHistogram('smDepthDist',
      smSites.map(s => s.sitemap_max_depth).filter(v => v > 0),
      [0, 1, 2, 3, 4, 5, 6, 8, 12, 20],
      'Max path depth', COLORS.cyan,
      ['1', '2', '3', '4', '5', '6-8', '8-12', '12-20']
    );
    buildHistogram('smExtDist',
      smSites.map(s => s.sitemap_external_links).filter(v => v >= 0),
      [0, 5, 10, 20, 30, 50, 100],
      'External links', COLORS.purple,
      ['0-5', '5-10', '10-20', '20-30', '30-50', '50+']
    );
  }

  // ============ SITE TABLE ============
  buildTable(S);

  // Search & filter
  document.getElementById('searchInput').addEventListener('input', filterTable);
  document.getElementById('platformFilter').addEventListener('change', filterTable);
}

function buildHistogram(canvasId, values, bins, label, color, customLabels) {
  const counts = new Array(bins.length - 1).fill(0);
  values.forEach(v => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (v >= bins[i] && (i === bins.length - 2 ? v <= bins[i + 1] : v < bins[i + 1])) {
        counts[i]++;
        break;
      }
    }
  });
  const labels = customLabels || bins.slice(0, -1).map((b, i) => `${b}-${bins[i + 1]}`);
  new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: counts.map((_, i) => {
          const ratio = i / (bins.length - 2);
          return i <= 1 ? COLORS.green : i <= 3 ? COLORS.amber : COLORS.red;
        }),
        borderWidth: 0,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        y: { ticks: { stepSize: Math.ceil(Math.max(...counts) / 5) }, grid: { color: '#1e2230' } }
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.raw} sites (${pct(ctx.raw, values.length).toFixed(1)}%)` } }
      }
    }
  });
}

const TABLE_COLS = [
  { key: 'site_name', label: 'Site', fmt: v => v },
  { key: 'html_platform', label: 'Platform', fmt: v => `<span class="badge blue">${v || '?'}</span>` },
  { key: 'lh_performance_score', label: 'Perf', fmt: scoreCell },
  { key: 'lh_accessibility_score', label: 'A11y', fmt: scoreCell },
  { key: 'lh_seo_score', label: 'SEO', fmt: scoreCell },
  { key: 'html_has_search', label: 'Search', fmt: boolCell },
  { key: 'html_has_order_tracking', label: 'Tracking', fmt: boolCell },
  { key: 'html_has_return_link', label: 'Returns', fmt: boolCell },
  { key: 'html_has_phone', label: 'Phone', fmt: boolCell },
  { key: 'html_has_chat_widget', label: 'Chat', fmt: (v, s) => v ? `<span class="badge green">${s.html_chat_provider || 'Yes'}</span>` : '<span class="badge red">No</span>' },
  { key: 'html_has_carousel', label: 'Carousel', fmt: boolCell },
  { key: 'html_wcag_carousel_violation', label: 'WCAG⚠', fmt: (v, s) => s.html_has_carousel ? (v ? '<span class="badge red">Fail</span>' : '<span class="badge green">OK</span>') : '<span style="color:#4a5568">—</span>' },
  { key: 'nav_found', label: 'Nav', fmt: boolCell },
  { key: 'nav_item_count', label: 'Nav Items', fmt: v => v || '—' },
  { key: 'nav_max_depth', label: 'Nav Depth', fmt: v => v || '—' },
  { key: 'footer_link_count', label: 'Footer Links', fmt: v => v || '—' },
  { key: 'sitemap_internal_links', label: 'Int. Links', fmt: v => v || '—' },
  { key: 'sitemap_unique_paths', label: 'Paths', fmt: v => v || '—' },
  { key: 'script_count', label: 'Scripts', fmt: v => v || '—' },
  { key: 'lh_lcp_value', label: 'LCP', fmt: v => v > 0 ? `${(v/1000).toFixed(1)}s` : '—' },
];

function scoreBarTier(percent) {
  if (percent >= 90) return 'good';
  if (percent >= 50) return 'mid';
  return 'low';
}

function scoreCell(v) {
  if (!v || v <= 0) return '—';
  const p = v * 100;
  const tier = scoreBarTier(p);
  return `<span class="score-bar" title="${p.toFixed(0)}"><span class="fill fill--${tier}" style="width:${Math.min(100, p)}%"></span></span><span class="score-num">${p.toFixed(0)}</span>`;
}

function boolCell(v) {
  return v ? '<span class="badge green">Yes</span>' : '<span class="badge red">No</span>';
}

let sortCol = 'lh_performance_score';
let sortDir = -1;

function buildTable(sites) {
  const head = document.getElementById('tableHead');
  head.innerHTML = TABLE_COLS.map(c =>
    `<th data-col="${c.key}" onclick="sortTable('${c.key}')">${c.label} ${sortCol === c.key ? (sortDir > 0 ? '↑' : '↓') : ''}</th>`
  ).join('');
  renderRows(sites);
}

function renderRows(sites) {
  const sorted = [...sites].sort((a, b) => {
    const av = a[sortCol] ?? '', bv = b[sortCol] ?? '';
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir;
    return String(av).localeCompare(String(bv)) * sortDir;
  });
  const body = document.getElementById('tableBody');
  body.innerHTML = sorted.map(s =>
    `<tr>${TABLE_COLS.map(c => `<td>${c.fmt(s[c.key], s)}</td>`).join('')}</tr>`
  ).join('');
  document.getElementById('tableCount').textContent = `Showing ${sorted.length} of ${allSites.length} sites`;
  // Update header sort indicators
  const head = document.getElementById('tableHead');
  head.innerHTML = TABLE_COLS.map(c =>
    `<th data-col="${c.key}" onclick="sortTable('${c.key}')">${c.label} ${sortCol === c.key ? (sortDir > 0 ? '↑' : '↓') : ''}</th>`
  ).join('');
}

function sortTable(col) {
  if (sortCol === col) sortDir *= -1;
  else { sortCol = col; sortDir = -1; }
  renderRows(filteredSites);
}

function filterTable() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const platform = document.getElementById('platformFilter').value;
  filteredSites = allSites.filter(s => {
    const matchText = !query ||
      (s.site_name || '').toLowerCase().includes(query) ||
      (s.url || '').toLowerCase().includes(query) ||
      (s.html_platform || '').toLowerCase().includes(query);
    const matchPlatform = !platform || s.html_platform === platform;
    return matchText && matchPlatform;
  });
  renderRows(filteredSites);
}
