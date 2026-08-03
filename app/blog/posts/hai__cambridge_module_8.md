---
title: "HAI Cambridge Module 5 - Notes on Validation"
thread: hai
keywords: [HCI, AI tooling, user experience, design, xai, explainable ai]
author: "Federico Caria"
date: "2025-07-12"
tags: 
summary: "Notes from class Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristennson - Cambridge University"
---

# Module 8: Evaluation, Verification, Validation

Last module. This one covers how to check you built the thing correctly, whether the thing is actually useful, and how systems get reworked by real users once they shipped.

---

## Verification vs. validation

- **Verification** = did we meet all requirements? (built the thing right)
- **Validation** = does it actually work for people in practice? (built the right thing)

You can nail verification and still flop validation. Typical causes:
- missing requirements- wrong requirements
- verification method too weak
- success criteria too easy
- test environment nothing like the real world
- target audience used for research ≠ actual end users
- world changed since requirements were gathered
- users appropriated the system in ways nobody predicted

Examples of verified-but-busted products: Microsoft Bob, Clippy, Zune; Apple Newton, Pippin; Juicero Press.

---

## The verification cross-reference matrix (VCRM)

A table mapping every requirement to verification attributes. Common high-level methods:

- **Inspection** — look/listen/feel. E.g., checking a font or color by eye.
- **Demonstration** — manipulate the system as intended and check expected response. E.g., swipe to unlock works.
- **Test** — feed predefined inputs, check outputs programmatically.
- **Analysis** — calculations, models, or test equipment to predict behavior. E.g., run labeled images through a vision system and check classification.

---

## Analytical validation: heuristic evaluation

Expert-based, no users recruited.

**Step1: pick heuristics**
- Nielsen’s 10 usability heuristics are the standard set.

**Step 2: inspect**
- **Scanning** — go through every component looking for any breach.
- **Task-based** — walk through representative user tasks; keeps focus on real workflows and hidden dependencies.

**How to apply heuristics during inspection**
- One heuristic at a time across the whole system (easier).
- All heuristics on each component (holistic, but easier to miss or overweight one).

**Reporting format for breaches**
- **Frequency** — rarely / occasionally / frequently
- **Severity** — minor delay / serious delay / catastrophic blockage
- **Persistence** — one-time obstacle vs. recurring issue
- **Cause** — what’s triggering it (when known)
- **Redesign suggestion** — evaluator’s fix

**Reliability realities**
- Single evaluators miss a lot. With ~75% individual detection rate, two evaluators give ~95% coverage.
- Usually need 4–6 skilled experts max. They should work solo, then merge findings.
- Cheap and fast, but limited to visible UI surface; high false alarm rate and high false negative rate. Doesn’t catch AI interpretability issues hidden under the hood.

---

## Human–AI specific heuristics (Amershi et al., 2019)

Grouped by interaction phase.

**Before use**
- Make clear what the system can do.
- Make clear how well it can do those things.

**During use**
- Time services based on context; avoid bad interruptions.
- Show info relevant to what the user is doing right now.
- Match social and cultural norms.
- Mitigate social biases.

**When the AI is wrong**
- Make triggering AI easy (efficient invocation).
- Make dismissing AI easy (efficient dismissal).
- Make correcting AI easy (efficient correction).
- Narrow scope when uncertain rather than guessing.
- Explain why the system produced that output.

**Over repeated use**
- Remember recent interactions.
- Learn from user behavior and adapt.
- Update cautiously — model changes disrupt interaction.
- Let users give granular feedback (ratings, sentiments).
- Tell users how their actions change future system behavior.
- Provide global controls (privacy settings, behavior toggles).
- Notify users when the AI changes or gains new capabilities.

---

## Experimental validation

A true experiment is repeatable and supports causal claims: changing an **independent variable** causes measurable change in a **dependent variable**.

Example: compare Keyboard A vs. Keyboard B on typing speed.

**Three threats to watch**

- **Internal validity** — confounding variables. If Keyboard A also adds sound feedback, you can’t tell if speed came from the keys or the audio.
- **External validity** — will results hold in the wild? If users need 20 hours to learn Keyboard B but your test lasts 10 minutes, your experiment is useless for real deployment.
- **Construct validity** — does your metric actually capture the concept? A copy task measures transcription speed, not the speed of composing original text.

Trade-off: tight control boosts internal validity but often kills external validity. You have to balance both.

