---
slug: tractOCR
title: TractOCR
summary: The OCR and document parsing pipeline I built for my own research material. It's tuned to the kind of documents I keep running into, and it gets better as I correct its output.
status: internal tool
date: 2025-present
role: Solo developer
client: Internal tool
image: /static/assets/images/projects/tract/desktop_cover.webp
desktop_cover: /static/assets/images/projects/tract/desktop_cover.webp
mobile_cover:
pattern: lr-pattern-dots
technologies:
  - Python
  - FastAPI
  - SQLite
  - PyMuPDF
  - Kraken
  - Supabase S3
  - Docker
live_link:
github_link:
accent: hatch-data
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: Why I Built This
    content: |
      <p>Much of my work involves awkward documents: institutional inventories, academic papers, and scanned treatises several centuries old. The OCR tools I tried were good at plain text, but on these pages they tended to lose footnotes and margin notes and to scramble the reading order. I wanted a pipeline I could follow and adjust at every step, from the PDF to structured data, and one I could retrain on my own material.</p>

  # ── 2. METRICS ──
  - type: metrics
    items:
      - value: "37"
        label: Layout region types
      - value: "17th c."
        label: Oldest training data
      - value: "~0.4s"
        label: Per page (born-digital)

  # ── 3. HOW IT WORKS ──
  - type: split
    title: Two Engines, One Pipeline
    content: |
      <p><strong>Vision engine</strong> for scanned and image-heavy PDFs. Pages are rendered and sent to a vision model. This is the route for anything without a usable text layer.</p>
      <p><strong>Text engine</strong> for born-digital PDFs. PyMuPDF reads the embedded text layer directly, so it's fast and makes no paid API calls.</p>
      <p><strong>Auto mode</strong> looks at the first five pages and chooses an engine, so I don't have to check each file by hand before a batch.</p>
    image: /static/assets/images/projects/tract/desktop_cover.webp
    reverse: false

  - type: split
    title: Layout Detection
    content: |
      <p>For layout I use a D-FINE model trained on LADaS, a dataset spanning the 17th century to the present. The model recognises 37 region types, including paragraphs, headings, margin notes, drop capitals, tables, figures, stamps, music notation and decoration. Labels follow the SegmOnto vocabulary, so they stay compatible with other projects in the field.</p>
      <p>Kraken handles line segmentation. It traces each line as a polygon that follows the curve of the text on warped pages, and each line is then assigned to the region that contains its centre. In most cases this gives a reading order that matches how the page is meant to be read.</p>
    image:
    reverse: true

  - type: split
    title: Structured Output
    content: |
      <p>Each source produces a <code>book.json</code> file, with body text, margin notes, footnotes, headers, figures, tables, page numbers and catchwords kept in separate fields. Figures and tables are cropped to JPEG and saved alongside it.</p>
      <p>My other tools read this file. <strong>monsieur.lib</strong> shows the OCR text next to the original scan, the Riccardiana catalogue parser pulls structured records from it, and my regex and NLP scripts use it for entity extraction. Settling on one format early saved me from writing a converter for every new use.</p>
    image:
    reverse: false

  # ── 4. ANNOTATION + TRAINING ──
  - type: split
    title: Annotation and Retraining
    content: |
      <p>A small labelling interface lets me correct OCR output and region boundaries directly against the scans. Those corrections become training data, so the layout model gradually adapts to the material I actually work with.</p>
      <p>The routine is simple: process a batch, fix the worst pages, retrain, reprocess. Each corpus still takes work, but there's usually less to correct than the time before.</p>
    image:
    reverse: true

  - type: gallery
    title: In Use
    images:
      - src:
        alt: Job workspace with document list and OCR settings
      - src:
        alt: Layout detection preview with region overlays
      - src:
        alt: Split-screen reader with scan and transcription

  - type: callout
    title: Struggling with documents that standard OCR can't handle?
    content: |
      <p>If you work with historical texts, archives, or documents that standard OCR
      can't make sense of, I've spent a long time on the same problem. I'm happy to
      compare notes, or to help you set up something similar for your own material.</p>
    button: Get in touch
---