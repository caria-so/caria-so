---
title: Deepowl
summary: Turns a WooCommerce store into a knowledge graph, linking its categories, tags and attributes to published vocabularies so that other systems can understand them too.
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
      <p>Most online shops build their categories, tags and attributes by hand over many years. That structure holds real knowledge about the products, but it's written in the shop's own terms, and search engines and AI shopping assistants can't easily tell what those terms mean. Ontologies were made to solve this, but the tools for them are designed for specialists, not for someone running a store. I wanted a way to connect a store's own vocabulary to shared, published vocabularies, with automatic matching to do the heavy lifting and a person making the final decisions.</p>

  # ── 2. METRICS ──
  - type: metrics
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
      <p>deepowl reads a WooCommerce store through its REST API (products, categories, tags, attributes and orders) and builds a graph from it. It only reads from the store and never changes it. Each category, tag and attribute becomes a node that can be linked to a published vocabulary, such as schema.org, SKOS, Wikidata or an ontology from the store's own field.</p>
      <p>The mapping decisions are stored in Postgres, and the Neo4j graph is built from them. That means I can throw away the graph and rebuild it at any time without losing any of the work that went into the mappings.</p>
    image: /static/assets/images/projects/deepowl/desktop_cover.webp
    reverse: false

  - type: split
    title: Grounding With BERTMap and JEV
    content: |
      <p>Each term in the store is compared against Wikidata and any other ontology I load. BERTMap, from the DeepOnto library, handles the semantic matching. It can recognise, for example, that a field called <em>autore</em> corresponds to <code>schema:author</code>. JEV looks for near-duplicates and spelling variants within the store's own vocabulary, so they can be merged before they become separate nodes.</p>
      <p>A match is only accepted automatically in a narrow case: every source has answered, there is exactly one clear candidate, and the scorer raises no objection. Everything else goes to a review queue. I'd rather review a row than discover months later that a wrong match has spread quietly through the data.</p>
    image: /static/assets/images/projects/deepowl/grounding.webp
    reverse: true

  - type: split
    title: Seeing the Impact Before Applying It
    content: |
      <p>Once a term is linked to Wikidata or an ontology, it can take on that source's properties. deepowl lets me choose which properties to bring in. Before anything is applied, it shows how many nodes each property would affect and whether any of them conflict with links I've already made, which I call the "blast radius."</p>
      <p>JEV runs again at this stage, comparing incoming labels with existing terms to flag overlaps before they turn into contradictions. The tool shows the consequences of a change, and I decide whether to make it.</p>
    image: /static/assets/images/projects/deepowl/blast_radius.webp
    reverse: false

  # ── 4. EXPORT ──
  - type: methodology
    title: What Goes Out
    content: |
      <p>The resulting model can be exported as Turtle, OWL or JSON-LD. Published vocabularies are referenced rather than copied, so if the store uses a class someone else defined, the export points to the original. The matching and graph code is plain Python, independent of Django, so the whole pipeline can also run from the command line.</p>

  # ── 5. CTA ──
  - type: callout
    title: Want your product data to be understood beyond your own shop?
    content: |
      <p>If you've built up a store's categories and attributes over years and would like
      search engines, partners or AI assistants to understand them as well as you do, I'd be
      glad to talk about how this could work for your catalogue.</p>
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