**Design types**

- **Between-subjects** — each participant sees only one condition. Simple, but individual differences (e.g., naturally fast typists) can skew results.
- **Within-subjects** — each participant tries all conditions. Cuts individual noise, but introduces learning effects.
  - Fix with **counterbalancing**: half do A then B, half do B then A. This works if learning is symmetrical.
  - If learning is asymmetric (e.g., one system teaches users about the dataset more than the other), counterbalancing fails; you must use between-subjects.

**Hypothesis testing**

- H1 = the effect is real. H0 = the effect is just noise.
- **Frequentist**: compute a p-value = how likely this data would look if H0 were true. If p drops below a threshold (e.g., 0.05), reject H0. That threshold means if you ran the experiment 20 times, you’d expect1 false positive.
- **Bayesian**: compute posterior probabilities for H1 and H0 directly; update as more data arrives.
- Both are valid if applied correctly; get a stats expert if needed.

---

## Appropriation

Systems rarely survive deployment unchanged. Users reshape tools, workflows, and sometimes the org chart around them.

**Orlikowski (1992) on Lotus Notes in a consulting firm**
- Users interpreted Notes through prior experience with other tools; without training, they treated a collaborative system as a personal one.
- Company rewards and norms never pushed sharing, so people ignored collaboration features and stuck to old habits.

**Adoption and adaptation**
- **Adoption** = deciding the new thing is worth using.
- **Adaptation** = tweaking workflows because the new thing doesn’t fully match reality.

**Two kinds of user changes**
- **Personalisation** — cosmetic, non-functional (theme, icon, font). Signals identity or makes things findable.
- **Tailoring** — functional changes:
  - *Customization* — toggle settings.
  - *Integration* — link existing functions via scripts/macros.
  - *Extension* — inject new code or plugins.

**What appropriation actually means**
- The broader changes in workflow, roles, and org practice caused by introducing a system. Happens because designers can’t predict every context, and user needs drift over time.

**Appropriation moves can help or hurt**
- Positive: champion the tool, help onboard others, share tricks.
- Negative: delay uptake, replace the tool with shadow alternatives, opt out entirely, poison colleagues against it.

**Designing for appropriation (Dix, 2007)**
1. Allow interpretation — let users assign their own meanings (custom labels, tags, symbols).
2. Provide visibility — show how the system works so people can figure out how to bend it.
3. Expose intentions — explain why a feature or restriction exists.
4. Support, don’t control — don’t lock users into a single presumed workflow.
5. Pluggability and configuration — let people add functions or restructure later.
6. Encourage sharing — make it easy for appropriations to spread across the team.
7. Learn from appropriation — study what users actually do and feed that into future designs.

---

## Studying systems after launch

Deployment studies catch what lab work misses. Typical focus:

- Which features get used vs ignored- Barriers users hit in real contexts
- Practices and appropriation moves that emerge
- Design principles distilled from observed behavior
- New opportunities for functionality

**Common post-launch methods**
- **Logging** — cheap, large-scale behavioral data; good for pattern spotting.
- **Surveys** — track sentiment and obstacles; cheap but often biased and unrepresentative.
- **Reviews** — mine app-store/forum feedback for feature requests and complaints.
- **Field observation** — watch users in their actual environment (offices, factories, hospitals).
- **A/B testing** — push a new variant to a subset of users, compare against the established version on real metrics.

---

## Course wrap-up

The course argued that human-AI design is full of opportunity but also easy to get wrong. The toolkit covers functional modelling, automation levels, mixed-initiative interaction, interpretability, control/agency, risk management, verification, validation, and appropriation. The goal is systems that are effective, efficient, safe, and actually adopted.

---

## Biblio

- Amershi, S., Weld, D., Vorvoreanu, M., Fourney, A., Nushi, B., Collisson, P., Suh, J., et al. (2019). Guidelines for human-AI interaction. *Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems*, 1–13.
- Dix, A. (2007). Designing for appropriation. *Proceedings of the 21st British HCI Group Annual Conference*, 1–4.
- Nielsen, J. (1994). Heuristic evaluation. In *Usability Inspection Methods* (pp. 25–62). John Wiley & Sons.
- Orlikowski, W. J. (1992). Learning from Notes: Organizational issues in groupware implementation. *Proceedings of the 1992 ACM Conference on Computer-Supported Cooperative Work*, 362–369.