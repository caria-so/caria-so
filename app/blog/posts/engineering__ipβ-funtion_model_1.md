---
title: "IP-β Function model. Sketching the full system. One box."
thread: engineering
keywords: [scientific discovery, agentic ai, hugging face, duckdb, parquet, ontologies]
author: "Federico Caria"
date: "2026-08-11"
tags: 
summary: "This document sketches only the concept and the **overall shell** — one box and how it decomposes. The point of modelling at this level is to hold the *what* separate from the *how*: Neo4j, Claude, OpenAlex are function carriers; the functions are acquire, design, simulate, review, and decide."
image:
---

IP-β is a graph-native research agent: it takes a seed, a hypothesis written by a person or proposed by the machine, and tries to develop it into scientific evidence. The goal is an experiment in autonomous scientific discovery: not a chatbot writing plausible prose, but a group of agents coordinated by supervisors that reads what exists, grounds terms in the ontology, searches literature and datasets for support and refutation, runs experiments and simulations, and closes the loop only when the mechanism can show it deserves the next step.

## The Backbone

There is no external ontology. More than 30 ontologies are merged into one relational ontology inside the graph, a sort of extended RO, and terms and predicates are grounded against it as the search extracts them. Agents navigate that one graph.

**Key nodes**
- *Disciplines*: the OpenAlex discipline hierarchy; every seed is `POSITIONED_IN` it.
- *Problems*: open questions, solution-neutral. A problem is revised, never edited; the frontier is the set still open.
- *Theories*: what a problem is an anomaly for, and what commitments belong to.
- *Commitments*: what a theory requires or forbids on a parameter (bound, constant, scaling, prohibition), core or belt.
- *Regimes*: where a commitment holds. No regime means it holds everywhere.
- *Parameters*: the quantities commitments constrain and results measure.
- *Methods*, *Tools*, *Formulas*, *Datasets*, *Papers*.

**Key properties**
- `origin`: human or machine, on every node.
- `producer`: which agent or person wrote an edge.
- `binding`: how a word reached its node (seed marker, ontology match, paper mention). Only some bindings are trusted.
- `reader`: who read a paper against a claim. Only some readers are trusted.
- `status`: for example `proposed` on a machine claim.

## I/O

The system is designed to run autonomously, with a human in the loop whose interventions weigh differently from the machine's: credence is anchored on human-origin nodes, and machine-origin nodes stay out of the scoring substrate.

### Input
- *Seed*: one hypothesis, a way of approaching a problem. A person writes it; the machine can write one too, as a child of an earlier seed. It can carry a lot or be a single loose sentence.
- *Claims*: testable hypotheses, each a node of its own with its own research and its own stage. Testable means the claim states a test, what passes it and what fails it. The machine writes claims too; those stay `proposed` until a person adopts them.
- *Problem*: the seed is an approach to a problem, not the problem. The seed `ADDRESSES` a problem node, which can be reformulated while the derivation is kept.
- *Theory and commitments*: optional. The user names the theory the problem is an anomaly for and imports its commitments, with reference values. That boundary is what lets the system flag anomalies.

```yaml
commitments:
  - theory: standard-big-bang-nucleosynthesis
    kind: bound                # bound | constant | scaling | prohibition
    quantity: dimensionless
    status: core               # core | belt
    lo: 4.7e-10
    hi: 5.6e-10
    constrains: primordial-lithium-7-abundance
    holds_in: bbn-planck-eta   # optional regime
    source: "Fields et al. 2020, JCAP 03 010"
```

The resulting structure:

```
Seed        ADDRESSES       ProblemStatement
Problem     ANOMALY_FOR     Theory
Theory      HAS_COMMITMENT  Commitment
Commitment  CONSTRAINS      Parameter
Commitment  HOLDS_IN        Regime      (optional)
Regime      BOUNDS          Parameter
```

In Cypher:

```cypher
MATCH (s:Seed {ip_id: $seed})-[:ADDRESSES]->(p:ProblemStatement)
OPTIONAL MATCH (p)-[:ANOMALY_FOR]->(t:Theory)
               -[:HAS_COMMITMENT]->(c:Commitment)-[:CONSTRAINS]->(q:Parameter)
OPTIONAL MATCH (c)-[:HOLDS_IN]->(r:Regime)
RETURN p, t, c, q, r
```

### Output

