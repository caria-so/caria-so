---
title: "How I Mass-Audit E-Commerce UX with Playwright and a Multi-Phase Analysis Pipeline"
thread: usability
keywords: [ecommerce, agentic UX, agentic usability]
author: "Federico Caria"
date: "2025-07-21"
tags: 
summary: "This post walks through the system I built to mass analyse Italian e-commerce. It collects homepage data from hundreds of sites, runs a series of analysis phases, and outputs structured, comparable data that powers competitive UX research."
image: 
---

*This is an experiment on a list of Italian retailers that I put together with the idea of ​​playing with an automatic user experience evaluation method*, 

When you want to understand how a whole vertical of e-commerce sites behaves — not one site, but **hundreds** — you need more than a checklist. You need a pipeline that can scrape, analyse, and extract structured insights at cohort scale without becoming a maintenance nightmare.

This post walks through the system I built to do exactly that for Italian e-commerce. It collects homepage data from hundreds of sites, runs a series of analysis phases, and outputs structured, comparable data that powers competitive UX research.

---

## The Problem

Auditing UX patterns across an industry vertical — Italian bookshops, pharmacies, furniture retailers — means answering questions like:

- What percentage of sites expose order tracking on the homepage?
- How deep is the typical navigation hierarchy in this vertical?
- Which sites have a carousel with no pause control (a WCAG violation)?
- What platforms dominate, and how does that correlate with performance?

Manual auditing doesn't scale. You need to automate the collection, structure the extraction, and make the outputs comparable across sites.

---

## Architecture at a Glance

```
CSV of URLs
    │
    ▼
mass_url_analyzer.py          ← Playwright: screenshot, HTML, metadata, Lighthouse
    │
    ▼ (optional)
prepare_discovery_for_pipeline.py  ← merge richer Computer Use audit data
    │
    ▼
analysis_pipeline/run_pipeline.py  ← Phases 0–6
    │
    ├── site_profiles.json          ← structured data store, one record per site
    ├── unified_site_profiles.csv   ← flat export for spreadsheet analysis
    ├── *_insights.json             ← cohort-level aggregated stats
    └── *_report.txt                ← human-readable summaries
```

The pipeline is **resumable**: every phase writes a `done` flag per site into `site_profiles.json`. If a run is interrupted, it picks up where it left off.

---

## Stage 1: Mass Scraping

`mass_url_analyzer.py` is the collection engine. It reads a CSV with `company` and `company_link` columns and processes each URL through a concurrent Playwright browser pool (default: 5 parallel browsers).

For each site it:

1. Navigates to the URL (stealth mode, Italian locale, 1300×1300 viewport)
2. **Dismisses GDPR banners** — using a priority stack: learned per-domain selectors → global selector DB → Italian keyword heuristics → generic patterns
3. Scrolls the page and waits for images to load
4. Captures a **full-page PNG screenshot**
5. Saves the **rendered HTML** (post-JS, what the user actually sees)
6. Records **metadata**: page title, load time, DOM stats, image/script counts
7. Runs **Lighthouse** in a separate headless Chrome instance for performance and accessibility scores

Everything lands in a timestamped results folder: `_results/{NICHE}__analysis_{YYYYMMDD_HHMMSS}/`. The folder naming convention is important — it encodes the niche and date, and is used downstream by the import system.

**Scale:** The system handles ~400 sites per run at roughly one minute per site with Lighthouse enabled. A BOOKS vertical run processed 87 sites in under two hours with a 90.8% success rate.

---

## Stage 2: The Analysis Pipeline

`run_pipeline.py` orchestrates six analysis phases over the collected data. Each phase is independent, resumable, and free of API costs unless it involves vision.

### Phase 0 — Initialise Profiles

Reads `results.csv` and `metadata/*.json`, creates one `SiteProfile` record per site. Infers identity fields: domain, TLD, country (via ccTLD → URL path locale → `<html lang>` → CLI default), niche.

### Phase 1 — Screenshot Validation

