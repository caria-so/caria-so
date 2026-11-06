---
title: deepowl
summary: Turn product data into a knowledge graph, grounded against Wikidata and published ontologies.
status: internal tool
date: 2025-present
role: Solo developer
client: Internal tool
image: /static/assets/images/projects/deepowl/desktop_cover.webp
desktop_cover: /static/assets/images/projects/deepowl/desktop_cover.webp
mobile_cover:
pattern: lr-pattern-dots
technologies:
  - Python
  - Django
  - Postgres
  - Neo4j
  - DeepOnto
  - D3
  - WooCommerce REST
  - Wikidata
live_link:
github_link:
accent: hatch-data
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: Why I Built This
    content: |
      <p>Every e-commerce store has its own taxonomy — categories, tags, attributes, author names — built by hand over years, internally consistent at best. The terms mean something, but only to the people who made them. Ontology tooling exists to fix this, but it's built for ontologists. deepowl brings that rigour to product data, with AI doing the matching and a human making the calls.</p>

  # ── 2. METRICS ──
  - type: metrics-pills
    items:
      - value: "94,747"
        label: Nodes in the first graph
      - value: "11,457"
        label: Terms to ground
      - value: "~31s"
        label: Full graph rebuild

  # ── 3. HOW IT WORKS ──
  - type: split
    title: From Store to Knowledge Graph
    content: |
      <p>deepowl reads a WooCommerce store over the REST API — products, categories, tags, attributes, orders — and builds a graph. The source is never modified. Every piece of store taxonomy becomes a node that can be mapped to a published vocabulary: schema.org, SKOS, Wikidata, domain ontologies.</p>
      <p>Decisions live in Postgres. The graph in Neo4j is a projection — droppable and rebuildable at any time without losing a single mapping. What you see is disposable. What you decided is not.</p>
    image: /static/assets/images/projects/deepowl/desktop_cover.webp
    reverse: false

  - type: split
    title: Grounding With BERTMap and JEV
    content: |
      <p>Every local term is matched against Wikidata and any published ontology you load. BERTMap handles semantic matching — finding that your <em>autore</em> field maps to <code>schema:author</code>. JEV catches near-duplicates and surface-level variants within your own taxonomy before they become separate nodes in the graph.</p>
      <p>Auto-accept is narrow: all authorities answered, exactly one unambiguous match, no objection from the scorer. Everything else goes to a review queue. A wrong <code>exactMatch</code> is a lie nobody catches later — a row in a queue is work you can trust.</p>
    image: /static/assets/images/projects/deepowl/grounding.webp
    reverse: true

  - type: split
    title: Blast Radius
    content: |
      <p>Once a term is grounded, it has properties — from Wikidata, from the ontology it matched against. deepowl lets you inherit those properties selectively, and shows you the blast radius: how many nodes in your graph each inherited property would touch, and whether any of them collide with terms you already grounded differently.</p>
      <p>JEV runs again here — comparing inherited labels against your existing terms to surface overlaps before they become contradictions. The system tells you what would happen. You decide whether it should.</p>
    image: /static/assets/images/projects/deepowl/blast_radius.webp
    reverse: false

  # ── 4. EXPORT ──
  - type: methodology
    title: What Goes Out
    content: |
      <p>The model exports as Turtle, OWL, or JSON-LD. Published vocabularies are referenced, never forked — if you use a class someone else defined, the export names it, not redefines it. The matching and graph code is pure Python with no Django dependency, so the same pipeline runs from a CLI before any interface exists.</p>

  # ── 5. CTA ──
  - type: callout
    title: Product data that should be smarter?
    content: |
      <p>If your store's taxonomy is a mess of hand-made categories and ungrounded terms — I built the tool to fix that, and I can help you run it.</p>
    button: Get in touch

  - type: gallery
    title: In Use
    images:
      - src: /static/assets/images/projects/deepowl/bulk_edges.webp
        alt: Graph canvas with faceted legend and node drawer
      - src: /static/assets/images/projects/deepowl/match_accepted.webp
        alt: Grounding review queue with one verdict per row
      - src: /static/assets/images/projects/deepowl/schema_classes_crosswalk.webp
        alt: Schema.org class alignment across store and Wikidata
      - src: /static/assets/images/projects/deepowl/schema_properties_crosswalk.webp
        alt: Property crosswalk for grounding decisions
---