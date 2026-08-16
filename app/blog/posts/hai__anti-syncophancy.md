---
title: "Anti-sycophancy Pattern × Domain Mapping"
thread: product
keywords: [HCI, AI tooling, no-syncophancy]
author: "Federico Caria"
date: "2025-06-01"
tags: []
summary: "I experimented with some design tricks to mitigate the most dreadful LLM's behavior"
---

[*See demo here*](https://xfydjp.csb.app/). 

Reposting this quick experiment as a self reminder after [Stanford HAI](https://hai.stanford.edu/) landed: [*Human-Centered LLM Strategy*](https://hai.stanford.edu/industry/human-centered-large-language-models). 


## Core Insight

Not all queries need friction. The goal is **calibrated intervention** — match the intensity of epistemic friction to the stakes and the nature of the question.

---

## Pattern Suitability Matrix

| Pattern | Best For | Avoid When |
|---------|----------|------------|
| **1. Decision Paths** | Tradeoff decisions, preference-dependent choices | Single factual answers exist |
| **2. Progressive Disclosure** | Medium-stakes factual, research synthesis | Casual queries, time-critical |
| **3. Grounded Citations** | Verifiable claims, current events | Reasoning tasks, creative work |
| **4. Fragility Markers** | Conditional answers, personalized advice | Universal facts, established knowledge |
| **5. Triangulation** | High-stakes: medical/legal/financial | Low-stakes exploration |
| **6. Role Buttons** | Any context where user might benefit from pushback | Emotional support, time-critical |

---

## Domain Recommendations

### Medical / Health

| Question Type | Pattern(s) |
|---------------|-----------|
| Symptom lookup | Citations + Triangulation |
| Drug interactions | Fragility Markers + Triangulation (gated) |
| Treatment decisions | Decision Paths + Triangulation |

> Medical is the canonical high-friction domain. Always gate copy/export behind acknowledgment.

### Legal

| Question Type | Pattern(s) |
|---------------|-----------|
| Rights/entitlements | Fragility Markers + Citations |
| Contract interpretation | Progressive Disclosure + Fragility |
| Strategic decisions | Decision Paths |

> Legal answers are almost always jurisdiction-dependent. Fragility markers essential.

### Financial / Tax

| Question Type | Pattern(s) |
|---------------|-----------|
| Tax rules | Fragility Markers (heavy) + Citations |
| Investment advice | Decision Paths + Triangulation |
| Factual lookup | Citations only |

> Financial info has a temporal dimension — tax law changes yearly.

### Technical / Programming

| Question Type | Pattern(s) |
|---------------|-----------|
| Syntax/how-to | None (low friction) |
| Architecture decisions | Decision Paths |
| Security | Fragility Markers + Triangulation |

> Technical queries have a built-in verification mechanism (run the code).

---

## Friction Intensity Scale

```
LOW FRICTION                                    HIGH FRICTION
    |                                                 |
    v                                                 v

[None] → [Citations] → [Progressive] → [Fragility] → [Triangulation+Gating]

                         ↑
                   [Role Buttons]
               (user-initiated, any level)
```

---

## Pattern 6: Role Buttons — The Meta-Pattern

Role Buttons differ from the other five: they don't apply friction automatically. Instead, they let users **opt into friction** when they want it.

**Why this matters:** The core problem with adaptive friction is that LLMs can't reliably detect when stakes are high. Role Buttons sidestep this — the user decides when to be challenged.

**Example buttons:**
- "Play devil's advocate 😈"
- "What am I missing?"
- "Steelman the alternative"
- "Challenge this"

---

## Open Questions

1. **Who decides what's high-stakes?** The model? The user? A classifier? (Role Buttons offer a partial answer: let the user opt in.)
2. **Habituation:** If users see fragility markers on every answer, they'll ignore them.
3. **Minimum viable friction:** When does friction become annoying without being useful?

---

## Contributing

This is a living framework. Fork it, add your own patterns, test it in real contexts.