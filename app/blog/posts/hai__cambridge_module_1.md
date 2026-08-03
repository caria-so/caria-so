---
title: "HAI Cambridge Module 1 - Some Notes"
thread: hai
keywords: [HCI, AI tooling, system, design thinking]
author: "Federico Caria"
date: "2025-06-01"
tags: 
summary: "Notes from class Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristennson - Cambridge University"
---

# Human–AI Interaction Module: Actionable Blog Entries

A ready-to-adapt blog series summarizing the foundations of designing human–AI systems.

---

## Entry 1: Stop Treating HAI Like “Just Another UI”—It Has Its Own Rules

**The core idea:** Human–AI interaction is not human–computer interaction, and it is not AI engineering. It is its own cross-disciplinary problem that spans HCI, design, engineering design, human factors, and AI. As soon as you infuse AI into an interactive system, you introduce a complex “black box” with its own behavior.

**What changes when you add AI:**
- **Control:** AI is a dynamic system. Users struggle to link their actions to outcomes. *Actionable tip:* map every AI feature to a user-controllable input (e.g., pressure-sensitive typing to indicate certainty).
- **Interpretation:** AI hides its process. Users see input and output, but not the reasoning. *Actionable tip:* require an explainability layer for any recommendation your system makes.
- **Agency:** More automation = less ownership. Users may stop feeling responsible for outcomes (“complacency risk”). *Actionable tip:* vary the physical or digital surface of interaction to restore agency.
- **Governance:** Privacy, accountability, safety, security, transparency, fairness, human control, and professional responsibility all become first-class constraints.

**Quick checklist before your next sprint:**
1. Can the user meaningfully control the AI output?
2. Can the user interpret why the AI behaved that way?
3. Will the user feel like the author of the outcome?
4. Have we documented governance risks?

---

## Entry 2: The Six Reasons You Can’t Skip Design

**The core idea:** Design is not a luxury phase; it is a survival mechanism. Avoiding it has measurable costs.

**The six imperatives:**
1. **It is humane:** Better interfaces reduce harm. Even mundane AI (like spell check) quietly improves quality of life.
2. **Computers are hard to use:** Office productivity gains are non-trivial. Support systems can fail if they interrupt without benefit (e.g., Clippy).
3. **Include everyone:** Regulation and empathy demand accessibility. Consider adaptive interfaces that personalize themselves to the user over time.
4. **It is worth it:** Poor usability kills morale, productivity, and money. One call-center GUI redesign predicted—and produced—a dramatic productivity drop.
5. **Invent the future:** Capabilities we take for granted (mobile video, speech recognition) existed only because someone designed successive iterations of the future.
6. **You must, or you will be outcompeted:** Product life cycles move through introduction, growth, maturity, and decline. Firms need portfolios of new cycles to survive.

**Actionable exercise:**
Score your current product on a1–5 scale for each of the six imperatives. Any score below 3 is a proposal risk.

---

## Entry 3: Fix the Problem Before You Fall in Love with the Solution

**The core idea:** Teams often “solve the wrong problem”—they build the thing right, but it is the wrong thing. This is the **verification-validation trap**: requirements are met, yet the system is unfit for purpose.

**What causes it:**
- Design fixation: the brief already names the solution (e.g., “use random forests”).
- Too little abstraction: the team never explored a wider design space.

**Actionable method—Solution-neutral problem abstraction:**
Take your current brief and rewrite it at successive levels of abstraction.

| Level | Example |
|-------|---------|
| Level 1 (Specific) | Automate literature review using LLMs. |
| Level 2 (Streamlined) | Streamline research and publication using AI. |
| Level 3 (General) | Facilitate rapid access and analysis of scientific information through advanced computing. |
| Level 4 (Broad) | Enhance efficiency and effectiveness of information discovery, interpretation, and application in science. |

**Do this now:** Remove all solution keywords (technology names, interface types) from your problem statement. If the statement still makes sense, you have a properly abstracted problem.

**Warning signs you are solving the wrong problem:**
- You are copying a metaphor literally (e.g., Microsoft Bob’s “home desktop”).
- You are compromising between two paradigms and pleasing neither (e.g., Sega Saturn’s split focus on 2D and 3D).

---

## Entry 4: Make Your Requirements Specification a Living Contract

**The core idea:** Requirements are not a one-time document; they are a communication tool, a change-management aid, and a verification backbone.

**The four requirement types:**
1. **User-elicited:** Effectiveness, efficiency, safety.
2. **Technical:** Size, power, latency, precision/recall.
3. **Business:** Cost, time, IP, resources.
4. **Regulatory:** Legislation, ethics, standards.

**Non-negotiable qualities for every requirement:**
- **Solution independent:** Do not prescribe “how,” only “what.”
- **Complete:** Cover installation, support, maintenance, decommissioning.
- **Clear:** Unambiguous to any team member.
- **Concise:** No fluff.
- **Testable:** Must link to a verification procedure and criteria.
- **Traceable:** Record the source so you can run traceability analysis when one requirement changes.

