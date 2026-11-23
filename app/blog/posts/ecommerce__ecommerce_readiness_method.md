---
title: "Evaluating agentic ecommerce readiness I. Methodology"
thread: ecommerce
keywords: [ecommerce, agentic ai, user experience, usability, home & furniture]
author: "Federico Caria"
date: "2026-10-31"
tags: 
summary: "Can an AI shopping agent find the product a real buyer asks for, using only what a retailer publishes? This first post sets out the study design: the questions, what is sampled, how answers are scored, and the safeguards that keep the result honest."
image:
---

## 1. Overview

| | |
| --- | --- |
| **Study** | Evaluating agentic ecommerce readiness |
| **Type** | Observational measurement study, with a pilot run before the main run |
| **Category and market** | Bathroom and sanitary ware, Italian online retailers |
| **Instrument** | A fixed, open-weight AI agent, used as a measuring tool |
| **Series** | I. Methodology (this post) · [II. Preliminary findings](/post/ecommerce__ecommerce_readiness_preliminary) · [III. A first agent run (pilot)](/post/ecommerce__ecommerce_readiness_full-run) · main results to follow |

This post describes the design at the level of principles. Some operational details are held back until the results are published, for reasons explained in section 10.

## 2. Background and research questions

For many years at Baymard we measured how well e-commerce site search supports different types of query. One of them, *natural language search*, we eventually stopped evaluating because the results were consistently poor. Ironically, that's exactly the kind of query at the heart of what's now called **agentic ecommerce**. Product searches start in a conversation with an AI assistant rather than in a search box. The buyer describes what they need, the assistant reads what shops publish, and it comes back with a few products. Whether that works depends on something retailers control directly: the information on their product pages.

Before starting, I sent a few real enquiries to the chat assistants on major Italian retailers' websites. Every answer left something out, and the follow-up messages mostly suggested related products that weren't what I'd asked for. That isn't a result, and I'm not publishing it as one, but it was one more reason to think the study was worth doing.

A buyer's request is rarely just a keyword. It's usually a set of constraints:

> "I need a shower enclosure for a 70x90 corner, with a sliding door because there is little space in front. Clear glass, not frosted. 400 euros at most."

That's one of the simpler ones: four constraints, on size, door type, glass and price. A good answer meets all four. Unless the constraints are spelled out one by one, there's nothing to check an answer against. An answer that meets three and quietly ignores the fourth looks right but isn't, and from the chat window the buyer can't tell.

The study asks two questions:

- **RQ1.** Given only what a retailer publishes today, can an AI agent find products that satisfy a real buyer's stated requirements?
- **RQ2.** When it fails, what in the retailer's data caused it?

And it tests one hypothesis that links the series together:

- **H1.** Requirements whose facts sit lower on the readability ladder described in [part two](/post/ecommerce__ecommerce_readiness_preliminary) (prose rather than specification tables or structured data) more often end up unverifiable or missed.

## 3. What is sampled

The study samples at three levels.

**Retailers.** Italian online shops that sell bathroom products, drawn from a list of thousands of Italian retailers across many niches that I had collected earlier and not yet used. They include very different kinds of shop: bathroom specialists, plumbing and heating distributors, DIY chains and furniture chains, which makes for a useful comparison of how product data gets published. Shops that can't be measured, for example because they block automated access or publish no sitemap, are excluded and listed.

**Product pages.** Drawn at random from each retailer's public sitemaps, checked to be single-product pages, and saved as published.

**Buyer requests.** Written by real buyers, not by me: questions people have asked about bathroom products in public places, and requests from people who have recently renovated a bathroom. They're selected to cover the situations that tend to cause trouble, such as negations ("not frosted"), compatibility with something the buyer already owns, picking the right size variant at the right price, and information that sits outside the product page.

**Why bathrooms, and why Italy.** Bathroom products are heavy on specifications. It may not be the most exciting niche, but it's a good test bed: a wrong size or an incompatible part means the product is simply wrong. Italy was a less strategic choice, made because the retailer list was already there. Other countries could follow with the same method.

## 4. The instrument

The agent isn't what's being tested; it's the measuring instrument. I use a single open-weight language model running on my own hardware, kept at the same version, with the same instructions and limits, for the whole study. Because the agent stays constant, differences between retailers should come from their data, not from changes in the agent.

The agent doesn't browse the live websites. It works from each retailer's catalogue **as published**, collected from public pages without any cleaning, correction or additions. For every requirement in a request, it has to say what it found and where. That's what makes it possible to catch it when it claims something the page doesn't say.

## 5. Measures

**Per requirement.** Each product the agent returns is checked against the request one requirement at a time, on the retailer's own product page:

| Verdict | Meaning |
| --- | --- |
| PASS | the page shows the product meets it |
| FAIL | the page shows it does not |
| UNVERIFIABLE | the page does not say |

