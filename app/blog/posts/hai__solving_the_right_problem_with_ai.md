---
title: "Understanding problems"
thread: hai
keywords: [HCI, AI adoption, legacy systems, task clarification, user research, problem statements, solution-neutral, design fixation]
author: "Federico Caria"
date: "2025-07-12"
tags: ["HCI", "AI", "Notes"]
summary: "Notes from Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristensson, Cambridge University. What to do when a company that predates LLMs wants to adopt AI: understand the problem before choosing a solution."
image:
---

Committing to a solution before modelling the problem is an architectural failure, and in human–AI systems it is the commonest one. If time allows, force divergence first. Most shortcomings of human–AI interaction trace back to a problem that was not understood well, not to the model.

## Intelligent interactive systems are everywhere

AI is not full automation. Treating it that way is marketing bloat. Automating decisions is among the hardest things to get right, carries the most ways to fail, and often trades away human agency for little gain.

Software has carried some form of synthetic intelligence for decades. An **intelligent interactive system** is an interactive system that relies on AI to carry out its overall function: recommenders, dialogue systems, human–robot interaction, auto-correct keyboards, human-in-the-loop systems. They are already everywhere, which is the point: most companies adopting AI are adding to something that exists, not designing from nothing.

---

## The situation: companies that predate LLMs

New AI products ship every week. An existing business cannot compete on novelty; its architecture and taxonomies were not made for AI. The tempting question is *wipe and rebuild, or infuse AI where it matters?*

That is the wrong first question. The answer depends entirely on the problem, and the problem is usually not yet understood. The solution is not always to redesign. It may be to infuse the right AI so people reach their goals with minimal effort and learning. That requires **task clarification**: understanding what the joint human–computer system is supposed to do.

**Order of operations when talking to such a company:**

1. **Outcome.** What goal, for whom, is not being met? What does success look like, in terms the business already measures?
2. **As-is.** How does the work get done today, including the workarounds? Which steps cost the most time, error or money?
3. **Constraints.** Data, systems, regulation, people. What cannot change?
4. **Solution-neutral statement.** Write the problem so a non-AI option still fits (next sections).
5. **Options.** Include "do nothing", process change and partial automation, not only a model.
6. **Cheap test.** Prefer a Wizard of Oz or simulation over a build (see the function-modelling notes).

Only then choose between rebuild, infuse or leave alone.

**Questions worth asking in the first call.**
- What happens today when this goes wrong, and who notices first?
- What have you already tried, and why did it stop being used?
- Which decisions here must stay with a person, and why?
- What would you do with the time saved?

### Example (my illustration, not from the course)
A manufacturer asks for "an AI for change management". As-is mapping shows the real delay is not the decision but gathering sign-off data scattered over three legacy systems. The first useful intervention is a read-only view over those systems, not a decision model. Skipping step 2 would have funded the wrong build.

### Reading
- Jansson & Smith (1991), *Design fixation*, Design Studies 12(1), 3–11: designers shown an example solution reproduced its features, flaws included. A client brief that names a technique is that example.
- Crilly & Cardoso (2017), *Where next for research on fixation, inspiration and creativity in design?*, Design Studies 50, 1–38: the best map of what is established and what is contested.

---

## Understanding users

Before writing requirements or a functional design, we need the users' needs and wants: user research, with representative users from the target audience. Three constraints shape every choice of method:

- **Risk of misreading users.** Undetected bias is the main one.
- **Cost.** The more refined the method, the more it costs in time, money and opportunity.
- **Expertise.** Interviews, experiments and surveys need real training to do well.

Typical process: describe the audience, set design objectives, sample users, apply methods, draw conclusions, plan follow-up. Methods combine well, because each one covers another's blind spot.

| Method | Good for | Main risk | Cost |
|---|---|---|---|
| **Non-directed interview** (1:1, semi-structured) | Reasons, motives, values; follow-up questions | Interviewer bias; needs skill | High |
| **Focus group** | Priorities, preferences, competitor comparison | Group dynamics; people mispredict their own future behaviour; doesn't generalise | Medium |
| **Field visit** | Seeing what people actually do, in situ | Time; findings tied to one setting | High, but can be short |
| **Diary study** | Real events as they happen, rare events | Participants forget or log only what feels important | Low–medium |
| **Experience sampling (ESM)** | Many small in-the-moment reports; little recall | Too shallow for "why" | Low |
| **Survey** | Many users, statistics, generalising | Wrong sample, misread questions, no check on respondents | Low |

Two rules carry most of the weight:

- **Ask about now, not hypotheticals.** "Is this feature interesting?" invites "would I ever?". "If it were available today, would you use it?" invites a concrete answer you can probe.
- **Observe where you can.** People are poor predictors of their own behaviour, so pair what they say (interviews, surveys) with what they do (field visits, diaries, ESM).

For an AI-adoption conversation, field visits and diaries matter most: they show the as-is workflow that the stated problem usually hides.

*Pointers.* ESM overview: Consolvo & Walker (2003), *IEEE Pervasive Computing* 2(2), 24–31. ESM showing people type differently in the wild than in the lab: Reyal et al. (2015).

---

## Understanding problems

Solving the wrong problem fails however much AI you add. A problem statement that is already shaped like a solution is the usual way to get there.

**An example of a wrong problem:**

> "Design a decision-making support system for change management in manufacturing environments. Replace the system deployed last year. It must use random forests and explain decisions to the user by plotting posterior probabilities in relation to each decision."

It is wrong because it prescribes the technique (random forests), the explanation form (posterior plots) and the shape of the answer (a replacement system). That invites design fixation and bias and blocks abstraction and exploration. Notice a quieter problem too: *"replace the system deployed last year"* is a symptom. Why did last year's system fail or go unused? That answer is worth more than the choice of algorithm.

### Solution-neutral problem statements

A useful technique is to derive a **solution-neutral problem statement** by **successive abstraction**: each new statement is more general, so it admits a wider range of solutions.

For the example above:

1. *As given.* Replace last year's system with a random-forest classifier that plots posterior probabilities.
2. *Drop the technique and the explanation form.* Build a decision-support system for change management in manufacturing.
3. *Drop "system" and "replace".* Help the people who decide on changes in manufacturing make those decisions well.
4. *State the outcome.* Make changes to production processes safe and timely.

**Test for stopping.** At each level, ask whether a non-software or non-AI answer (a checklist, a process change, better data access) would still fit. When it fits, the statement is solution-neutral enough. If you drift so far that you are changing the goal rather than widening the solutions, step back down one level.

Hand-off: the neutral statement then gets constraints and becomes a requirements specification. See the companion note, *Requirements for human–AI systems*.