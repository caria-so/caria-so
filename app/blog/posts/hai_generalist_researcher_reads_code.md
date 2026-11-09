---
title: "Generative AI needs a designer who can read the code"
thread: hai
keywords: [HCI, IIS, interaction design, artificial intelligence, generalist designer]
author: "Federico Caria"
date: "2025-07-12"
tags: 
summary: "Human–AI systems break most assumptions interface design was built on and that calls for a generalist researcher to own the design."
image:
---

So if one wants to ship something more than a thin wrapper around an API call. Who owns the design?

## Automation was always hard

Software has carried some form of synthetic intelligence for decades. Human–AI interaction still raises problems that older interfaces mostly avoided:

1. **Control.** AI systems are complex, dynamic systems. Users struggle to link their actions to outcomes.
2. **Understanding.** AI is often a black box: we see input and output, not what happens between, yet we rely on it to decide [1].
3. **Agency.** More automation means less felt ownership. The automation literature calls the result complacency: users no longer feel responsible for outcomes [2].
4. **Governance.** Privacy, accountability, safety and security, transparency and explainability, fairness and non-discrimination, human control of technology, professional responsibility, promotion of human values. These are the eight themes Fjeld et al. found across 36 AI-principles documents [3]. Few teams cover all of them.

## Why that points to a generalist

None of the four lives only at the interface. Control depends on how the model behaves over repeated use. Understanding depends on what the system can expose. Agency depends on how automation is split between person and machine. Governance depends on the data and the process around the model. So if one wants to ship something more than a thin wrapper around an API call, usefulness has to be worked out starting from the code and the data, not painted on afterwards.

The obvious answer is a cross-functional team, and large organisations will build one. But a team only works if someone in it can hold the whole problem: see that a model threshold is an interaction decision, that a logging choice is a research-method decision, that a governance requirement constrains the architecture. That person sits across several fields at once:

- Human–computer interaction
- Design, and engineering design
- Human factors and ergonomics
- Machine learning
- Cognitive science and behaviour
- Usability and user experience

This role cuts across academic disciplines, and no established framework seems to exist for working in the gaps. It is a high-level design role, not an engineering one. It needs the skills of someone who can frame problems and look for solutions in several directions with the same dexterity.

### What I think this replaces

For decades the industry traded rigorous user research for flashy graphics, forcing researchers into absurdly narrow boxes, like a *Senior Left-Click Usability Interviewer for Desktop Web Browsers (Q3 Only)* who wouldn't dare touch a survey or mock up a prototype. What changes now is that the visual layer carries less of the weight. In a chat or an agentic tool there is not much interface left to polish; the question moves back to behaviour, information processing and what the system does underneath. That rewards people who can move between source code and human behaviour without hand-offs.

## Not designing from nothing

This figure does not have to be invented, but built with a little combinatory art.

### Intelligent interactive systems (IIS)

IIS is an existing research field: systems that rely on some form of AI to do their work, such as recommenders, dialogue systems, human–robot interaction, auto-correct keyboards and human-in-the-loop systems. They are already everywhere, and the labs that study them are a starting point.

#### Academic, not product

The material is very academic. When I joined the classes at Cambridge expecting to learn how to evaluate AI products, I got very little about that. The gap is real: the methods exist (envelope analysis, mixed-initiative principles, function modelling) but they stop at the prototype. Nobody in that literature is asked whether the thing sells, retains, or survives a support queue.

### User research

Someone has to take the research and carry it into products, with a holistic view of the process and what it means for meaningful design and product success. This is where user research finds its place. It needs no less rethinking to be applied successfully, on at least two fronts: (a) how user research and task analysis change when the unit of analysis is no longer a click or a task; (b) whether ease of use is the right target for AI-infused tools.

**Usability for AI systems starts in the code and the data**, so the thing to analyse is behaviour over time, not isolated events. Classic task analysis assumes a fixed task with a known sequence of steps. With a generative system the task is open and the output varies, so *what counts as a task* is unclear.

The Copilot work from Microsoft Research is the concrete case [4]. Mozannar and colleagues had 21 programmers label their own coding sessions with a taxonomy of 12 states (CUPS: writing new code, prompt crafting, verifying a suggestion, editing a suggestion, deferring thought, and so on). The result is a timeline per session, not a list of clicks. Two findings matter here. First, verifying suggestions took about 22% of session time, the single largest state, and much of that verification happened *after* acceptance, which acceptance-rate metrics miss entirely. Second, once you account for it, the time attributable to the AI nearly doubles compared with the standard metrics. The usability problem is invisible in the interface and visible only in the time series. And the fix is not a UI change: the follow-up work asks *when to show a suggestion at all* [5], which is a model and policy decision. Usability sits in the code.

**Ease of use came from consumer products and may be the wrong primary target** for AI tools people use to find and think with. Ease and speed ("I want it all now") suit buying goods. Having worked in e-commerce and in information systems, I saw how little attention goes to the person who consumes *information*. The information seeker has a different profile: the goal is often vague at the start and sharpens while searching, so the task is to learn rather than to complete [6]; people trade effort for expected information value, not for speed alone [7]; and what they need from the system is the ability to judge a source, to retrace steps and to compare, not fewer clicks. Users of today's chat tools are largely information consumers, so metrics built for checkout flows (time on task, conversion, error rate) miss what matters. Which metrics replace them is an open question; task success and time-on-task are not candidates.

## References

1. Castelvecchi, D. (2016). Can we open the black box of AI? *Nature*, 538, 20–23. See also Lipton, Z. C. (2018). The mythos of model interpretability. *Communications of the ACM*, 61(10).
2. Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation: an attentional integration. *Human Factors*, 52(3), 381–410. The earlier framing is Parasuraman, R., & Riley, V. (1997). Humans and automation: use, misuse, disuse, abuse. *Human Factors*, 39(2), 230–253.
3. Fjeld, J., Achten, N., Hilligoss, H., Nagy, A., & Srikumar, M. (2020). *Principled Artificial Intelligence: Mapping Consensus in Ethical and Rights-based Approaches to Principles for AI*. Berkman Klein Center Research Publication 2020-1. <https://cyber.harvard.edu/publication/2020/principled-ai>
4. Mozannar, H., Bansal, G., Fourney, A., & Horvitz, E. (2024). Reading between the lines: modeling user behavior and costs in AI-assisted programming. *CHI 2024*. <https://arxiv.org/abs/2210.14306>
5. Mozannar, H., Bansal, G., Fourney, A., & Horvitz, E. (2023). When to show a suggestion? Integrating human feedback in AI-assisted programming. <https://arxiv.org/abs/2306.04930>
6. Marchionini, G. (2006). Exploratory search: from finding to understanding. *Communications of the ACM*, 49(4), 41–46.
7. Pirolli, P., & Card, S. (1999). Information foraging. *Psychological Review*, 106(4), 643–675.