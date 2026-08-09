---
title: DeepOCR
summary: OCR pipeline for historical and esoteric texts. Two engines, transformer-based layout detection, structured output — built to read documents most tools ignore.
status: in_development
date: 2025-present
role: Solo developer
client: Internal product
image: /static/assets/images/projects/deepocr/desktop_cover.png
desktop_cover: /static/assets/images/projects/deepocr/desktop_cover.png
mobile_cover:
pattern: lr-pattern-dots
technologies:
  - Python
  - FastAPI
  - SQLite
  - PyMuPDF
  - Kraken
  - LightOn OCR
  - Supabase S3
  - Docker
live_link:
github_link:
accent: hatch-data
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: The Problem
    content: |
      <p>Most OCR tools are built for clean, modern documents. Feed them a 16th-century
      manuscript, a scanned esoteric treatise, or a book with drop capitals, margin notes, and decorative borders — and they likely give you garbage. They flatten the structure, lose the footnotes, and oftne have little concept of reading order.</p>
      <p>DeepOCR is built for the hardest layout and scripts most OCR ignores</p>.

  # ── 2. METRICS ──
  - type: metrics-pills
    items:
      - value: "10"
        label: OCR engines
      - value: "37"
        label: Layout region types
      - value: "17th c."
        label: Oldest training data
      - value: "~0.4s"
        label: Per page (born-digital)

  # ── 3. SOLUTION ──
  - type: split
    title: Two Engines, One Pipeline
    content: |
      <p><strong>Vision engine</strong> for scanned and image-heavy PDFs — pages rendered
      and sent to a LightOn 2B model on a HuggingFace Inference Endpoint. This is the
      path for old books, manuscripts, anything without a machine-readable text layer.</p>
      <p><strong>Text engine</strong> for born-digital PDFs — PyMuPDF extracts the embedded
      text layer directly as Markdown. No vision model, no API calls, no cost.</p>
      <p><strong>Auto mode</strong> samples the first five pages and picks the right engine.
      The pipeline assumes nothing about the input.</p>
    image: /static/assets/images/projects/deepocr/desktop_cover.png
    reverse: false

  - type: split
    title: Layout Detection for Old Books
    content: |
      <p>A D-FINE transformer model trained on LADaS — a multi-century dataset from the
      17th century to present — identifies 37 region types: paragraphs, headings, margin
      notes, drop capitals, tables, figures, stamps, music notation, decorative elements.
      SegmOnto controlled vocabulary throughout.</p>
      <p>Kraken's baseline segmentation then detects individual text lines as polygon
      boundaries — not rectangles, but shapes that follow the actual curve of text on
      warped pages. Lines are assigned to their enclosing region by centroid. The result
      is a reading order that respects the page, not just its bounding box.</p>
    image: /static/images/projects/deepocr-layout.jpg
    reverse: true

  - type: split
    title: Structured Output, Not a Text Dump
    content: |
      <p>Each source produces a single <code>book.json</code> — body text, margin notes,
      footnotes, headers, figures, tables, page numbers, and catchwords in separate fields.
      Detected figures and tables are automatically cropped to JPEG and saved alongside.</p>
      <p>This is what makes DeepOCR useful as infrastructure. Downstream apps read
      <code>book.json</code> from Supabase S3 and work with the data directly. The primary
      consumer is <strong>monsieur.lib</strong> — a library reader that serves the OCR text
      next to the original scan, renders markdown, and inlines cropped figures. A single-page
      re-OCR button delegates back to DeepOCR without either system knowing the other's internals.</p>
    image: /static/images/projects/deepocr-output.jpg
    reverse: false

  # ── 4. RESULT ──
  - type: callout
    title: What It Can Read
    content: |
      <p>Tested on 17th-century printed books, esoteric and hermetic treatises, manuscripts
      with handwritten marginal additions, academic papers, auction catalogs, and modern
      reports. The LADaS training set covers monographs, PhD theses, magazines, and
      multi-script documents — Latin, Hebrew, Arabic, blackletter.</p>
      <p>If a document has been digitized, DeepOCR can give it structure.</p>

  - type: gallery
    title: In Use
    images:
      - src: /static/images/projects/deepocr-workspace.jpg
        alt: Job workspace with document list and OCR settings
      - src: /static/images/projects/deepocr-layout-preview.jpg
        alt: Layout detection preview with region overlays
      - src: /static/images/projects/deepocr-reader.jpg
        alt: Split-screen reader with scan and transcription
---
