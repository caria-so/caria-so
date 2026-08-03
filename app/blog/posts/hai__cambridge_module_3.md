---
title: "HAI Cambridge Module 2 - Notes on Automation"
thread: hai
keywords: [HCI, AI tooling, developer workflow]
author: "Federico Caria"
date: "2025-07-12"
tags: 
summary: "Notes from class Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristennson - Cambridge University"
---

# Module 3: Automation — Raw Notes

**Definition** (Parasuraman & Riley 1997)
- Device/system accomplishing (partially or fully) a function previously carried out by a human.

---

## The Irony of Automation (Bainbridge, 1983)

- Automate all the easy stuff → humans are left with the hardest tasks *plus* the job of supervising the automation.
- Higher automation can increase human workload, not reduce it.
- Example: **Boeing 737 Max**. Hidden MCAS automation; pilots didn't know it existed. When sensors failed, they had to manually manage a situation the automation was supposed to handle. Result: catastrophic failure because humans had to intervene in a system they weren't meant to manage manually.

To some extent watching full automation work is better than dope.

---

## Function Allocation Strategies
OMG here 

1. **Maximize automation** — default corporate choice. Leaves humans with tasks designers found "too expensive/hard to automate." Danger: human role becomes critical exactly when automation fails.
2. **Most capable agent** — allocate to whichever (human or machine) is best. Hard to determine in practice.
3. **Maximize economic efficiency** — requires accurate modelling; rarely feasible.

---

## Types of Automation (mapped to human information processing)

- **Acquisition** — automated sensing/registration of input data.
- **Analysis** — automated inference on that data.
- **Decision** — automated selection of actions from alternatives.
- **Action** — automated execution of the chosen action.
- **Adaptive** — system changes its own type or level of automation dynamically based on context/situation.

---

## Levels of Automation (1–10 scale)

| Level | What happens |
|-------|--------------|
| 1 | No assistance. Human decides and acts. |
| 2 | Computer offers a complete set of alternatives. |
| 3 | Computer narrows alternatives down to a few. |
| 4 | Computer suggests one alternative. |
| 5 | Computer decides, executes if human approves. |
| 6 | Computer allows restricted time to veto before auto execution. |
| 7 | Computer executes automatically, then necessarily informs human. |
| 8 | Computer informs human only if asked. |
| 9 | Computer informs human only if it decides to. |
| 10 | Computer decides everything, ignores human. |

---

## Evaluation Criteria

**Primary (user-centered)**
- Mental workload
- Situation awareness
- Complacency
- Skill degradation

**Secondary (system-centered)**
- Automation reliability
- Cost of action outcomes

---

## Classifier Metrics / Automation Reliability

- Binary classifiers produce: TP, TN, FP, FN.
- **TPR** = TP / (TP + FN). Useless alone (always saying "true" = 100% TPR).
- **FPR** = FP / (FP + TN) = false alarm rate. Useless alone (always saying "false" = 0% FPR).
- **ROC curve**: TPR vs. FPR. Perfect = top-left (TPR 100%, FPR 0%). Diagonal = random guessing.
- Depending on domain, you may accept higher FPR to ensure high TPR (e.g., hazard detection).

**Risk**
- Risk = probability(error) × cost(error)

---

## The Framework (7 Steps)

1. Identify automation problem.
2. Identify types of automation.
3. Identify levels of automation.
4. Evaluate against **primary criteria** → loop back if needed.
5. Arrive at initial types/levels.
6. Evaluate against **secondary criteria** → loop back if needed.
7. Arrive at final types/levels.

---

## Worked Example: Sensor Stream Target Detection

**Pre-automation**
- Human does everything: detects and processes targets from raw sensor feeds.

**Attempt 1**
- Add AI: `Infer Target` (analysis, level 10) + `Prioritize Target` (decision, level 3).
- System highlights everything for the user.
- **Primary eval issue:** high complacency risk. User stops scanning and only watches highlights. Skill degradation likely.

**Attempt 2**
- Same as above, but inject surrogate/fake targets into the stream to force user attention.
- **Secondary eval issue:** only works if classifier has **very high TPR + very low FPR**. If not, user is flooded with false alarms *and* fake alerts. Destroys trust. Most real-world classifiers are imperfect, so this design fails.

**Attempt 3 — Redesign the function model, not just the level**
- Add:
  - `Track Gaze` — eye-tracker monitoring where user looks.
  - `Highlight Target` — only activates if user missed a target the AI detected.
- AI runs in background. User still primarily responsible.
- System only intervenes when user *actually misses* a gaze-confirmed target.
- **Primary eval:**
 - Mental workload: reduced (assistance on actual misses).
  - Situation awareness: maintained (same raw feed visible).
  - Complacency: low (user still doing main task).
  - Skill degradation: low (task unchanged).
- **Secondary eval:**
  - Reliability: less sensitive to perfect classifier performance. User is the first line of defense; AI is backup.
 - Cost: still high if miss occurs, but probability reduced via hybrid approach.

**Key lesson:** Sometimes you can't fix a problem by changing automation type/level numbers. You need to redesign the underlying function model (e.g., adding gaze tracking and selective intervention).

---

## Bottom Line

- Max automation is usually a bad default.
- The framework is iterative: primary eval → redesign → secondary eval → redesign → finger crossed :)?
- Be ready to add/remove functions in the model, not just slide automation levels up and down.

---

## Biblio

- Bainbridge, L. (1983). Ironies of automation. *Automatica*, 19(6), 775–779. https://doi.org/10.1016/0005-1098(83)90046-8
- Parasuraman, R., & Riley, V. A. (1997). Humans and automation: Use, misuse, disuse, abuse. *Human Factors*, 39(2), 230–253.