- *Fingerprint* The fingerprint is supposed to make the entire process auditable. It's the main output of the research; whereas the paper is a presentation of what's most worth sharing, the fingerprint provides a structured account of everything that happened, combining graph evidence with supervisory decisions, machine and human tweaks, and so on.

## The Function Model 
To make it simple, there's no need to complicate things further than they already are. Let's take the main elements to sketch the shell, then it's my plan to zoom in each single loop, subloop and component. 

**Inside:** one seed in, one fingerprint out; [CHECK IF THIS IS APPLICABLE] the run state on disk; the Neo4j subgraph the run touched; the control plane (heat, budget, mode, manager, architect, harness thresholds).

**Outside (environment, not designed here):** the human who wrote the seed and who may or may not act on the fingerprint; the full literature and dataset corpora (we query, we do not own); external peer review and publication; compute billing and API rate limits treated as constraints rather than subfunctions.

That boundary is a kind of a bet: I am designing the research *programme conductor*, not the journal, not the wet lab. Computational tests in a sandbox are in scope only as far as this pipeline can run them — not as a replacement for real experiments.

| Side | Name | Meaning here |
|------|------|----------------|
| **Left** | Input | What the function transforms |
| **Right** | Output | What it produces |
| **Top** | Control | What constrains *how* it may act — decisions, membranes, budgets |
| **Bottom** | Mechanism | What performs it — agents, APIs, graph, sandbox |

---

# A-0 — Conduct a research programme
This is the whole system in one box. The control side matters most here: the experiment is not *can an LLM write a review?* or *brute force a math prolem* but "can a **controlled** loop run literature acquisition, optional simulation, and adversarial review without confirming its own seed?" Heat, budget, mode, the manager, the architect, and the five *harness membranes* are how that control is supposed to work — even when most of them are still shadow or declared rather than live on the CLI path.

Inside the box: **A1** acquire, **A2** design, **A3** simulate, **A4** review, and **A5** decide (control over the loop).

```
                 ┌ control ───────────────────────────────────────────┐
                 │  heat · mode · impact · budget                     │
                 │  manager (tactical) · architect (strategic)        │
                 │  harness membranes · theory commitments            │
                 └─────────────────────────┬──────────────────────────┘
                                           │
  seed            ┌────────────────────────▼────────────────────────┐
  human | machine │                                                 │
  ───────────────►│        A0  Conduct a research programme         ├──► fingerprint
  claims, 1..n    │                                                 │    + next claims and seeds
                  └────────────────────────▲────────────────────────┘
                                           │
                 ┌ mechanism ──────────────┴──────────────────────────┐
                 │  agents (LLMs) · literature sources · datasets     │
                 │  Neo4j graph (backbone ontology inside) · sandbox  │
                 └────────────────────────────────────────────────────┘
```

**Does.** Takes one person's hypothesis and returns a positioned, evidenced,
adversarially reviewed account of where that hypothesis stands — plus the next
hypotheses/claims worth running.

**Input — seed.** A research idea from a person or from the machine: hypothesis, heat, impact weights, mode, constraints, declared datasets, and the problem it addresses. Its claims are separate nodes (test / pass / fail), each researched and judged on its own. In the graph from tick 0 as `:Seed`, `:Claim` and `POSITIONED_IN`.

**Output — fingerprint.** The fingerprint is *derived on read* from what the run left on disk (`decisions.jsonl`, `pipeline.jsonl`, `writes.jsonl`, `panel/*.json`, `fork.json`, `seed.json`, the
seed YAML). It is not built in-process at a clean end. A run stopped at tick 3
is a fingerprint with three ticks; an unrun seed is a fingerprint at tick zero.

**Control.** `control` holds inputs only (heat, impact, budget, mode).
`derive_control()` is the only place knobs are computed. The manager picks the
next action from the weakest maturity dimension; the architect is called only
on escalation (stall, budget milestone, no affordable agent). Today the default path is still a hardcoded stage list in `cli.py` with the manager in **shadow**: it logs what it would do, per seed and per claim. A live loop that routes on one claim and one move at a time exists (`executive/manage.py`, `IP_ROUTER=claims`) and is off by default.

**Mechanism — two external authorities**, not interchangeable:

| Mechanism | Answers | How it enters |
|-----------|---------|----------------|
| **Sources** | What has been published | OpenAlex, PubMed, Europe PMC, Semantic Scholar, patents, Wikidata, full text and PDFs |
| **Datasets** | What can *test* a claim | Registry + Hub + corpus; `dataset_finder` writes `:Dataset` + `CAN_TEST` |

