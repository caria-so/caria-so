---
title: Parama Shop
summary: Product page and product list redesign for a bathroom furniture brand moving off Amazon — heuristic evaluation, competitive benchmarking, and CSS-only implementation shipped around an uncooperative agency.
status: completed
date: 2024
role: UX Researcher & Front-End
client: Parama Shop
services:
  - usability
  - front end
image: /static/assets/images/projects/paramashop/page_product-page_after.webp
desktop_cover: /static/assets/images/projects/paramashop/page_product-page_after.webp
mobile_cover: 
pattern: lr-pattern-dots
technologies:
  - Shopware
  - CSS
  - JavaScript
  - Figma
accent: hatch-ux
tags:
  - UX
  - E-Commerce
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: The Problem
    content: |
      <p>Parama sells designer bathroom furniture — products with dozens of size and color variants, high price points, and buyers who need to see every angle before committing. They'd built their brand on Amazon and were moving to their own Shopware store, built by a local agency. The result: single-image galleries, broken spec tables, no variant management, one-line descriptions. The agency went dark. The CMS was locked down. The client needed someone who could evaluate what was wrong, design the fix, and ship it — without waiting for developers who wouldn't pick up the phone.</p>

  # ── 2. METRICS ──
  - type: metrics-pills
    items:
      - value: "12"
        label: Competitors benchmarked
      - value: "48"
        label: Heuristics evaluated
      - value: "0"
        label: Backend changes needed
      - value: "1"
        label: CSS + JS file to ship

  # ── 3. SOLUTION — two splits, short and salesy ──
  - type: split
    title: Product Page
    content: |
      <p>Multi-angle gallery with thumbnail strip. Collapsible specification sections. Grid-based size selector replacing dropdowns. Visual color swatches. Stock indicators, savings callouts, split delivery options with estimated dates. Everything the original page was missing — built with CSS overrides and injected JavaScript, no backend access required.</p>
    image: /static/assets/images/projects/paramashop/page_product-page_after.webp
    reverse: false

  - type: split
    title: Product List
    content: |
      <p>Structured cards with variant previews, price ranges, and stock availability visible before click-through. Reduced the gap between what buyers see on the list and what they find on the page — fewer bounces, fewer surprises.</p>
    image: /static/assets/images/projects/paramashop/page_product-list.png
    reverse: true

  # ── 4. METHODOLOGY — all the process detail lives here ──
  - type: methodology
    title: Evaluate, benchmark, ship around the agency
    content: |
      <p>Started with heuristics. Benchmarked every element of the existing product page against established ecommerce heuristics. Then a structured competitive analysis across twelve bathroom furniture brands to establish what good looks like in this specific vertical.</p>
    detail_label: Process & decisions
    case_study:
      problem: |
        <p>Product page with a single image, broken specifications, and one-line descriptions. Agency unresponsive, CMS locked down — no backend access, no cooperation.</p>
      role: |
        <p>UX researcher and front-end — evaluation, design, prototyping, and production CSS/JS. Solo engagement, reporting directly to the owner.</p>
      method: |
        <p>Heuristic evaluation (Baymard Home & Furniture guidelines) → competitive analysis across 12 direct competitors → prioritized fix list → Figma prototypes → browser prototyping → production CSS/JS delivered as two injectable files.</p>
      decisions: |
        <p><strong>Ship via CSS overrides</strong> — agency wouldn't cooperate and CMS was rigid. Everything implemented through one stylesheet and one script file. No backend changes, no database access, no agency coordination for day-to-day work.</p>
        <p><strong>Heuristics before wireframes</strong> — every recommendation traces back to a scored guideline or a competitor benchmark. No opinion-driven redesign; the evaluation document was the spec.</p>
        <p><strong>Grid selectors over dropdowns</strong> — for products with 20+ size/color variants, grid layouts have lower error rates and faster selection times than dropdown menus. Research-backed, not a style preference.</p>
      constraints: |
        <p>No backend access. No agency cooperation. Shopware CMS with limited template flexibility. Every design decision constrained by what could be shipped independently as injected CSS and JavaScript.</p>
      outcome: |
        <p>Product page and product list redesigned and shipped. Client's developers include one stylesheet and one script file — everything else is maintainable without the agency.</p>
      lessons: |
        <p>When the CMS is locked and the agency won't cooperate, the constraint becomes the method: evaluate what's broken, design within what's buildable, prototype in the browser, deliver production code.</p>
      metrics:
        - label: Heuristics evaluated
          before: "0"
          after: "48"
        - label: Competitors benchmarked
          before: "—"
          after: "12"
        - label: Backend changes
          before: "Blocked"
          after: "0 needed"
      evidence:
        - image: /static/assets/images/projects/paramashop/competitors.webp
          caption: Competitive analysis — structured comparison across twelve bathroom furniture brands on gallery, variant management, and specification hierarchy.
        - image: /static/assets/images/projects/paramashop/page_product-page_before.webp
          caption: Product page before — single image, broken spec table, dropdown variant selector, no trust signals.
        - image: /static/assets/images/projects/paramashop/heuristic_evaluation.png
          caption: Heuristic evaluation — each element scored against Baymard's Home & Furniture guidelines.
        - image: /static/assets/images/projects/paramashop/desktop_cover.webp
          caption: Figma iterations — variant selector and gallery explorations before browser prototyping.

  - type: split
    title: Taxonomy & Navigation
    content: |
      content: |
      <p>Restructured the product taxonomy and surfaced it where it matters — categories in the main navigation for direct access, thumbnail cards on the homepage for browse entry points, and category badges on product list cards so buyers always know where they are. Same data, three touchpoints, zero ambiguity about what the store sells.</p>
    image: /static/assets/images/projects/paramashop/taxonomy-navigation.webp
    reverse: false

  # ── 5. CALLOUT ──
  - type: callout
    title: E-commerce page not converting the way it should?
    content: |
      <p>I redesign product pages and product lists based on research, not opinions — and I can ship the CSS myself.</p>
    button: Get in touch
---