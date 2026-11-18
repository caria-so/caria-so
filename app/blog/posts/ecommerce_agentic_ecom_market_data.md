---
title: "Agentic commerce: what the forecasts say, and what they assume"
thread: ecommerce
keywords: [agentic UX, agentic usability]
author: "Federico Caria"
date: "2025-07-21"
tags: 
summary: "A reading of the current market research on AI shopping agents: how big the forecasters think it will get, why product data matters more than the storefront, and what consumers need before they let software buy for them."
image: 
---

Online shops have been designed for one kind of customer for about thirty years: a person looking at a screen. Search optimisation, product photography, banners and persuasive copy all assume that someone is browsing, comparing in several tabs and filling in a checkout form. That assumption is starting to weaken. More and more, the first visitor to look at a product page is software acting for a person.

This is what people mean by *agentic commerce*. Instead of doing the research themselves, the buyer states what they want once ("a wall-hung toilet under €300 that fits a 50 cm space", say). An agent then searches, compares the options, checks them against the buyer's constraints and, in some cases, completes the purchase. The person sets the rules, and the agent does the browsing.

I've been reading the market research on this, partly to understand the scale and partly because the forecasts rest on assumptions worth looking at. These are my notes.

## Two stages: traffic first, then control

ECDB describes the shift as two stages, and I think the distinction is useful.

In the first stage, which is already happening, AI assistants act as a discovery layer. Someone asks ChatGPT or Perplexity for a recommendation, gets a shortlist, and clicks through to a shop to buy. The shop still owns the sale and the customer relationship. What changes is where the visitor comes from.

In the second stage, the agent completes the purchase itself, inside the AI interface or through an API, and the buyer never sees the shop's website. That's a much bigger change, because it moves the customer relationship away from the retailer. Seen this way, a lot of what follows is about how far and how fast the market moves from the first stage to the second.

## How big the forecasters think it will get

Every major consultancy and bank has published a number, and the numbers differ a lot. That's partly because they measure different things. Some count purchases an agent *influenced*, others only those it *completed*.

| Source | Projection | Horizon | What is being measured |
| :--- | :--- | :--- | :--- |
| Bain & Company | $300–500B (15–25% of US e-commerce) | 2030 | US retail moving to delegated agents |
| McKinsey & Company | Up to $1T US B2C; $3–5T globally | 2030 | B2C volume involving agents |
| Gartner | 20% of digital transactions | 2026–2030 | Agent-executed and on-platform checkout |
| Stripe & BCG | $1.3T influenced; ~$400B fully autonomous | 2030 | Assisted vs. autonomous US spend |
| Morgan Stanley | 10–20% of US e-commerce | 2030 | Adoption across core retail categories |
| J.P. Morgan | Up to 25% of US online sales | 2030 | Concentrated in repeat purchases |
| Juniper Research | $8B (2026) to $3.5T globally | 2026–2031 | Growth in users and transactions |

The Stripe and BCG split is the one I find most helpful. They estimate that about 55% of US online spend will be *agent-assisted* by 2030, but only around 18% *fully autonomous*. In other words, most of the change, at least for now, is agents helping people decide rather than buying on their own. J.P. Morgan expects autonomous buying to start where choices are routine and low-risk, such as groceries, household refills and subscriptions, which seems plausible. Nobody needs to deliberate over washing-up liquid.

It's worth remembering that these are forecasts by firms that also sell advice on the transition. The direction is consistent across all of them; the size is much less certain.

## Search is already changing

The forecasts build on something that can already be measured. According to Semrush and SparkToro, around 60% of searches in 2025 ended without a click to any website, rising to 77% on mobile. People increasingly get their answer on the results page or from an AI summary. Some projections expect traffic referred by LLMs to overtake organic search by 2028, though that's a projection, not an observation.

Conversion data points the same way. Adobe Digital Insights reports that visits referred by AI assistants converted 38% *worse* than other traffic in March 2025, but 42% *better* by March 2026. Similarweb figures put ChatGPT referrals at about 11.4% conversion, compared with 5.3% for organic search. The likely explanation is that the assistant has already done the filtering: by the time someone clicks, they've narrowed their choice and are close to buying. The volumes are still small, but the visitors are unusually ready to buy.

## Who controls the transaction

Three kinds of platform are competing for the role of the agent, and each gives the retailer a different position.

**OpenAI**, through ChatGPT, wants to own the conversation and complete the purchase inside it. In September 2025 it launched the Agentic Commerce Protocol with Stripe, which lets people check out without leaving ChatGPT. In this model the retailer becomes a supplier behind the interface.

**Google** is building shopping agents into search and Android, working through open standards like Schema.org markup and shared protocols. Retailers stay visible as partners, provided their data meets the standard.

**Amazon** keeps its own agent, Rufus, inside its own marketplace and restricts outside agents. Sellers there depend entirely on Amazon's rules.

