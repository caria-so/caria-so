---
title: Bookshelf
summary: Barcode to catalog in under 10 seconds. A metadata aggregation platform for independent bookshops — scan, enrich from five sources, publish to WooCommerce.
status: live
date: 2025-present
role: Solo developer
client: Libreria Rotondi, Rome
image: /static/assets/images/projects/bookshelf/desktop_cover.png
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
live_link: https://bookshelf.onrender.com
github_link:
accent: hatch-data
desktop_cover: /static/assets/images/projects/bookshelf/desktop_cover.png
mobile_cover: 
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: The Problem
    content: |
      <p>Independent bookshops run on WooCommerce but their catalogs are a disaster. Every new book means five minutes of manual data entry — publisher, year, page count, subjects, description, cover image — copy-pasted from wherever Google leads.</p>
      <p>Libreria Rotondi in Rome has 18,000 published products with significant data gaps. 2,545 items filed under "Senza categoria." A category tree 280 nodes deep with no consistency. Adding a shelf of fifty new books is a full day gone.</p>

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
    image: /static/assets/images/projects/bookshelf/desktop_cover.png
    reverse: false

  - type: split
    title: Works in the Shop
    content: |
      <p>A mobile barcode scanner that works on an iPhone in a dimly lit bookshop is harder than it sounds. The solution: auto-zoom at 3.7×, capture-and-crop to the barcode area, server-side multi-pass decoding via pyzbar with grayscale, sharpen, and contrast enhancement. If the camera can see it, pyzbar reads it.</p>
      <p>For counter setups, a standard laser scanner gun works natively — it emulates a keyboard, types the ISBN, hits Enter. Scan, beep, next book.</p>
    image: /static/assets/images/projects/bookshelf/mobile_scan.png
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
      <p>Every bookshop organizes differently. Rotondi uses a custom <code>autore</code> taxonomy with 11,000+ entries and a dozen <code>libro_*</code> meta keys. Another shop might use WooCommerce attributes, tags, or completely different field names.</p>
      <p>Nothing is hardcoded. A JSON profile defines how each field maps to the store — native field, meta key, taxonomy term, or skip. Adding a new store means writing one JSON file. The metadata aggregation layer is designed to serve any application that needs bibliographic intelligence.</p>
    image: /static/assets/images/projects/bookshelf/mapping.png
    reverse: false


  # ── 5. RESULT ──
  - type: callout
    title: Built With a Real Shop
    content: |
      <p>Every feature was tested on real hardware with real data — iPhone 14 in the shop, laser scanner at the counter, 18,000 products with real data gaps. Libreria Rotondi is an esoteric bookshop with one of the largest collections of occult, hermetic, and Eastern philosophy titles in Italy. If it works here, it works anywhere.</p>
      <p>Bookshelf is in pilot with independent bookshops on board. If you run an online store and spend too much time on catalog data entry — <a href="#" data-contact-trigger>get in touch</a>.</p>
---