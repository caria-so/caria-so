---
title: "Measuring ecommerce readiness II. Preliminary Findings"
thread: ecommerce
keywords: [ecommerce, agentic ai, user experience, usability, home & furniture]
author: "Federico Caria"
date: "2026-10-31"
tags: 
summary: "Italian home and bathroom retailers state most product attributes on their pages, but almost none in a form software can read directly: material appears on 75% of product pages, and in machine-readable markup on 7.5%."
image:
---

I am posting some preliminary findings from of a study titled *Evaluating agentic ecommerce readiness*. Agentic readiness represents the extent to which a retailer's public product information lets a fixed agent identify products satisfying stated constraints, and describe them without asserting unsupported attributes. 

For more information see. 

### Key findings
Italian home and bathroom retailers state most product attributes on their pages, but almost none in a form software can read directly: material appears on 75% of product pages, and in machine-readable markup on 7.5%.

1. **Most attributes are stated.** Across 23 retailers, material appears on 75% of product pages, colour on 62%, and at least one dimension on 70% or more.
2. **Almost none of it is machine-readable.** The same attributes appear in the page's structured data (schema.org) on 7.5%, 11% and about 10% of pages. Only 4 of 23 retailers publish any of them that way.
3. **A large share exists only in prose.** For material, 28 of the 75 points come from ordinary sentences or the product title. One retailer states dimensions on about 90% of its pages, and never in a structured form.
4. **Product identifiers are patchy.** 11 of 23 retailers show no GTIN (barcode number) on the sampled pages. At 8, the "manufacturer part number" field repeats the shop's own SKU.
5. **EU product-safety information is rare.** Only 3 of 23 retailers show the manufacturer or EU contact details that the EU General Product Safety Regulation requires online listings to carry.

### What is measured

For each product attribute, I asked two questions: is it **stated** anywhere on the product page, and is it **machine-readable**, published in the page's schema.org markup that search engines and shopping software read first?

Every attribute found was assigned to the first of four layers where it appears:

| Layer | Where the information sits | Who can read it reliably |
| --- | --- | --- |
| 1. Structured data | schema.org markup in the page code | any software |
| 2. Spec block | a specification table or list of label and value pairs | software that knows the page layout |
| 3. Label lines | lines such as "Materiale: Nobilitato" inside the description | a simple text parser |
| 4. Prose | ordinary sentences, or the product title | a person, or a language model |

"Stated" means found in any layer. "Machine-readable" means layer 1.

