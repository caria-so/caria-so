---
slug: tractOCR
title: TractOCR
summary: Closed-loop OCR and document parsing pipeline for research-grade output. Each corpus I work through makes the next one cheaper.
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
      <p>I often work with difficult documents — institutional inventories, academic papers, scanned treatises. Off-the-shelf OCR flattens the structure, loses footnotes, and has no concept of reading order. I needed a pipeline I control end to end, from ingestion to structured data, that I can retrain on my own material.</p>

  # ── 2. METRICS ──
  - type: metrics-pills
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
      <p><strong>Vision engine</strong> for scanned and image-heavy PDFs — pages rendered and sent to a vision model. This is the path for anything without a machine-readable text layer.</p>
      <p><strong>Text engine</strong> for born-digital PDFs — PyMuPDF extracts the embedded text layer directly. No vision model, no API calls, no cost.</p>
      <p><strong>Auto mode</strong> samples the first five pages and picks the right engine. The pipeline assumes nothing about the input.</p>
    image: /static/assets/images/projects/tract/desktop_cover.webp
    reverse: false

  - type: split
    title: Layout Detection
    content: |
      <p>A D-FINE transformer model trained on LADaS — a multi-century dataset from the 17th century to present — identifies 37 region types: paragraphs, headings, margin notes, drop capitals, tables, figures, stamps, music notation, decorative elements. SegmOnto controlled vocabulary throughout.</p>
      <p>Kraken's baseline segmentation detects individual text lines as polygon boundaries — shapes that follow the actual curve of text on warped pages. Lines are assigned to their enclosing region by centroid. The result is a reading order that respects the page.</p>
    image:
    reverse: true

  - type: split
    title: Structured Output
    content: |
      <p>Each source produces a <code>book.json</code> — body text, margin notes, footnotes, headers, figures, tables, page numbers, and catchwords in separate fields. Detected figures and tables are cropped to JPEG and saved alongside.</p>
      <p>Everything downstream reads from this: <strong>monsieur.lib</strong> serves the OCR text next to the original scan, the Riccardiana catalog parser extracts structured records from it, regex and NLP pipelines consume it for entity extraction. One format, many uses.</p>
    image:
    reverse: false

  # ── 4. ANNOTATION + TRAINING ──
  - type: split
    title: Annotation and Retraining
    content: |
      <p>A labeling interface for correcting OCR output and region boundaries directly against the source scans. Corrections feed back as training data — the layout model improves on my own material over time.</p>
      <p>A closed loop: process a batch, correct the worst pages, retrain, reprocess. Each corpus I work through makes the next one cheaper.</p>
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
    title: Need to extract structured data from difficult documents?
    content: |
      <p>If you're working with historical texts, institutional archives,
      or any document that breaks standard OCR — I've built the pipeline
      and I can help you set up yours.</p>
    button: Get in touch
---
