---
title: SciData Hub
summary: The data behind the papers. 30+ scientific datasets and 12 ontologies on Hugging Face — queryable in SQL, loadable in Python, joinable across domains. Zero downloads, zero API keys.
status: live
date: 2025-present
role: Solo developer
client: Impossible Papers
services:
  - pipelines
  - knowledge
image: /static/assets/images/projects/scidata-hub/desktop_cover.webp
pattern: lr-pattern-dots
technologies:
  - Python
  - Hugging Face
  - Parquet
  - DuckDB
  - MCP
live_link: https://huggingface.co/scidata-hub
github_link:
accent: hatch-data
related_posts:

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: The Problem
    content: |
      <p>Every scientist who's tried to test a hypothesis across two datasets knows
      the ritual: hunt down the archive, read the API docs, write the pagination code,
      fight the rate limiter, clean the format, realize the other dataset uses different
      column names, write a coordinate matcher. Do this for every source, every project,
      every domain. The plumbing takes longer than the science.</p>
      <p>SciData Hub ends the ritual. Cleaned, versioned, Parquet-backed datasets on
      Hugging Face — one line to load, one SQL query to join, one search to discover.
      From galaxy rotation curves to dark matter exclusion limits to elliptic curve
      databases to medical ontologies. The data behind the papers, ready to use.</p>

  # ── 2. METRICS ──
  - type: metrics
    items:
      - value: "30+"
        label: Datasets live on HF
      - value: "12"
        label: Ontologies with synonyms
      - value: "3M+"
        label: Elliptic curves (Cremona)
      - value: "236K"
        label: MeSH synonyms for entity resolution

  # ── 3. FOUR WAYS IN ──
  - type: split
    title: One Door, Four Ways In
    content: |
      <p><strong>Hugging Face Parquet</strong> — every dataset under the
      <code>scidata-hub</code> org. Versioned, streamable, free.
      <code>load_dataset("scidata-hub/sparc-rotation-curves")</code> and you're working.</p>
      <p><strong>DuckDB over HTTP</strong> — SQL against remote Parquet. No download,
      no install beyond <code>pip install duckdb</code>. Join galaxy properties with
      rotation curves in one query, from a terminal, a notebook, or a script in any language.</p>
      <p><strong>Python library</strong> (coming) — unified <code>load()</code>,
      <code>query()</code>, <code>discover()</code>, <code>join()</code> across cached
      and live sources.</p>
      <p><strong>MCP server</strong> (coming) — LLM research agents discover, query,
      and join datasets through tools. No hand-written API code per hypothesis.</p>
    image: /static/assets/images/projects/scidata-hub/desktop_cover.webp
    caption: |
      Scidata Hub home
    reverse: false

  
  # ── 9. METHODOLOGY ──
  - type: methodology
    title: Push one, prove the abstraction, scale
    content: |
      <p>Started with a single rotation curve dataset and a question: can Hugging Face + DuckDB replace forty bespoke API integrations? Proved the pattern with SPARC, then scaled to dark matter, number theory, and ontologies — one push script per source, each live before the next.</p>
    detail_label: Process & decisions
    case_study:
      problem: |
        <p>Impossible Papers' simulation agents needed data from 40+ public sources — galaxy rotation curves, detector event rates, elliptic curve databases, biomedical ontologies. Every new hypothesis domain meant writing bespoke API code: pagination, rate limiting, auth, format conversion. The agent spent more tokens on plumbing than on science. Cross-domain joins (match a galaxy across SPARC and SDSS by coordinates, or resolve a paper term against MeSH and HPO simultaneously) were effectively impossible without manual integration per pair.</p>
      role: |
        <p>Solo developer: chose the architecture, wrote every push script, parsed every format (MRT, OBO, OWL, Manchester Notation, NLM XML, SKOS CSV, space-delimited fixed-width), debugged every PyArrow overflow, and curated 12 ontologies with full synonym support.</p>
      method: |
        <p>SPARC first (3,391 rows, simple) → ANAIS-112 (per-detector CSVs, medium) → XENON1T (response matrices, complex schemas) → COSINE-100 (15 configs across 3 experiment sets) → Cremona (3M rows, integer overflow edge cases) → 12 ontologies across 5 parser backends. Each dataset live on HF and queryable via DuckDB before starting the next.</p>
      decisions: |
        <p><strong>Hugging Face over S3/self-hosted</strong> — free hosting, dataset viewer, community discovery, versioning. Zero infrastructure to maintain.</p>
        <p><strong>DuckDB httpfs over a custom query API</strong> — stolen from science-datalake. A 274KB <code>.duckdb</code> file with SQL views reads remote Parquet at zero cost. Any language, any notebook, no server.</p>
        <p><strong>config_name over DatasetDict</strong> — HF's DatasetDict requires matching schemas across splits. Scientific datasets never match. Separate configs per table, each with its own schema, solved it.</p>
        <p><strong>Federation over duplication</strong> — MultimodalUniverse has 100TB of astronomy data. OEIS has 392K sequences. science-datalake has 293M papers. Don't re-host. Point DuckDB views at their Parquet, join in the same session.</p>
        <p><strong>Synonyms as a first-class table</strong> — entity resolution lives or dies on synonyms. "Heart rate variability" isn't in MeSH but is in HPO. Without the synonyms table, the resolver misses a large fraction of real mentions.</p>
        <p><strong>Tree numbers for hierarchy gating</strong> — MeSH resolved "methods", "review", "therapeutics" as entities. Adding tree_numbers to the terms table let the resolver gate by branch: V (Publication Types) and L (Information Science) are design space, not real entities. One column eliminated an entire class of junk matches.</p>
        <p><strong>Coefficients as strings</strong> — Cremona's elliptic curve coefficients overflow int64 at high conductors. Store as strings in Parquet, parse on read. PyArrow doesn't negotiate with large integers.</p>
      constraints: |
        <p>No budget, no team, no infrastructure beyond a laptop and free HF hosting. Parser failures on complex OBO files (pronto crashed on UBERON, MONDO, SO, CL) required fallback to obonet. NLM's download server returned 403 on FMA, requiring manual BioPortal download. science-datalake's <code>unified_papers</code> table (293M rows) cannot be scanned over httpfs — ZSTD decompression fails. Only the small mapping tables work remotely.</p>
      outcome: |
        <p>30+ datasets and 12 ontologies live on Hugging Face, queryable in a single DuckDB session over HTTP. SPARC, ANAIS-112, XENON1T, and COSINE-100 form the only unified dark matter direct detection collection on HF. Cremona's 3M elliptic curves are the largest number theory dataset on the platform. MeSH with tree numbers and 236K synonyms powers entity resolution across the full Impossible Papers pipeline. The integration demo joins scidata-hub measurement data with science-datalake's 293M-paper bibliometrics in one script, zero downloads.</p>
      lessons: |
        <p>The abstraction held: one push script per source format, three Parquet tables per ontology, DuckDB views over httpfs for everything. The value wasn't in the Python library (not yet built) or the MCP server (not yet built) — it was in getting the data cleaned and on HF where anyone can reach it. Ship the data first. Build the API when the data proves it's worth wrapping.</p>
      metrics:
        - label: Datasets live
          before: "0 (bespoke API calls)"
          after: "30+"
        - label: Ontology synonym coverage
          before: "Term names only"
          after: "236K synonyms"
        - label: Cross-domain query setup
          before: "Days per source"
          after: "One SQL session"
        - label: Parser backends
          before: "—"
          after: "5 (pronto, obonet, XML, OWL, regex)"
 

  # ── 4. LIVE DATASETS ──
  - type: split
    title: What's Live Right Now
    content: |
      <p><strong>Astrophysics & Dark Matter</strong></p>
      <ul>
        <li><strong>SPARC</strong> — 175 galaxies, 3,391 rotation curve data points (Lelli+ 2016)</li>
        <li><strong>ANAIS-112</strong> — 6-year dark matter modulation search. 9 NaI detectors, 3 energy ranges, event rates + efficiency + simulated backgrounds + live time</li>
        <li><strong>XENON1T S2-only</strong> — response matrices (NR, ER, electron), events, backgrounds, 10 exclusion limit curves</li>
        <li><strong>COSINE-100</strong> — WIMP extraction (SET2), modulation analysis (SET3), DAMA comparison simulations. 15 configs</li>
      </ul>
      <p><strong>Number Theory</strong></p>
      <ul>
        <li><strong>Cremona ECDB</strong> — 3,064,705 elliptic curves up to conductor 500,000. Curves, BSD data (L-ratio, regulator, analytic Sha), generators, modular degrees, isogeny matrices, big Sha</li>
      </ul>
    image: /static/assets/images/projects/scidata-hub/viz_structure.webp
    caption: |
      The layer
    reverse: true

  # ── 5. ONTOLOGIES ──
  - type: split
    title: 12 Ontologies, Full Synonym Support
    content: |
      <p>Every ontology ships with three Parquet tables — terms, relationships, and synonyms.
      Entity resolution searches names <em>and</em> synonyms, so "HRV" finds
      <code>HP:0031860</code> (Abnormal heart rate variability) even though MeSH doesn't
      have a dedicated term for it.</p>
    badges:
      - name: MeSH
        detail: 31K medical terms, 236K synonyms, tree numbers for hierarchy gating
      - name: Gene Ontology
        detail: 47K biological process/function/component terms
      - name: ChEBI
        detail: 175K chemical entities
      - name: HPO
        detail: 20K human phenotypes (the one that catches what MeSH misses)
      - name: DOID
        detail: 15K diseases
      - name: UBERON
        detail: 24K anatomy terms
      - name: MONDO
        detail: 45K disease terms (cross-ontology)
      - name: GO
        detail: Gene Ontology
      - name: FMA
        detail: 80K foundational anatomy terms
      - name: SO
        detail: Sequence Ontology (genomic features)
      - name: CL
        detail: Cell Ontology
      - name: CSO
        detail: 14K computer science topics
      - name: OntoMathPro
        detail: mathematical concepts, bilingual EN/RU
      - name: MP
        detail: Mammalian Phenotype Ontology
      - name: ENVO
        detail: Enviroment Ontology
      - name: NBO
        detail: Neuro Behavior Ontology
      - name: PATO
        detail: Phenotype and Trait Ontology
      - name: PO
        detail: Plant Ontology
      
    reverse: false

  # ── 6. CODE ──
  - type: code
    title: Query Across Domains in One Session
    filename: scidata_duckdb.sql
    content: |
      -- No download. No API key. Just DuckDB + httpfs.

      -- Galaxy rotation curves
      SELECT galaxy, radius_kpc, Vobs_km_s
      FROM read_parquet(
        'hf://datasets/scidata-hub/sparc-rotation-curves/data/train-*.parquet'
      ) WHERE galaxy = 'DDO154';

      -- Ontology lookup with synonyms
      SELECT term_id, synonym, scope
      FROM read_parquet(
        'hf://datasets/scidata-hub/ontology-hpo/synonyms/train-*.parquet'
      ) WHERE lower(synonym) LIKE '%heart rate variab%';

      -- Elliptic curves with non-trivial Sha
      SELECT conductor, iso_class, rank, analytic_sha
      FROM read_parquet(
        'hf://datasets/scidata-hub/cremona-ecdb/bsd/train-*.parquet'
      ) WHERE analytic_sha > 1
      ORDER BY conductor LIMIT 20;

  # ── 7. FEDERATION ──
  - type: split
    title: Federation, Not Duplication
    content: |
      <p>SciData Hub doesn't re-host what others maintain.
      <a href="https://huggingface.co/MultimodalUniverse">MultimodalUniverse</a>
      hosts 24 astronomical surveys (JWST, DESI, TESS) at 100TB+.
      <a href="https://huggingface.co/datasets/J0nasW/science-datalake">science-datalake</a>
      maps 293M papers to ontology terms.
      <a href="https://huggingface.co/datasets/christopher/oeis">OEIS</a> has 392K
      integer sequences.
      <a href="https://huggingface.co/datasets/facebook/principia-collection">Principia</a>
      has 554K math/physics problems tagged with MSC2020 and PhySH.</p>
      <p>They stay where they are. SciData Hub's DuckDB views and join layer route to
      them, making them queryable and joinable alongside our own data — in the same
      SQL session, over the same httpfs connection. Federate, don't duplicate.</p>
    image: /static/assets/images/projects/scidata-hub/datalake.webp
    caption: |
      The Datalake on Hugging Face
    reverse: true

  - type: callout
    title: Growing every week
    content: |
      <p>Next on the roadmap: WESAD wearable stress data, Odlyzko zeta zeros,
      Rfam RNA families, and NHANES health surveys. Each new source follows the
      same pattern — one push script, one DuckDB view, discoverable from day one.
      Working on a dataset that belongs here? Get in touch.</p>
    button: Get in touch
---