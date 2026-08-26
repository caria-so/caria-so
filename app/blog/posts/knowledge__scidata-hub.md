---
title: "I put 30 scientific datasets on Hugging Face so you don't have to write another API wrapper"
date: 2025-06-20
tags: [scidata-hub, datasets, hugging-face, duckdb]
keywords: [scientific datasets, open data, hugging face, duckdb, parquet, ontologies]
summary: Galaxy rotation curves, dark matter detector results, 3 million elliptic curves, 12 ontologies with full synonym tables. All on Hugging Face. Query them in SQL. Join them across domains. No downloads, no API keys, no pagination code.
thread: tooling
---

Every scientist I know has a folder called something like `data_scripts_FINAL_v3_fixed`. Inside it there are 40 Python files, each one talking to a different API, each one broken in a slightly different way. One has a hardcoded auth token that expired in March, another does pagination but crashes on page 47 because the API changed its response format, a third downloads a 2GB CSV every time you run it because somebody forgot to add caching.

This is the state of scientific data access: all public, sometimes getting to it is more problematic then the research problem.

## What SciData Hub actually is

Something I started for necessity, it's a Hugging Face organization — [huggingface.co/scidata-hub](https://huggingface.co/scidata-hub) — where I've been pushing cleaned, versioned scientific datasets as Parquet files. Right now there are 30+ datasets and many ontologies across astrophysics, dark matter physics, number theory, and biomedicine, chemestry, you name it.

That's it. No platform. No SaaS. No login. Parquet on Hugging Face. You load it however you want.

## How to use it

**If you're a Python person:**

```python
from datasets import load_dataset

sparc = load_dataset("scidata-hub/sparc-rotation-curves")
```

One line. You now have 175 galaxies and 3,391 rotation curve data points from Lelli et al. 2016. In memory, ready to plot, no API call, no rate limiter.

**If you're a SQL person:**

```sql
-- DuckDB + httpfs. No download, no install beyond pip.

SELECT galaxy, radius_kpc, Vobs_km_s
FROM read_parquet(
  'hf://datasets/scidata-hub/sparc-rotation-curves/data/train-*.parquet'
) WHERE galaxy = 'DDO154';
```

That query reads directly from Hugging Face over HTTP. The data never touches your disk unless you want it to. Works from a terminal, a notebook, a script in any language that can shell out to DuckDB.


**If you want to join across domains — and this is where it gets unreasonable:**

```sql
-- What chemicals interact with proteins involved in heart rate regulation?
-- Three datasets, three domains, one query, zero downloads.

SELECT c.name AS chemical, t.name AS phenotype, g.name AS biological_process
FROM read_parquet('hf://datasets/scidata-hub/ontology-chebi/terms/train-*.parquet') c
JOIN read_parquet('hf://datasets/scidata-hub/ontology-hpo/synonyms/train-*.parquet') s
  ON lower(s.synonym) LIKE '%heart rate%'
JOIN read_parquet('hf://datasets/scidata-hub/ontology-go/terms/train-*.parquet') g
  ON g.name LIKE '%cardiac%';
```

Chemistry, phenotypes, and gene ontology in one SQL session from a laptop at 3 AM in your underwear. No institutional access, no collaborator with the right credentials, no six-month data sharing agreement. That's the kind of cross-domain madness I built this for. In the near future I want to wake up, cross-reference solar system orbital data with cardiac physiology and ChEBI molecular interactions — **my chemical wedding, served over HTTP**.

## What's in there so far

**Astrophysics and dark matter** — SPARC rotation curves, ANAIS-112 (six years of dark matter modulation data, nine NaI detectors), XENON1T (response matrices, exclusion limits), COSINE-100 (WIMP extraction, modulation analysis, DAMA comparison simulations). This is the only unified dark matter direct detection collection on Hugging Face as far as I can tell.

**Number theory** — Cremona's Elliptic Curve Database. 3,064,705 curves up to conductor 500,000. BSD data, L-ratios, regulators, analytic Sha, generators, isogeny matrices. The largest number theory dataset on HF. If you're hunting for statistical anomalies in BSD invariants, the data is sitting there waiting.

**Ontologies** — MeSH, Gene Ontology, ChEBI, HPO, DOID, UBERON, MONDO, FMA, SO, CL, CSO, and more. Each one ships as three Parquet tables: terms, relationships, and synonyms. The synonym table is the part nobody else ships and it's the part that makes entity resolution actually work. "Heart rate variability" isn't a MeSH term. But it's an HPO synonym. Without the synonym table, your resolver misses it.

## Why Parquet on Hugging Face

I tried the alternatives. S3 costs money. Self-hosting means maintaining a server. Building a custom API means building a custom API and then maintaining a custom API and then explaining to people how to authenticate with your custom API. I've been in that loop. It ends with you maintaining the explanation of the authentication of the API of the server you're also maintaining.

What I wanted was simple: free hosting, a dataset viewer in the browser, community discovery, versioning, and streaming. Hugging Face gives you all of that. DuckDB reads HF Parquet over HTTP natively. The entire infrastructure is two things that already exist and work well together. The 274KB DuckDB file with SQL views that reads all 30+ datasets? That's the entire backend. No server. No Lambda function. No Kubernetes cluster. A quarter-megabyte file and an HTTP connection. If my laptop catches fire, everything still works.

And frankly — I think Hugging Face is the coolest thing I've seen since maybe Wikipedia.


## What it doesn't do

It doesn't do your analysis, it's just data sitting there waiting to be played with in minutes instead of hours.

It also doesn't re-host what others maintain well. MultimodalUniverse has 100TB of astronomy surveys. science-datalake has 293M papers. OEIS has 392K integer sequences. They stay where they are. 

SciData Hub's DuckDB views point at their Parquet, making them joinable alongside everything else in the same SQL session. Federation, not duplication.

## Why I built it

I am building agents for scientific discoveries. Writing a bespoke API wrapper for each source every time was killing me. SciData Hub was the fix: clean the data once, push it to HF, point DuckDB at it, move on.

But it turned out to be useful on its own. The ontologies with synonym tables are worth the whole project — entity resolution across 12 knowledge domains in one SQL session is something I haven't seen anywhere else in this form.

New datasets go up every week. If you're working with a public dataset that should be in here, [let me know](mailto:hello@caria.so).

[huggingface.co/scidata-hub](https://huggingface.co/scidata-hub)
