---
title: "Evaluating agentic ecommerce readiness I. Methodology"
thread: ecommerce
keywords: [ecommerce, agentic ai, user experience, usability, home & furniture]
author: "Federico Caria"
date: "2026-10-31"
tags: 
summary: "Can an AI shopping agent find the product a real buyer asks for, using only what a retailer publishes? This first post explains the question, the principles behind the method, and the safeguards that keep the result honest."
image:
---

More and more product searches will start in a conversation with an AI assistant rather than in a retailer's search box. The buyer types what they need, the assistant reads what shops publish, and it comes back with a few products. Whether that works depends on something retailers control directly: the information on their product pages.

This series measures how well it works today. This first post explains the study: the question, the principles behind the method, and the safeguards that keep the result honest. [Part two](https://caria.so/post/usability__ecommerce_readiness_preliminary) shares preliminary findings on how retailers publish product data. Part three will report what happens when an AI agent actually shops their catalogues.

I'm deliberately not publishing every detail of the setup yet. Part of the study's value is that it can be repeated over time to measure change, and that only works if the test can't be tuned or trained on in advance. The full method will be published together with the results.

## The question

Given only what a retailer publishes today, can an AI agent find products that satisfy a real buyer's stated requirements? And when it fails, what in the retailer's data caused it?

The question is deliberately narrow. I'm not measuring sales, conversion or the quality of the AI assistants themselves. I'm measuring one thing: whether a retailer's public product information lets an agent identify the right products, and describe them without claiming things the page doesn't support.

A buyer's request is rarely just a keyword. It's usually a set of constraints:

> "I need a shower enclosure for a 70x90 corner, with a sliding door because there is little space in front. Clear glass, not frosted. 400 euros at most."

That's four constraints: size, door type, glass and price. A good answer meets all four. An answer that meets three and quietly ignores the fourth looks right but isn't, and it's exactly the kind of failure a buyer can't see.

## Why bathrooms, and why Italy

I chose bathroom products because they're full of constraints that matter: precise dimensions, materials and finishes, installation types, and compatibility with things the buyer already owns, such as a toilet seat that has to fit a specific toilet. A wrong size or an incompatible part isn't a matter of taste. The product simply doesn't work.

Before starting, I sent a few real enquiries to the chat assistants on major Italian retailers' websites. Every answer left something out, and the follow-up messages mostly suggested related products that weren't what I'd asked for. That isn't a result, but it was one more reason to think the study was worth doing.

Italy comes first partly out of curiosity, and partly because I already had a list of thousands of Italian retailers across many niches, collected months ago and not yet used. Bathroom products are sold by very different kinds of shop (specialists, plumbing and heating distributors, DIY chains, furniture chains), which makes for a useful comparison of how product data gets published. Other countries could follow with the same method.

## The principles behind the method

### The agent is the measuring instrument

The agent isn't what's being tested; it's the instrument. I use a single open-weight language model running on my own hardware, kept at the same version and with the same instructions and limits for the whole study. Because the agent stays constant, differences between retailers should come from their data, not from changes in the agent.

The agent doesn't browse the live websites. It works from each retailer's catalogue **as published**, collected from public pages without any cleaning, correction or additions. For every requirement in a request, it has to say what it found and where. That's what makes it possible to catch the agent when it claims something the page doesn't actually say.

### Real requests from real buyers

The requests come from real buyers, not from me: questions people have asked about bathroom products in public places, and requests written by people who have recently renovated a bathroom. They're selected to cover the situations that tend to cause trouble, such as negations ("not frosted"), compatibility with something the buyer owns, choosing the right size variant at the right price, and information that sits outside the product page.

### Every requirement is checked separately

Each product the agent returns is checked against the request one requirement at a time, using the retailer's own product page. Each requirement gets one of three verdicts:

| Verdict | Meaning |
| --- | --- |
| PASS | the page shows the product meets it |
| FAIL | the page shows it does not |
| UNVERIFIABLE | the page does not say |

The third verdict is the most interesting one. If a page never says whether the glass is frosted, the product may well be right, but neither the buyer nor the agent can know. Unverifiable is never counted as a pass or a fail. It's reported on its own, because it points to something a retailer can fix.

### Having a product versus finding it

A big shop has more chances to stock something that fits than a small one. If that went straight into the scores, size would look like quality. So I keep two questions apart: *does the shop have a product that fits?*, which describes the assortment and isn't ranked, and *can the agent find it?*, which is what the study ranks. Alongside the results I also report how large each relevant part of the catalogue is, so readers can see where size might still play a role.

### Tracing failures to their cause

When the agent fails, I trace the problem back to the first thing that went wrong. Was the information missing from the page? Was it there, but somewhere software struggles to read? Did one part of the page contradict another? Or did the agent simply misread it? If this works, each retailer gets a concrete list: which pieces of information cause most of their problems, and where on the page they should be.

## Safeguards

It's good practice to fix the rules before seeing any results, and then stick to them:

- **Requests are written before anyone looks at the catalogues,** by people who aren't involved in building or adjusting the system. Some are kept sealed until the final run.
- **What counts as a correct answer is decided from the request alone,** by someone with expertise in the sector. This is also when it's decided which retailers each request applies to, so a shop that doesn't sell toilets isn't penalised for not finding one.
- **Errors caused by the agent are never counted against a retailer.** How often they happen is published as a check on the study itself: if the agent makes too many mistakes of its own, the retailer results can't be trusted.
- **No composite score.** Retailers are ranked on one measure, whether the agent can find products that meet every requirement. Where the uncertainty is too large to separate two shops, they share a tier.
- **The method is registered before the main run,** with its assumptions and thresholds, so the analysis can't be adjusted after seeing the data.
- **Every run is versioned** and never silently changed.

## What I'll publish, and what stays private

With the results, I'll publish the full method, every retailer's results with their uncertainty, the failure analysis and the validity checks. The requests, the correct answers and the agent's full transcripts stay private, so the test can't be trained on and remains useful for measuring change over time.

## Limitations

I'm writing the limitations down before the results, so they can't be softened afterwards:

- **It doesn't measure revenue.** As far as I know, nobody has yet published what closing this gap is worth.
- **It isn't a test of commercial assistants.** The agent is a fixed instrument, chosen so the study can be repeated. I'll compare its failures with commercial assistants on part of the sample, and the match won't be perfect.
- **It covers one category in one country.**
- **The requests describe a range of buyer needs, not a whole catalogue.**
- **Catalogue size can't be removed completely.** Separating "has it" from "finds it" reduces its influence, but a large catalogue can still make some requests easier or harder.
- **Agents vary from run to run.** Every figure will be reported with its uncertainty across repeated runs.

---

## Next in the series

[Part two](https://caria.so/post/usability__ecommerce_readiness_preliminary) looks at what's already visible before any agent runs: how Italian bathroom and home retailers publish product data, and how little of it is in a form software can read directly. Part three will report the agent's results, retailer by retailer.

If you run one of the shops in the study and would like to see your figures early, get in touch.