---
title: IP-β
summary: A graph-native multi-agent system for automated scientific discovery. 40+ agents decomposing hypotheses, searching the literature, running adversarial review, and producing structured research fingerprints. One confirmed novel finding. Now facing the grounding challenge — the problem of getting a machine and a person to agree on what a claim is actually about.
status: active
date: 2026-present
role: Solo researcher & developer
client:
services:
  - pipelines
  - knowledge
image: /static/assets/images/projects/ip-beta/desktop_cover.webp
desktop_cover: /static/assets/images/projects/ip-beta/desktop_cover.webp
mobile_cover:
pattern: lr-pattern-noise
technologies:
  - Python
  - Claude API
  - Neo4j
  - DuckDB
  - spaCy
  - OpenAlex
  - PubMed
  - Hugging Face Datasets
live_link:
github_link:
accent: hatch-ai
tags:
  - AI
  - Research
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: The Problem
    content: |
      <p>
      Frontier labs are building research agents with hundreds of engineers
      and unrestricted compute. This project asks a narrower question:
      what is the minimum viable architecture that can survive contact
      with real scientific literature without hallucinating its results?
      The answer turns out to be more about what you <em>don't</em> store
      than what you compute — and, increasingly, about where a person is
      allowed to disagree with the machine before anything is written down.
      </p>

  # ── 2. METRICS ──
  - type: metrics
    items:
      - value: "Prototype"
        label: Current Stage
      - value: "1"
        label: Confirmed novel finding (validated by domain experts)
      - value: "+618"
        label: Papers analyzed in a single run

  # ── 3. WHAT IT FOUND ──
  - type: split
    title: What It Has Found
    content: |
      <p><strong>Astrophysics — a real number nobody seems to have computed.</strong>
      The Bondi-Hoyle accretion timescale for tidal dwarf galaxies in the
      superfluid dark matter framework: ~1,280 Gyr — 93 times the age of the
      universe. Read the report <a href="https://caria.so/post/ip_astrophys_TDG_Superfluid_DM_Accretion_Timescale_some_numbers">here</a></p>

      <p><strong>Origin of life — catching its own mistake.</strong>
      Stress-tested a hypothesis about emergent RNA-amino acid coding. The
      system caught its own pipeline producing a p-value interpretation that
      contradicted the actual simulation output — internal consistency
      checking working as designed. Read the report <a href="https://caria.so/post/ip_biology_can_rna_build_code">here</a></p></p>

      <p>The interesting pattern: both results came from the system
      <em>disagreeing with itself</em>, not from generating novelty.
      Generation is easy. Adjudication is the hard part.</p>
    image: /static/assets/images/projects/ip-beta/desktop_cover.webp
    caption: |
      The Neo4j knowledge graph is the system's topology. Agents move across
      a map where each research area is positioned via different techniques
      within disciplines, theories, methods, and tools.
    reverse: false

  # ── 4. ARCHITECTURE ──
  - type: split
    title: How It Works
    content: |
      <p>Not a pipeline. A graph-native engine where agents communicate
      through a shared Neo4j knowledge graph, never through direct calls.</p>

      <p><strong>Literature search.</strong> OpenAlex, PubMed, Patents — searched
      by citation frontier: depth (mining references of accepted papers)
      before breadth (entering new topic areas). 618 papers in the largest
      run, with structured extraction of entities, numeric thresholds,
      Wikidata, and MeSH-grounded concepts.</p>

      <p><strong>Ontology grounding.</strong> Every extracted concept is resolved
      against 22+ scientific ontologies hosted on
      <a href="https://huggingface.co/scidata-hub">SciData Hub</a> — a federated dataset and ontology layer
      built as a companion project. Resolution is exhaustive: a term that
      resolves in both ChEBI and Gene Ontology is a measured cross-domain
      bridge, not a routing artifact.</p>

      <p><strong>Adversarial review.</strong> Review agents attack the graph simultaneously,
      not the text. Every objection arrives with its evidence attached —
      the missing edge, the contradicting quote, the numerical
      inconsistency.</p>
    image: /static/assets/images/projects/ip-beta/ontology_management.webp
    caption: |
      A system for extraction, triple selection, and grounding in existing
      ontologies resolves a certain percentage of cases; anything left
      unresolved is saved as a candidate in the ontology management section,
      where a "human-in-the-loop" process promotes terms.
    reverse: true

  # ── 5. THE GROUNDING PROBLEM ──
  - type: split
    title: The Grounding Problem
    content: |
      <p>The system reasons over a graph. A researcher thinks in prose. Every
      claim about how well this works is really a claim about that gap — and
      for most of the project's life the gap was crossed by a parser, silently,
      with nobody able to see what it decided.</p>

      <p><strong>Extraction is not grounding.</strong> On one real hypothesis —
      Birch–Swinnerton-Dyer, five sentences — the dependency-parse path
      proposed <strong>28 terms and 4 relations</strong>. Eleven of the terms
      were filler noun phrases (<em>exact formula</em>, <em>current
      understanding</em>), one term was proposed twice, and <strong>one of
      the four relations was correct</strong>. The same text through an LLM
      proposer: 17 terms, no filler, every one typed, and 15 relations.
      The parser was not slightly worse. It was answering a different
      question.</p>

      <p><strong>Grounding can be confidently wrong.</strong> Of those 28 terms,
      three resolved against an ontology and <strong>two of the three were
      false</strong>. <code>regulator</code> matched
      <code>OBI:0000014 "regulator role"</code> — a biological role — where
      the author meant the determinant of the height pairing. So the resolver
      now <em>annotates</em>: the ontology match is shown beside the proposed
      type, never in place of it.</p>

      <p><strong>The prose stays prose.</strong> Markup is composed from what a
      person accepts, not typed by them, and never edits the sentence. A
      relation is written as <code>[[e:verb|3&gt;1]]</code> — naming its two
      ends by position — because the older adjacency-paired form could only
      express a relation between two terms that happen to sit either side of
      a verb, and <strong>13 of 15</strong> real relations in that hypothesis
      join terms that don't.</p>
    image: /static/assets/images/projects/ip-beta/ontology_management.webp
    caption: |
      Terms and relations proposed from a hypothesis, each editable: rename
      a term, split one in two, change its type, choose the predicate, or
      assert a relation the reader missed. What is accepted becomes the
      markup; what is declined stays prose.
    reverse: false

  # ── 6. WHERE THE HUMAN IS ──
  - type: split
    title: Where the Human Actually Is
    content: |
      <p>"Human in the loop" usually means a person approving output. Here
      it means something narrower and more load-bearing: there is exactly one
      kind of node in this graph that <em>only</em> a person can create.</p>

      <p><strong>A commitment is what a theory forbids.</strong>
      <code>:Commitment</code> is <code>origin=human</code> and requires a
      named curator and a citation — and <code>curator</code> sits in the
      write layer's reserved set, so no agent can stamp one. Every other path
      in the system is structurally barred from creating one.</p>

      <p>In a single claim — <em>"the fraction of curves with rank ≥ 2 among
      those with conductor N &gt; 300,000 exceeds the prediction by more than
      3σ, at p &lt; 0.001"</em> — the four figures are four different kinds
      of thing: scope, content, stake, and decision threshold. Only one is a
      commitment, and no parser can tell which. So each is <em>offered</em>
      with its quantity prefilled, and the question — is an anomaly here a
      Tuesday or a crisis? — is left to the person, because that is the whole
      content of the field.</p>
    image: /static/assets/images/projects/ip-beta/fingerprint.webp
    caption: |
      Numbers a claim commits to, each offered as a candidate commitment
      with its quantity kind prefilled. What is accepted becomes structure;
      what is declined stays prose.
    reverse: true

  # ── 7. DESIGN PRINCIPLES ──
  - type: text
    title: Design Principles
    content: |
      <p>Every serious design decision in this system was learned from a bug.
      Three principles now govern the architecture:</p>

      <p><strong>Never store what you can derive.</strong> Standing, confidence,
      controversy, promise — all computed live from graph edges. If it can be
      a read, it must be a read. A stored score is a surface the loop inflates.
      Machine output is capped and topologically excluded from the scoring
      substrate; credence is derived from provenance at read time, never
      persisted. The only stored anchor is human canonization.</p>

      <p><strong>Absence is a value, not a gap.</strong> The root bug pattern:
      every serious failure had the same shape — a thing that didn't happen
      was recorded as a thing that happened. A failed lookup returning empty
      instead of DEGRADED. A zero-row query indistinguishable from "not
      attempted." A seed with no concepts looking exactly like one that had
      none to find. Solved by making degraded/unattempted a first-class
      distinction everywhere.</p>

      <p><strong>Propose, never apply.</strong> The rule the whole authoring
      surface is built on. A term is offered with its type; a relation the
      model inferred rather than read arrives unticked; a derived test
      criterion fills only the fields the author left empty. An invented
      threshold must never read like one a person wrote.</p>

  # ── 8. THE FINGERPRINT ──
  - type: split
    title: The Research Fingerprint
    content: |
      <p>Every run produces a structured fingerprint — not a paper, not a
      report, but the graph itself: claims with dependency chains and
      evidence edges, concepts grounded to canonical ontology terms, numeric
      thresholds attached to the spans they were extracted from, regime
      distances showing how far each claim sits from established work.</p>

      <p>The fingerprint is what makes retrodiction possible. A paper is a
      narrative; a fingerprint is a testable structure. The open research
      frontier is a Cypher query over unresolved ProblemStatement nodes —
      and that query is the architectural keystone of the whole system.</p>
    image: /static/assets/images/projects/ip-beta/fingerprint.webp
    caption: |
      Progress on the research process is tracked via a Trello-style board,
      which displays agent activity, results, and new hypotheses generated
      for further development.
    reverse: false

  # ── 9. WHAT'S HARD AND WHAT'S NEXT ──
  - type: text
    title: What's Hard and What's Next
    content: |
      <p>This is a solo project with no institutional compute budget. Literature
      is limited to abstracts for most papers. The knowledge graph holds 302
      papers at current scale; corpus-relative metrics like Uzzi atypicality
      require orders of magnitude more and are structurally out of reach for
      now.</p>

      <p>The operational layer — what to do next — exists. The evaluative layer
      — is the output any good — largely does not. The credence formula is
      specified but unimplemented. The retrodiction benchmark, which is the
      only instrument that can distinguish the system from architectural taste,
      needs a dated OpenAlex snapshot, ~20 seeds, and a naked-LLM baseline.
      It is not yet built.</p>

      <p>The system is not finished. The question is whether the problems it
      has found are the right problems.</p>

  # ── 10. CTA ──
  - type: callout
    title: Struggling with a knowledge system?
    content: |
      <p>If you're working with scientific literature at scale —
      structured review, ontology grounding, dataset discovery,
      or agent architectures that need to not hallucinate their
      results — I can help you design it.</p>
    button: Get in touch

---