---
title: "IP-β Function model. Sketching the full system. One box."
thread: knowledge
keywords: [scientific discovery, agentic ai]
author: "Federico Caria"
date: "2026-08-26"
tags: [scientific datasets, open data, hugging face, duckdb, parquet, ontologies]
summary: "Sketching the full system."
---

This is an IDEF0 function model of the research pipeline as it exists today, 30-08-26. A function model is useful to plan complex architecture, and it is especially valuable when many i/o modules interact. 

## What this system is

IP-β is a graph-native research agent: one hands it a hypothesis, and it tries to turn that seed into an evidenced, adversarially reviewed account of where the idea stands — plus a candidate for what to run next. The ambition is an openClaw-style experiment in scientific discovery: not a chatbot that writes plausible prose, but a pipeline that reads what exists, grounds terms, searches for disconfirming as well as supporting literature, and closes the loop only when the machinery can prove it earned the next step.

This document sketches only the **overall shell** — one box (A-0) and how it decomposes — not every agent or harness detail. The point of modelling at this level is to hold the *what* separate from the *how*: Neo4j, Claude, OpenAlex are function carriers; the functions are acquire, design, simulate, review, and decide.

## System boundary

**Inside:** one seed in, one fingerprint out; the run state on disk; the Neo4j subgraph the run touched; the control plane (heat, budget, mode, manager, architect, harness thresholds).

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

```
                    ┌ control ─────────────────────────────────────────┐
                    │  heat · mode · impact · budget                   │
                    │  manager (tactical) · architect (strategic)      │
                    │  harness membranes (5)                           │
                    └──────────────────────┬───────────────────────────┘
                                           │
     seed ──────────►┌─────────────────────▼─────────────────────┐──────────► fingerprint
                     │                                           │
                     │     A0  Conduct a research programme      │
                     │                                           │
                     └─────────────────────▲─────────────────────┘
                                           │
                    ┌ mechanism ───────────┴───────────────────────┐
                    │  sources · ontologies · datasets             │
                    │  Neo4j graph · LLMs · compute sandbox        │
                    └──────────────────────────────────────────────┘
```

**Does.** Takes one person's hypothesis and returns a positioned, evidenced,
adversarially reviewed account of where that hypothesis stands — plus the next
hypotheses/claims worth running.

**Hard part.** Three of them, and they are not implementation problems:

1. **Knowing when to stop.** There is no bottom to a literature. Every stop rule
   is a bet that the next paper would not have changed the answer, and the
   system cannot see the paper it did not fetch. `_should_exit` is five signals
   voting on that bet.
2. **Not confirming itself.** Every mechanism that improves retrieval — scoping,
   affinity maturation, anti-queries — improves it *toward the seed's own
   framing*. Disconfirming evidence sits, by construction, where the seed is not
   looking. Most of the specific protections in A1 exist for this one reason.
3. **Closing the loop without laundering authorship.** A machine-written child
   seed must re-enter as a machine claim. The origin firewall is what stops the
   system from citing itself as a human source, and it is why the loop is open
   today.

**Input — seed.** A research idea: hypothesis, claims (test / pass /
fail), heat, impact weights, mode, constraints, optional `[[n:]]` / `[[e:]]`
markers, declared datasets. Graph-native from tick 0 as `:Seed` + `:Claim` +
`POSITIONED_IN`. The input must have those parts; it can carry other information,
but everything else lives in run state until a writer persists it.

**Output — fingerprint.** Nella mia idea il seed è bozza di programma ricerca a cui manca la validazione. The fingerprint is *derived on read* from what the run left on disk (`decisions.jsonl`, `pipeline.jsonl`, `writes.jsonl`, `panel/*.json`, `fork.json`, `seed.json`, the
seed YAML). It is not built in-process at a clean end. A run stopped at tick 3
is a fingerprint with three ticks; an unrun seed is a fingerprint at tick zero.

