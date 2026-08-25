---
title: "Frontend as Backend Specs"
thread: engineering
keywords: [engineering, xai, hci]
author: "Federico Caria"
date: "2026-08-24"
tags: [notes, engineering]
summary: "Build the maximal, wrong version of the interface. The places it breaks are your backend spec."
---

Luke Wroblewski's argument: design used to run ahead of engineering because mockups were cheap and production software wasn't. AI coding agents killed that gap. Working software now appears about as fast as a mockup, so development can get ahead of design.

Fine. I think there might be a second flip inside that one. **Build the frontend first to figure out the backend.** Not frontend faster. Not frontend without Figma — though that alone is worth the price. I often use frontend as the instrument to stress test a specification.

The method is unsubtle: put everything on screen, fake the states, wire every plausible interaction, generate the form for every kind of object, try the weirdest cases, and the nice to have. I do not mind wasting some more tokens on a solution space, in all those cases where inserts can modify behavior, and an oversight could cost me triple. 

Then find where the interface breaks. Those breaks are telling me about the backend — not because the UI is smarter than the specification, but because **an interface has to make assumptions executable.**

## The setup

The examples below come from a system built on a graph database. Two things to know for those who are not familiare with KGs: 

Data lives in *nodes* that carry *labels* — the label says what kind of thing a node is. A generic `:Concept`, or one of five more specific kinds like `:Commitment` or `:Regime`. Nodes connect through *edges*, and edges have their own rules about what can link to what.

A *schema* declares all of this: which fields each label carries, which are required, which are optional. And because the schema is machine-readable, you can generate the data-entry forms from it rather than hand-writing one per label. That's the piece I was prototyping.

## A specification can be locally correct while an implementation is globally incomplete

This is the whole argument, so here's the case that produced it.

The spec said: *the form contains the required and optional fields for each concept type.* That reads as complete. You can go read the schema. You can enumerate the fields. The worked example in the doc checks out. But a form generator has a much harder job than a document describing a form. It needs a [total function](https://en.wikipedia.org/wiki/Partial_function#Total_function) from fields to widgets — a mapping defined for *every* input in the domain, with no gaps. Miss one field and the form renders blank, or crashes.

Building it, I found that the field `accumulate` appeared on some labels and not others. `:Commitment` didn't have it. The worked example in the spec happened to use `:Commitment`. The hand-written test fixtures covered the same clean case. Nothing in the spec was inaccurate. It had sampled the schema and generalised from the sample. That is what prose does, and it's usually fine. A generator can't do it. It consumes the entire schema or it fails.

No amount of rereading finds this defect, because the field list is *correct*. The gap isn't in the description. It's between an example of a schema and a program that has to handle all of it. Which is why cheap AI prototyping is interesting: you can turn prose into an executable consumer of the specification in an afternoon, and the consumer becomes a test of the prose.

## Specifications describe state. Interfaces require transport.

Second case. The spec called for a read-only field displaying a value called `IP_CURATOR` — who curated this record. Value, presentation, mutability, all specified. The prototype rendered an empty box.

The missing piece was *transport*: where does that value physically come from, and how does it reach the browser? Is it in the schema? Derived on the server? Returned by the endpoint the form already calls, or a different one? Prose hides this question effortlessly, because a noun doesn't require a verb. You can write "the form shows X" without ever committing to where X comes from. An implementation can't. And the answer — the path from stored state to rendered pixel — is architecture.

Third case, same defect one layer out. The spec correctly stated that a `producer` field was required on nine kinds of edge. The backend knew this. But the form wasn't running inside the backend — it was calling an endpoint, `/api/schema/edges`, which returned each edge's source, destination, required and optional fields, and *not* the list of valid producers. From inside the server that list was one import away. From the browser it might as well not exist.

That's the useful property. A frontend prototype is an **adversarial observer of your API** — not in the security sense, but in the sense that it only ever asks one question: *can I actually do the thing you said the system does, using only what you exposed?* Backend developers reason from the inside, where everything is reachable. The frontend reasons from the boundary. Same system, and the difference is exactly the architecture that's invisible from within.

## Some things aren't discovered, they're forced

Not everything the prototype surfaces is a bug. Some of it is a decision you'd been quietly deferring.

There was a workflow with three branches — hydrate an existing record, create a new one, merge two. Prose can tell you the hydrate branch is easy to omit and expensive to omit. It cannot tell you whether all three stay visible at all times, whether empty ones collapse, whether they carry counts. You can argue that in a document indefinitely. Put all three on screen and you've chosen.

Same with unmet references — a record pointing at something that doesn't exist yet. A spec can argue convincingly that this is a legitimate state rather than an error. The UI has to answer something much narrower: what does the user see? Once the prototype renders a numbered list ending in an unresolved pointer back to the node above it, the design principle has become a widget. That's a specification you can click.

And the most useful thing in the whole build started as throwaway scaffolding: a panel showing the request body that would be sent to the API. The written spec had described the API shape by hand, and that description had already drifted out of sync once. The panel instead derived the payload from the same schema that generated the form — so it could show the real request body for any label, any path. A hand-written example says *here's what the API looks like*. A generated one says *here's what it looks like for this actual member of the domain*. The second is much harder to fake, and you can diff it against what the server expects.

## The honest limit

Most of the serious defects in this exercise were invisible to the prototype. Four of the five worst came from reading and running backend code: a merge function that could crash; a mutation returning server errors for three labels; a curator stamp being written to records without being declared anywhere; a database query using *merge* semantics where *create* was intended, so writes silently updated existing records instead of adding new ones; and live queries returning stale counts.

A mock that can't actually write to the database finds none of that. So the claim has to be narrower than "frontend-first replaces backend-first."

**Frontend-first isn't backend-first inverted. It's a different instrument.** It's sharp at the seams — schema against UI, API against interaction, state against transport, domain concept against human decision. It's blind to what happens behind the API when something is actually written. You still need source inspection, integration tests, exercised mutations, queries against the live system. What's new is that you can add one more kind of test, much earlier, for almost nothing.

There's a cost too. The prototype is now a second consumer of the schema, which means it can drift from the first. My test checked that the generated fields came from the schema's required list. It did not check that the generated `:Commitment` form matched the hand-written reference fixture. That comparison still had to be built.

So prototypes don't remove specifications. They add an executable version of one, which is another thing to keep consistent — but a productive kind of duplication. The document says the form should contain every field. The generator demonstrates whether that's even possible. The test verifies it stays true.

## Documents cannot enforce anything

A specification can describe a system accurately and still fail to reveal that the system cannot be built as described. Building the form is the test, and it can take ten seconds on screen to expose what four careful readings missed.

That's not an argument for reading less. It's an argument for not asking prose to do a job that interaction does better.

The maximalist prototype is not the architecture. It's allowed to be excessive: ten states where four will ship, controls that should never exist, transitions that turn out unnecessary. Once you've seen the space, you cut it down. **Waste tokens in the prototype so you don't waste architecture in production.**

Which inverts the usual order into: build something maximally wrong, interact with it, find out what must be true, make the backend true, simplify the interface.

Sounds backwards. For complex systems under human control, it's the more natural direction. The frontend stops being the last layer of the stack and becomes the first instrument for discovering it.