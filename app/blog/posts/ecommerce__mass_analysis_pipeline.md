---
title: "A quick experiment in automated UX evaluation at scale"
thread: ecommerce
keywords: [ux evaluation, automated audit, accessibility, lighthouse, ecommerce]
author: "Federico Caria"
date: ""
tags: 
summary: "A quick experiment: can a cheap pipeline that reads the page code, rather than looking at screenshots, say anything useful about UX across a hundred shops at once? Some of it worked, some of it didn't, and the most interesting result was about the platforms rather than the shops."
image: 
---

This is a quick experiment. When a new client, a historical bookshop in Rome, asked me to redesign their website, I started where I always start: by looking at the competition. The analysis wasn't part of the delivery, but I find it hard to skip, so I used it as an excuse to try an idea that had been in my head for months that could save time in the next project.

## The idea

Checking UX patterns across a single website takes time. Doing it across a whole industry, dozens or hundreds of sites, is a much bigger job, and manual review doesn't scale.

An obvious move today could be to hand the whole evaluation to a vision-language model (VLM) and I've seen teams try this, then struggling with accuracy problems, then custom models to fix them, then API bills that grow faster than the results improve. Most importantly, a VLM can tell you useful things about layout, but UX is mostly about states and behaviour: what happens when a filter is applied, a form fails, a menu opens on mobile. Screenshots don't show much of that.

So the idea was to start from the other end. The page itself, meaning its HTML, CSS and JavaScript plus a Lighthouse report, already say a lot. I still think most of an evaluation can come from there, the VLM only needs to handle what's left, the cost per site drops drammatically and the budget goes entirely into computer use. The downside is that you need more than an API call wrapper, some Playwrite workarounds are needed to make this work.

---

## What I built, briefly

A Python script opens each homepage in a headless browser, dismisses overlays (cookie banners, promotions, etc.) scrolls, and saves the rendered HTML, a full-page screenshot and a Lighthouse report. It takes about a minute per site. A second script then runs a series of analysis steps over what was saved:

- **HTML analysis**, with no API cost: search box, contact options, chat widgets (identified by provider), trust badges, return and tracking links, prices, carousels and the library behind them, and the e-commerce platform the site runs on.
- **Navigation and site structure**: the menu tree, and a map of the site built from every link on the homepage. Repeating segments are collapsed (fifty product URLs become one `products/isbn/{id}` node), so what's left is the site's category skeleton. On AbeBooks, for example, this separated the collections, rare books and selling sections cleanly.
- **Lighthouse**: performance, layout stability and a set of accessibility and SEO checks.
- **Vision, optional**: a quick VLM check that the screenshot is usable, and a deeper pass for things like the hero and value proposition. I left the deeper pass off for most of this run.

Everything ends up as one record per site, around 90 fields, plus summary files for the whole group. The run is resumable, so an interruption doesn't mean starting again.

I ran the pilot on a hundred of Italian bookshops without even looking at their name (had scraped thousands of Italian retailers from every niche diligently in the past); most urls produced complete data.

---

## Architecture at a Glance