**Control.** `control` holds inputs only (heat, impact, budget, mode).
`derive_control()` is the only place knobs are computed. The manager picks the
next action from the weakest maturity dimension; the architect is called only
on escalation (stall, budget milestone, no affordable agent). Today both are
**SHADOW** on the production path — `run_cmd` is a hardcoded stage list;
`manage()` writes `would` vs `actual` to `decisions.jsonl`.

**Mechanism — three external authorities**, not interchangeable:

| Mechanism | Answers | How it enters |
|-----------|---------|----------------|
| **Sources** | What has been published | OpenAlex, PubMed, Europe PMC, Semantic Scholar, patents, PDFs |
| **Ontologies** | What the terms *are* | OpenAlex backbone, Wikidata, MeSH, SciData Hub via `ground/resolver` |
| **Datasets** | What can *test* a claim | Registry + Hub + corpus; `dataset_finder` writes `:Dataset` + `CAN_TEST` |

Plus the Neo4j graph (canonical state), LLM providers, and
`tools/compute_executor.py` (sandbox — Layer 1 of simulation, no caller yet).

---

# A0 — four phases

The parent decomposes into four sequential functions and one control function
that sits above them for the whole run. The intended cycle is not a straight
line: after review the manager may send a child seed back into A1, or forward
into A2.

```
                         A5  Control & decide
                         manager · architect · harnesses
                    ┌────────────────────────────────────┐
                    │  readiness → weakest dim → action  │
                    │  escalate → architect              │
                    │  membranes wrap A1–A4              │
                    └──────────────┬─────────────────────┘
          seed                     │                         fingerprint
            │                      │                              ▲
            ▼                      ▼                              │
     ┌────────────┐   ┌────────────┐   ┌────────────┐   ┌────────────┐
     │ A1 Acquire │──►│ A2 Design  │──►│ A3 Simulate│──►│ A4 Review  │
     │ knowledge  │   │ experiment │   │            │   │ & fork     │
     │            │   │            │   │            │   │            │
     │ **LIVE**   │   │ DECLARED   │   │ DECLARED   │   │ **LIVE**   │
     │ to fork    │   │ no agent   │   │ sandbox    │   │ panel +    │
     │            │   │            │   │ only       │   │ YAML child │
     └────────────┘   └────────────┘   └────────────┘   └────────────┘
            ▲                                                 │
            └──────────── child seed (intended) ──────────────┘
                          machine-origin re-entry BLOCKED
```

| Box | Job | Input | Output | Today |
|-----|-----|-------|--------|-------|
| **A1** | Turn a seed into a grounded, scoped corpus and a closable subgraph | seed | graph + state + lit-close fork | **LIVE** through panel-end fork. This is what `run_cmd` actually does. |
| **A2** | Design tests that use available datasets | claims + `CAN_TEST` | `experiments` | Capability declared. **No registered agent.** `simulation_readiness` was removed because nothing produced it. |
| **A3** | Execute computational tests | experiments + datasets | `simulation_results` | Sandbox exists (`compute_executor`). Capability requires `experiments`, which nothing writes. |
| **A4** | Adversarial panel (min. 4 agents) → verdict → child seed | claim subgraph | `panel/*.json` + `fork.json` + fingerprint | **LIVE** sequential panel. Child YAML is `origin: machine` and `run_cmd` refuses it. |
| **A5** | Choose the next function and wrap it in membranes | maturity vector | `Action` / heat throttle / escalation | Manager **SHADOW**. Architect uncalled on the CLI path. Harnesses: see below. |

**Why the decomposition is hard, independent of any box.** A1 is cheap-ish and
unbounded; A2/A3 are expensive and bounded; A4 is cheap and decisive. The
economically correct order is to let A4 tell A1 when to stop — but A4 needs a
corpus to review, so it cannot run first. The pipeline resolves this by running
A1 to its own exhaustion and only then reviewing, which means **every run pays
full literature price before anything adversarial has looked at it**. That is
the structural cost of the current shape, and it is what A5 exists to fix.

External arrows into A0 (mechanisms used by more than one box):

```
  sources ──────────► A1 (search, full text, patents)
  ontologies ───────► A1 (resolve, backbone match) · A4 (claim_subgraph concepts)
  datasets ─────────► A1 (dataset_finder) · A2 · A3
  compute sandbox ──► A3 (and, later, A4 reviewer tools)
```

