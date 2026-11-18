---
title: IP-β
summary: My research pipeline. I give it a hypothesis, and agents search the literature, link every claim to its source and to established ontology terms, and build a graph I can query and check. It's a prototype, and I review the important steps myself.
status: active
date: 2026-present
role: Solo researcher & developer
client: Internal tool
image: /static/assets/images/projects/ip-beta/desktop_cover.webp
desktop_cover: /static/assets/images/projects/ip-beta/desktop_cover.webp
mobile_cover:
pattern: lr-pattern-noise
technologies:
  - Python
  - Claude API
  - Neo4j
  - DuckDB
  - OpenAlex
  - PubMed
  - Hugging Face Datasets
live_link:
github_link:
accent: hatch-ai
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: Why I Built This
    content: |
      <p>When I ask a language model about the literature, I usually get fluent prose, and it's hard to tell which sentence rests on which paper, or whether two sources actually agree. I wanted something I could check. In IP-β every claim is a node in a graph, tied to the paper it came from and to a term in a published ontology. I can trace a claim to its source, ask which claims support or contradict a hypothesis, and see where the evidence is thin. I find that more useful than a review I have to take on trust, though prose is still how the results get communicated in the end.</p>

  # ── 2. METRICS ──
  - type: metrics
    items:
      - value: "40+"
        label: Agent roles in the shell
      - value: "600+"
        label: Papers in a single run

  # ── 3. HOW IT WORKS ──
  - type: split
    title: From Hypothesis to Graph
    content: |
      <p>A run starts from a <strong>seed</strong>: one hypothesis, plus any specific claims I want tested. As it runs, it builds a Neo4j subgraph of problems, theories, papers, datasets and the decisions each agent made. The files on disk (the decision log, the reviewers' outputs and the seed itself) are the record. From them I can generate a <strong>fingerprint</strong>, a structured summary of what the run found and where it stands.</p>
      <p>Agents don't talk to each other directly. They read from and write to the graph, so every step leaves a trace. Supervisor agents are meant to decide what runs next and keep each run within budget. For now most of that supervision runs in shadow mode: it records what it would decide, and I make the call from the command line.</p>
    image: /static/assets/images/projects/ip-beta/desktop_cover.webp
    reverse: false

  - type: split
    title: Literature, Grounding and Review
    content: |
      <p><strong>Search.</strong> OpenAlex, PubMed, Europe PMC and patent databases are searched in depth on a narrow question before the search widens. Relevant papers are then broken down into individual claims and concepts.</p>
      <p><strong>Ground.</strong> Each concept is matched to a term in a published ontology, such as MeSH or HPO, many of which I host on <a href="https://huggingface.co/scidata-hub">SciData Hub</a>. This lets claims from different papers line up even when they use different wording. Uncertain matches stay as candidates until I review them.</p>
      <p><strong>Review.</strong> A panel of reviewer agents critiques the graph rather than a paragraph of text. They're asked to point to something concrete, such as a missing link, a contradiction between sources, or a number that doesn't add up.</p>
    image: /static/assets/images/projects/ip-beta/literature_grounding.webp
    reverse: true

  - type: split
    title: Where I Stay in the Loop
    content: |
      <p>The pipeline makes suggestions and I decide what to accept. Extracted claims and ontology matches are shown next to the source text and are never applied silently. Some decisions are reserved for me by design, for example which theoretical commitments a run should hold fixed and what counts as established background.</p>
      <p>This is the same approach I take in the rest of my tools. I automate the repetitive searching and linking, and keep judgement, and responsibility for the conclusions, with me until the system has earned more trust.</p>
    image: /static/assets/images/projects/ip-beta/fingerprint.webp
    reverse: false

  # ── 4. OUTPUT ──
  - type: methodology
    title: What Comes Out
    content: |
      <p>What comes out is a fingerprint, meaning a structured graph plus a run log, rather than a finished paper. When a run turns up something worth discussing, I write it up on the blog. Related tools: <a href="/project/deepowl">deepowl</a> applies similar ontology work to product data, and SciData Hub hosts the ontologies.</p>

  # ── 5. CTA ──
  - type: callout
    title: Building a research pipeline?
    content: |
      <p>If you're trying to connect literature search, ontologies and agents in your own
      research, and want results you can check rather than just read, I'd be glad to talk it
      through. I'm still learning what works, and comparing notes usually helps both sides.</p>
    button: Get in touch

---