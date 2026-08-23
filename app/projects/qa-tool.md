---
title: Benchmark QA Tool
summary: Turned a time consuming manual QA process into a smart automated workflow for e-commerce UX datasets. Built iteratively from Colab scripts to a full Flask application.
date: 2024-02-24
status: internal product
role: Solo developer
client: Baymard Institute
services:
  - product
image: /static/assets/images/projects/qa_tool/desktop_cover.png
desktop_cover: /static/assets/images/projects/qa_tool/desktop_cover.png
mobile_cover:
pattern: lr-pattern-crosshatch
github_link:
technologies:
  - Python
  - Flask
  - Streamlit
  - Pandas
  - Playwright
  - Pandas
accent: hatch-ux
tags:
  - Data
  - Visualization

sections:

  # ── 1. PROBLEM ──
  - type: text
    title: The Problem
    content: |
      <p>Baymard Institute evaluates e-commerce UX across hundreds of sites, generating
      datasets with thousands of datapoints. The QA process was a bottleneck — researchers
      drowning in Excel files, no version control, peer reviewers catching typos instead
      of real issues, and no way to see the actual UI while correcting evaluation data.</p>
      <p>Nobody asked for a tool. I saw the workflow, opened a notebook, and started building.</p>

  # ── 2. METRICS ──
  - type: metrics-pills
    items:
      - value: "10x"
        label: Larger datasets handled
      - value: "3d → 20m"
        label: QA cycle time
      - value: "3"
        label: Iterations to production
      - value: "0"
        label: Code required by reviewers

  # ── 3. SOLUTION ──
  - type: split
    title: Three Iterations, Each One Useful
    content: |
      <p><strong>Colab scripts</strong> — automated consistency checks and flagging in
      plain Python. No infrastructure, no dependencies. Colleagues got value on day one,
      but they needed me to run every job.</p>
      <p><strong>Streamlit prototype</strong> — wrapped the scripts in an interactive UI
      so researchers could run checks themselves. Proved the interaction model worked:
      dashboard, filtering, guideline detail view. But Streamlit's routing and pagination
      hit limits fast.</p>
      <p><strong>Flask application</strong> — the production version. Proper pagination,
      role-based permissions, export pipelines, and a modular validation system where
      new checks plug in without touching the rest.</p>
    image: /static/assets/images/projects/qa_tool/colab_prototype.png
    caption: 
      Colab notebook — first iteration, automated consistency checks only. Useful to optimize pandas queries.
    reverse: false

  - type: split
    title: See the UI While You Fix the Data
    content: |
      <p>The core insight: researchers were correcting evaluation data blind. They'd read a judgment about a checkout field but couldn't see the actual checkout. Every correction required opening a separate browser, finding the site, navigating to the right page.</p>
      <p>The detail view shows the actual UI screenshot next to the data being reviewed.
      Exported images are automatically captioned with the evaluation judgment — feeding
      other departments with pre-labeled best practice examples without extra work.</p>
    image: /static/assets/images/projects/qa_tool/page_guideline-detail.png
    caption: 
      Pagination allows researcher to quickly check the evaluation against the target UI. Smart filtering was added to cross check performance across the same candidate, by themes, by topic, by platform to ensure consistency.
    reverse: true

  - type: methodology
    title: Prototype, test, iterate
    content: |
      <p>No mandate, no spec, no sprint ticket. I saw a broken workflow, opened a notebook, validated it with the team, and shipped three iterations — each one usable before the next.</p>
    detail_label: Process & decisions
    case_study:
      problem: |
        <p>UX benchmark datasets with thousands of datapoints were QA'd in Excel — no version control, blind corrections without seeing the UI, peer review stuck on typos instead of substance.</p>
      role: |
        <p>Solo builder: observed the workflow, wrote the checks, designed the UI, and negotiated API access with platform developers.</p>
      method: |
        <p>Colab scripts → Streamlit prototype → Flask production. Each stage shipped value to researchers before committing to the next layer.</p>
      decisions: |
        <p><strong>Streamlit first, Flask later</strong> — proved interaction model cheaply; pagination and permissions outgrew Streamlit quickly.</p>
        <p><strong>Playwright import, then API</strong> — script worked for demos but broke on large payloads and UI changes; API was the durable fix.</p>
        <p><strong>Screenshot beside data</strong> — detail view pairs judgment with the actual UI so reviewers never context-switch to a browser tab.</p>
      constraints: |
        <p>Researchers are not developers — zero code required to run checks. Existing Excel habits had to die gradually, not overnight. Baymard's platform team had limited bandwidth for API work.</p>
      outcome: |
        <p>QA cycle dropped from ~3 days to few hours per dataset. Reviewers catch real consistency issues across themes and platforms, not formatting errors. Tool still in daily use.</p>
      lessons: |
        <p>Internal tools win when every iteration is runnable by the team — not when you disappear for a quarter and return with a spec.</p>
      metrics:
        - label: QA cycle time
          before: "~3 days"
          after: "~20 min"
        - label: Reviewer code required
          before: "Manual exports"
          after: "0"
        - label: Iterations to production
          before: "—"
          after: "3"
      evidence:
        - image: /static/assets/images/projects/qa_tool/colab_prototype.png
          caption: Iteration 1 — Colab checks, no UI. Proved the validation logic before any infrastructure.
        - image: /static/assets/images/projects/qa_tool/page_guideline-detail.png
          caption: Production detail view — judgment text next to the actual checkout screenshot.

  - type: split
    title: From Fragile Export to API
    content: |
      <p>The original data pipeline was manual — researchers exported projects from the
      platform, copy-pasted into Excel, cleaned by hand. The first prototype used a
      Playwright script to import projects by ID, but it required login credentials,
      crashed on large payloads, and broke when the UI changed.</p>
      <p>The final version: a proper API integration built in collaboration with the
      platform developers. Type the project IDs, reviews load in seconds. Solid,
      authenticated, handles any payload size.</p>
    image: /static/assets/images/projects/qa_tool/option_merge-datasets.png
    caption: 
      Pulling content from Bayamrd API fixed the most fragile seam. Additional functions like merging datasets gave researcher the option to quality check and compare implementation from different industries and across years.
    reverse: false

  - type: callout
    title: Building internal tools from broken workflows?
    content: |
      <p>I prototype in notebooks, validate with the team, and ship to production — usually without a spec or sprint ticket.</p>
    button: Get in touch
---