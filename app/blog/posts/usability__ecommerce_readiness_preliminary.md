---
title: "Evaluating agentic ecommerce readiness II. Preliminary Findings"
thread: ecommerce
keywords: [ecommerce, agentic ai, user experience, usability, home & furniture, schema.org, GPSR]
author: "Federico Caria"
date: "2026-10-31"
tags: 
summary: "Italian home and bathroom retailers state most product attributes, but one to three steps below where software reads. For material, half of what is stated already sits in label-and-value form and only needs mapping into structured data."
image:
---

These are preliminary findings from a study titled [Evaluating agentic ecommerce readiness](https://caria.so/post/usability__ecommerce_readiness_method). Agentic readiness is the extent to which a retailer's public product information lets a fixed agent find products that meet a buyer's stated constraints, and describe them without claiming things the page does not support.

Before any agent runs, one thing is already visible: where on the page the product information sits. I sorted every attribute I found onto a four-step ladder of readability, from structured data that any software reads, down to ordinary sentences that only a person or a language model can read. Across 23 Italian home and bathroom retailers, most attributes are stated, and most sit one to three steps below where filtering software looks.

## The readability ladder

Every attribute found was assigned to the highest step where it appears:

| Step | Where the information sits | Who can read it reliably |
| --- | --- | --- |
| 1. Structured data | schema.org markup in the page code | any software |
| 2. Spec block | a specification table or list of label and value pairs | software that knows the page layout |
| 3. Label lines | lines such as "Materiale: Nobilitato" inside the description | a simple text parser |
| 4. Prose | ordinary sentences, or the product title | a person, or a language model |

"Stated" means found on any step. "Machine-readable" means step 1.

**An example.** A wall cabinet at Boleco ([page](https://www.boleco.it/pensili-e-colonne/1799-pensile-bagno-diadema-cm-30x75.html)) publishes its SKU, price and availability as structured data (step 1). Its colour sits in a spec list, "Colori: PERLA SPATOLATO" (step 2), and its material in a description line, "Materiale: Nobilitato" (step 3). The material is clearly stated, but software reading only the structured data never sees it.

## Key findings

1. **Most attributes are stated, few are machine-readable.** Material appears on 75% of sampled product pages and in structured data on 7.5%. Colour: 62% and 11%. Width: 58% and 7%. Only 5 of 23 retailers publish any of these attributes as structured data.
2. **Much of the gap is a mapping job, not a content job.** Of the material values retailers state, 53% already sit in a spec block or a "Label: value" line but are missing from structured data. Only 10% are machine-readable, and 37% exist only in prose or the title. For colour the split is 18%, 44% and 38%.
3. **EU product-safety details are almost absent.** Only 3 of 23 retailers show the manufacturer or EU responsible-person details on their product pages, a year after the EU General Product Safety Regulation began to apply.
4. **Identifier fields are often copies.** At 8 retailers the "manufacturer part number" repeats the shop's own SKU on every sampled page; at one it repeats the barcode number. Every automated completeness check scores such a field as present.
5. **Barcode numbers are patchy.** 11 of 23 retailers show no GTIN on the sampled pages. Every GTIN found passed its check digit.

## How I did it

1. **Retailers.** I listed 27 Italian online retailers that sell bathroom products: bathroom specialists, plumbing and heating distributors, DIY chains and home-furnishing chains. 23 could be measured; Amazon, for example, has no public sitemap, and another site blocked automated access.
2. **Pages.** From each retailer's public sitemaps I drew 25 product pages at random, checked that each was a single-product page and not a category listing, and saved them. Pages were collected between 30 September and 3 October 2026 with a standard Chrome browser, respecting each site's robots.txt.
3. **Rule-based extraction.** Code read the structured data, the spec blocks and the label lines of each page. It mapped labels such as "Materiale" or "Larghezza" to standard attributes, and removed prices, shipping notes and menu text.
4. **Prose extraction.** A language model running locally (Qwen 2.5, 32B) read each page's title and description and reported any attribute the rules had missed, with an exact quote. A value was kept only if its quote appears word for word on the page and contains the value.
5. **Checking.** Two hand-checked random samples of 50 prose values each showed **82% correct, 88%** counting borderline cases. Most errors attach a component's value to the product (a hose length to a shower kit) or name the toilet a seat is compatible with as its brand.

Figures are shares of each retailer's 25 pages, averaged across the 23 retailers with equal weight.

**How precise a single retailer's figure is.** 25 pages give a rough measure. A retailer at 60% could truly be anywhere from about 41% to 77% (a 95% interval), and because a sample can hold several variants of one product series, the real uncertainty is wider still. So I name individual retailers only where the difference is large, and give the interval when I do.

<div class="post-image">
<img src="/static/assets/images/blog/agentic-ecom__viz_material_retailers.png" alt="Dot plot of the share of pages stating material for each of 23 retailers with 95% intervals; most intervals overlap, Mondo Convenienza is lowest at 2 of 25" />
<p class="post-image-caption">Material stated, per retailer, with 95% intervals · diamonds: material in schema.org (Bagnity, IKEA)</p>
</div>

Most intervals overlap. The chart separates the retailers that state material on nearly every page from the few that rarely do, and little in between.

## Results

The gap between what retailers state and what software can read is between 30 and 70 percentage points for every core attribute.

<div class="post-image">
<img src="/static/assets/images/blog/agentic-ecom__viz_ladder.png" alt="Stacked bars for material, colour, width, height, finish and depth: machine-readable share is 0.3 to 11 percent of pages; label-and-value not mapped 10 to 40 percent; prose only 22 to 37 percent; the rest not stated" />
<p class="post-image-caption">Share of sampled product pages by the highest step where each attribute appears · 23 retailers, 25 pages each (Boleco 23, Paramashop 24, Idro-Bric 15) · collected 30 Sep–3 Oct 2026</p>
</div>

Each page counts once per attribute, on the highest step where that attribute appears.

Material makes the pattern plain. Only Bagnity and IKEA publish it as structured data. Colour follows the same shape: only Bagnity, IKEA, Jysk and OBI put it in schema.org. For dimensions it is IKEA, Jysk, OBI and ShopBagno, with OBI the one retailer that publishes width, height and depth as structured data on almost every sampled page. Overall, dimensions sit lower on the ladder than material or colour: most width values are in prose or the title, where sizes are written as shorthand such as "L.290 P.170 H.99".

## The cheap fix, measured

If a value already sits in a spec table or a "Label: value" line, the retailer has it in a field somewhere. Exposing it in structured data is mapping work, not new content.

That share is large. Across the 23 retailers, 40% of product pages state material in label-and-value form without putting it in structured data; that is 53% of all the material values stated. For finish it is 56%, for colour 44%, for height 40%. Only dimensions written into titles and sentences, most of the width values, would need new content.

This figure counts spec blocks and description label lines together. Spec blocks alone, where the value almost certainly comes from a product database field, will be reported once the page-level split is computed; it will be smaller.

## EU product-safety information

The EU General Product Safety Regulation (Regulation (EU) 2023/988) has applied since 13 December 2024. Among other things, it asks sellers offering products online to show who made a product, with a postal and electronic address, and, where the maker is outside the EU, a responsible person in the EU.

I recorded only whether such details are visible on the sampled product pages. This is not a legal assessment: the details may sit elsewhere, some products may be exempt, and I did not check whether what is shown is correct.

| Retailer | EU responsible person | Manufacturer name and address |
| --- | --- | --- |
| Leroy Merlin | shown on 18 of 25 pages; "not available" on 7 | not shown separately |
| OBI | not shown | 22 of 25 pages ("Dati del produttore") |
| Tecnomat | "not available" on 13 of 25 pages | 13 of 25 pages ("Elementi di conformità del prodotto") |

The other 20 retailers show neither on the sampled pages. The three that do are all large DIY chains, and two of them sometimes fill the field with "not available": the template is there, the data is not.

## Copied identifiers

A "manufacturer part number" (MPN) should identify the product as its maker knows it, so that other systems can match it across shops. At 8 retailers (Arredobagno360, Bagnodistile, Ceramikeshop, Dwelli, IKEA, InBagno, Mondo Convenienza and Tecnomat) the MPN repeats the shop's own SKU on every sampled page, and at Mondialshop on 19 of 25. At Arcshop it repeats the GTIN on every page.

This matters more than a missing field. A missing MPN is easy to spot. A copied one passes: every automated completeness check, from a feed validator to a data-quality dashboard, scores the field as present. It looks complete and carries no extra information, so any system that relies on it to match a product to the maker's catalogue gets a shop-specific code instead.

**GTIN.** A GTIN (the barcode number) is the identifier other systems use to match a product across shops. Every GTIN found passed its check digit.

| GTIN on the sampled pages | Retailers |
| --- | --- |
| on 90% of pages or more (7) | Arcshop, Bagnodistile, Idro-Bric, InBagno, Leroy Merlin, OBI, ShopBagno |
| on some pages (5) | Ceramikeshop 52%, Paramashop 42%, Termoidraulica RV 32%, Mondialshop 24%, Jo-Bagno 12% |
| on none (11) | Arredobagno360, Bagnity, Bertani, Boleco, Deghi, Dwelli, IKEA, Iperceramica, Jysk, Mondo Convenienza, Tecnomat |

## Two retailers up close

**Mondo Convenienza: a full datasheet, entirely in prose.** Its pages carry the product's size in a single line of text, for example "VENERE DIVANO LETTO ANGOLARE CON PENISOLA SINISTRA L.290 P.170 H.99" ([page](https://www.mondoconv.it/venere-vtnh.html)). Width is stated on 22 of 25 sampled pages (88%, 95% interval 70–96%), height on 23 (92%, 75–98%), colour on 19 (76%, 57–89%). None of it appears in a spec table or in structured data. A shopper reads it at a glance; software has to parse the Italian shorthand L, P and H to find it. The sample is drawn from the whole catalogue, so it is mostly furniture, not bathroom products.

**IKEA: the closest to machine-readable.** IKEA publishes material as structured data on 18 of 25 sampled pages (72%, 95% interval 52–86%) and colour on 19 (76%, 57–89%). It is one of only two retailers whose structured data carries material at all.

## What this means for AI shopping agents

The information buyers need is mostly there, but in a form built for human readers. Search engines and shopping agents narrow a catalogue with structured attributes first ("MDF, white, at most 60 cm wide"). An attribute that exists only lower on the ladder is invisible to that filtering; it can only be found by opening and reading each page.

For a large share of it, the fix is mapping existing fields into schema.org rather than writing new content. The product-safety and identifier gaps are different: there, the information is either missing or a placeholder.

**What the findings do not show:**

- **They do not show that agents fail yet.** An agent that reads the full page can understand prose. Whether the missing structure actually costs buyers correct answers is the question of the next part of the study, in which an AI agent searches these retailers for real buyer requests.
- **They do not cover private feeds.** Feeds that retailers send to Google Merchant Center or to marketplaces are not public. The public product endpoints are no richer than the pages: for four retailers on Shopify or WooCommerce (5 pages each), they return identifiers, weight, brand and product type, plus dimensions at the two WooCommerce shops, but no material or colour. Some of their values are placeholders: 5.0 kg on three unrelated ShopBagno products, 0 kg at Jo-Bagno.
- **They do not check whether values are correct.** A stated material may be wrong; I recorded only whether it is there and where.

## Limitations

- **Whole catalogues, not only bathroom products.** Pages were drawn from each retailer's full sitemap. For generalists such as IKEA, Jysk and Mondo Convenienza, the sample includes furniture and textiles.
- **25 pages per retailer.** A single retailer's figure has a 95% interval up to about ±20 points, wider when the sample holds several variants of one product series.
- **"Stated" is a lower bound.** The language model misses some values.
- **The prose layer is about 82–88% precise.** Its errors overstate "stated" by roughly 3 percentage points; the machine-readable figures do not use the model and are unaffected.
- **The mapping figure combines two steps.** Spec blocks and description label lines are counted together; the spec-block share alone is still to be computed.
- **Equal weight per retailer.** The averages do not reflect catalogue size or sales.
- **A snapshot.** Pages were collected between 30 September and 3 October 2026; retailers change their pages often.
- **Four retailers excluded.** Amazon, ManoMano, Idrocentro and KVStore could not be measured, for the reasons given above.
- **Some Termoidraulica pages are not Italian.** Its sample includes pages from its English and French subdomains, which the language filter missed; its figures will be rerun on Italian pages only.