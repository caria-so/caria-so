---
title: IP-β
summary: A graph-native multi-agent system for automated scientific discovery. Agents decompose hypotheses into testable claims, search the literature, run adversarial review, and produce structured research fingerprints. One confirmed novel finding. Several killed hypotheses. Most of the hard problems are still open.
status: active
date: 2024-present
role: Solo researcher & developer
client: Independent research — ARC Prize 2026 Paper Track
image: /static/assets/images/projects/impossible-papers/desktop_cover.webp
desktop_cover: /static/assets/images/projects/impossible-papers/desktop_cover.webp
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
      Can a machine find something genuinely new in science — not by
      generating plausible text, but by reading what exists, identifying
      what's missing, and testing whether the gap is real?
      </p>
      <p>
      Frontier labs are building research agents with hundreds of engineers
      and unrestricted compute. This project asks a narrower question:
      what is the minimum viable architecture that can survive contact
      with real scientific literature without hallucinating its results?
      The answer turns out to be more about what you <em>don't</em> store
      than what you compute.
      </p>

  # ── 2. METRICS ──
  - type: metrics
    items:
      - value: "1"
        label: Confirmed novel finding (validated by domain experts)
      - value: "618"
        label: Papers analyzed in a single run
      - value: "5"
        label: Active research domains
      - value: "2"
        label: Hypotheses killed by the system itself

  # ── 3. WHAT IT FOUND ──
  - type: split
    title: What It Has Found
    content: |
      <p><strong>Astrophysics — a real number nobody had computed.</strong>
      Run 022b calculated the Bondi-Hoyle accretion timescale for tidal dwarf
      galaxies in the superfluid dark matter framework: ~1,280 Gyr — 93 times
      the age of the universe. TDGs cannot accrete superfluid DM condensate.
      The system found this by following citation chains the seed didn't
      anticipate, then killed its own broader hypothesis when the numbers
      contradicted it. Validated as novel by INAF astrophysicists.</p>

      <p><strong>Origin of life — catching its own mistake.</strong>
      Run 025h stress-tested a hypothesis about emergent RNA-amino acid
      coding for the Evolution 2.0 Prize. 8 claims decomposed, 3
      computationally simulated, 2 falsified. The system caught its own
      pipeline producing a p-value interpretation that contradicted
      the actual simulation output — internal consistency checking
      working as designed. The hypothesis was killed, correctly.</p>

      <p>The interesting pattern: both results came from the system
      <em>disagreeing with itself</em>, not from generating novelty.
      Generation is easy. Adjudication is the hard part.</p>
    image: /static/assets/images/projects/impossible-papers/desktop_cover.webp
    reverse: false

  # ── 4. ARCHITECTURE ──
  - type: split
    title: How It Works
    content: |
      <p>Not a pipeline. A graph-native engine where agents communicate
      through a shared Neo4j knowledge graph, never through direct calls.
      A hypothesis enters as a YAML seed. The system decomposes it into
      testable claims, then a CLI-orchestrated loop runs agents in
      data-dependency order:</p>

      <p><strong>Literature search.</strong> OpenAlex and PubMed, searched
      by citation frontier — depth (mining references of accepted papers)
      before breadth (entering new topic areas). Breadth requires a
      license: a hapax term from an accepted paper pointing at the new
      territory. 618 papers in the largest run, with structured extraction
      of entities, numeric thresholds, and MeSH-grounded concepts.</p>

      <p><strong>Ontology grounding.</strong> Every extracted concept is
      resolved against 20+ scientific ontologies hosted on
      <a href="#">SciData Hub</a> — a federated dataset and ontology layer
      built as a companion project. Resolution is exhaustive: a TMJ term
      that resolves in both ChEBI and Gene Ontology is a measured
      cross-domain bridge, not a routing artifact.</p>

      <p><strong>Adversarial review.</strong> Review agents attack the graph,
      not the text. Every objection arrives with its evidence attached —
      the missing edge, the contradicting quote, the numerical
      inconsistency. Reviewers color findings; they do not kill them.
      Adjudication is separate from generation, and always will be.</p>
    image: /static/assets/images/projects/impossible-papers/architecture.png
    reverse: true

  # ── 5. METHODOLOGY — the hard problems ──
  - type: methodology
    title: Methods and Open Challenges
    content: |
      <p>
      Each of these is both a design decision the system enforces and an
      unsolved problem it surfaces. They are the project's contribution
      whether or not the system produces another finding — because
      naming these problems precisely is itself a result.
      </p>
    detail_label: Architecture & open questions
    case_study:
      problem: |
        <p>An autonomous research system that stores scores creates a
        gradient the loop exploits. A system that trusts its own output
        cannot grade itself. A system that doesn't ground in real
        ontologies hallucinates structure. These are not engineering
        problems — they are epistemic ones, and solving them wrong
        produces confident, plausible, wrong results.</p>
      role: |
        <p>Solo researcher — architecture, implementation, domain
        validation with external collaborators (INAF for astrophysics,
        University of Messina for neurorehabilitation).</p>
      method: |
        <p><strong>Credence firewall.</strong> Machine output is capped
        (MACHINE_CAP = 0.15) and topologically excluded from the scoring
        substrate. Credence is derived from provenance at read time via
        noisy-OR with Jaccard independence discounting — never stored.
        A stored score is a surface the loop inflates. The only stored
        anchor is human canonization. <em>Open: the cap is a fiat
        constant. The system should earn its credence through measured
        calibration (Brier score on its own predictions), not receive
        it by decree.</em></p>

        <p><strong>Derive-don't-store.</strong> Standing, confidence,
        controversy, promise — all computed live from graph edges. If it
        can be a read, it must be a read. This eliminates an entire class
        of bugs where re-running an agent inflates a stored metric.
        <em>Open: the read layer needs batch queries before the
        executive can loop without N+1 performance traps.</em></p>

        <p><strong>Ontology grounding.</strong> SciData Hub hosts 22+
        ontologies as Parquet on Hugging Face, queried over DuckDB httpfs.
        The resolver discovers available ontologies from the Hub rather
        than maintaining a hardcoded list. Cross-ontology predicate map
        (704 RO properties + domain-specific entries) grounds extracted
        relations to canonical CURIEs. <em>Open: the predicate vocabulary
        was never cached, meaning the formalizer's grounding was running
        against an empty table. Fix identified, not yet deployed.</em></p>

        <p><strong>Anomaly load.</strong> Lakatosian layer — Regime,
        Commitment, Anomaly nodes. A theory whose anomaly load is rising
        (more papers re-raising the same unresolved problems) is a theory
        under strain. This is the only metric that measures the field's
        belief state, not the system's own valuation. <em>Open: requires
        RAISES edge extraction from full-text discussion sections, which
        requires PDF ingestion, which requires an adapter field nobody
        has written. The dependency chain is stated; the code is not.</em></p>

        <p><strong>Retrodiction benchmark.</strong> Freeze the corpus at
        year Y, run the pipeline, check whether the ProblemStatements
        flagged as open were closed by Y+5 literature. The world grades
        the system instead of the system grading itself. This is the
        falsifiable centerpiece — the only instrument that can distinguish
        the harness from architectural taste. <em>Open: requires a dated
        OpenAlex snapshot (earliest available: 2022 view of pre-2021
        data), ~20 seeds, ~30 human-adjudicated forks, and a naked-LLM
        baseline for comparison. Not yet built.</em></p>
      decisions: |
        <p><strong>Single-writer invariant</strong> — all graph writes
        through one module (graph.py). Enforced by test. No agent runs
        raw Cypher writes. This was learned from a bug where an agent's
        inline SET wrote to the graph outside the transaction fence.</p>

        <p><strong>CLI as conductor</strong> — agents never sequence each
        other. Learned from a bug where evidence mapping ran before papers
        were persisted, raising on every missing endpoint.</p>

        <p><strong>Absence recorded as a value</strong> — the root bug
        pattern. Every serious bug in this system had the same shape:
        a thing that didn't happen was recorded as a thing that happened.
        A failed HTTP lookup returning empty instead of DEGRADED. A zero-row
        query indistinguishable from "not attempted." Solved by making
        Degraded/unattempted a first-class distinction everywhere.</p>
      constraints: |
        <p>Solo developer. No institutional compute budget — Modal for GPU,
        cost-capped at $20/run. Literature limited to abstracts for most
        papers (full-text gated on open access). 302 papers in the graph
        at current scale; corpus-relative metrics (Uzzi atypicality, CD
        index) require 10⁵–10⁶ and are structurally out of reach.</p>
      issues: |
        <p>The operational layer (what to do next) exists. The evaluative
        layer (is the output any good) largely does not. Credence has a
        formula and no code. The numeric extractor reads scientific
        notation incorrectly (1.2e-3 parsed as 1.2 — a 1000× error
        written deterministically). 690 resolved concepts with ~15
        spot-checked. These are not footnotes — they are the current
        state of the system, reported as-is.</p>
      outcome: |
        <p>One confirmed novel finding. Two killed hypotheses. A set of
        architectural invariants learned from bugs, each one encoding a
        principle about what autonomous research systems must not do.
        A companion dataset infrastructure (SciData Hub) with 22+
        ontologies and multiple experimental datasets published to
        Hugging Face. The system is not finished. The question is
        whether the problems it has found are the right problems.</p>
      metrics:
        - label: Papers analyzed
          before: "0"
          after: "618"
        - label: Ontologies grounded
          before: "3 (hardcoded)"
          after: "22+ (discovered from Hub)"
        - label: Architectural invariants documented
          before: "0"
          after: "60+ (each from a bug)"
      evidence:
        - image:
          caption:
        - image:
          caption:

  # ── 6. THE FINGERPRINT ──
  - type: split
    title: The Research Fingerprint
    content: |
      <p>Every run produces a structured fingerprint — not a paper, not a
      report, but the graph itself: claims with dependency chains and
      evidence edges, concepts grounded to canonical ontology terms,
      numeric thresholds attached to the spans they were extracted from,
      regime distances showing how far each claim sits from established
      work.</p>

      <p>The fingerprint is what makes retrodiction possible. A paper is
      a narrative; a fingerprint is a testable structure. The open research
      frontier is a Cypher query over unresolved ProblemStatement nodes —
      and that query is the architectural keystone of the whole system.</p>
    image: /static/assets/images/projects/impossible-papers/fingerprint.png
    reverse: false

  # ── 7. SCIDATA HUB ──
  - type: split
    title: "SciData Hub — Companion Infrastructure"
    content: |
      <p>A federated scientific dataset and ontology layer on Hugging Face,
      built to serve as the grounding backbone for Impossible Papers but
      published as a standalone contribution. 22+ ontologies (MeSH, Gene
      Ontology, ChEBI, DOID, UBERON, UAT, QUDT, and others) with enriched
      schemas — parent hierarchies, cross-references, relationship
      extraction, and a four-table structure (terms, relationships,
      synonyms, properties) per ontology.</p>

      <p>Experimental datasets: SPARC rotation curves, ANAIS-112 dark
      matter direct detection, XENON1T, COSINE-100, Cremona elliptic
      curve database (3M+ curves). Cross-ontology predicate map linking
      22+ ontologies to canonical Relation Ontology CURIEs.</p>

      <p>The design principle: the system discovers what's available
      rather than being told. When a new ontology is pushed to the Hub,
      the resolver picks it up with no code change.</p>
    image:
    reverse: true

  # ── 8. ACTIVE PROGRAMS ──
  - type: callout
    title: Active Research Seeds
    content: |
      <p><strong>BSD conjecture</strong> — elliptic curve rank distributions
      via LMFDB/Cremona. <strong>Cosmological lithium problem</strong> —
      primordial nucleosynthesis discrepancy. <strong>Transactional entropic
      gravity</strong> — TEG vs SPARC/DESI/neutron interferometry.
      <strong>TMJ condylar regeneration</strong> — tissue engineering
      approaches. <strong>Evolution 2.0 Prize</strong> — emergent
      molecular coding systems.</p>

      <p>Each seed is a YAML file that becomes a graph at ingest time.
      The system doesn't care about the hypothesis — it cares about
      whether the evidence supports it.</p>

---