---

# A5 — Control and decide  *(zoom)*

Not a phase. The function that *selects and constrains* A1–A4.

```
     maturity vector · reward · budget remaining
                    │
                    ▼
     ┌──────────────────────────────┐
     │ A5.1  Measure readiness      │  LIVE (assess() every stage boundary)
     └──────────────┬───────────────┘
                    │
                    ▼
     ┌──────────────────────────────┐
     │ A5.2  Manage (tactical)      │  SHADOW — logs would; cli runs actual
     │   weakest dim → cheapest     │  one write: set_heat() throttle
     │   improving agent            │
     └──────────────┬───────────────┘
                    │ escalate?
                    ▼
     ┌──────────────────────────────┐
     │ A5.3  Architect (strategic)  │  DECLARED — Opus on stall / budget /
     │   continue · pivot · fork ·  │  no-affordable-agent. Heuristic fallback.
     │   narrow · abandon · review  │  No CLI caller.
     └──────────────────────────────┘
```

### A5.1  Measure readiness

**Does.** Reduces the whole run — graph, state, corpus — to a maturity vector
with a named weakest dimension, plus a reward delta against the previous tick's
committed baseline.

**Hard part.** A dimension that cannot be measured must read `None`, not `0.0`.
The two are opposite instructions to the manager: `0.0` means "this is the
weakest thing, fix it", `None` means "nothing has spoken to this yet". Every
regression in this box has been a `None`/`0.0` confusion — `data_availability`
read `0.00` on every diverge tick until `dataset_finder` moved into the loop,
so the manager kept prescribing a remedy that was queued too late to run. The
`unscored` / `dim_states` fields in `decisions.jsonl` exist so this class of bug
is visible without re-running.

**Today.** **LIVE.** One `assess()` per tick, and `manage()` decides from the
*same* assessment object rather than measuring again — the two used to disagree
inside one tick. `commit_tick()` advances the baseline exactly once per tick and
refuses a second committer loudly (`commit_conflicts` in the record).

### A5.2  Manage (tactical)

**Does.** Picks the cheapest agent that improves the weakest measured dimension.
No LLM. Algorithmic by construction, so its choices are auditable.

**Hard part.** The manager is only as good as the capability graph it plans over
— `capabilities.py` declares `requires` / `produces` / `improves` per agent, and
a capability whose `requires` nothing produces is a permanent dead end the
planner will keep proposing. `experiment` (requires nothing, produces
`experiments`) and `simulation` (requires `experiments`) are exactly this pair:
the planner can see a path to `feasibility` that no run can walk.

**Today.** **SHADOW.** Writes `would` / `reason` / `would_targets` /
`would_cost` beside the `actual` stage into `decisions.jsonl`. Its one live
write is the `set_heat()` throttle. `executed` compares the manager's *agent*
name against the agents that actually ran since the last tick — comparing it
against the *stage* label made `would_eq_actual=0` a namespace artifact rather
than a finding.

### A5.3  Architect (strategic)

**Does.** The only executive that uses an LLM, called only where the manager
cannot resolve algorithmically: stall, budget milestone, or no affordable agent.
Chooses `continue · pivot · fork · narrow · abandon · review`.

**Hard part.** Its inputs are the same numbers the manager already failed to act
on. An escalation is a request to reason about *why the numbers are stuck*,
which needs run history and not a snapshot — and a heuristic fallback that
answers "continue" is indistinguishable from an architect that was never called.

**Today.** **DECLARED.** No CLI caller.

**Seams the manager is supposed to own** (`_FLOW.md`):

| Seam | When | Can choose |
|------|------|------------|
| S0 | After seed-graph + ingest | proceed to A1 / block |
| S1 | Each A1 tick | widen / map / depth / gap / fork / exit A1 |
| S2 | A1 closed | panel / pause / A2 |
| S3 | After A4 | child seed / conclude / back to A1 |

