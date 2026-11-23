---
title: "Evaluating agentic ecommerce readiness II. Preliminary Findings"
thread: ecommerce
keywords: [ecommerce, agentic ai, user experience, usability, home & furniture, schema.org, GPSR]
author: "Federico Caria"
date: "2026-11-15"
tags: 
summary: "Italian home and bathroom retailers state most product attributes, but one to three steps below where software reads. For material, half of what is stated already sits in label-and-value form and only needs mapping into structured data."
image:
---

These are preliminary findings from a study called [Evaluating agentic ecommerce readiness](https://caria.so/post/usability__ecommerce_readiness_method). The question behind it is simple. More and more people ask an AI assistant to find products for them: "a white bathroom wall cabinet, MDF, no wider than 60 cm." Can the assistant answer that correctly using only what retailers publish on their product pages, without making things up?

I call this *agentic readiness*: how far a retailer's public product information lets an AI agent find products that meet a buyer's requirements, and describe them without claiming things the page doesn't support.

The agent tests come in the next part of the study. Before any agent runs, though, there's something we can already measure: **where on the page the product information sits.** That turns out to matter a lot, and it's what this post is about.

## Why "where" matters

A product page is written for two audiences at once.

The first is the person looking at it. They see the photo, the title, the description, maybe a table of specifications. People are good at this: they can find "Material: laminated chipboard" halfway down a paragraph without effort.

The second audience is software: search engines, price comparison sites and now AI shopping agents. Software is much less flexible. The most reliable way to give it information is a hidden, standardised layer in the page code called **structured data**. The common standard for it is **schema.org**, a shared vocabulary that Google, Bing and others agree on. If a page says, in that layer, "colour: white, width: 60 cm", any piece of software can read it without guessing.

When a search engine or an agent filters a catalogue ("only white, only under 60 cm"), it usually works from that structured layer first. Information that exists only in the visible text is still there, but it can only be found by opening each page and reading it, which is slower, more expensive and more error-prone.

So a retailer can describe a product perfectly for humans and still be nearly invisible to the filtering step.

## The readability ladder

To measure this, I sorted every product attribute I found (material, colour, width and so on) onto four steps, from easiest for software to read down to hardest:

| Step | Where the information sits | Who can read it reliably |
| --- | --- | --- |
| 1. Structured data | schema.org markup in the page code | any software |
| 2. Spec block | a specification table or list of label and value pairs | software that knows the page layout |
| 3. Label lines | lines such as "Materiale: Nobilitato" inside the description | a simple text parser |
| 4. Prose | ordinary sentences, or the product title | a person, or a language model |

Each attribute is placed on the highest step where it appears. In what follows, **"stated"** means the attribute appears on any step, and **"machine-readable"** means it appears on step 1.

**An example.** A bathroom wall cabinet at Boleco ([page](https://www.boleco.it/pensili-e-colonne/1799-pensile-bagno-diadema-cm-30x75.html)) publishes its product code, price and availability as structured data (step 1). Its colour is in a specification list, "Colori: PERLA SPATOLATO" (step 2). Its material is in a line of the description, "Materiale: Nobilitato" (step 3). A shopper sees the material straight away. Software that reads only the structured data never sees it.

## What I found, in brief

I looked at 23 Italian online retailers selling home and bathroom products, 25 random product pages each.

1. **Most attributes are stated, but few are machine-readable.** Material appears on 75% of the sampled product pages, but in structured data on only 7.5%. For colour it's 62% and 11%; for width, 58% and 7%. Only 5 of the 23 retailers publish any of these attributes as structured data at all.
2. **Much of the gap is a mapping job, not a writing job.** Of all the material values retailers state, 53% are already in a spec block or a "Label: value" line; they just haven't been copied into structured data. Only 10% are machine-readable already, and 37% exist only in prose or the title. For colour the split is 18%, 44% and 38%.
3. **EU product-safety details are almost absent.** Only 3 of 23 retailers show the manufacturer or the EU responsible person on their product pages, almost two years after the EU General Product Safety Regulation began to apply.
4. **Identifier fields are often copies.** At 8 retailers the "manufacturer part number" field simply repeats the shop's own product code on every sampled page, and at one it repeats the barcode number. Automated quality checks count these fields as filled in.
5. **Barcode numbers are patchy.** 11 of 23 retailers show no barcode number (GTIN) on any sampled page. Every one I did find was valid.

The rest of this post goes through each of these in more detail.

## Results: the gap between stated and readable

For every core attribute, the gap between what retailers state and what software can read is between 30 and 70 percentage points.

<div class="post-image">
<img src="/static/assets/images/blog/agentic_ecom_2/attribute_ladder.webp" alt="Stacked bars for material, colour, width, height, finish and depth: machine-readable share is 0.3 to 11 percent of pages; label-and-value not mapped 10 to 40 percent; prose only 22 to 37 percent; the rest not stated" />
<p class="post-image-caption">Share of sampled product pages by the highest step where each attribute appears · 23 retailers, 25 pages each (Boleco 23, Paramashop 24, Idro-Bric 15) · collected 30 Sep–3 Oct 2026</p>
</div>

How to read the chart: each bar is one attribute. The bottom segment (machine-readable) is what filtering software can use directly. The segments above it are information that exists on the page but lower on the ladder. Each page counts once per attribute, at the highest step where that attribute appears.

Material shows the pattern most clearly. Only two retailers, Bagnity and IKEA, publish it as structured data. Colour looks similar: only Bagnity, IKEA, Jysk and OBI put it in schema.org. For dimensions it's IKEA, Jysk, OBI and ShopBagno, and OBI is the only retailer that publishes width, height and depth as structured data on almost every sampled page.

Dimensions generally sit lower on the ladder than material or colour. Most width values are in the prose or the title, written as shorthand like "L.290 P.170 H.99" (Italian abbreviations for width, depth and height). A person reads that instantly; software has to be taught what L, P and H mean.

## The cheap fix, measured

Here's the encouraging part. If a value is already in a specification table or a "Label: value" line, the retailer almost certainly has it stored as a field somewhere in their system. Getting it into structured data is a matter of connecting that field to the right schema.org property. That's technical work, but it doesn't mean writing new product content.

That share is large. Across the 23 retailers, 40% of product pages state material in label-and-value form without putting it in structured data. That's 53% of all the material values stated. For finish the figure is 56%, for colour 44%, for height 40%. Only the dimensions that are written into titles and sentences, which is most of the width values, would need new content.

One caveat: this figure counts spec blocks and description label lines together. Spec blocks on their own are the surest sign that a database field exists behind the value. I'll report that share separately once I've computed it, and it will be smaller.

## EU product-safety information

The EU General Product Safety Regulation (Regulation (EU) 2023/988, often shortened to GPSR) has applied since 13 December 2024. Among other things, it asks sellers who offer products online to show who made the product, with a postal and an electronic address. If the maker is outside the EU, they should also show a responsible person inside the EU.

I only recorded whether these details are visible on the sampled product pages. This is not a legal assessment. The details may be published elsewhere on the site, some products may be exempt, and I didn't check whether what's shown is correct.

| Retailer | EU responsible person | Manufacturer name and address |
| --- | --- | --- |
| Leroy Merlin | shown on 18 of 25 pages; "not available" on 7 | not shown separately |
| OBI | not shown | 22 of 25 pages ("Dati del produttore") |
| Tecnomat | "not available" on 13 of 25 pages | 13 of 25 pages ("Elementi di conformità del prodotto") |

The other 20 retailers show neither on the sampled pages. The three that do are all large DIY chains, and two of them sometimes fill the field with "not available". In other words, the template for the information is in place, but the data behind it isn't.

## Copied identifiers

Products carry several kinds of code, and they do different jobs:

- The **SKU** is the shop's own internal code. It's only meaningful inside that shop.
- The **manufacturer part number (MPN)** is the code the maker uses. It lets other systems recognise the same product across different shops.
- The **GTIN** is the number under the barcode. It's the most widely used identifier for matching a product across shops.

At 8 retailers (Arredobagno360, Bagnodistile, Ceramikeshop, Dwelli, IKEA, InBagno, Mondo Convenienza and Tecnomat), the MPN field repeats the shop's own SKU on every sampled page, and at Mondialshop it does so on 19 of 25. At Arcshop the MPN repeats the GTIN on every page.

This is more troublesome than a missing field. A missing MPN is easy to notice. A copied one isn't: every automated completeness check, from a product-feed validator to a data-quality dashboard, sees the field as filled in. It looks complete, but it carries no extra information, so any system that relies on it to match a product to the maker's catalogue gets a shop-specific code instead.

**Barcode numbers (GTIN).** The last digit of a GTIN is a check digit, calculated from the others, so a mistyped number can be detected. Every GTIN I found passed that check. The problem is that many retailers don't show one at all.

| GTIN on the sampled pages | Retailers |
| --- | --- |
| on 90% of pages or more (7) | Arcshop, Bagnodistile, Idro-Bric, InBagno, Leroy Merlin, OBI, ShopBagno |
| on some pages (5) | Ceramikeshop 52%, Paramashop 42%, Termoidraulica RV 32%, Mondialshop 24%, Jo-Bagno 12% |
| on none (11) | Arredobagno360, Bagnity, Bertani, Boleco, Deghi, Dwelli, IKEA, Iperceramica, Jysk, Mondo Convenienza, Tecnomat |

## Two retailers up close

**Mondo Convenienza: a full datasheet, entirely in prose.** Its pages give the product's size in a single line of text, for example "VENERE DIVANO LETTO ANGOLARE CON PENISOLA SINISTRA L.290 P.170 H.99" ([page](https://www.mondoconv.it/venere-vtnh.html)). Width is stated on 22 of 25 sampled pages (88%, 95% interval 70–96%), height on 23 (92%, 75–98%) and colour on 19 (76%, 57–89%). None of it appears in a spec table or in structured data. A shopper reads it at a glance; software has to work out the Italian shorthand to find it. Note that the sample is drawn from the whole catalogue, so it's mostly furniture rather than bathroom products.

**IKEA: the closest to machine-readable.** IKEA publishes material as structured data on 18 of 25 sampled pages (72%, 95% interval 52–86%) and colour on 19 (76%, 57–89%). It's one of only two retailers whose structured data includes material at all.

## What this means for AI shopping agents

The information buyers need is mostly there, but in a form built for human readers. Search engines and shopping agents usually narrow a catalogue using structured attributes first ("MDF, white, at most 60 cm wide"). An attribute that exists only lower on the ladder is invisible to that first filter; it can only be found by opening and reading each page.

For a large part of the gap, the fix is to map fields the retailer already has into schema.org, not to write new content. The product-safety and identifier gaps are a different kind of problem: there, the information is either missing or replaced by a placeholder.

It's just as important to be clear about **what these findings don't show**:

- **They don't show that agents fail yet.** An agent that reads the whole page can understand prose. Whether the missing structure actually leads to wrong answers for buyers is the question for the next part of the study, in which an AI agent searches these retailers with real buyer requests.
- **They don't cover private feeds.** Many retailers send product data directly to Google Merchant Center or to marketplaces, and those feeds aren't public. I did check the public product endpoints that Shopify and WooCommerce shops expose, for four retailers (5 pages each). They were no richer than the pages: they return identifiers, weight, brand and product type, plus dimensions at the two WooCommerce shops, but no material or colour. Some of the values are placeholders: 5.0 kg on three unrelated ShopBagno products, 0 kg at Jo-Bagno.
- **They don't check whether values are correct.** A stated material may be wrong. I only recorded whether it's there, and where.

## How I did it

1. **Choosing retailers.** I listed 27 Italian online retailers that sell bathroom products: bathroom specialists, plumbing and heating distributors, DIY chains and home-furnishing chains. 23 of them could be measured. Amazon, for example, has no public sitemap, and another site blocked automated access.
2. **Sampling pages.** Most sites publish a *sitemap*, a list of all their pages for search engines. From each retailer's sitemaps I picked 25 product pages at random, checked that each was a single product and not a category listing, and saved them. I collected the pages between 30 September and 3 October 2026 with a standard Chrome browser, following each site's robots.txt (the file in which a site says what automated visitors may access).
3. **Reading the structured parts.** Code read the structured data, the spec blocks and the label lines of each page. It mapped labels such as "Materiale" or "Larghezza" to standard attributes, and removed prices, shipping notes and menu text.
4. **Reading the prose.** A language model running on my own machine (Qwen 2.5, 32B) read each page's title and description and reported any attribute the rules had missed, together with the exact quote it came from. I kept a value only if that quote appears word for word on the page and actually contains the value. This prevents the model from inventing values.
5. **Checking the model.** I checked two random samples of 50 prose values each by hand. **82% were correct, or 88%** if borderline cases are counted. Most errors attach a component's value to the whole product (a hose length to a shower kit, for instance) or take the brand of toilet a seat fits as the seat's own brand.

All figures are the share of each retailer's 25 pages, averaged across the 23 retailers, with each retailer counting equally regardless of size.

**How precise a single retailer's figure is.** 25 pages give a rough measure, not an exact one. If a retailer scores 60%, its true figure could be anywhere from about 41% to 77% (that's what a 95% interval means). Because a sample can include several variants of the same product series, the real uncertainty is wider still. For that reason I only name individual retailers when the difference is large, and I give the interval when I do.

<div class="post-image">
<img src="/static/assets/images/blog/agentic_ecom_2/material_stated_most_page.webp" alt="Dot plot of the share of pages stating material for each of 23 retailers with 95% intervals; most intervals overlap, Mondo Convenienza is lowest at 2 of 25" />
<p class="post-image-caption">Material stated, per retailer, with 95% intervals · diamonds: material in schema.org (Bagnity, IKEA)</p>
</div>

The chart shows why. Most retailers' intervals overlap, so the data can separate the retailers that state material on nearly every page from the few that rarely do, but not much in between.

## Limitations

- **Whole catalogues, not only bathroom products.** Pages were drawn from each retailer's full sitemap. For generalists such as IKEA, Jysk and Mondo Convenienza, the sample includes furniture and textiles.
- **25 pages per retailer.** A single retailer's figure has a 95% interval of up to about ±20 points, and wider when the sample includes several variants of one product series.
- **"Stated" is a lower bound.** The language model misses some values, so the true share of stated attributes is probably a little higher.
- **The prose reading is about 82–88% precise.** Its errors overstate "stated" by roughly 3 percentage points. The machine-readable figures don't use the model and aren't affected.
- **The mapping figure combines two steps.** Spec blocks and description label lines are counted together; the spec-block share on its own is still to be computed.
- **Each retailer counts equally.** The averages don't reflect catalogue size or sales.
- **A snapshot.** Pages were collected between 30 September and 3 October 2026, and retailers change their pages often.
- **Four retailers excluded.** Amazon, ManoMano, Idrocentro and KVStore could not be measured.
- **Some Termoidraulica pages aren't in Italian.** Its sample includes pages from its English and French subdomains, which my language filter missed. I'll rerun its figures on Italian pages only.