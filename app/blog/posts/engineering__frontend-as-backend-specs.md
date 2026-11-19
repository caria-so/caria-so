---
title: "From Frontend to Backend Specs"
thread: engineering
keywords: [vibe]
author: "Federico Caria"
date: "2026-08-14"
tags:
summary: "What I noticed while building interfaces with AI coding agents: putting a deliberately oversized version of the interface on screen showed me gaps in the backend specification that I had missed when reading it."
image:
---

Luke Wroblewski has argued that design used to run ahead of engineering because mockups were cheap and working software wasn't. Agree. Coding agents have narrowed that gap, and (hopefully) working software can now appear almost as fast as a mockup. I think there's a second reversal hidden inside that one: I've started building the interface first to find out what the backend actually needs to do.

I do this when something comes up that wasn't specified in advance and ends up touching the architecture. I mock the add-on states first, every one I can think of. It costs more AI usage than a minimal version, but when a wrong assumption in the data model would be expensive to fix later, I think it's worth it. Then I look for the places where the interface breaks. An interface has to *do* things, so it has to turn every assumption in the specification into something concrete, and the breaks show where the specification is missing something.

## The setup

The system is built on a graph database. Data lives in *nodes*, each with a *label* saying what kind of thing it is (a generic `:Concept`, or more specific kinds like `:Commitment`). Nodes are connected by *edges*. A *schema* defines which fields each label has, and because software can read it, the data-entry forms can be generated from it automatically. That form generator is what I was prototyping.

## A specification can be right and still incomplete

The specification said: *the form contains the required and optional fields for each concept type.* That sounds complete, and the worked example in the document checked out.

But a program that generates forms has to know what to do with *every* field in the schema. While building it, I found that a field called `accumulate` appeared on some labels and not others. `:Commitment` didn't have it, and `:Commitment` was the label used in the worked example. The hand-written test data covered the same case. Nothing in the specification was wrong; it had described one example and let the reader assume the rest followed the same pattern. A generator can't assume. It handles the whole schema or it fails.

Rereading the document would never have found this, because everything it said was correct. Building something that had to *use* the specification found it in an afternoon.

## Knowing what a value is versus how it arrives

The specification asked for a read-only field showing `IP_CURATOR`, the person who curated the record. It said what the value was and how to display it. The prototype showed an empty box.

What was missing was the route: where the value is stored and how it gets from the server to the screen. You can write "the form shows X" without ever saying where X comes from. An interface can't skip that, and the answer is a question about how the system is built.

The same thing happened one step further out. A `producer` field was required on nine kinds of edge, and the backend knew it. But the form gets its information through an *endpoint*, an address the server exposes, and that endpoint didn't return the list of valid producers. Inside the server the list was easy to reach. From the browser it didn't exist.

This is what I find most useful. The prototype keeps asking: *can I actually do what you say the system does, using only what you've made available to me?* The backend is designed from the inside, where everything is within reach. The interface sees it from the outside, and that's where these gaps show.

Some of what came up wasn't a bug but a postponed decision. A workflow with three branches (enrich a record, create one, merge two) raised questions no document had settled: are all three always visible, do empty ones collapse? Once they were on screen, I had to choose.

## What it can't do

Most of the serious problems in this project were invisible to the prototype. They came from reviewing and running the backend code: a merge function that could crash, errors when updating three labels, queries that overwrote existing records instead of creating new ones, out-of-date counts. A mock that never writes to the database finds none of that.

So this doesn't replace anything. It's an extra test, good at the points where parts of the system meet (schema and interface, API and interaction) and blind to what happens when data is actually written. What's new is that it can happen early and cost very little.

## The point

A specification can describe a system accurately and still hide that the system can't be built as described. Building the interface showed me in seconds what several careful readings had missed.

So the order I've ended up with is: build something deliberately too big, use it, work out what has to be true, make the backend do that, then cut the interface back. It sounds backwards, but for systems where people make the important decisions, it's started to feel more natural to me.