```
CSV of URLs
    │
    ▼
mass_analyzer.py          ← Playwright: screenshot, HTML, metadata, Lighthouse
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


## Some findings

### Carousels and accessibility

This was the clearest result. The HTML analysis can tell whether a homepage has a carousel, which library builds it, whether it plays automatically and whether there's a control to pause it. WCAG 2.1 (success criterion 2.2.2) asks that content which moves automatically can be paused, so an autoplaying carousel without a pause control is a check that can be fully automated.

<div class="post-image">
<img src="/static/assets/images/blog/mass_analysis/carousel_autoplay.webp" alt="Bar chart: about 80 sites have a carousel, about 30 autoplay, about 4 have a pause control; 20 sites flagged for autoplay without pause control" />
<p class="post-image-caption">Carousels on the homepage, autoplay, pause controls and WCAG 2.2.2 flags</p>
</div>

Most homepages have a carousel, roughly a third of those play automatically, and almost none offer a pause button. The tool flagged 20 sites. Each of these is something a site owner could fix in an afternoon, and nobody had to look at a single page to find them.

---

### Which features shops offer

The same pass records whether a homepage offers search, prices, a phone number, a chat widget, trust badges, links to returns and order tracking, and so on.

<div class="post-image">
<img src="/static/assets/images/blog/mass_analysis/feature_adoption_rate.webp" alt="Horizontal bar chart of feature adoption across sites, from search bar (highest) to chat widget (lowest)" />
<p class="post-image-caption">Share of homepages showing each feature</p>
</div>

Search and prices on the homepage are the most common. Visible email addresses and chat widgets are the least common. Few shops offer live chat at all, and among those that do, a handful of providers dominate.

<div class="post-image">
<img src="/static/assets/images/blog/mass_analysis/chat_providers.webp" alt="Donut chart: most sites have no chat widget; Crisp is the most common provider, followed by LiveChat, Intercom, Tidio and tawk.to" />
<p class="post-image-caption">Chat and support widget providers</p>
</div>

---

### Performance and accessibility

Lighthouse is a low hanging fruit (sorry Andy!), enough good to get some more context and it is free.

<div class="post-image">
<img src="/static/assets/images/blog/mass_analysis/lighthouse_performance.webp" alt="Performance score distribution mostly between 20 and 80; largest contentful paint mostly above 4 seconds; cumulative layout shift mostly below 0.05" />
<p class="post-image-caption">Lighthouse: performance, LCP and CLS across the cohort</p>
</div>

<div class="post-image">
<img src="/static/assets/images/blog/mass_analysis/accessibility_checks.webp" alt="Accessibility pass rates for alt text, colour contrast, heading order, tap targets, skip navigation, language attribute, title, meta description, font size and crawlability" />
<p class="post-image-caption">Lighthouse accessibility checks</p>
</div>

Most performance scores fall between 20 and 80, and the largest element on the page usually takes more than four seconds to appear. Lighthouse simulates a slow mobile connection, so these figures are pessimistic, but the spread between sites looks realistic. Layout stability is good almost everywhere. On accessibility, the basics are mostly in place (page titles, language attribute, readable font sizes).

Two checks look wrong rather than bad: tap targets (0 of 91 passing) and skip navigation (2 of 91). Results that uniform usually mean the check didn't apply or wasn't parsed properly, not that every site failed. I'm treating them as bugs in my pipeline.

---

### Platforms

This is the most freestyle part. The pipeline detects which platform each site runs on, every other measure can be split by platform.

<div class="post-image">
<img src="/static/assets/images/blog/mass_analysis/feature_adoption_by_platform.webp" alt="Grouped bar chart comparing custom/unknown sites with WooCommerce sites on search, tracking, returns, phone, chat and badges" />
<p class="post-image-caption">Feature adoption, custom or undetected platform vs WooCommerce</p>
</div>

<div class="post-image">
<img src="/static/assets/images/blog/mass_analysis/lighthouse_by_platform.webp" alt="Lighthouse averages by platform: performance, accessibility, best practices and SEO for custom or unknown sites versus WooCommerce" />
<p class="post-image-caption">Lighthouse averages by platform · Custom/Unknown vs WooCommerce</p>
</div>

The WooCommerce shops show search, a phone number and trust badges far more often than the rest, and score similarly on Lighthouse. With only a few of them, and with most sites landing in "custom or unknown", this is a hint rather than a finding. Some of the gap may also come from detection: a WooCommerce theme that ships a feature by default is easy to spot, while a custom site that does the same thing differently may be missed. But it points to what I think is the most interesting use of this approach.

---

## What I take from it

See how this goes? Frankly, it seems to me to be pushing in a much less utilitarian direction than I originally intended. Sure, with a bit of tinkering, I managed to get my audit, but I think a similar approach is especially interesting for:

**Qualitative and quantitative, together, at scale.** The pipeline produces counts (pass rates, percentages, distributions), but each count is kind of built from qualitative judgements a UX reviewer would normally make by hand: is there a search box? is it just a loupe icon or there is a visible input field? can this carousel be paused? where does the menu lead? 

**Useful for a single site, more interesting across many.** In general, many of the patterns, good and bad, aren't really decisions by individual shops. They come with the platform. If an autoplaying carousel without a pause button keeps turning up with the same library and the same default settings, the fix belongs with the vendor, and it would reach thousands of shops at once. This run can only point in that direction.
