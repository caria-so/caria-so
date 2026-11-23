---
title: "Evaluating agentic ecommerce readiness III. A first agent run"
thread: ecommerce
keywords: [ecommerce, agentic ai, user experience, usability, home & furniture, AI shopping agents]
author: "Federico Caria"
date: "2026-11-19"
tags: 
summary: "An AI agent shopped four Italian bathroom retailers for 18 real buyer requests. It found a fitting product in 11 of 19 answers, but most of its mistakes were its own: wrong products, missed products, and constraints it never checked."
image:
---

[Part one](https://caria.so/post/usability__ecommerce_readiness_method) described the method. [Part two](https://caria.so/post/usability__ecommerce_readiness_preliminary) showed that Italian bathroom retailers state most product facts, but rarely in a form software reads directly. This part puts an AI agent in front of four of those catalogues with real buyer requests and checks every answer against the retailer's own pages.

This is not the main study. I started with a larger batch of requests, then realised I should first test the whole pipeline end to end on a small one, before aiming at real numbers. So this is a pilot to refine the method: 18 requests, four shops, one agent, one run. The agent will be improved before the main run, and the requests used here will be retired from it. The numbers below have wide intervals and support no ranking of retailers. What they do show is where things break, in the retailers' data and in my own instrument.

## Key findings

1. **The agent was right a little over half the time.** Of 19 answers on requests the shop could plausibly satisfy, 11 met every constraint the buyer stated (58%, 95% interval 36–77%).
2. **Most failures were the agent's, not the retailer's.** It recommended the wrong kind of product 4 times, declined 4 times when a fitting product was in the catalogue, and offered furniture 3 times to requests the shop could not serve. Only 2 answers failed because the retailer's page left a fact out.
3. **The agent checked about a third of what it should.** It named 37% of the buyer's scored constraints in its answers (95% interval 25–51%). The rest it passed over in silence.
4. **When facts are published, they are rarely in structured data.** Of the 31 facts that decided whether an answer was right, only 3 were in structured data, and two of those were prices. Most sat in label lines, titles and running text.
5. **The saved catalogue went stale within weeks.** Of 26 recommended pages checked live, 3 were out of stock although the indexed copy showed them in stock, and 1 price had changed.

<div class="post-image">
<img src="/static/assets/images/blog/agentic_ecom_3/pilot_rates.webp" alt="Three rates with 95% intervals: answers that meet every constraint 58% (36 to 77), declines that were correct 84% (69 to 92), buyer's constraints the agent named 37% (25 to 51)" />
<p class="post-image-caption">The three headline rates, with 95% intervals · pilot run</p>
</div>

## What I ran

**Shops.** Four retailers from part two, chosen to span catalogue styles: IKEA (921 bathroom products, the most structured data), Deghi (5,589) and InBagno (5,332), two bathroom specialists, and Mondo Convenienza (82 bathroom products, mostly furniture). Leroy Merlin, which was measured in part two, blocked automated access this time and is not included.

**Requests.** 18 requests from real buyers: questions posted on forums, requests from people who had recently renovated a bathroom, and one heard at a hardware-store counter. Three include a follow-up turn, such as "and in ceramic?". None was written by looking at a catalogue.

**Agent.** An open-weight model (Qwen 2.5, 32B parameters) running on my own machine, at temperature 0, with fixed instructions and at most 12 lookups per request. It searches a saved copy of each shop's catalogue, collected in early November, and can open any product in it. It cannot browse the live site. For every product it recommends it must list each of the buyer's constraints and where on the page it found it; if nothing fits, it must say so.

**Scoring.** Before the run, I wrote down each request's scored constraints and their rules, using only the request's own words and numbers. Each answer was then checked constraint by constraint on the retailer's page: met, not met, or not stated. Each decline was checked against the shop's catalogue: was there a product that fits? The rules and the instructions were frozen, with their fingerprints recorded in every result, before the run started.

**Which requests count.** A shop that does not sell toilets is not penalised for not finding one. Requests were scored only where the shop sells that kind of product. That removes most requests at Mondo Convenienza, which sells bathroom furniture, mirrors and mixers, but not sanitaryware or shower fittings.

## Results

<div class="post-image">
<img src="/static/assets/images/blog/agentic_ecom_3/pilot_outcomes.webp" alt="Two stacked bars. Answers (19): 11 meet every constraint, 2 fail a constraint, 4 wrong kind of product, 2 page doesn't say. Declines (37): 31 correct, 4 wrong because a fitting product existed, 2 can't be judged" />
<p class="post-image-caption">What the agent replied, on requests the shop could plausibly satisfy · green correct, red agent error, yellow the page doesn't state the fact, grey can't be judged</p>
</div>

**Answers** (the agent recommended a product). Of 19, 11 met every scored constraint (58%). Two were the right kind of product but failed a constraint, and two were the right kind of product on a page that doesn't state one of the constraints (11% each). Four were the wrong kind of product altogether (21%).

**Declines** (the agent said nothing fits). 31 of 37 were correct (84%, 95% interval 69–92%). 4 were wrong: a fitting product was in the catalogue. 2 could not be judged, because the request's only firm constraint was the type of product and the rest was a matter of taste.

Per shop, the counts are too small to compare. IKEA had 3 answers, Deghi and InBagno 8 each, and Mondo Convenienza none on requests it could serve. A difference of one answer moves a shop's share by 12 to 33 points.

## What went wrong, with examples

<div class="post-image">
<img src="/static/assets/images/blog/agentic_ecom_3/pilot_failures.webp" alt="Bar chart of 15 failed replies: wrong kind of product 4, said nothing fits when something did 4, offered furniture for products the shop doesn't sell 3, product fails a constraint 2, all agent mistakes; retailer's page doesn't state the fact 2" />
<p class="post-image-caption">Where the failures came from · 15 failed replies · red the agent's mistake (13), yellow missing from the retailer's page (2)</p>
</div>

**Wrong kind of product.** Asked for a shower tray under €300 with both sides under 100 cm, the agent recommended a glass shower wall at IKEA. Asked for a spare part for a 1970s concealed diverter, it recommended complete concealed mixers at Deghi (€351) and InBagno (€52): the very replacement the buyer was trying to avoid. Asked for a retro ceramic cistern, it recommended a flush mechanism.

**Missed products.** Asked for a bathtub 80 cm wide and 130, 140 or 150 cm long, the agent told the buyer Deghi had none. Deghi lists a 150 x 80 cm bathtub. Asked for wall-hung pans at least 55 cm deep, it declined at Deghi and InBagno; both list pans with "profondità 55 cm" on the page, at InBagno in the product title. At Deghi it declined a shower tray request with both sides under 100 cm, after recommending a 90 x 90 cm tray from the same shop for another request.

**Furniture for sanitaryware.** At Mondo Convenienza, which sells no toilets or shower trays, the agent answered three such requests with bathroom furniture units instead of saying the shop does not have them.

**Constraints never checked.** Most answers listed two or three constraints. The ones left out were often the product type itself, but also sizes, materials and whether a mat is washable. An answer that does not name a constraint gives the buyer no way to know whether it was checked.

**Claims the page does not support.** In the development runs that preceded the scored run, the agent repeatedly asserted facts that were not on the page: "male thread", "mould-resistant", "delivery to the floor included". In none of those cases did it say it could not verify them. I added an explicit instruction against this before the scored run; the scored run has one confirmed case, but I did not check every claim, so that number is a lower bound.

## What the retailers' pages contributed

Two answers were the right product but could not be confirmed, because the page did not state the fact the buyer asked for: two bath mats, at Deghi and InBagno, say nothing about washing. IKEA's mat states it: machine washable at 40°C.

More often, the fact was on the page, just not where software looks first.

<div class="post-image">
<img src="/static/assets/images/blog/agentic_ecom_3/pilot_deciding_layer.webp" alt="Stacked bars showing where the deciding fact sat on the page, for 31 constraints: structured data 3, spec table 10, label line 9, title 6, description 2, not located 1; Deghi mostly spec table, InBagno mostly label lines" />
<p class="post-image-caption">Where the deciding fact sat on the page, by the readability ladder from part two · 31 constraints checked in 17 answers</p>
</div>

Of the 31 facts that decided whether an answer was right, only 3 were in structured data, and two of those were prices. Ten sat in a specification table. The rest (18 of 31) were further down: in "Label: value" lines in the description, in the product title, or in running text. The retailers differ in the way part two would predict. Deghi keeps most of its facts in a specification table, while InBagno writes them as label lines in the description, where they're published but only readable by an agent that reads the whole page.

Two examples. InBagno states that a resin shower tray can be fitted flush with the floor in a sentence of the description ("in appoggio o filo pavimento grazie allo spessore di soli 3 cm"). In the development runs, a €1 InBagno aerator stated its thread ("filetto M 24x1") in a bullet list in the description, while IKEA's own aerator gave only a 24 mm diameter.

This also bit me. My first version of the tool showed the agent only the structured description, and it never saw InBagno's thread size until I changed how descriptions are extracted. A shopping agent that reads only what is structured misses facts that are, strictly speaking, published.

## Handoff and freshness

Every link the agent handed over opened the right product, and the saved copy matched the price it quoted. But between collecting the catalogue in early November and checking the pages live on 19 November, 3 of 26 recommended products had gone out of stock at InBagno, and one Deghi price had risen from €49.61 to €62.00. An agent that answers from an index a few weeks old will sometimes recommend what a buyer cannot buy.

## What this means

For this pilot, the agent is the weaker link. Part one set a rule for exactly this case: when the agent makes too many mistakes of its own, the retailer results can't be trusted yet. That's where this run stands, and it's what the pilot was for. Much of what went wrong would likely go wrong with any catalogue: picking a product of the wrong kind, stopping the search too early, not checking every constraint. Those are failures buyers cannot see, because the answer reads as confident either way.

For retailers, the results point the same way as part two, with a twist. The facts that decided answers were usually published, but in prose, label lines and titles, where a careful agent can find them and a hurried one does not. Putting them in the specification table, and in structured data, removes the need for the agent to be careful.

## Limitations

- **A pilot.** 18 requests, 4 shops, one model, one run. Every rate has a wide interval, and no retailer is ranked.
- **Answer rules written by me.** The scored constraints come from the requests' own words, were written before the run and frozen, but were not reviewed by an independent expert.
- **Declines partly judged from titles.** 27 correct declines were judged from the titles of the closest products, then rechecked by filtering each shop's whole catalogue on the rule's numbers and product type. The recheck found no fitting product for any of them, but a fitting product described in unusual words could still be missed. One borderline case: InBagno lists a wall-mounted basin mixer supplied with 3/8" flexible connectors; I counted the decline of the 3/8" wall tap request as correct, because the page does not state a 3/8" wall connection.
- **Unsupported claims undercounted.** Only claims tied to scored constraints were checked.
- **Style not scored.** Two requests were mostly about style ("shabby chic", "classic"); only the product type was scored.
- **One agent.** Commercial assistants may do better or worse; comparing them is the next step.
- **Saved catalogue.** Collected in early November 2026; live checks on 19 November.

---

## Next in the series

The natural next step is to scale but I am not happy yet. I’d ather wait before adding websites. The pilot showed two bottlenecks, a manual checking step and a weak agent:

- Hand checking is so boring and doesn’t scale. About 100 judgments took me two sittings, and 60 requests across 8 shops would be about thousands checks on a crazy csv. Not for me.
- The agent’s mistakes drown out the retailers’ differences. With 21% wrong products and 11% missed products, a retailer’s gaps barely show. Scaling up now would mostly measure the agent more precisely.
- Collecting intents was the slowest step, and asking people didn’t work.

### How I would fix it:

1. Automate the checking, and test the automation against your marks.
2. Rerun the pilot with a strong commercial model next to Qwen (1–2 days).
3. Collect requests from forum archives rather than people (in parallel).
4. Add shops last: 4 → about 8.
5. Run the scored round, both agents, about 60 requests × 8 shops.
