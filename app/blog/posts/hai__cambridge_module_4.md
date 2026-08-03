---
title: "HAI Cambridge Module 4 - Notes on Mixed Initiaitve Sys"
thread: hai
keywords: [HCI, AI tooling, developer workflow, humanin the loop, mixed initiative systems]
author: "Federico Caria"
date: "2025-07-12"
tags: ["HCI", "AI", "Notes"]
summary: "Notes from class Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristennson - Cambridge University"
---

# Module 4: Mixed-Initiative Systems — Raw Notes

This one is about how the user actually interacts with the system once it's running.

---

## Four ways users hit AI

Ways AI shows up in an interface:
- **Augmentation** — amplifies human capability. Ex: autocorrect lets you type faster despite errors.
- **Dialogue** — back-and-forth to reach a goal. Ex: user clicks a system suggestion, or speaks to an assistant.
- **Monitoring** — system watches in background, acts when conditions hit. Ex: gesture detection, smart home temp/humidity triggers.
- **Recommendations** — system proposes songs, routes, decisions. Ex: playlists, map routes.

---

## The four classic interaction styles

Before direct manipulation, these were the options. Still relevant because mixed-initiative builds on top of them.

**Command entry**
- Syntax-based. Terminal, spreadsheets, spoken command interfaces.
- Vi example: modal editor. Command mode (`h,j,k,l`, `gg`, `G`, `2j`) vs insert mode. `:` for line commands (`:w test.txt`).
- Heavily recall-based.
- Fast for experts, brutal learning curve.

**Menus**
- Tree of discoverable commands.
- Desktop: hierarchical linear pull-downs (Edit → …).
- Pen tablets: pie menus, but max ~6–8 slices or error rate spikes.
- Mobile: full-screen hierarchical lists (Settings).
- Supposedly easy for lay users, horrible in general.

**Forms**
- Fields + options. Fill in any order, commit with OK/Submit/Back/Cancel.
- Ex: word processor layout adjustment panel.
- Sigh...

---

## Direct manipulation

Shneiderman's principle that underpins GUIs.

**Original3 properties (1982):**
- Visible objects/actions of interest.
- Rapid, reversible, incremental actions.
- Pointing instead of typed commands.

**Updated (2010):**
- Continuous representations + meaningful visual metaphors.
- Physical actions or labelled button presses, not complex syntax.
- Rapid, reversible, incremental actions; effects visible immediately.

**Why it works**
- Recognition > recall. You see the icon and remember what dragging it to bin does. No need to remember `rm file.txt`.
- Leverages metaphors (desktop, bin) even if dated.
- Deleting a file by dragging to bin = textbook example.

**Distance and engagement**
- Distance = mental effort to map your goal to an action and read the result.
- Engagement = locus of control. You feel like you're operating the system, not begging a middleman.

---

## Mixed-initiative interface

GUI that couples direct manipulation with an automated service. Both user and system can take initiative.

**Basic cross-cuts:**
- Utility — only automate if it adds real value over pure direct manipulation.
- Balance — weigh utility against interruption cost.
- Control — user can override, dismiss, or adjust automation manually.
- Uncertainty — system never fully knows user intent; design for that.

---

## Horvitz 1999 principles

Three groups of design rules for mixed-initiative systems.

**Value and uncertainty**
- Only automate if the non-automated path is worse.
- Account for uncertainty in user goals (input is noisy, humans make mistakes/slips).
- Compute ideal action under cost/benefit/uncertainty. Sometimes doing nothing wins.
- Use dialogue to resolve key uncertainties, but factor in interruption cost.

**Prioritise the user**
- Check user attention state before interrupting.
- Let user directly invoke or kill automation. System won't always know when to start.
- Minimise cost of bad guesses: easy dismiss, minimal disruption, auto-timeout.
- Reduce precision/scope when uncertainty is high (do less automation rather than guess wrong).

**System refinement**
- Let user refine or complete something the system started.
- Interruptions should be socially appropriate.
- Keep working memory of recent interactions (refer back to prior objects/actions).
- Keep learning from observation.

---

## Example: Eager (Cypher, 1991)

Programming by example at Apple. System watches user actions, induces a program from repetition.

Scenario: user building a numbered list by copying topics from messages:
1. Types `1.`
2. Goes to message, copies topic, pastes.
3. Types `2.`, repeat.
4. Eager detects loop and pops an icon showing predicted next step.
5. User clicks icon when they agree it's right → triggers automation.
6. If user does something unexpected, Eager revises or abandons the guess.

**Why it matters**
- No explicit "Did you mean X?" interruption.
- Prediction shown silently; user owns the decision to engage.
- Macro alternative is rigid: records literal coordinates, breaks if icon moves. Eager generalizes.

---

## Alignment, gulfs, and dialogue

User and AI need shared goals. Sounds obvious but it's hard.

**Gulf of execution** — user knows desired state but not what action gets there.
**Gulf of evaluation** — user performed an action but can't tell if system is now in desired state eg. lazy logging.

# **Referenced sources**

### **4.4 Direct manipulation**

- Shneiderman, B. (1982). The future of interactive systems and the emergence of direct manipulation. *Behaviour & Information Technology* **1**(3): 237-256.
- Shneiderman, B., & Plaisant, C. (2010). *Designing the User Interface: Strategies for Effective Human-Computer Interaction*. Pearson.

### **4.5 Mixed-initiative interface**

- Horvitz, E. (1999). "Principles of mixed-initiative user interfaces." *Proceedings of the SIGCHI conference on Human Factors in Computing Systems*.

### **4.8 Teaming, partnerships and cooperative AI**

- Bansal, G., Nushi, B., Kamar, E., Weld, D.S., Lasecki, W.S. and Horvitz, E., (2019,). Updates in human-AI teams: Understanding and addressing the performance/compatibility tradeoff. In *Proceedings of the AAAI Conference on Artificial Intelligence* (Vol. 33, No. 01, pp. 2429-2437).