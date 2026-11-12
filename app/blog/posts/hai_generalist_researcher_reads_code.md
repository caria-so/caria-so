---
title: "Generative AI needs a designer who can read the code"
thread: hai
keywords: [HCI, IIS, interaction design, artificial intelligence, generalist designer]
author: "Federico Caria"
date: "2025-07-12"
tags: ["HCI", "AI", "Notes"]
summary: "Human–AI systems break most of the assumptions interface design was built on. Somebody has to own that problem whole, and I don't think we have a name for them yet."
image:
---

Human–AI interaction raises problems that older interfaces mostly avoided, or never raised with such urgency. Among them:

1. **Control.** AI systems are complex, dynamic systems. Users struggle to link their actions to outcomes.
2. **Understanding.** AI is often a black box: we see input and output, not what happens between, yet we rely on it to decide [1].
3. **Agency.** More automation means less felt ownership. The automation literature calls the result complacency: users stop feeling responsible for outcomes [2].
4. **Governance.** Privacy, accountability, safety and security, transparency and explainability, fairness, human control, professional responsibility, human values. These are the eight themes Fjeld et al. found across 36 AI-principles documents [3]. Few teams cover all of them.

## Usefulness has to be worked out from the code

None of these four lives only at the interface. Control depends on how the model behaves over repeated use. Understanding depends on what the system can expose. Agency is about the balance between person and machine. So if you want to ship something more than a thin wrapper around an API call, usefulness has to be worked out starting from the code and the data, not added at the end.

For a long time our industry put a lot of its energy into the visual layer, and I did too. What changes now is that the visual layer carries less of the weight. In a chat or an agentic tool there is not much interface left to polish. The questions move back to behaviour, information processing, and what the system does underneath. That rewards people who can move between source code and human behaviour without a hand-off in between.

### A generalist? Maybe a polymath

The obvious answer is a cross-functional team, and large organisations will build one. But most of the teams I meet are small, often one person. And even inside a big team, something changes when one person can hold the whole problem: see that a model threshold is an interaction decision, that a logging choice is a research-method decision, that a governance requirement constrains the architecture. That person sits across several fields at once:

| Challenge | The model | The interaction | The person | The organisation |
| --- | --- | --- | --- | --- |
| **Control** | how behaviour shifts with data, thresholds, drift (ML) | feedback, undo, visibility of state (HCI, direct manipulation) | mental models of a dynamic system (cognitive science) | who can change the model, and when |
| **Understanding** | interpretability, what can be exposed (ML) | explanation design (HCI) | how people reason under opacity (cognitive science) | explainability as a duty (governance) |
| **Agency** | confidence and when to act (ML, mixed-initiative) | initiative, interruption, hand-over (HCI) | complacency, ownership (human factors / automation) | accountability for outcomes |
| **Governance** | data provenance, bias | consent and disclosure in the UI | fairness as experienced | law, ethics, process (requirements engineering) |

NN/g has been talking about the [return of the generalist](https://www.nngroup.com/videos/return-of-the-generalist/). I'd go a step further. A generalist knows several things; this role has to translate between them, because nobody has written the framework that connects them yet. The closest word I can think of... *polymath*?

## Not designing from nothing

This figure doesn't have to be invented. The skills exist and need putting together, with a little combinatory art, in the end skills is the least of the problems.

### Intelligent interactive systems + User research

#### Intelligent interactive systems
I'm thinking of IIS, a well-established research field at the intersection of AI and design. It studies systems that rely on some form of AI to do their work: recommenders, dialogue systems, human–robot interaction, auto-correct keyboards, human-in-the-loop systems. These things are already everywhere, and the labs that study them have theories, methods and tools worth learning.

**Too academic, not product** I tell you the material is very academic. Interesing theories and methods are all there (envelope analysis, mixed-initiative principles, function modelling), but they tend to stop at the prototype. Nobody in that literature is asked whether the thing sells, retains, or survives a support queue. 

#### User research

Someone has to carry the research into products, with a view of the whole process and what it means for adoption. Isn't this the domain of good old user experience? Sure if UX only had theories and methods that capture the essence of the change. I'm not sure it does now. Jakob Nielsen has a long post listing [76 open research questions in AI usability](https://jakobnielsenphd.substack.com/p/ai-ux-research), two entries give the taste of the problem:

- *What counts as a task?* Conversations sprawl across topics, sessions blur into each other, one question can hide five goals.
- *Scoring the unscorable.* Open-ended output has no single correct answer, which breaks the usual definition of task success.

**Too GUI, too easy** These are not edge cases. They are the unit of analysis and the success metric, the two things every usability method rests on. Most importantly a further question: what role does ease of use play here? It was the dominant value of GUI usability, almost the only one. I'm not sure it's the right primary target for tools people use to think with. 

## References

1. Castelvecchi, D. (2016). Can we open the black box of AI? *Nature*, 538, 20–23. See also Lipton, Z. C. (2018). The mythos of model interpretability. *Communications of the ACM*, 61(10).
2. Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation: an attentional integration. *Human Factors*, 52(3), 381–410. The earlier framing is Parasuraman, R., & Riley, V. (1997). Humans and automation: use, misuse, disuse, abuse. *Human Factors*, 39(2), 230–253.
3. Fjeld, J., Achten, N., Hilligoss, H., Nagy, A., & Srikumar, M. (2020). *Principled Artificial Intelligence: Mapping Consensus in Ethical and Rights-based Approaches to Principles for AI*. Berkman Klein Center Research Publication 2020-1. <https://cyber.harvard.edu/publication/2020/principled-ai>