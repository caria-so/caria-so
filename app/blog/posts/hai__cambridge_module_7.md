---
title: "HAI Cambridge Module 5 - Notes on Governance and Risk"
thread: hai
keywords: [HCI, AI tooling, user experience, design, xai, explainable ai]
author: "Federico Caria"
date: "2025-07-12"
tags: 
summary: "Notes from class Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristennson - Cambridge University"
---


# Module 7: Governance, Risk, and Safety

This module shifts from interaction mechanics to the ethical and operational safety layer: how human and system errors turn into risk, how to map and measure that risk, and the governance principles meant to keep AI from harming people.

---

## How people mess up

Two basic error flavors:
- **Mistakes** — wrong intention. You misunderstood the situation and picked the wrong goal or plan.
- **Slips** — right intention, botched execution. You knew what to do but your body/brain failed at the follow-through.

Missing knowledge can produce either. Experts still slip under pressure, distraction, overload, or when facing novel situations where their knowledge is incomplete.

**SRK framework** (Rasmussen): three performance levels
- **Skill-based** — automatic, highly practiced, nearly unconscious.
- **Rule-based** — following stored if-then patterns triggered by familiar cues.
- **Knowledge-based** — analytical problem-solving when no existing rule fits.

When diagnosing an error, ask whether it was a mistake or a slip, and at which level it happened. That determines whether you fix the interface, the training, or the procedures.

---

## Risk, hazard, and exposure

- **Risk** = chance of an incident × magnitude of harm/loss. Fundamentally quantitative.
- **Hazard** = anything with the potential to cause damage (sharp edge, confusing label, biased classifier). A hazard only becomes a risk if there is **exposure** — the likelihood someone actually encounters it.
- Example: a volcano on an uninhabited island is a hazard but not a risk because exposure is zero. Cover a sharp edge with rubber → hazard neutralized. Remove a destructive button → exposure eliminated.

Zero risk is impossible; achieving it would mean the system does nothing. The real goal is keeping risk below tolerable thresholds.

---

## Risk management cycle

Five-step loop:
1. **Spot hazards** — find unintended behaviors that can produce unwanted outcomes.
2. **Estimate risk** — judge probability and severity for each hazard.
3. **Evaluate risk** — decide whether it’s acceptable as-is.
4. **Control risk** — push unacceptable risks down to acceptable levels.
5. **Monitor risk** — keep verifying that levels stay acceptable over the system’s lifetime.

Many truly dangerous risks are low-frequency, high-severity (security breaches, data leaks, adversarial manipulation). They rarely come with historical incidence data, so teams rely on expert estimation. Imprecise, but still better than pretending they don’t exist.

---

## Draw the line: system boundary

Before mapping or assessing anything, set a system boundary. Everything inside gets risk-managed; everything outside is explicitly out of scope.

Too narrow and you miss indirect actors (regulators, contractors, affected non-users). Too wide and you drown in irrelevant tail risks. It needs to capture all relevant concerns, which means it almost always stretches past the software itself into people, organizations, and external rules.

---

## Six ways to map a system

System mapping = diagramming processes, people, and information flows inside the boundary.

- **Task diagrams** — hierarchical task trees. Nodes = tasks; links = conditions and sequencing. Good for workflows and UI procedures. Can nest subplans to any depth.
- **Information diagrams** — hierarchical map of documents and their relationships. Shows standardization, dependencies, and whether docs are digital or paper.
- **Organisational diagrams** — hierarchy of roles, teams, departments. Helps identify stakeholders who might otherwise be ignored.
- **System diagrams** — data transformation flow plus state transitions. Top half shows activities creating or changing data; bottom half shows states and the rules for moving between them.
- **Process diagrams** — serial or parallel steps, often as flowcharts or swimlanes. Swimlanes assign each step to a specific actor, making handoffs visible.
- **Communication diagrams** — who talks to whom. Nodes = people or groups; links = information flow. Useful across teams, departments, or organizations.

These can be layered: link a process diagram to an org chart to see who owns each step.

---

## Four methods to find and rank risk

