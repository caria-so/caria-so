---
title: SciData Hub
summary: One door to 40+ scientific datasets — curated Parquet on Hugging Face, federated external collections, SQL and Python access, and MCP tools for research agents.
status: live
date: 2025-present
role: Solo developer
client: Impossible Papers
services:
  - pipelines
  - knowledge
image: /static/assets/images/projects/scidata-hub/desktop_cover.png
pattern: lr-pattern-dots
technologies:
  - Python
  - Hugging Face
  - Parquet
  - DuckDB
  - MCP
live_link: https://huggingface.co/scidata-hub
github_link:
accent: hatch-data
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: The Problem
    content: |
      <p>Scientific data is public but scattered. Galaxy rotation curves live in one archive.
      Dark matter detector results in another. Protein interactions in a REST API. Number
      theory databases behind their own query syntax. Each source has its own format,
      pagination, rate limits, and documentation — if any.</p>
      <p>If you're testing a hypothesis that touches more than one domain, you spend days
      on plumbing before you touch science. SciData Hub is the front door: one interface
      to discover, load, query, and join across 40+ datasets.</p>

  # ── 2. METRICS ──
  - type: metrics
    items:
      - value: "40+"
        label: Datasets in registry
      - value: "7"
        label: Ontologies as Parquet
      - value: "4"
        label: Access paths
      - value: "0"
        label: Data re-hosted

  # ── 3. SOLUTION ──
  - type: split
    title: One Door, Four Ways In
    content: |
      <p><strong>Hugging Face Parquet</strong> — cleaned datasets under the
      <code>scidata-hub</code> org. Versioned, streamable, one-line load.</p>
      <p><strong>Python library</strong> — <code>load()</code> for cached data,
      <code>query()</code> for live APIs, <code>discover()</code> to find what exists,
      <code>join()</code> to cross-match catalogs by coordinates or keys.</p>
      <p><strong>DuckDB views</strong> — a registry file with SQL views that read Parquet
      directly from Hugging Face over HTTP. No install, any language, joins work out of
      the box.</p>
      <p><strong>MCP server</strong> — LLM agents call tools to discover schemas, run
      queries, and join datasets without knowing which API sits underneath.</p>
    image: /static/assets/images/projects/scidata-hub/desktop_cover.png
    reverse: false

  - type: split
    title: Federation, Not Duplication
    content: |
      <p>SciData Hub doesn't copy what others maintain.
      <a href="https://huggingface.co/MultimodalUniverse" target="_blank">MultimodalUniverse</a>
      hosts 24 astronomical surveys — JWST, DESI, TESS — over 100 TB. They stay where
      they are; our registry routes to them and makes them joinable with our data.
      <a href="https://huggingface.co/datasets/J0nasW/science-datalake" target="_blank">science-datalake</a>
      exposes ~293M papers as queryable Parquet. SciData Hub federates it: query by DOI,
      trace which datasets a paper references, route to the source.</p>
      <p>Seven ontologies — GO, ChEBI, HPO, DOID, MeSH, CSO, FMA — published as Parquet
      alongside the research data. A gene name in one paper, a chemical ID in another,
      and a disease term in a third resolve to the same entity graph. Research data plus
      shared identifiers in one place.</p>
    image: /static/assets/images/projects/scidata-hub/viz_structure.png
    reverse: true

  # ── 4. ARCHITECTURE ──
  - type: code
    title: What It Looks Like
    filename: scidata_usage.py
    content: |
      from scidata import load, query, discover, join

      # One line — rotation curves from Hugging Face
      sparc = load("sparc")

      # Live API, same interface
      curves = query("lmfdb",
          filters={"conductor_max": 1000, "rank": 2},
          fields=["conductor", "rank", "bsd_ratio"]
      )

      # What exists for this question?
      hits = discover("dark matter annual modulation NaI")
      # → anais112, cosine100, xenon1t, ...

      # Cross-catalog join — the part nobody else ships
      result = join(
          left=load("sparc"),
          right=query("sdss", filters={"type": "galaxy"}),
          on="sky_coords",
          tolerance_arcsec=5.0
      )

  # ── 5. RESULT ──
  - type: callout
    title: Why One Door Matters
    content: |
      <p><strong>For researchers:</strong> stop losing days to API archaeology. Load SPARC,
      query LMFDB, join on sky coordinates — same afternoon.</p>
      <p><strong>For agents:</strong> simulation pipelines import <code>scidata</code> or
      call MCP tools instead of generating fragile one-off HTTP scripts per hypothesis.</p>
      <p><strong>For the commons:</strong> cleaned Parquet, documented schemas, and DuckDB
      views on Hugging Face — reusable by anyone, whether or not they use Impossible Papers.</p>
      <p>Live but still growing. New domains mean new sources; each follows the same plugin
      pattern — one file in <code>sources/</code>, one DuckDB view, discoverable from day one.
      Working on a public dataset that should be behind this door?
      <a href="#" data-contact-trigger>Get in touch</a>.</p>
---