---
title: Benchmark QA Tool
summary: Turned a 3-day manual QA process into a 20-minute automated workflow for e-commerce UX datasets — built iteratively from Colab scripts to a full Flask application.
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
    image: /assets/images/projects/qa_tool/filter_qa-lint.png
    reverse: false

  - type: split
    title: See the UI While You Fix the Data
    content: |
      <p>The core insight: researchers were correcting evaluation data blind. They'd read
      a judgment about a checkout field but couldn't see the actual checkout. Every
      correction required opening a separate browser, finding the site, navigating to
      the right page.</p>
      <p>The detail view shows the actual UI screenshot next to the data being reviewed.
      Exported images are automatically captioned with the evaluation judgment — feeding
      other departments with pre-labeled best practice examples without extra work.</p>
    image: /static/assets/images/projects/qa_tool/page_guideline-detail.png
    reverse: true

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
    image: /static/assets/images/projects/qa_tool/feature_auto-presentation.png
    reverse: false

  # ── 4. RESULT ──
  - type: callout
    title: How This Got Built
    content: |
      <p>No mandate, no spec, no sprint ticket. I saw a broken workflow, prototyped a fix
      in a notebook, validated it with the team, and iterated to production — delivering
      usable output at every stage. The tool is still in daily use.</p>
---