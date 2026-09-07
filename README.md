# [caria.so](https://caria.so)

**Experience engineering — from user research through working code.**

Portfolio and product site for [Federico Caria](https://caria.so/about): UX research, e-commerce optimization, and AI/knowledge systems built as things you can actually test — not slide decks.

**→ [Visit the site](https://caria.so)** · **[Projects](https://caria.so/projects)** · **[Get in touch](mailto:hello@caria.so)**

---

## What I do

| | |
|---|---|
| **Product research & audits** | Heuristic evaluation, benchmark studies, UX teardowns — evidence you can act on |
| **Prototyping & development** | Flask, React, full-stack builds from research specs to production |
| **AI & data pipelines** | Multi-agent workflows, literature grounding, structured extraction |
| **Knowledge systems** | Ontologies, scholarly editions, dataset infrastructure |

Worked with **Baymard Institute** (Fortune 500 e-commerce), **Marie Curie / EU research**, university digital humanities, and independent product teams.

Case studies on the site cover e-commerce rebuilds, research tooling, OCR pipelines, and graph-native discovery systems — each with constraints, stack, and what actually shipped.

---

## This repo

Open-source codebase for the live site: **Flask 3**, server-rendered **Jinja2**, content in **Markdown + YAML**, no CMS. Fast to deploy, easy to version, built for clarity and accessibility.

**Highlights**

- Project case studies and sketchboard notes from flat files
- Agent-friendly surfaces (`/llms.txt`, sitemap, semantic HTML)
- Dark/light theme, responsive layout, contact form via SMTP
- Optional tooling pages (e.g. research method finder)

Some content and deploy config stay **local-only** (drafts, private research data) and are not in this public tree.

### Other work on GitHub

There are **20+ repositories** under my account — client deliverables, research prototypes, and experiments. **Most are private**: proprietary work, or not ready to share publicly yet.

The main open exception is **[SciData Hub](https://huggingface.co/scidata-hub)** — versioned scientific datasets and ontologies on Hugging Face (with supporting tooling on GitHub where it makes sense).

If something on [caria.so](https://caria.so/projects) points at work you can’t find in public repos, that’s usually why. **Interested in a collaboration or a private demo?** [Get in touch](mailto:hello@caria.so).

---

## Run locally

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set SECRET_KEY and optional SMTP vars
python run.py          # http://127.0.0.1:8080
```

Production deploy uses Gunicorn; config lives outside this public repo.

---

## Stack

Python · Flask · Jinja2 · Markdown · YAML · vanilla JS · CSS custom properties

---

**Need research turned into a working prototype, or a knowledge system that doesn’t hallucinate its outputs?**  
→ [hello@caria.so](mailto:hello@caria.so)
