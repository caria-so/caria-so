---
title: "HAI Cambridge Module 5 - Notes on Interpretability"
thread: hai
keywords: [HCI, AI tooling, user experience, design]
author: "Federico Caria"
date: "2025-07-12"
tags: []
summary: "Notes from class Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristennson - Cambridge University"
---

# Module 5: Understanding and Interpreting AI

This module picks up the black-box problem from module 1. How do you show users what the AI is doing and why, without drowning them in math.

---

## Transparent vs. opaque systems

Two basic classes:
- **Opaque / non-transparent** — can't inspect the internal mechanism linking input to output. Most AI in practice. You only correlate inputs and outputs indirectly.
- **Transparent** — mechanism inspectable in principle, even if complex. Example: decision tree = inspectable flowchart. Deep learning = not inspectable even to the people who built it.

This raises two practical design headaches:
1. Making sense of high-dimensional data the AI is chewing on.
2. Explaining why the AI made a particular decision.

---

## Visualizing high-dimensional data

Humans can't see past 3D. Most AI data has way more dimensions. Two ways to deal:

**Dimensionality reduction**
Project high-D data down to 2D so people can see clusters/outliers.
- **Feature selection** — hand-pick the most informative dimensions. Only works when designers deeply know the domain. Ex: speech recognition pulls out MFCC coefficients because they map to human hearing.
- **Projection algorithms** — PCA, t-SNE, Sammon mapping, etc.
  - Example: handwriting digits. Sammon mapping gives overlapping garbage clusters. t-SNE separates0–9 into mostly clean blobs. You can spot which digits live close to each other (3, 5, 8 nearby) and spot outliers.
  - Trade-off: you always lose info when you squash dimensions. No free lunch.

**2D rendering that keeps all dimensions**
Instead of collapsing, lay dimensions out so people can trace across them.

- **Parallel coordinates plots** — each dimension is a vertical axis; a data point is a line snaking across all axes.
  - Good for finding patterns/correlations in high-D quantitative data.
  - Axis order matters. Only adjacent axes are easy to compare; you can't freely compare any axis to any other.
  - All axes must be on a common scale, even if original units differ.

- **Radar charts** — axes radiate from center; fill the polygon.
  - Useful for spotting outliers or similarities at a glance.
  - Bad for judging trade-offs between dimensions.

---

## Visualizing uncertainty

Data isn't just a point; it has spread. Hiding that spread misleads people.

- **Box-and-whisker plots** and **error bars** — standard ways to show variance/std dev/confidence intervals around a mean.
- **Fan charts** (Bank of England style) — solid line for measured facts, widening fan for predicted future. More visual salience = higher estimated probability. Good for separating "what we know" from "what we guess."
- **Confidence scores** — speech recognition example shows word hypotheses with probabilities.
  - Caveat: confidence scores often don't predict actual correctness well.
  - Vertanen & Kristensson (2008): marking "low confidence" words actually didn't improve final text accuracy. Users only looked at flagged words and missed errors the system didn't flag. Confidence-based cueing is dangerous if the scores are unreliable.

General-purpose uncertainty viz beyond error bars and box plots is still an open problem.

---

## Interpretable AI: why and when

Most interpretability research is for ML engineers debugging models, not end users. Doshi-Velez & Kim (2017) argue interpretability isn't always necessary.

**When you DON'T need it**
- System is thoroughly verified/validated for full autonomy (e.g., aircraft auto-landing, manufacturing auto-braking).
- Consequences of mistakes are acceptable (e.g., spam filter).

**When you DO need it — "incompleteness"**
You can't fully optimize or evaluate the system without seeing inside. Five reasons:
1. **Safety** — can't enumerate every edge case; need to check AI reasoning.
2. **Fairness** — catch bias in benefits, credit, insurance, hiring decisions even when designers intended fairness.
3. **Alignment** — user and AI need shared goals; user can't verify alignment without interpretation.
4. **Gaining knowledge** — AI might spot patterns humans missed (e.g., new skin cancer visual feature). Without interpretation, insight is lost.
5. **Trade-offs** — AI optimizes across multiple objectives; users need to know what trade-offs were made and why.

---

## Evaluating interpretability

Three evaluation flavors:

- **Application-oriented** — test in real task with domain experts. Ex: do diagnostic explanations help doctors? Gold standard but expensive and hard to get experts.
- **Human-oriented** — abstract controlled tasks with non-experts. Methods:
  - *Forced choice* — pick the better of two explanations.
  - *Forward simulation* — given explanation + input, predict what the system will do.
  - *Counterfactual simulation* — given explanation + input + output, say what would have to change to flip the output.
 - Risk: external validity may be weak.
