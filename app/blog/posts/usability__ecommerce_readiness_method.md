---
title: "Measuring ecommerce readiness I. Methodology"
thread: usability
keywords: [ecommerce, agentic ai, user experience, home & furniture]
author: "Federico Caria"
date: "2026-10-31"
tags: 
summary: "Can an AI shopping agent find the product a real buyer asks for, using only what a retailer publishes? This first post explains how we are measuring it across Italian bathroom retailers, and why the method is built the way it is."
image:
---

More and more product searches will start in a conversation with an AI assistant rather than in a retailer's search box. The buyer types what they need; the assistant reads what shops publish and comes back with a few products. Whether that works depends on something retailers control directly: the information on their product pages.

This series measures how well it works today. This first post explains the study: the question, how we measure it, and the safeguards that keep the result honest. [Part two](#) shares preliminary findings on how retailers publish product data. Part three will report what happens when an AI agent actually shops their catalogues.

## The question

Given only what a retailer publishes today, can an AI agent find products that satisfy a real buyer's stated constraints? And when it fails, what in the retailer's data caused it?

The question is deliberately narrow. We are not measuring sales, conversion or the quality of the assistants themselves. We measure one thing: whether a retailer's public product information lets a fixed agent identify the right products, and describe them without claiming things the page does not support.

A buyer's request is never just a keyword. It is a set of constraints:

> "I need a shower enclosure for a 70x90 corner, with a sliding door because there is little space in front. Clear glass, not frosted. 400 euros at most."

That is four constraints: size, door type, glass and price. A good answer meets all four. An answer that meets three and quietly ignores the fourth is a wrong answer that looks right, and that is exactly the failure a buyer cannot see.

## Why bathrooms, and why Italy

I chose bathroom and sanitary ware products because they are full of constraints that make a difference: precise dimensions, materials and finishes, installation types, and compatibility with what the buyer already owns, such as a toilet seat that must fit a specific toilet. An incorrect size or an incompatible component isn't a matter of taste; the product simply doesn't work.

Before wasting time, I tried sending some real inquiries to sales assistants, limiting ourselves to the websites of major Italian retailers. Each response omitted something, and the subsequent messages were recommendations for related products that weren't directly relevant. This isn't a result, but one more reason why the study is worth conducting.

Italy is the first country because I'm curious, and because I hadn't yet used the list of thousands of Italian retailers (from every niche) that I diligently scraped months ago. These include bathroom specialists, plumbing and heating distributors, DIY chains, and furniture chains, which offers a useful insight into how product data is published. Other countries may follow the same method.

## How I aim to measure

### One fixed agent, used as an instrument

The agent is the measurement tool, not the subject. I use an open-weight language model, running on my hardware and constrained to a single version for the entire study, with a fixed set of instructions and a fixed limit on the number of lookups it can perform. Since everything about the agent must theoretically remain constant, differences between retailers will arise more from their data than from the agent's whims.

Another important thing is that the agent will not browse the live website. For each retailer, it will search an index of that retailer's catalog **as published**: product pages collected from public sitemaps, without any cleanup, corrections, or additions. It has two tools, *search catalog* and *open a product*, and must respond in a fixed format: the products it recommends, the price, availability, and link for each, and, for each constraint in the query, what it found and where. Having the agent repeat the constraints is what allows us to catch it when it claims something the page doesn't.

### Real buyer requests

The requests are collected from real buyers, not invented by me. This adds some friction but must be questions people asked about bathroom products in public places, and requests written by people who recently renovated a bathroom. Each request is coded on four dimensions:

- **how many constraints** it contains;
- **what kind** they are: an exact value, a range, availability, a negation ("not frosted"), or a relation to another product ("fits my toilet");
- **where the needed fact lives**: on the product page, in a size or colour variant, on a delivery or returns page, in an external datasheet, or in something the buyer already owns;
- **whether constraints depend on each other**, as when the price depends on the size.

From a larger pool I draw 30 requests that cover these dimensions: several with negations, several about compatibility, several where the right size variant has to be chosen at a price, several whose answer sits outside the product page. Ten of them must carry a follow-up turn, in theory, including tricky ones, eg. relaxing a constraint ("and if I go up to 500?").

### Scoring every constraint

Every product the agent returns is checked against the request, constraint by constraint, on the retailer's own product page. Each constraint gets one of three verdicts:

| Verdict | Meaning |
| --- | --- |
| PASS | the page shows the product meets it |
| FAIL | the page shows it does not |
| UNVERIFIABLE | the page does not say |

The third verdict is the important one. If a page never states whether the glass is frosted, the product may well be right, but neither the buyer nor the agent can know. Unverifiable is never counted as a pass or a fail. It is reported on its own, because it measures something a retailer can fix.

From these verdicts come three headline measures, always reported together:

- **task success:** did the agent return products that meet every constraint?
- **constraint precision:** of what the agent returned, how much actually fits?
- **constraint recall:** of the products in the catalogue that fit, how many did the agent find?

To know what "all the products that fit" are, we cannot rely on our own search, or we would only grade what our system happens to find. Candidate products are therefore gathered by several independent search methods, and each candidate is judged against its own product page. A language model does the bulk of that judging; people check a stratified sample of its verdicts, and a set of ten sealed requests is judged by people only, so the model's reliability is measured rather than assumed.

### Five dimensions per retailer

Instead of one score, each retailer gets a profile:

| Dimension | What it shows |
| --- | --- |
| Handoff | Does the link the agent hands over open, land on the right variant, show the same price, show stock and delivery terms? |
| Variant resolution | Can the agent pick the right size or colour at the right price? |
| Attributes and constraints | How success falls as requests carry more constraints |
| Meaning | Failures caused by vague or ambiguous product language |
| Relations | Compatibility, alternatives and complements, scored separately |

Alongside the profile we measure **freshness**: how far the published values drift from the live page.

### Tracing every failure to its cause

When the agent fails, I think I can trace the chain backwards and record the first broken link. The information could be 1. missing from the page, 2. located somewhere the software struggles to read, 3. contradicted by another part of the page, or 4. found but misinterpreted by the agent. In short, for every piece of information the agent needs, I also record its location on the page: structured data, a table of specifications, the description, the title, a PDF, or a separate page. If this works, it would provide every retailer with a concrete list: which attributes cause most of their unverifiable verdicts and where they should be on the page.

## Safeguards

It's a good idea to establish rules before getting results and stick to them:

- **Requests are written before anyone reads the catalogs,** by people who aren't involved in creating or tweaking the system. A third of these requests are sealed and opened only for final execution.

- **The rules for determining what is considered a correct response are defined based solely on the request,** by an external person with specific industry expertise. Which retailers each request applies to is also decided at this stage: a store that doesn't sell restrooms isn't penalized for not finding one.

- **Agent-caused errors are never counted against a retailer.** Their frequency is published as a check on the validity of the study itself: if the agent messes up too often due to their own fault, all retailer data is background noise.

- **No composite score.** Retailers are ranked based on their compliance with the constraints.

- **The method is registered before the main run,** along with its assumptions and thresholds, so the analysis cannot be modified after viewing the data.

- **Each run of evaluations is versioned,** and is never silently modified.

## What we publish, and what we keep

I will publish the full method, every result per retailer with its uncertainty, the failure analysis, and all the validity checks. The requests, the correct answers and the agent's full transcripts stay private, so the benchmark cannot be trained on and stays useful for measuring change over time.

## Limitations

Limits are written down before the results, so they cannot be softened afterwards. Among them:

- **I am not measuring revenue.** As far as I know, being this gap specific and relatively new, nobody has yet published what closing this gap is worth.
- **It is not a test of commercial assistants.** The agent is a fixed instrument chosen so the study can be repeated. We compare its failures with two commercial assistants on a subset of retailers, and the match will be imperfect.
- **It covers one category and one country.** BIt's just a pilot!!!
- **Thirty requests describe a range of buyer needs, not a whole catalogue.** Same as above!!
- **Agents vary from run to run.** Every figure is reported with its interval over repeated runs.

## Next in the series

[Part two](#) looks at what is already visible before any agent runs: how a few Italian bathroom and home retailers publish product data, and how little of it is in a form software can read directly. Part three will report the agent's results, retailer by retailer.

If you run one of the shops in the study and want your figures early, get in touch.