**An example.** A wall cabinet at Boleco ([page](https://www.boleco.it/pensili-e-colonne/1799-pensile-bagno-diadema-cm-30x75.html)) publishes its SKU, price and availability as structured data. Its colour sits in a spec list ("Colori: PERLA SPATOLATO"), and its material in a description line ("Materiale: Nobilitato"). The material is clearly stated, but software reading only the structured data never sees it.

## How I did it
1. **Retailers.** I listed 27 Italian online retailers that sell bathroom products: bathroom specialists, plumbing and heating distributors, DIY chains and home-furnishing chains. 23 could be measured, for example Amazon has no public sitemap, another site blocked automated access, etc. 
2. **Pages.** From each retailer's public sitemaps I drew 25 product pages at random, checked that each was a single-product page and not a category listing, and saved them. Pages were collected between 30 September and 3 October 2026 with a standard Chrome browser, respecting each site's robots.txt.
3. **Rule-based extraction.** Code read the structured data, the spec blocks and the label lines of each page. It mapped labels such as "Materiale" or "Larghezza" to standard attributes, and removed prices, shipping notes and menu text.
4. **Prose extraction.** A language model running locally (Qwen 2.5, 32B) read each page's title and description and reported any attribute the rules had missed, with an exact quote. A value was kept only if its quote appears word for word on the page and contains the value.
5. **Checking.** Two hand-checked random samples of 50 prose values each showed **82% correct, 88%** counting borderline cases. Most errors attach a component's value to the product (a hose length to a shower kit) or name the toilet a seat is compatible with as its brand.

Figures are shares of each retailer's 25 pages, averaged across the 23 retailers with equal weight.

## Results

The gap between what retailers state and what software can read is between 50 and 70 percentage points for every core attribute.

| Attribute | Stated on the page | Machine-readable | Stated only in prose or the title |
| --- | --- | --- | --- |
| Material | 75% | 7.5% | 28% |
| Colour | 62% | 11% | 23% |
| Any dimension | 70% or more | about 10% | not computed |

<div class="post-image">
<img src="/static/assets/images/blog/agentic-ecom__viz_1.png" alt="Material is stated on most pages; 2 of 23 retailers make it machine-readable" />
<p class="post-image-caption">23 retailers, 25 sampled product pages each (Boleco 23, Paramashop 24, Idro-Bric 15) · collected 30 Sep–3 Oct 2026</p>
</div>

Material makes the pattern plain. Only Bagnity and IKEA publish it as structured data. Colour and dimensions follow the same shape: IKEA, Jysk, OBI and, for dimensions, ShopBagno are the only retailers that put them in schema.org at all.

## Two retailers up close

**Mondo Convenienza: a full datasheet, entirely in prose.** Its pages carry the product's size in a single line of text, for example "VENERE DIVANO LETTO ANGOLARE CON PENISOLA SINISTRA L.290 P.170 H.99" ([page](https://www.mondoconv.it/venere-vtnh.html)). Width, depth and height are all there, on about 90% of pages, and colour on 76%. None of it appears in a spec table or in structured data. A shopper reads it at a glance; software has to parse the Italian shorthand L, P and H to find it.

**IKEA: the closest to machine-readable.** IKEA publishes material on 72% of sampled pages and colour on 76% as structured data, and states width on 96% of pages. It is one of only two retailers whose structured data carries material at all.

## Identifiers and EU product-safety information

**GTIN.** A GTIN (the barcode number) is the identifier other systems use to match a product across shops. Every GTIN found passed its check digit.

| GTIN on the sampled pages | Retailers |
| --- | --- |
| on 90% of pages or more (7) | Arcshop, Bagnodistile, Idro-Bric, InBagno, Leroy Merlin, OBI, ShopBagno |
| on some pages (5) | Ceramikeshop 52%, Paramashop 42%, Termoidraulica RV 32%, Mondialshop 24%, Jo-Bagno 12% |
| on none (11) | Arredobagno360, Bagnity, Bertani, Boleco, Deghi, Dwelli, IKEA, Iperceramica, Jysk, Mondo Convenienza, Tecnomat |

The "manufacturer part number" field is often a copy. At 8 retailers it repeats the shop's own SKU on every sampled page, and at Arcshop it repeats the GTIN. A copied field looks complete to software but adds no information.

**EU product-safety information.** The EU General Product Safety Regulation asks online sellers to show who made a product and, where the maker is outside the EU, a responsible person in the EU. Irecorded only whether such details are visible on the product page; this is not a legal assessment.

| Retailer | EU responsible person | Manufacturer name and address |
| --- | --- | --- |
| Leroy Merlin | shown on 18 of 25 pages; "not available" on 7 | not shown separately |
| OBI | not shown | 22 of 25 pages ("Dati del produttore") |
| Tecnomat | "not available" on 13 of 25 pages | 13 of 25 pages |

The other 20 retailers show neither on the sampled pages.

## What this means for AI shopping agents

The information buyers need is mostly there, but in a form built for human readers. Search engines and shopping agents narrow a catalogue with structured attributes first ("MDF, white, at most 60 cm wide"). An attribute that exists only in a description line or a sentence is invisible to that filtering; it can only be found by opening and reading each page.

The fix is unusually cheap. Most retailers already hold these attributes in their own spec fields, so exposing them in schema.org is just some mapping work rather than new content.

**What the findings do not show:**

- **They do not show that agents fail yet.** An agent that reads the full page can understand prose. Whether the missing structure actually costs buyers correct answers is the question of my next study, in which AI agents search these retailers for real buyer requests.
- **They do not cover private feeds.** Feeds that retailers send to Google Merchant Center or to marketplaces are not public. The public product endpoints are no richer than the pages: for four retailers on Shopify or WooCommerce (5 pages each), they return identifiers, weight, brand and product type, plus dimensions at the two WooCommerce shops, but no material or colour. Some of their values are placeholders: 5.0 kg on three unrelated ShopBagno products, 0 kg at Jo-Bagno.
- **They do not check whether values are correct.** A stated material may be wrong; Irecorded only whether it is there and where.

## Limitations

- **Whole catalogues, not only bathroom products.** Pages were drawn from each retailer's full sitemap. For generalists such as IKEA, Jysk and Mondo Convenienza, the sample includes furniture and textiles.
- **25 pages per retailer** Random samples can include several variants of one product series, so a retailer's figure can partly reflect one series.
- **"Stated" is a lower bound.** The language model misses some values, and "any dimension" takes the highest of the individual dimensions rather than combining them.
- **The prose layer is about 82–88% precise.** Its errors overstate "stated" by roughly 3 percentage points; the machine-readable figures do not use the model and are unaffected.
- **Equal weight per retailer.** The averages do not reflect catalogue size or sales.
- **A snapshot.** Pages were collected between 30 September and 3 October 2026; retailers change their pages often.
- **Four retailers excluded.** Amazon, ManoMano, Idrocentro and KVStore could not be measured, for the reasons given above.
- Some Termoidraulica pages are not Italian. Its sample includes pages from its English and French subdomains, which the language filter missed; its figures will be rerun on Italian pages only.