- **Functionally oriented** — use a computable proxy known to be human-interpretable. Ex: approximate a complex model with a small decision tree; if the tree is interpretable, the proxy passes.

---

## Techniques for explaining AI to users

No general silver bullet. Some options that work across domains:

- **Confidence scores** — show posterior probabilities across alternatives. Must actually be calibrated; otherwise they mislead.
- **Factors / sources** — tell the user which inputs or data sources drove the decision.
- **Saliency / feature highlighting** — e.g., heatmaps on images showing which pixels mattered. Warning: users may not read the pattern correctly. Also, classifier might latch on spurious features (e.g., lighting conditions in skin-cancer photos instead of the mole itself). Highlighting reveals this.
- **LIME** — fit a simple local linear model around a specific prediction. Explains a small region, not the whole model. Model-agnostic.
- **Anchors** — simple IF-THEN rules that are robust in a small region of feature space (e.g., "IF these3 features hold, THEN always class X"). Needs large enough coverage to be useful.

---

## Reality check: dynamical decisions are hard even with perfect info

Jensen & Brehmer (2003) — fox/rabbit population task.
- Closed ecology. Two coupled differential equations.
- Participants could only control fox count; rabbit count followed indirectly.
- 15 uni students, only 8 reached equilibrium in 30 years.

Even with:
- all parameters given,
- only one control variable,
- immediate feedback,
- no noise,

people still struggled because the system was coupled and counterintuitive. If this is hard, real-world AI-assisted decisions with hidden variables, noise, and delays are brutal.

---

## Cognitive biases that screw up decisions

Heuristics save time but create biases:
- **Availability** — favor options that are right in front of you.
- **Anchoring** — overweight the first reference point you see.
- **Representativeness / gambler's fallacy** — judge by what "looks like" a pattern. Expect a coin to "balance out" after heads streaks.
- **Confirmation** — favor info that matches what you already believe. Very strong, especially when you want a specific outcome.

---

## Example: gesture recognition as an interpretability problem

Rubine recognizer for touchscreen gestures:
- 11 hand-engineered features (cos/sin of angles, bounding box diag, total length, etc.).
- Two visually different gestures (left veer vs right veer) can project to the *same* 11D feature vector = classifier sees identical input.
- User lives in 2D interaction space; algorithm lives in 11D feature space. Total mismatch. User builds wrong mental model ("if I start left, I get left gesture") when output is effectively random noise.
- **Template matching** alternative: resample gesture + template to same points, align, average Euclidean distance. More geometrically intuitive than Rubine's abstract features but still requires users to understand confusability.

**Interpretability questions this raises:**
- How to show a user whether their custom gesture will collide with existing ones in the feature space?
- Would you need parallel coordinates / t-SNE of the 11D space? Probably too abstract for end users.
- Could use LIME/anchors to explain "your gesture got classified as X because of feature 3 and feature 9," but that's still heavy.

---

## Biblio

- Doshi-Velez, F., & Kim, B. (2017). Towards a rigorous science of interpretable machine learning. *arXiv:1702.08608*.
- Jensen, E., & Brehmer, B. (2003). Understanding and control of a simple dynamic system. *System Dynamics Review*, 19, 119–137.
- Pratt, M. K. (2021). AI accountability: Who's responsible when AI goes wrong? *TechTarget*. https://www.techtarget.com/searchenterpriseai/feature/AI-accountability-Whos-responsible-when-AI-goes-wrong
- Tadeja, S. K., Kipouros, T., Lu, Y., & Kristensson, P. O. (2021). Supporting decision-making in engineering design using parallel coordinates in virtual reality. *AIAA Journal*, 59(12), 5332–5346. https://arc.aiaa.org/doi/10.2514/1.J060441
- van der Maaten, L., & Hinton, G. (2008). Visualizing data using t-SNE. *Journal of Machine Learning Research*, 9, 2579–2605. https://jmlr.org/papers/volume9/vandermaaten08a/vandermaaten08a.pdf
- Vertanen, K., & Kristensson, P. O. (2008). On the benefits of confidence visualization in speech recognition. In *Proceedings of the 26th ACM Conference on Human Factors in Computing Systems (CHI 2008)* (pp. 1497–1500). ACM.