**Actionable template for your next requirement:**
> **REQ-ID:** 001  
> **Source:** User interview, June 2026  
> **Statement:** The supervisor shall receive a replacement-machine suggestion within 10 seconds of a failure alert.  
> **Test criteria:** Simulated failure test; 95% of alerts delivered in <10s under normal load.  
> **Dependencies:** REQ-004 (failure-detection latency), REQ-012 (worker-skill database accuracy).

---

## Entry 5: Log Your Trade-offs Explicitly—Because Implicit Ones Kill

**The core idea:** Every design is an operating point in a multidimensional space. Dimensions conflict. If you do not make trade-offs explicitly, they become **implicit design decisions** that can lead to unexpected, sometimes fatal, failures.

**Example of implicit trade-offs:** A patient-controlled analgesia pump cleared inputs after a timeout without making that reset obvious. The result: incorrect doses and patient deaths.

**Actionable workshop—The Trade-off Log:**
Create a table with at least these columns:

| Design Dimension | Option A | Option B | Explicit Decision | Risk if Ignored |
|------------------|----------|----------|-------------------|-----------------|
| Battery life vs. Wearable size | 48h / 12mm thick | 24h / 8mm thick | Selected 24h / 8mm for user comfort. | If ignored, users may abandon device due to bulk. |

**Rule:** If you cannot articulate the trade-off in one sentence, it is still implicit.

---

## Entry 6: Build Personas from a Sampling Frame, Not from Gut Feel

**The core idea:** You cannot elicit the right requirements if you misunderstand who the user is. Target audience definition prevents sampling frame error and sampling error.

**The three sampling criteria:**
- **Behavioural:** Desire or need to interact with the system.
- **Technological:** Prior familiarity with relevant tech.
- **Demographical:** Age, income, education, location.

**Bias check:**
- **Detected bias:** You know your sample is unrepresentative; you can adjust for it.
- **Undetected bias:** You do not know it exists. It poisons the design process, leading to systems that pass tests but fail in the real world.

**Actionable steps:**
1. Write an initial profile using all three criteria.
2. Refine it by asking: “Which segments provide the most informative feedback?”
3. Remove factors unlikely to affect usage.
4. Convert the refined profile into 2–3 **personas**—fictional characters that let the team ask, *“Would this decision help or harm Maya?”*

---

## Entry 7: Choose the Right User Research Method for the Information You Need

**The core idea:** Different methods produce different data at different costs. Match the method to the design risk, not just the budget.

| Method | Best for | Key risk / cost |
|--------|----------|----------------|
| **Non-directed interviews** | Deep qualitative insight into reasons, values, and motivations. | Expensive; requires expertise to avoid leading questions and interviewer bias. |
| **Focus groups** | Prioritizing features, competitive analysis, early idea generation. | Findings do not generalize; people are poor at predicting future behavior. |
| **Field visits** | Observing actual workflows and tasks in context. | Time-consuming; results are scoped to the observed environment. |
| **Diary studies** | Tracking infrequent events and daily frustrations over time. | Relies on participant diligence; participants may forget or under-report. |
| **Experience Sampling Method (ESM)** | Capturing in-the-moment behavior with minimal recall bias. | Data captured per sample is shallow; not suitable for deep exploration. |
| **Surveys** | Statistical generalization, profiling, satisfaction, value assessment. | Easy to mislead with bad questions; hard to verify respondent honesty or expertise. |

**Actionable decision tree:**
- Need deep “why”? → Non-directed interviews.
- Need to prioritize features? → Focus groups + follow-up validation.
- Need real workflow truth? → Field visits.
- Need longitudinal habits? → Diary studies or ESM.
- Need numbers to justify a change? → Surveys (but validate with another method).

---

## Entry 8: Sometimes the UI Isn’t Broken—the Task Clarification Is

**The core idea:** Before redesigning an interface, ask whether the right AI is being applied to the right task. In human–AI interaction, the solution is not always to redraw the UI.

**Case study:** Smartwatch keyboards. Early proposals redesigned the keyboard entirely (zoomable keys, chording, special gestures). Instead, researchers made the keyboard tiny and let a statistical decoder correct the input. Users typed “as usual.” The breakthrough was not a new UI; it was better task clarification and better AI.

**Actionable framework—Task clarification first:**
1. What is the joint human–computer system supposed to do?
2. What is the user’s goal, and what is the machine’s goal?
3. Can the user achieve the goal with minimal interface redesign if the AI is improved?
4. Only after answering (1)–(3) should you specify UI requirements.

**Takeaway:** Redesign the intelligence before you redesign the interface.

---

## Use & Remix Guide

- **Length:** Each entry is designed to stand alone or be merged into a long-form guide.
- **Tone:** Professional but direct; retains academic rigor while being scannable.
- **Next step:** Pick the entry that matches your current design phase and run the attached exercise with your team.