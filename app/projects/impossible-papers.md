---
title: Impossible Papers
summary: Multi-agent research engine that takes an impossible hypothesis, stress-tests it against real academic literature, and produces papers that read like hard science.
status: in_development
date: 2025–present
role: Solo developer
client: Personal research
services:
  - pipelines
  - knowledge
image: /static/images/projects/impossible-papers-cover.jpg
technologies:
  - Python
  - LangGraph
  - Ollama
  - Semantic Scholar API
  - OpenAlex API
  - Flask
  - MathJax
  - Matplotlib
accent: hatch-data
related_posts:

sections:
  - type: text
    title: The Problem
    content: |
      <p>There are ideas that sit at the edge of science — hypotheses too
      speculative for a journal submission but too structured for a blog post.
      Consciousness as a somatic field. Luminiferous ether revival. FTL
      propulsion from first principles. Will-driven motion.</p>
      <p>The trick is that these ideas can be explored with full scientific
      rigor even when the premise is false. A good impossible paper commits
      to internal consistency: it derives consequences, cites a real
      intellectual lineage, shows its math, and states what would falsify it.
      The reader's pleasure comes from watching a false premise handled with
      completely straight-faced discipline.</p>
      <p>Writing one by hand takes weeks of literature review, formal
      derivation, and careful self-editing. Impossible Papers automates
      the scaffolding so the human can focus on the idea.</p>

  - type: metrics
    items:
      - value: "3"
        label: Agent pipeline steps
      - value: "2"
        label: Academic APIs searched
      - value: "∞"
        label: Impossible hypotheses
      - value: "0"
        label: Claims without citation

  - type: split
    title: The Refinement Loop
    content: |
      <p>Impossible Papers is not a paper generator. It's a <strong>hypothesis
      refinement engine</strong>. A raw idea goes in fuzzy and comes out
      battle-tested against real literature.</p>
      <p><strong>Step 1 — Formalize:</strong> An LLM takes your shower thought,
      conversation transcript, or one-line hypothesis and decomposes it into
      a structured thesis with typed, dependency-linked claims. Foundational
      axioms first, derived claims next, speculative leaps last.</p>
      <p><strong>Step 2 — Literature:</strong> Semantic Scholar and OpenAlex
      are queried for real academic papers. Each source is mapped against each
      claim — supporting, challenging, or irrelevant. The agent identifies
      structural gaps: where does the argument break without a source? Only
      then are synthetic references generated to fill those gaps.</p>
      <p><strong>Step 3 — Reassess:</strong> The hypothesis is stress-tested.
      Which claims have real support? Which are hanging by invented bridges?
      Did the literature reveal a better version of the idea? The system
      returns a verdict — solid, revise, pivot, or abandon — and routes
      back to whichever step needs work.</p>
    image: /static/images/projects/impossible-papers-loop.jpg
    reverse: false

  - type: split
    title: Literature That Earns Its Place
    content: |
      <p>The literature agent doesn't decorate — it diagnoses. Real papers
      from Semantic Scholar and OpenAlex are searched, mapped against each
      claim, and assessed for strength. The agent builds an argument map:
      which sources support which claims, which challenge them, and where
      the lineage breaks.</p>
      <p>Invented references are structural, not cosmetic. They exist only
      because gap analysis proved the argument can't stand without them.
      A synthetic "Moretti 2008" paper fills a specific hole — the missing
      link between IIT's information metric and field theory — published
      in a real journal, with a plausible abstract and realistic authors.
      Internally flagged <code>real: false</code>. In the published paper,
      seamless.</p>
    image: /static/images/projects/impossible-papers-literature.jpg
    reverse: true

  - type: code
    title: Checkpoint System
    filename: runs/run_006/
    content: |
      # Every step writes a JSON checkpoint.
      # The pipeline can restart from any point.
      
      hypothesis.json    ← structured thesis + claims
      literature.json    ← real sources, argument map, gaps, synthetics
      reassessment.json  ← verdict, strength ratings, revisions
      
      # Resume from any checkpoint with a different model:
      impossible-papers run --from runs/run_006/hypothesis.json \
                            --step literature

  - type: split
    title: Model-Agnostic Per Step
    content: |
      <p>Every agent's LLM is configured independently via YAML. The
      formalization step might run on Qwen 7B locally through Ollama.
      The reassessment step might use Claude Sonnet for stronger reasoning.
      The literature mapping might use a 70B model on a HuggingFace
      endpoint spun up on demand.</p>
      <p>Swap providers without touching code. Add a new provider by
      implementing one method: <code>complete(system, user, temperature)</code>.
      The config router handles the rest.</p>
    image: /static/images/projects/impossible-papers-config.jpg
    reverse: false

  - type: split
    title: Human in the Loop
    content: |
      <p>The pipeline pauses after every step. Each checkpoint is a
      deliverable for human review. Is the thesis framing right? Are
      these the claims you want to make? Are the real sources the right
      ones? Are the gaps correctly identified?</p>
      <p>Any step can be a restart point. Revise the seed, re-run
      formalization with a different model, expand the literature search
      with new queries. The system remembers its state; the human steers
      the direction.</p>
    image: /static/images/projects/impossible-papers-review.jpg
    reverse: true

  - type: split
    title: Built on the Caria Stack
    content: |
      <p>Impossible Papers lives in the <strong>caria</strong> monorepo.
      Its academic search layer — Semantic Scholar, OpenAlex — is the same
      infrastructure planned for Bookshelf's discovery features. Its
      embedding pipeline will share LaBSE with Monsieur.lib's esoteric
      catalog of 161,000 items.</p>
      <p>For hypotheses that touch Western esotericism, consciousness, or
      occult-adjacent domains, Monsieur.lib provides a unique source
      catalog that no academic API covers. The literature agent can pull
      from both peer-reviewed science and the hermetic tradition.</p>
    image: /static/images/projects/impossible-papers-stack.jpg
    reverse: false

  - type: callout
    title: The First Hypothesis
    content: |
      <p>Level 1 consciousness is somatic, not cortical. The body receives
      the full unfiltered data stream — all sensory, proprioceptive,
      interoceptive input. The brain runs in parallel on a filtered subset.
      What we call "gut feeling" is the soma having integrated information
      the brain hasn't received yet. AI is structurally incapable of L1
      consciousness because it only has the brain-analog.</p>
      <p>Singer & Damasio (2025) argue that interoception constitutes
      the foundational substrate of consciousness, grounded in core biology
      rather than high-level cognition. The real literature supports
      the hypothesis. Impossible Papers found it.</p>

  - type: metrics
    items:
      - value: "LangGraph"
        label: Agent orchestration
      - value: "Ollama"
        label: Local model inference
      - value: "YAML"
        label: Per-step model config
      - value: "JSON"
        label: Checkpoint format

  - type: callout
    title: Roadmap
    content: |
      <p><strong>V1 (current):</strong> Hypothesis refinement loop —
      formalize, literature review, reassess. Checkpoint-restart. YAML
      model routing. CLI interface.</p>
      <p><strong>V2:</strong> Formalization agent (equations, toy models),
      visualization agent (figures, phase plots), editor agent (consistency
      audit), falsifiability sub-loop. Flask renderer with MathJax.</p>
      <p><strong>V3:</strong> SIA-style meta-learning across runs. Full-text
      RAG over key papers. Monsieur.lib integration for esoteric sources.
      Web UI for checkpoint review.</p>
---