**SWIFT (Structured What-If Technique)**
- Team brainstorming guided by prompt words (e.g., “failure to detect,” “wrong delay,” “wrong message”).
- Output is a table: ID, what-if question, hazards/risks, existing or proposed controls, risk ranking, action notes.
- Good for exploring scenarios and contexts quickly.

**FMEA (Failure Mode and Effects Analysis)**
- Inspect component by component (hardware, software, human roles).
- For each: failure mode, causes, probability, severity, risk score (= probability × severity), recovery steps, action notes.
- Forces a systematic, piece-by-piece inspection.

**Fault trees**
- Start with a top-level fault (unintended system behavior).
- Decompose downward using AND/OR logic to trace root causes and hidden dependencies.
- Used for root-cause analysis.

**Risk matrix**
- 2D grid: likelihood vs. severity.
- Plots risks so the team sees which sit in the danger zone (high × high).
- Usually used alongside SWIFT or FMEA to prioritize what to tackle first.

---

## AI-specific safety hazards

Beyond generic system risk, AI introduces its own failure modes:
- **Discrimination** — systematically biased decisions against groups.
- **Inappropriate behavior** — rude, aggressive, or socially unacceptable outputs (e.g., a chatbot abruptly ending a conversation).
- **Inaccurate information** — factually wrong content that gets acted upon.
- **Misleading information** — not necessarily false, but framed or selected to push users toward wrong beliefs or actions.
- **Privacy leaks** — exposing personal data, sometimes via adversarial prompting or social engineering of the model.
- **Direct unethical or criminal acts by the AI** — convincing someone to self-harm, physical harm via robotic actuation.
- **Aiding unethical/criminal acts by users** — generating disallowed content, enabling plagiarism, providing instructions for prohibited activities.

---

## Alignment as a safety problem

Alignment means ensuring the system pursues the designer’s true intent, not a literal or loophole-ridden version of it.

- **Specification gaming** — even a well-written spec can produce perverse incentives. Example: fining train companies for lateness leads them to cancel late trains entirely, which is worse for passengers.
- **Emergent misalignment** — the system technically follows the spec but exploits a gap because training data differs from real-world deployment conditions.
- Because full alignment is practically impossible for complex systems, risk assessment and a living risk management plan are mandatory.

---

## Eight governance principles (Fjeld et al., 2020)

1. **Privacy** — people must know when their data is used and retain control over it; include rights to correction and deletion; expect evolving regulation.
2. **Accountability** — systems must produce verifiable, reproducible results; enable auditing; support appeals for automated decisions; assign clear legal liability.
3. **Safety & Security** — internal correctness + harm avoidance; resilience against external attacks; security must be usable by real humans; continuous monitoring.
4. **Transparency & Explainability** — design for oversight; outputs must be interpretable; public disclosure of data and algorithms where feasible; notify users when they interact with AI or receive AI-made decisions; log decisions routinely.
5. **Fairness & Non-discrimination** — prevent algorithmic bias; treat individuals fairly; aim for equity (equal opportunity and protection regardless of context); inclusive design and accessibility.
6. **Human Control** — people must be able to review, override, or opt out of automated decisions.
7. **Professional Responsibility** — designers bear responsibility for effectiveness, efficiency, and safety; consider long-term societal effects; consult affected communities; maintain scientific and ethical integrity.
8. **Promotion of Human Values** — AI should serve broad human flourishing, benefit people with disabilities, and advance societal wellbeing including sustainability.

---

## Biblio

- Fjeld, J., Achten, N., Hilligoss, H., Nagy, A., & Srikumar, M. (2020). *Principled artificial intelligence: Mapping consensus in ethical and rights-based approaches to principles for AI*. Berkman Klein Center Research Publication No. 2020-1. https://dash.harvard.edu/bitstream/handle/1/42160420/hls%20white%20paper%20final_v3.pdf?sequence=1
- Perrow, C. (1999). *Normal accidents: Living with high-risk technologies* (Rev. ed.). Princeton University Press. https://doi.org/10.2307/j.ctt7srgf
- Rasmussen, J. (1983). Skills, rules, and knowledge; signals, signs, and symbols, and other distinctions in human performance models. *IEEE Transactions on Systems, Man, and Cybernetics*, SMC-13(3), 257–266.