ECDB suggests that retailers broadly choose between four positions: make themselves easy for agents to use, invest in a brand experience that wins customers before agents get involved, distribute as widely as possible through the platforms, or combine these by joining the protocols while keeping some benefits for direct customers. Each involves a trade-off between reach and keeping the customer relationship, and I don't think there's a right answer for every shop. A specialist retailer with loyal customers and a reseller of commodity products are in very different positions.

## The part that applies to everyone: product data

Whichever position a retailer takes, it depends on one thing: an agent has to be able to read the product data. A person can look at a photo and infer the size, the material and whether something will fit. An agent can only work with what's written down in a structured way: the attributes, the variants, the price, stock levels and the return policy.

This is where shops appear least prepared. Adobe's readability audit gives product pages an average score of 66%, the lowest of any page type on retail sites. The usual problems are variants hidden behind JavaScript menus, specifications written as free text rather than fields, and missing structured markup. When an agent can't work out whether a product meets the buyer's constraints, it's likely to recommend a competitor whose data is clearer.

I suspect this is hardest for small and mid-sized shops. W3Techs puts WooCommerce at over 32% of online stores, and most of those run on themes and plugins that were never designed with agents in mind. Large retailers have data teams. A family business selling bathroom fittings usually doesn't. Their catalogue knowledge is often excellent, but it's in a form that only people can read.

What agents need, roughly, is:

- complete Schema.org markup for products, offers and return policies;
- attributes stored as consistent fields (dimensions, materials, compatibility) rather than buried in descriptions;
- up-to-date availability and pricing that an agent can query;
- terms linked to shared vocabularies, so an agent can tell that two shops mean the same thing even when they describe it differently.

## Would people actually let an agent buy for them?

Every forecast assumes consumers will hand over the decision. The academic research suggests that's less straightforward. Balaskas (2026) reviewed the literature on agentic AI in e-commerce, and his central point is that a more capable agent doesn't automatically get more use.

He describes two forces working against each other. On one side, convenience, speed and good recommendations build trust and keep people coming back. On the other, the more an agent acts without asking, the more people feel their control slipping, and some respond by refusing to use it. This is a familiar effect in psychology, usually called reactance. People don't like decisions being made for them, even good ones.

The review suggests that systems are more likely to keep users' trust when they:

- ask for confirmation before purchases where the price, brand or return terms differ from what the user expected;
- make it easy to cancel, undo or dispute an order;
- explain why a product was chosen, and show the alternatives;
- let people withdraw consent and delete their history;
- keep a clear record of who decided what (the user, the agent or the merchant) in case something goes wrong;
- start in an advisory role and only act autonomously for low-risk, routine purchases.

There's one interesting nuance: under time pressure or when stock is scarce, people tolerate more autonomy and fewer confirmation steps. In normal shopping, they want to stay in control.

As someone who has spent years testing checkout flows with real users, I find this reassuring. The usability problems don't disappear when an agent does the shopping. They move to the moment when the person decides how much to trust it.

## What I take from this

The forecasts disagree on size but agree on direction, and the measurable signals (zero-click search, AI referral conversion) support them. Two things seem most solid to me. First, product data that agents can read is now a requirement rather than an extra, and small shops are furthest from it. Second, adoption depends as much on whether people feel in control as on how capable the agents are.

The forecasts don't tell me whether today's agents can actually do the job with the data retailers publish now. That's what I'm testing next, starting with Italian bathroom retailers: I take real buyer requests and check whether an agent can find a matching product using only what the shops publish. The methodology will be in the next post in this thread.

---

## Sources

### Academic and research literature
1. **Balaskas, S.** (2026). From Recommendations to Delegation: A Systematic Review Mapping Agentic AI in E-Commerce and Its Consumer Effects. *Information*, 17(3), 222. MDPI. DOI: 10.3390/info17030222.
2. **ECDB Research Team.** (2025/2026). *Agentic Commerce and AI in E-Commerce: How the Shopper Is Becoming an Algorithm*. ECDB.
3. **commercetools.** (2026). *Agentic Commerce Stats: Enterprise Strategy & Market Guide*.

### Industry studies
4. **Adobe Digital Insights.** (2025/2026). Retail machine-readability and AI channel conversion analytics.
5. **Bain & Company.** (2025/2026). US agentic commerce market outlook.
6. **Barn2 & W3Techs.** (2026). WooCommerce market share statistics.
7. **Digital Commerce 360 & Retail Dive.** (2025/2026). Coverage of McKinsey's global agentic commerce forecast.
8. **Gartner.** (2025/2026). *Predicts 2026*: embedded AI agents in enterprise applications.
9. **Juniper Research.** (2026). Global agentic commerce sizing, 2026–2031.
10. **McKinsey & Company.** (2025/2026). *The Agentic Commerce Opportunity*. QuantumBlack.
11. **PayPal Newsroom.** (2026). *Making Sense of the AI Shopping Protocol Moment*.
12. **Stripe & Boston Consulting Group.** (2025/2026). Agent-assisted vs. autonomous e-commerce spend projections.