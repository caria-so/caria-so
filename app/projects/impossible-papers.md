---
title: Impossible Papers
summary: A system that stress-tests scientific hypotheses against real literature, real data, and adversarial review. It doesn't confirm ideas — it tries to kill them. What survives is worth publishing.
status: active
date: 2024-present
role: Solo researcher & developer
client: Independent research
image: /static/assets/images/projects/impossible-papers/desktop_cover.png
desktop_cover: /static/assets/images/projects/impossible-papers/desktop_cover.png
mobile_cover:
pattern: lr-pattern-noise
technologies:
  - Python
  - Claude API
  - LangGraph
  - Neo4j
  - FastAPI
  - DuckDB
  - D3.js
  - spaCy
  - OpenAlex
  - PubMed
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
      <p>Most scientific hypotheses die slowly. A researcher has an idea, finds
      supporting literature, writes a paper, submits it, waits six months for
      peer review, gets told the idea was already explored by a group in Kyoto
      in 2019. Or worse — the idea survives review because nobody checked the
      math, and it enters the literature carrying errors that take years to find.</p>
      <p>Impossible Papers compresses that cycle. Take a hypothesis, decompose it
      into testable claims, search the literature exhaustively, run computational
      simulations against real datasets, subject everything to structured adversarial
      review. The system doesn't care about the hypothesis — it cares about whether
      the evidence supports it. What gets killed, stays dead. What survives is
      genuinely worth pursuing.</p>

  # ── 2. METRICS ──
  - type: metrics
    items:
      - value: "1"
        label: Confirmed novel finding
      - value: "618"
        label: Papers analyzed (single run)
      - value: "5"
        label: Active research domains
      - value: "2"
        label: Hypotheses killed by the system

  # ── 3. FINDINGS ──
  - type: split
    title: What It Has Found
    content: |
      <p><strong>Astrophysics.</strong> Run 022b computed the Bondi-Hoyle accretion
      timescale for tidal dwarf galaxies in the superfluid dark matter framework:
      ~1,280 Gyr — 93 times the age of the universe. TDGs cannot accrete superfluid
      DM condensate. INAF astrophysicists confirmed this calculation is not in the
      published literature and contradicts mainstream superfluid DM theory. The system
      found something genuinely new, then killed its own broader hypothesis when the
      numbers didn't work.</p>
      <p><strong>Neurorehabilitation.</strong> Run neurorehab_001 analyzed 618 papers
      and produced a structured research fingerprint for a university neuroscience
      collaboration: 7 claims with dependency chains, 6 concept genealogies tracing
      ideas across decades of literature, 7 cross-field gaps where cardiology and
      neuroscience stopped talking to each other, and 2 ready-to-run experiment
      protocols with feasibility assessments and dataset discovery.</p>
      <p><strong>Origin of life.</strong> Run 025h stress-tested a hypothesis about
      emergent RNA-amino acid coding systems for the $10M Evolution 2.0 Prize. 8
      claims decomposed, 3 computationally simulated, 2 falsified. The system caught
      its own pipeline producing a p-value interpretation that contradicted the actual
      numbers — internal consistency checking working as designed.</p>
    image: /static/assets/images/projects/impossible-papers/desktop_cover.png
    reverse: false

  - type: split
    title: How It Works
    content: |
      <p>A hypothesis enters as a seed — the core claim, the domain,
      what would falsify it. The system decomposes it into testable sub-claims
      (foundational, derived, speculative), then runs iterative loops:</p>
      <p><strong>Literature.</strong> OpenAlex, PubMed, and Google Patents searched
      exhaustively. Papers scored by relevance, clustered by concept, mapped into
      a regime chart showing where the hypothesis sits relative to established work.</p>
      <p><strong>Claims.</strong> Each loop refines the claims — strengthening what
      the literature supports, weakening what it challenges, killing what it
      contradicts. Claims that depend on killed claims die automatically.</p>
      <p><strong>Simulation.</strong> Computational tests against real datasets
      (NHANES, MIMIC-IV-ECG, WESAD, SPARC, Cremona ECDB — sourced from SciData Hub).
      The system writes and executes simulation code, then evaluates whether the
      results support or falsify each claim.</p>
      <p><strong>Review.</strong> Four-stage adversarial review: regime diversity
      check, rederivation from first principles, counter-model generation, and
      stress testing. The review agents try to break what the research agents built.</p>
    image: /static/assets/images/projects/impossible-papers/architecture.png
    reverse: true

  - type: split
    title: The Fingerprint
    content: |
      <p>Every run produces a structured research fingerprint — not a paper, not a
      report, a machine-readable record of everything the system found. Claims with
      evidence status and dependency chains. Concept genealogies tracing ideas through
      decades of literature with transition types (builds on, contradicts, converges
      independently). Regime distances showing how far each claim sits from established
      work. Convergences, contradictions, surprises. What survived, what died, why.</p>
      <p>The fingerprint is designed to be read by humans and consumed by downstream
      tools. The concept genealogy renders as an interactive graph. The evidence
      status renders as a dashboard. The experiment proposals come with feasibility
      scores and dataset links. A researcher receiving a fingerprint gets a structured
      map of where they stand, not a wall of text.</p>
    image: /static/assets/images/projects/impossible-papers/fingerprint.png
    reverse: false

  # ── 4. RESULT ──
  - type: callout
    title: Active Programs
    content: |
      <p><strong>TDG Superfluid DM Falsification</strong> — novel astrophysics finding,
      paper draft in progress.</p>
      <p><strong>Evolution 2.0 Prize</strong> ($10M) — emergent RNA-amino acid coding,
      2 claims falsified, residual hypothesis worth pursuing.</p>
      <p><strong>ARC Prize 2026</strong> ($450K) — biological harness patterns for
      AGI architectures.</p>
      <p><strong>BSD Conjecture</strong> — statistical anomaly hunting in elliptic
      curve invariants using Cremona's 3M-curve dataset.</p>
      <p><strong>Neurorehabilitation</strong> — HRV distributional shift in stroke
      patients, collaboration with university neuroscience lab.</p>
      <p>The system is domain-agnostic. The hypothesis is the input.
      <a href="#" data-contact-trigger>Submit one</a>.</p>
---