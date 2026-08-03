---
title: Flowws MCP
summary: A computable UX knowledge system — HCI research encoded as a graph with every citation verified against its source, exposed to Claude Code through an MCP server so evidence lands in a developer's context window exactly when they need it.
status: live
date: 2025-present
role: Solo developer
client: Internal product
image: /static/assets/images/projects/flowws-mcp/desktop_cover.png
technologies:
  - Python
  - Django
  - Neo4j
  - Pydantic
  - MCP
  - Qwen (HF Inference)
  - Claude AI (Vision)
  - Playwright
  - Lighthouse
live_link: https://flowws.io
github_link:
accent: hatch-data
desktop_cover: /static/assets/images/projects/flowws-mcp/desktop_cover.png
related_posts:
  - ux__search-audit-methodology
  - ux__trust-signals-ecommerce

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: The Problem
    content: |
      <p>UX knowledge exists as prose. Baymard publishes 650+ guidelines. Nielsen Norman
      has 450+ articles. Google has playbooks. A developer building a search component
      can't query any of it. A designer can't ask it why a layout causes friction.
      An automated system can't reason about it at all.</p>
      <p>Flowws makes UX knowledge computable: research parsed into a graph of
      interactions, every claim traceable to the exact sentence it came from, served
      to an AI at the moment it writes code.</p>

  # ── 2. METRICS ──
  - type: metrics-pills
    items:
      - value: "392"
        label: Articles parsed
      - value: "4,815"
        label: Interaction scenarios
      - value: "17,640"
        label: Verified citations
      - value: "0"
        label: Fabricated quotes

  # ── 3. SOLUTION ──
  - type: split
    title: The Interaction as Unit of Analysis
    content: |
      <p>Most tools treat the <strong>page</strong> as the unit. GA4 measures sessions
      per page. Lighthouse scores a page. Heatmaps show a page.</p>
      <p>Flowws treats the <strong>interaction</strong>: a user, in a context, performing
      an action on a component, arriving at one of several possible outcomes. Each state
      has a quality judgment, a causal chain, and literature evidence. Two-thirds of the
      corpus describes perception and comprehension failures — the user never finds the
      element, or can't predict what it will do. GOMS operators from cognitive psychology
      model these as first-class nodes, so "users never noticed the map toggle" is captured
      as precisely as "users clicked submit."</p>
    image: /static/images/projects/flowws-architecture.jpg
    reverse: false

  - type: split
    title: Citations You Can Trust
    content: |
      <p>Language models are useful extractors and unreliable quoters — they reconstruct
      fluent sentences and present them as verbatim. For a system whose entire value is
      citations, that's fatal.</p>
      <p>Every passage the model produces is checked character by character against the
      source article. Quotes that don't exist are removed. Reworded statistics are repaired
      back to the true sentence. Numbers that appear nowhere in the source are dropped.
      Across 11,000+ candidate quotes: <strong>zero fabricated citations</strong> in the
      served graph. The verifier is deterministic and re-runnable — the guarantee is
      mechanical, not a matter of trusting the model.</p>
    image: /static/assets/images/projects/flowws-mcp/citation_checked.jpg
    reverse: true

  - type: split
    title: MCP Server for Claude Code
    content: |
      <p>The graph is exposed as tools Claude Code calls during development.
      <code>get_component_guidance("search-input")</code> returns the evidence base
      for a component across the whole corpus: pitfalls, heuristic clusters, pages
      it appears on, source-linked citations. <code>get_page_flows</code> audits a
      page type. <code>query_by_heuristic</code> pulls a failure class across every
      article at once.</p>
      <p>When a developer asks whether their search results page follows best practice,
      Claude calls the tools, gets the causal chains for the components in scope, and
      cites the specific passage that applies — with a title and URL a reader can open.
      The design argument that used to end with "that's just best practice" now ends
      with a reference.</p>
    image: /static/assets/images/projects/flowws-mcp/mcp_landing.png
    reverse: false

  # ── 4. RESULT ──
  - type: callout
    title: Who This Is For
    content: |
      <p><strong>Developers</strong> who want UX evidence in the editor, cited, not in a
      PDF nobody reopens. <strong>E-commerce teams</strong> who need to know where their
      site sits relative to the research. <strong>Agencies</strong> pitching audits who
      need traceable sources, not opinions.</p>
      <p>Next: a screenshot pipeline that detects UI components on real sites, records
      bounding boxes keyed to the same component names the graph uses, and grounds
      spatial reasoning in what real pages actually do. The bridge from knowledge base
      to automated auditor.</p>
      <p>Want your niche mapped — or your site benchmarked against the research?
      <a href="#" data-contact-trigger>Let's talk</a>.</p>
---