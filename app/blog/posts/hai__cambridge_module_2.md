---
title: "HAI Cambridge Module 2 - Notes on Function Modelling"
thread: hai
keywords: [HCI, AI tooling, developer workflow, function modelling, ]
author: "Federico Caria"
date: "2025-07-12"
tags: 
summary: "Notes from class Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristennson - Cambridge University"
---

# Function Modelling

Do not commit to specific solutions before modelling and possibly put together quant/qual data. Pure divergence is time allows.

---

## What counts as a system?

A gearbox is part of a car, which operates on roads, which exist inside legal and economic frameworks. So where do we draw the line? A system is layered complexity, the whole point is to take a honest stance. 

A **system boundary** is not a physical fence but a conscious decision about the stuff being designed. Anything outside that boundary becomes noise. Boundary is hard to scope, howerver so improtant as it shapes not only what we build, but also what **risks we assess** later in the the game.

A the functional description that ignores non-functional aspects (like usability or experience) feels increasingly outdated.

---

## Functions vs. function carriers: separating the *what* from the *how*

This distinction is key. A **function** describes an integral element — the *what*. A **function carrier** is a particular solution that realises it — the *how*. A functional description is therefore intentionally abstract; it wants to avoid **design fixation**, that tendency to lock onto the first plausible solution and miss better alternatives.

Spending time at the functional level is not a delay. Rushing to the detailed description too early closes off branches of possibility before we have even mapped them.

---

## Function structures: following the flows

Function structures model a system through inputs and outputs of **signals, energy, and material** between subfunctions. In human–AI systems, the emphasis is typically on **signals** rather than energy or material.

The approach makes the *interactions* between functions visible. Decomposing an overall function into subfunctions with explicit input/output flows forces me to ask: what does each step actually need in order to proceed, and what does it pass on? The example of the touchscreen keyboard helped me see how a seemingly simple interaction can be unpacked into a chain of signal transformations.

This is so useful when looping. It's already a sort of contract.

---

## FAST diagrams: abstraction over time

Where function structures emphasise *flow*, **FAST diagrams** (Function Analysis Systems Technique) emphasise *abstraction*. They decompose an overall function into successively more specific, **time-ordered** functions, each expressed as a verb and a noun.

FAST diagrams forces answers to *how* questions at every level of abstraction. They also help surface operational modes we might otherwise forget — configuration, updating, error recovery — because the method asks us to chronologically trace everything the system must do.

FAST diagrams are a way to break down workflow stages, whereas function structures help see the exchange of information between components. Both can be parameterised, which leads into good numbers.

---

## From functions to concepts: morphological charts and evaluation

Once functions are clear, we can populate a **morphological chart**: a table that maps each function to possible **function carriers**. Each row is a function; each cell in the row is a candidate solution. A **concept** is then simply a combination of carriers, one per function.

The module introduces formal **concept evaluation** through weighted scoring. Numbers are rough. Weightings come from things like focus group priorities; scores come from expert judgment. Because of that intrinsic uncertainty, the narrative explanation matters as much as the score. 

We are not optimising for the highest number; we are making explicit trade-offs and explaining why a particular concept is preferable despite (or because of) its weaknesses.

---

## Parameters: what we can tune and what we cannot

Every functional model can be parameterised. 

**Controllable parameters** are those the design team can adjust — the number of recommendations shown, the modality of the interface, the choice of algorithm, the training data. 

**Uncontrollable parameters** belong to the environment or the user population — accuracy ceilings, noise, human error (mistakes and slips), and the variety of user strategies.

Understanding this split is formative. It clarifies where design effort goes and where we need **sensitivity analysis**. Instead of pretending we can control everything, we model how the system behaves when uncontrollable factors shift. Honest stance Per!

---

## Envelope analysis: testing ideas before building them

Now three methods for early-stage analysis [get biblio here].

**Wizard of Oz studies** are useful when the underpinning AI does not yet exist or is too expensive to build. A human operator simulates the system so we can observe user behaviour and collect data early. The trade-off is realism: response times may be off, and it can be hard to simulate truly representative tasks.

**KLM-GOMS** offers a lightweight way to estimate expert task times without recruiting users. The standard operators (K, P, B, BB, H, M, W(t)) let us sketch how long a workflow might take. Its major limitation is that it assumes error-free expert behaviour, so it cannot model learning curves or slips. Quick comparative tool early on. Needs validation through actual user studies before anyone treats the numbers as ground truth.

**Computational experiments** use simulated oracles — ideal or deliberately imperfect — to explore how system outcomes change as parameters shift. FAVOURITE! The *Parakeet* case study was particularly clarifying: by simulating a word-confusion network with varying numbers of alternatives, deletion features, and morphological support, the researchers could optimise parameters before committing to a full prototype. The insight that more than two or three word hypotheses yield diminishing returns is exactly the kind of evidence that saves expensive iteration later.

What links all three methods is the idea of **envelope analysis**: exploring the operating envelope of a design before heavy prototyping. I am coming to see this as a form of intellectual prototyping — learning early, failing cheaply, and entering user studies with sharper hypotheses.

---

## TO DOs

- Everything about KLM-GOMS.
- Practice modeling on NLS.

---

## Bibliography

Gray, W. D., John, B. E., & Atwood, M. E. (1993). Project Ernestine: Validating a GOMS analysis for predicting and explaining real-world task performance. *Human-Computer Interaction, 8*(3), 237–309. https://doi.org/10.1207/s15327051hci0803_3

Kristensson, P. O., & Müllners, T. (2021). Design and analysis of intelligent text entry systems with function structure models and envelope analysis. In *Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems* (Article No. 584). ACM Press.

Vertanen, K., & Kristensson, P. O. (2009). Parakeet: A continuous speech recognition system for mobile touch-screen devices. In *Proceedings of the 14th International Conference on Intelligent User Interfaces* (pp. 237–246). ACM Press.