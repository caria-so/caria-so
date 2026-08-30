---
title: Bookshelf
summary: Barcode to catalog in under 10 seconds. A metadata aggregation platform for independent bookshops — scan, enrich from five sources, publish to WooCommerce.
status: live
date: 2025-present
role: Solo developer
client: Libreria Rotondi, Rome
services:
  - development
  - knowledge
image: /static/assets/images/projects/bookshelf/desktop_cover.webp
pattern: lr-pattern-dots
technologies:
  - Python
  - FastAPI
  - SQLite
  - Vanilla JS
  - Jinja2
  - pyzbar
  - Docker
  - Render
live_link: https://bookshelf-app-xj01.onrender.com/
github_link:
accent: hatch-data
desktop_cover: /static/assets/images/projects/bookshelf/desktop_cover.webp
mobile_cover:
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: The Problem
    content: |
      <p>Independent bookshops run on WooCommerce but their catalogs are a drama. Every new book means five minutes or more of manual data entry — publisher, year, page count, subjects, description, cover image — copy-pasted from wherever Google leads. <strong>Libreria Rotondi</strong> has circa 20,000 published products with significant data gaps. 2545 items filed under "Senza categoria." Author names inconsistent, many items with no image, no description, no sku. A category tree 280 nodes deep with no consistency. Adding a shelf of fifty new books is a full day gone.</p>

  # ── 2. METRICS ──
  - type: metrics-pills
    items:
      - value: "5"
        label: Sources merged per scan
      - value: "<10s"
        label: Barcode to catalog
      - value: "18K+"
        label: Products managed
      - value: "0"
        label: Manual data entry

  # ── 3. SOLUTION (2-3 splits) ──
  - type: split
    title: Scan, Enrich, Publish
    content: |
      <p>Point your phone at the barcode. Five sources are queried simultaneously — OPAC SBN (Italian national catalog), IBS.it, OpenLibrary, Maremagnum, and ViaLibri. Each returns different data. The system merges them intelligently: OPAC SBN for authoritative bibliographic records, IBS for Italian descriptions and cover images, OpenLibrary for English-language metadata. Authors are deduplicated across name variants ("Evola, Julius" and "Julius Evola" become one entry).</p>
      <p>One click pushes the enriched record to WooCommerce with field-level diff detection. Only changed fields are sent.</p>
    image: /static/assets/images/projects/bookshelf/desktop_cover.webp
    caption: Importing a store's dataset from WooCommerce and recreating a listing table with stats. Users can filter to highlight missing information, inspect the page detail, plan batch enrichment.
    reverse: false

  - type: methodology
    title: Shadow, Interview, Prototype, Test
    content: |
      <p>Started by shadowing the shop team at Rotondi — watching how catalog data actually gets entered, where it breaks, and what they'd trust from an automated import.</p>
    detail_label: Process & decisions
    case_study:
      problem: |
        <p>~20K WooCommerce products with gaps — missing images, inconsistent authors, 2,545 items in "Senza categoria," a 280-node category tree with no consistency. Adding 50 books was a full day of copy-paste.</p>
      method: |
        <p>Shadowing → interviews with the archivists → barcode prototype on real inventory → profile-driven WooCommerce sync with human approval before publish.</p>
      decisions: |
        <p><strong>Five-source merge</strong> — no single API has complete Italian bibliographic data; OPAC SBN for authority, IBS for covers and Italian copy.</p>
        <p><strong>Human in the loop</strong> — archivist approves taxonomy placement; automation handles lookup, not judgment calls.</p>
        <p><strong>JSON store profiles</strong> — Rotondi's custom <code>autore</code> taxonomy doesn't hardcode; next shop is one config file.</p>
      constraints: |
        <p>Live store — nothing breaks checkout. Staff use phones and laser scanners interchangeably. WooCommerce plugin stack already fragile.</p>
      outcome: |
        <p>Barcode to enriched catalog record in under 10 seconds. Pilot running on real shop inventory with 18K+ products managed.</p>
      lessons: |
        <p>Bookshop software fails when it ignores how archivists actually think about categories — the UI has to match their mental model, not WooCommerce's defaults.</p>
      metrics:
        - label: Time per new title
          before: "~7 min. manual entry"
          after: "<6 sec. scan"
        - label: Data sources merged
          before: "3 (Opac, IBS, Vialibri)"
          after: "5 APIs"

  - type: split
    title: Works in the Shop
    content: |
      <p>A mobile barcode scanner that works on any smartphone: auto-zoom at 3.7×, capture-and-crop to the barcode area, server-side multi-pass decoding via pyzbar with grayscale, sharpen, and contrast enhancement. If the camera can see it, pyzbar reads it.</p>
      <p>For counter setups, a standard laser scanner gun works natively — it emulates a keyboard, types the ISBN, hits Enter. Scan, beep, next book.</p>
      <p>Multiple scans can be triggered by csv list or simply by typing isbn codes in a custom field.</p>
    image: /static/assets/images/projects/bookshelf/mobile_scan.webp
    caption: A scanner is a powerful way to shoot barcodes and load book data in a standardized way. Taxonomy dedup and a human-in-the-loop UI let the archivist approve before publish. Works with laser guns too.
    reverse: true

  # ── 4. ARCHITECTURE ──
  - type: code
    title: Source Merging
    filename: lookup.py
    content: |
      # Five sources return different data for the same ISBN.
      # Smart merge picks the best value per field, deduplicates
      # authors across name variants, respects source priority.

      record = merge_sources([opac, ibs, openlibrary, maremagnum, vialibre])

      # "Evola, Julius" + "Julius Evola" → one author
      # IBS description preferred (Italian store)
      # OPAC SBN publisher name = authoritative
      # Cover: IBS first, OpenLibrary fallback

  - type: split
    title: Multi-Store, Profile-Driven
    content: |
      <p>Every bookshop organizes differently. My customer uses a custom <code>autore</code> taxonomy with 11,000+ entries and a dozen <code>libro_*</code> meta keys. Another shop might use WooCommerce attributes, tags, or completely different field names.</p>
      <p>Nothing is hardcoded. A JSON profile defines how each field maps to the store — native field, meta key, taxonomy term, or skip. Adding a new store means writing one JSON file. The metadata aggregation layer is designed to serve any application that needs bibliographic intelligence.</p>
    image: /static/assets/images/projects/bookshelf/mapping.webp
    caption: Importing a store's dataset from WooCommerce and recreating a listing table with stats. Users can filter to highlight missing information, inspect the page detail, plan batch enrichment.
    reverse: false

  # ── 5. RESULT ──
  - type: callout
    title: Built with a real shop
    content: |
      <p>Bookshelf is in pilot with independent bookshops on board. If you run an online store and spend too much time on catalog data entry, we can fix it.</p>
    button: Get in touch
---