Sends each screenshot to Claude for a fast check: is the page usable? Is there a blocking overlay? Is it in the expected language? Pages that fail are flagged and skipped in Phase 2. This keeps vision costs focused on usable data.

### Phase 2 — Vision UX Analysis

A deeper Claude pass over validated screenshots. Extracts: search bar visibility and location, hero type, value proposition text, trust badges, pricing visibility, phone number prominence, design score, overall impression. This phase is the most expensive (~$0.01–0.02 per site) and is skipped by default for budget-conscious runs.

### Phase 3 — HTML/DOM Analysis

Pure BeautifulSoup — no API cost. Extracts structured signals from the rendered HTML:

- **Search:** Presence, type (full text vs icon-only vs hidden), location, placeholder text
- **Contact:** Phone numbers, email, chat widget (provider fingerprinted: Crisp, Zendesk, Intercom, etc.)
- **Trust signals:** Security badges, payment method icons
- **Commerce signals:** Return policy links, order tracking links, pricing data (min/max/avg from regex)
- **Platform:** Magento, WooCommerce, Shopify, PrestaShop, and others detected from DOM patterns with confidence scoring
- **Carousels:** Library (Swiper, Slick, Splide…), autoplay flag, pause control presence, WCAG violation flag

Output includes a cohort `html_ux_insights.json` with percentage breakdowns across the entire vertical.

### Phase 4 — Structure Extraction + Sitemap

**Two sub-extractors run over each HTML file:**

**Structure Extractor** builds a hierarchical tree of the site's navigation and footer:

It uses a two-path approach. If the site has pre-audited CSS selectors (from a Computer Use deep audit), it uses those directly. Otherwise it falls back to a heuristic cascade:

1. Find the header by locating universal e-commerce elements — cart button, login link, logo, search box — and climbing up the DOM to their common ancestor. This handles sites that split utility elements and navigation into sibling header bars.
2. Pick the `<nav>` with the most links (avoids catching breadcrumbs or pagination).
3. Fall through IDs, class patterns (`navbar`, `megamenu`, etc.), and finally positional heuristics.

The result is a full hierarchical tree: top-level categories → subcategories → links, with depths recorded. The footer is extracted similarly and broken into named sections.

**Sitemap Extractor** treats the homepage as a complete link inventory:

1. Harvest every `<a href>` on the page — text label, absolute URL, original href
2. Classify as **internal** (same domain), **external**, or **other** (mailto, hash, javascript)
3. Insert internal URLs into a **path trie** keyed on URL segments (`/libri/antichi/` → `libri` → `antichi`)
4. **Collapse dynamic segments**: numeric IDs → `{id}`, UUIDs → `{uuid}`, long hex hashes → `{hash}`. This means fifty product links at `/products/isbn/9780...` become a single node with all book titles as labels.
5. **Prune single-child chains**: `a → b → c` (where b has only one child and is not an endpoint) merges into `a/b/c`
6. Serialize the tree with stats: max path depth, unique internal paths, external link inventory

This gives you the site's **actual information architecture** from its link graph — no DOM guessing required. For AbeBooks this cleanly separated `collezioni/`, `libri-antichi-rari-collezione/`, `vendere-libri/` as distinct top-level sections, and collapsed 50 ISBN product links into a single `products/isbn/{hash}` node.

### Phase 5 — Lighthouse

Parses the pre-collected Lighthouse JSON from Phase 1. Extracts performance score, LCP, FCP, CLS, TBT, Speed Index, plus boolean accessibility and SEO checks (alt text, colour contrast, heading order, tap targets, lang attribute, etc.).

No browser is launched at this stage — it's pure JSON parsing.

### Phase 6 — Export and Cross-Validation

Flattens all profile data to `unified_site_profiles.csv`. Runs cross-validation between HTML and vision signals: do both agree a search bar exists? Do both see a phone number? This surfaces parser disagreements that indicate either a scraping issue or a genuinely ambiguous UI.

---

## Outputs

After a full run, the results folder contains:

```
_results/BOOKS__analysis_20260311_213355/
  ├── site_profiles.json           ← source of truth, ~90 fields per site
  ├── unified_site_profiles.csv    ← one row per site, all fields
  ├── screenshots/                 ← full-page PNGs
  ├── html/                        ← rendered HTML snapshots
  ├── site_structures/             ← per-site nav+footer JSON
  ├── sitemaps/                    ← per-site URL trie JSON
  ├── html_ux_insights.json        ← cohort percentages for HTML signals
  ├── structure_insights.json      ← top nav categories, footer link frequency
  ├── sitemap_insights.json        ← path depth stats, common segments, top external domains
  └── lighthouse_insights.json     ← performance/accessibility distribution
```

The `*_insights.json` files are the primary deliverable for cohort research. A run over the Italian books vertical produced findings like:

- 87% of sites have a detectable search widget
- 83% show pricing on the homepage
- 54% include a return policy link in the footer
- 24% have a live chat widget (Crisp is the dominant provider)
- Top navigation categories: `Libri`, `Catalogo`, `Novità`, `Autori`, `Narrativa italiana`

---

## Interesting Engineering Choices

**Resumable JSON profiles instead of a database.** `site_profiles.json` accumulates fields across phases. Each phase checks `{phase}_done` flags and skips completed sites. Git-friendly, zero infrastructure, survives interruptions. The docs note a migration to SQLite at 10k+ sites.

**Two-track nav extraction.** The heuristic cascade and the selector-based fast path live in the same method with a clean fallback. Sites that have been deep-audited get precise extraction; new sites get best-effort heuristics that are surprisingly good for standard e-commerce markup.

**URL trie for information architecture.** Rather than fighting the DOM to find the "real" navigation, the sitemap extractor reads the URL namespace directly. This is robust to unusual markup, JavaScript-rendered menus, and split header layouts. The dynamic segment collapsing is the key insight: product-level URLs collapse away, leaving only the categorical skeleton.

**GDPR dismissal stack.** Unskipped cookie banners ruin screenshots and confuse nav extraction. The system tries learned dismissals first (from a previous Computer Use audit), then a global selector database, then Italian keyword patterns, then generic button heuristics — in two passes around a full page scroll.

**Country inference cascade.** ccTLD (`.it` → Italy) → URL path locale (`/it/`) → `<html lang="it">` → CLI `--country` default. Each subsequent signal only fires if the previous one is ambiguous.

---

## Connecting to Flowws

The output folder is designed to be importable into [Flowws](https://flowws.io), our UX knowledge platform, via a single Django management command:

```bash
python manage.py import_analysis_run \
  --folder /path/to/BOOKS__analysis_20260311_213355
```

This creates `AnalysisRun`, `Website`, `SiteSnapshot`, and `LighthouseAudit` records in Postgres. Screenshots and HTML files are copied into Django media. The sitemap JSON lands on `SiteSnapshot.sitemap_data`. From there, Flowws can run scenario evaluations against the snapshots — but that's a story for another post.

---

## Running It Yourself

```bash
# 1. Install deps
pip install -r requirements.txt
playwright install chromium

# 2. Scrape
python mass_url_analyzer.py --urls path/to/sites.csv

# 3. Run analysis phases (no vision, no API cost)
python analysis_pipeline/run_pipeline.py \
  --dir _results/BOOKS__analysis_YYYYMMDD_HHMMSS \
  --phase 0,1,3,4,5,6 \
  --niche books \
  --country IT
```

The `--phase` flag accepts any comma-separated subset, so you can run just structure extraction (`--phase 4`) or just Lighthouse parsing (`--phase 5`) on an existing session.

---

## What's Next

The pipeline currently covers the mass breadth path. The Computer Use selector discovery (deep single-site audits) feeds into the same `site_selectors_db.json` and improves extraction quality for audited domains — that system gets its own post.

The graph ontology module (`graph_ontology.py`) maps profiles to typed nodes — Platform, NavCategory, WcagViolation, PerformanceTier — for cross-vertical questions like "which platform has the worst carousel accessibility record." That's a further layer on top of what's described here.
