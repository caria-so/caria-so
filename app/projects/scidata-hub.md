---
title: SciData Hub
summary: Cleaned, versioned copies of 30+ scientific datasets and 12 ontologies on Hugging Face, so they can be queried in SQL or loaded in Python without writing a new API client each time. Built as infrastructure for Impossible Papers, open to anyone.
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
      <p>Anyone who has tried to test an idea against two datasets from different fields
      knows how much of the work happens before the analysis starts: finding the archive,
      reading its documentation, handling pagination and rate limits, converting formats,
      and reconciling column names and coordinate systems that were never meant to meet.
      None of this is anyone's fault. Each collaboration publishes its data in the way that
      suits its own community, but the cost falls on whoever tries to work across them.</p>
      <p>SciData Hub is my attempt to take some of that cost away. I convert published
      datasets and ontologies to Parquet, keep them versioned on Hugging Face, and document
      how to query and join them. The original data, and the credit for it, stays with the
      teams who produced it. This is a convenience layer, not a replacement.</p>

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
    title: Four Ways to Access the Data
    content: |
      <p><strong>Hugging Face Parquet</strong>: every dataset is published under the
      <code>scidata-hub</code> organisation, versioned, streamable and free to use.
      <code>load_dataset("scidata-hub/sparc-rotation-curves")</code> loads it in Python.</p>
      <p><strong>DuckDB over HTTP</strong>: SQL queries run directly against the remote
      Parquet files, so nothing has to be downloaded first and the only install is
      <code>pip install duckdb</code>. For example, you can join galaxy properties with
      rotation curves in a single query from a terminal, a notebook or a script.</p>
      <p><strong>Python library</strong> (planned): a common <code>load()</code>,
      <code>query()</code>, <code>discover()</code> and <code>join()</code> interface
      across cached and live sources.</p>
      <p><strong>MCP server</strong> (planned): research agents built on LLMs would be able to
      find, query and join datasets through tools instead of needing API code written
      for each new hypothesis.</p>
    image: /static/assets/images/projects/scidata-hub/viz_structure.webp
    caption: |
      Scidata Hub home
    reverse: false


  # ── 9. METHODOLOGY ──
  - type: methodology
    title: Start with one dataset, test the approach, then grow
    content: |
      <p>I started with a single dataset and a narrow question: could Hugging Face plus DuckDB replace the bespoke API code I kept having to write? SPARC was small enough to test that cheaply. Once it worked, I added sources one at a time (dark matter experiments, number theory, ontologies) and only moved on when each one was live and queryable.</p>
    detail_label: Process & decisions
    case_study:
      problem: |
        <p>The simulation agents in Ip-β needed data from very different places: galaxy rotation curves, detector event rates, elliptic curve databases and biomedical ontologies. Each new hypothesis domain meant new API code for pagination, rate limits, authentication and format conversion. In practice the agents spent more effort getting the data than working on the question itself. Joining across sources, such as matching a galaxy between SPARC and SDSS by coordinates or resolving a term against MeSH and HPO at the same time, needed manual integration for every pair.</p>
      role: |
        <p>I worked on this alone. I chose the architecture, wrote the ingestion scripts, and wrote or adapted parsers for the formats involved: MRT, OBO, OWL, Manchester syntax, NLM XML, SKOS CSV and fixed-width text. I also curated the ontology tables, including their synonyms.</p>
      method: |
        <p>The datasets went in roughly in order of difficulty. First came SPARC (3,391 rows, simple), then ANAIS-112 (per-detector CSVs), XENON1T (response matrices with complex schemas), COSINE-100 (15 configs across three experiment sets) and Cremona (3M rows, with some integer edge cases). The last step was 12 ontologies spread across five parser backends. I made each dataset live on HF and queryable through DuckDB before I started the next one.</p>
      decisions: |
        <p><strong>Hugging Face rather than S3 or self-hosting</strong>: free hosting, a built-in dataset viewer, versioning and discoverability, with no infrastructure for me to maintain. The trade-off is that the project depends on one platform's policies.</p>
        <p><strong>DuckDB over HTTP rather than a custom query API</strong>: I borrowed this approach from science-datalake, which ships a small (274KB) <code>.duckdb</code> file of SQL views over remote Parquet. It works from any language or notebook and needs no server.</p>
        <p><strong>Separate configs instead of DatasetDict</strong>: DatasetDict expects every split to share a schema, and scientific tables rarely do. Giving each table its own config and schema meant I didn't have to force them into one shape.</p>
        <p><strong>Linking rather than re-hosting</strong>: projects such as MultimodalUniverse, OEIS and science-datalake already maintain large collections on HF. Copying them would duplicate their work and could drift out of sync, so the DuckDB views point at their Parquet files and the joins happen in the same session.</p>
        <p><strong>Synonyms as their own table</strong>: entity resolution depends heavily on synonyms. "Heart rate variability", for example, has no dedicated MeSH heading but does appear in HPO. Without a synonyms table the resolver missed many real mentions.</p>
        <p><strong>MeSH tree numbers for filtering</strong>: early versions matched generic words such as "methods", "review" or "therapeutics" as entities. Once I added tree numbers to the terms table, the resolver could exclude branches like V (Publication Characteristics) and L (Information Science), which removed most of those false matches.</p>
        <p><strong>Large coefficients stored as strings</strong>: some of Cremona's elliptic curve coefficients exceed the int64 range at high conductors. They are stored as strings and parsed on read, which is less convenient but loses no information.</p>
      constraints: |
        <p>There was no budget or team, just a laptop and free HF hosting. Some OBO files (UBERON, MONDO, SO, CL) crashed the pronto parser, so I fell back to obonet. FMA's official download returned a 403 error, so I retrieved it manually from BioPortal. The largest table in science-datalake (<code>unified_papers</code>, 293M rows) currently can't be scanned over httpfs because ZSTD decompression fails, so only its smaller mapping tables work remotely.</p>
      outcome: |
        <p>More than 30 datasets and 12 ontologies are now on Hugging Face and can be queried together in a single DuckDB session over HTTP. As far as I know, SPARC, ANAIS-112, XENON1T and COSINE-100 had not been available side by side on HF before. Cremona's tables, with around 3M curves, are among the larger number-theory datasets on the platform. MeSH, with tree numbers and 236K synonyms, now handles entity resolution across the Impossible Papers pipeline. A demo script joins measurement data from the hub with science-datalake's bibliometric tables without downloading anything.</p>
      lessons: |
        <p>The pattern held up: one ingestion script per source format, three Parquet tables per ontology, and DuckDB views for access. Most of the value so far has come from the unglamorous part, which is cleaning the data and putting it somewhere people can reach it. The library and the MCP server aren't built yet, and I'd rather see how people actually use the data before deciding what API to put around it.</p>
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
  - type: text
    title: What's Live Right Now
    content: |
      <p>Here are the datasets currently on the hub.</p>
      <div class="proj-dataset-grid">
        <article class="proj-dataset-card">
          <span class="proj-dataset-card__topic">Astrophysics &amp; dark matter</span>
          <h4 class="proj-dataset-card__title">SPARC</h4>
          <p class="proj-dataset-card__desc">175 galaxies and 3,391 rotation-curve points (Lelli+ 2016).</p>
        </article>
        <article class="proj-dataset-card">
          <span class="proj-dataset-card__topic">Astrophysics &amp; dark matter</span>
          <h4 class="proj-dataset-card__title">ANAIS-112</h4>
          <p class="proj-dataset-card__desc">Six-year NaI annual-modulation search with rates, efficiency, backgrounds, and live time.</p>
        </article>
        <article class="proj-dataset-card">
          <span class="proj-dataset-card__topic">Astrophysics &amp; dark matter</span>
          <h4 class="proj-dataset-card__title">XENON1T S2-only</h4>
          <p class="proj-dataset-card__desc">S2 response matrices, events, backgrounds, and ten exclusion-limit curves.</p>
        </article>
        <article class="proj-dataset-card">
          <span class="proj-dataset-card__topic">Astrophysics &amp; dark matter</span>
          <h4 class="proj-dataset-card__title">COSINE-100</h4>
          <p class="proj-dataset-card__desc">WIMP and modulation analysis sets plus DAMA comparison sims (15 configs).</p>
        </article>
        <article class="proj-dataset-card">
          <span class="proj-dataset-card__topic">Number theory</span>
          <h4 class="proj-dataset-card__title">Cremona ECDB</h4>
          <p class="proj-dataset-card__desc">3.06M elliptic curves to conductor 500k with BSD fields, generators, and isogeny data.</p>
        </article>
      </div>

  # ── 5. ONTOLOGIES ──
  - type: split
    title: 12 Ontologies, Full Synonym Support
    content: |
      <p>Each ontology is stored as three Parquet tables: terms, relationships and synonyms.
      Searching synonyms as well as names catches mentions that a single vocabulary would
      miss. "HRV", for instance, resolves to <code>HP:0031860</code> (Abnormal heart rate
      variability) in HPO, even though MeSH has no dedicated heading for it.</p>
    badges:
      - name: MeSH
        detail: 31K medical terms, 236K synonyms, tree numbers for hierarchy filtering
      - name: Gene Ontology
        detail: 47K biological process/function/component terms
      - name: ChEBI
        detail: 175K chemical entities
      - name: HPO
        detail: 20K human phenotypes, covering many clinical terms that MeSH lacks
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
        detail: Environment Ontology
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
      -- Requires only DuckDB with the httpfs extension; nothing is downloaded in advance.

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
    title: Linking, Not Copying
    content: |
      <p>Several groups already maintain excellent scientific collections on Hugging Face.
      <a href="https://huggingface.co/MultimodalUniverse">MultimodalUniverse</a>
      brings together 24 astronomical surveys, including JWST, DESI and TESS, at more than 100TB.
      <a href="https://huggingface.co/datasets/J0nasW/science-datalake">science-datalake</a>
      maps 293M papers to ontology terms.
      <a href="https://huggingface.co/datasets/christopher/oeis">OEIS</a> holds 392K
      integer sequences, and
      <a href="https://huggingface.co/datasets/facebook/principia-collection">Principia</a>
      collects 554K maths and physics problems tagged with MSC2020 and PhySH.</p>
      <p>There's no reason to copy them. The hub's DuckDB views point at their Parquet files
      instead, so they can be queried and joined with the datasets here in the same SQL
      session. Their authors keep both the credit and the maintenance.</p>
    image: /static/assets/images/projects/scidata-hub/datalake.webp
    caption: |
      The Datalake on Hugging Face
    reverse: true

  - type: callout
    title: What's next
    content: |
      <p>Next I'm planning to add WESAD (wearable stress data), Odlyzko's zeta zeros,
      Rfam RNA families and the NHANES health surveys, following the same pattern. If you
      work with a dataset that would be useful here, or you maintain one that's already
      included and would like something changed, I'd be glad to hear from you.</p>
    button: Get in touch
---