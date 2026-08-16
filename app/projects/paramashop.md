---
title: Parama Shop
summary: Evidence-based product page redesign for a bathroom furniture brand transitioning from Amazon to their own e-commerce platform. Heuristic evaluation, competitive analysis, and iterative prototyping — shipped around a locked-down CMS.
status: completed
date: 2024
role: UX Researcher
client: Parama Shop
services:
  - usability
  - front end
image: /static/assets/images/projects/parama/desktop_cover.png
desktop_cover: /static/assets/images/projects/parama/desktop_cover.png
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
      <p>Parama sells designer bathroom furniture. They'd built their brand on Amazon
      and were transitioning to their own store — a Shopware site built by a local agency.
      The result was a product page with a single image, one-line descriptions, a broken
      specifications table, and no variant management for the dozens of size and color
      combinations each product comes in.</p>
      <p>The agency was unresponsive. The CMS was inflexible. The client needed someone
      who could evaluate what was broken, design the fix, and ship it — without depending
      on developers who wouldn't cooperate.</p>

  # ── 2. METRICS ──
  - type: metrics
    items:
      - value: "12"
        label: Competitors benchmarked
      - value: "700+"
        label: Heuristics evaluated against
      - value: "3"
        label: Iterative design rounds
      - value: "0"
        label: Backend changes required

  # ── 3. SOLUTION ──
  - type: split
    title: Heuristic Evaluation & Competitive Analysis
    content: |
      <p>The redesign started with research, not wireframes. I evaluated the existing
      product page against Baymard's heuristic guidelines for Home & Furniture
      e-commerce — the same dataset I helped build over eight years. Every element
      scored: gallery, buy section, product descriptions, variant selectors, delivery
      information, trust signals.</p>
      <p>Then a structured competitive analysis across twelve direct competitors —
      Italian and international bathroom furniture brands — focused on the specific
      problems Parama faced: variant management for products with many sizes and
      colors, gallery requirements for high-consideration purchases, and information
      hierarchy for complex product specifications.</p>
      <p>The output wasn't a PDF of suggestions. It was a prioritized fix list where
      every recommendation traced back to a heuristic, a competitor benchmark, or both.</p>
    image: /static/assets/images/projects/parama/competitive_analysis.png
    reverse: false

  - type: split
    title: The Redesign
    content: |
      <p><strong>Layout:</strong> replaced the flat single-page structure with
      collapsible sections — optimal information hierarchy for complex products,
      implementable with CSS and minimal JavaScript, no backend changes required.</p>
      <p><strong>Gallery:</strong> moved from a single image to a multi-angle
      gallery with vertical thumbnail strip. Research shows that for high-consideration
      purchases like designer furniture, buyers need at minimum four angles plus
      lifestyle context shots.</p>
      <p><strong>Buy section:</strong> restructured the entire purchase area — stock
      status indicator, price with savings callout, grid-based size selector instead
      of dropdowns (lower error rates, faster selection), visual color swatches,
      hybrid quantity controls, split delivery options with estimated dates, and
      third-party payment integration.</p>
    image: /static/assets/images/projects/parama/desktop_redesign.png
    reverse: true

  - type: split
    title: Shipping Around a Locked CMS
    content: |
      <p>The agency wouldn't cooperate and the CMS was rigid. The strategy: do
      everything through external CSS overrides and injected JavaScript. No backend
      access needed, no database changes, no agency coordination for day-to-day work.</p>
      <p>Collapsible sections — pure CSS with a few lines of JavaScript for the toggle.
      Gallery — JavaScript image switcher overlaying the existing single-image container.
      Variant selectors — CSS grid layout replacing the default dropdowns, with JavaScript
      handling the state. The client's developers only needed to include one stylesheet
      and one script file.</p>
      <p>Every design decision was constrained by what could be shipped independently.
      That constraint shaped the methodology: evaluate what's broken, design the fix
      within what's buildable, prototype in the browser, iterate with the client, deliver
      production CSS.</p>
    image: /static/assets/images/projects/parama/mobile_redesign.png
    reverse: false

  # ── 4. RESULT ──
  - type: callout
    title: Research to Implementation, One Person
    content: |
      <p>No handoff between researcher and developer. The same person who ran the
      heuristic evaluation against 700+ guidelines and benchmarked twelve competitors
      wrote the CSS and JavaScript that shipped. The gap between "what the research
      found" and "what the code does" was zero — because there was no gap to cross.</p>
---