*Unverifiable* is the most interesting verdict. If a page never says whether the glass is frosted, the product may well be right, but neither the buyer nor the agent can know. It's never counted as a pass or a fail, and it's reported separately, because it points to something a retailer can fix.

**Having a product versus finding it.** A big shop has more chances to stock something that fits than a small one. If that went straight into the scores, size would look like quality. So two questions are kept apart: *does the shop have a product that fits?*, which describes the assortment and isn't ranked, and *can the agent find it?*, which is what the study ranks. The size of each relevant part of the catalogue is reported alongside.

**Cause of failure.** When the agent fails, the problem is traced back to the first thing that went wrong. Was the information missing from the page? Was it there, but somewhere software struggles to read? Did one part of the page contradict another? Or did the agent misread it? This is what answers RQ2, and it should give each retailer a concrete list of which pieces of information cause most of their problems and where on the page they belong.

**Handoff and freshness.** Whether the link the agent hands over opens the right product at the quoted price and availability, and how far the saved catalogue has drifted from the live site.

## 6. Procedure

The steps run in a fixed order, so that nothing later can influence anything earlier:

1. Buyer requests are collected and coded before anyone looks at the catalogues.
2. For each request, the rules for a correct answer, and the retailers it applies to, are written down and frozen.
3. Catalogues are collected from public pages.
4. The agent runs on every applicable request–retailer pair.
5. Every answer and every "nothing fits" reply is scored against the retailer's pages and catalogue.
6. Recommended pages are checked live for handoff and freshness.

A small pilot ran through all six steps first, to test the pipeline end to end before aiming at real numbers. Its requests are retired and won't be used in the main run. Part three reports what it showed.

## 7. Analysis

- Every figure is reported with its uncertainty. Shares are given with 95% intervals, and agent results also with their variation across repeated runs.
- Each retailer counts equally in averages, regardless of size.
- Retailers are ranked on one measure only: whether the agent finds products that meet every requirement. Where the uncertainty doesn't allow a strict order, they share a tier. There is no composite score.
- Results on individual dimensions, such as variants, compatibility or vague product language, are reported for the category as a whole and are only indicative per retailer.
- Requests differ in difficulty, and the analysis accounts for this, so a shop isn't marked down just because more of the hard requests applied to it.
- Failures caused by the agent are separated from failures caused by the data before any retailer is scored.

## 8. Validity and safeguards

The rules are fixed before seeing any results, and then kept:

- **Requests are written by people who aren't involved in building or adjusting the system.** Some are kept sealed until the final run.
- **What counts as a correct answer is decided from the request alone,** by someone with expertise in the sector.
- **Agent errors are never counted against a retailer.** How often they happen is published as a check on the study itself. If the agent makes too many mistakes of its own, the retailer results can't be trusted, and I'll say so.
- **The model's judgements are checked by people.** Where a language model helps with scoring, a sample of its verdicts is checked by hand and some requests are judged by people only, so its reliability is measured rather than assumed.
- **The protocol is registered before the main run,** with its assumptions and thresholds, so the analysis can't be adjusted after seeing the data.
- **Every run is versioned** and never silently changed.

## 9. Ethics

- Only public pages are collected, with a standard browser, following each site's robots.txt.
- No personal data about shoppers is collected. Buyer requests are stripped of anything that could identify their authors, and the people who wrote requests for the study agreed to their use.
- Retailers are named in the results. Any retailer in the study can see its own figures before publication and point out errors.
- Nothing in the study is a legal assessment, including the observations on EU product-safety information.

## 10. What is published, and what stays private

With the results, I'll publish the full method, every retailer's results with their uncertainty, the failure analysis and the validity checks. The requests, the correct answers and the agent's full transcripts stay private, so the test can't be trained on and stays useful for measuring change over time. For the same reason, the full protocol is registered privately before the main run and made public together with the results, so anyone can check that nothing was changed along the way.

## 11. Limitations

The limitations are written down before the results, so they can't be softened afterwards:

- **It doesn't measure revenue.** As far as I know, nobody has yet published what closing this gap is worth.
- **It isn't a test of commercial assistants.** The agent is a fixed instrument, chosen so the study can be repeated. Its failures will be compared with commercial assistants on part of the sample, and the match won't be perfect.
- **It covers one category in one country.**
- **The requests describe a range of buyer needs, not a whole catalogue.**
- **Catalogue size can't be removed completely.** Separating "has it" from "finds it" reduces its influence, but a large catalogue can still make some requests easier or harder.
- **Agents vary from run to run,** which is why agent results are reported across repeated runs.

---

## Next in the series

[Part two](/post/ecommerce__ecommerce_readiness_preliminary) looks at what's already visible before any agent runs: how Italian bathroom and home retailers publish product data, and how little of it is in a form software can read directly. [Part three](/post/ecommerce__ecommerce_readiness_full-run) reports a first pilot run of the agent.

If you run one of the shops in the study and would like to see your figures early, get in touch.