Today only shadow ticks exist (`diverge_N`, `post_diverge`, `formalize`,
`depth_N`, `panel`). `dispatch.run_tick` has zero callers on the main path.

### Harnesses — membranes, not functions

Five types (`enums.HarnessType`). `derive_control()` computes a threshold
block for each every tick. **Applying** a harness is a different fact from
**deriving** its knobs.

| Harness | Biological analogue | Would buy | Why it isn't on |
|---------|---------------------|-----------|-----------------|
| **GradientSensor** | Chemotaxis — still learning? | A second, independent stop signal to cross-check typed yield | **Measure only, deliberately.** Its saturation reading rests on `claim_stability`, which compares `core_thesis` against its previous value — and nothing revises `core_thesis`, so the similarity is an identity. `thesis_unrevised` on each reading says the number is an artifact, not a measurement. Exit stays `cli._should_exit`. |
| **Phosphatase** | Downstream kills push back upstream | A2/A3 failure revising A1's claims instead of just ending the run | **No-op.** `check()` returns `None` when `total == 0`; nothing writes `state["experiments"]`. Runner-only apply. |
| **SharedContext** | T-cell panel — later reviewers read earlier ones | A panel that argues rather than five parallel monologues | Split writer/reader. All five reviewers *read* `get_panel_strategy(state, …)` and degrade to `""`; the writer `SharedContext.record` has no caller on either path. The panel is therefore sequential in time and independent in content. |
| **SelectionPressure** | Clonal selection — rank, don't just vary | Ranking among multiple agent outputs instead of taking the first | Runner debate executor only. |
| **Stigmergy** | Pheromone — the store as shared environment | Cross-run memory: papers that paid off before surface sooner | Talks to `papers.db`, which the target architecture kills. Not on the graph path. |

```
  derive_control() ──► harness thresholds (always)
         │
         ├── CLI path:   GradientSensor.measure() logged; others unused
         └── runner path: init_harnesses + pre/post hooks  (UNWIRED)
```

Affinity maturation is listed here only to refuse the category: it does live
I/O and iterates. That is A1 work, not a membrane the runner inserts.

---

## What this shell does not yet model

Cross-check against the [Cambridge function-modelling notes](hai__cambridge_module_2.md) — useful gaps to close before committing to carriers or running envelope analysis.

| Module 2 idea | Status in this sketch |
|---------------|----------------------|
| **System boundary** | Now stated above; still thin on *user* side (supervisor vs solo researcher personas, what "done" means for a human). |
| **Function vs function carrier** | IDEF0 mechanisms name carriers (Neo4j, LLMs, OpenAlex). The four phases are functions; a morphological row per function — alternative carriers for A1 retrieval, A4 panel shape, etc. — is not drawn yet. |
| **Function structures (signal flow)** | Phases have inputs/outputs, but no diagram of **signals** moving between A1→A2→A3→A4 (corpus, claims, experiments, verdict). That flow chart is the natural next decomposition step. |
| **FAST (time-ordered modes)** | Operational modes beyond the happy path are implicit (stall, fork, shadow tick) but not listed as a chronological FAST: configure seed, diverge ticks, close literature, panel, fork, re-enter. Worth a pass so error recovery and maintenance are not forgotten. |
| **Morphological chart + weighted evaluation** | No table of alternative **concepts** (e.g. panel-first vs literature-first, graph store vs document store) with explicit trade-off weights. The A1-then-A4 cost structure is argued in prose, not scored. |
| **Controllable vs uncontrollable parameters** | Controls name heat, budget, mode. **Uncontrollable** side not explicit: literature depth, source API gaps, model drift, human framing of the seed, disconfirming evidence off the query manifold. Sensitivity analysis belongs here before tuning knobs. |
| **Envelope analysis** | Shadow `manage()` and GradientSensor logging are early computational experiment; there is no Wizard-of-Oz (human simulating A2/A3), no task-time model for the human reading a fingerprint, no parameter sweep doc like Parakeet's confusion network. Favourite next step once signal flows exist. |

None of these block the A-0 shell; they mark where the model stops being a box diagram and starts being a design tool.

---
