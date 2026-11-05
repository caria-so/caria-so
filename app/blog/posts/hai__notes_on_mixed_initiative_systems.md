---
title: "Notes on Mixed Initiative Systems"
thread: hai
keywords: [HCI, AI tooling, developer workflow, human in the loop, mixed initiative systems, direct manipulation, Horvitz]
author: "Federico Caria"
date: "2026-07-12"
tags: 
summary: "Augmented notes from Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristensson - Cambridge University. Expanded with checked claims, real systems to look at, and literature."
image:
---

This one is about how the user actually interacts with the system once it's running.

**Look at (the debate this whole topic sits inside).** Mixed-initiative is the settlement of a 1990s argument: direct manipulation (DM) versus interface agents. Shneiderman's side is in [Direct manipulation for comprehensible, predictable and controllable user interfaces](https://www.cs.umd.edu/~ben/papers/Shneiderman1997Direct.pdf) (IUI '97), which argues DM is the better bet than adaptive, autonomous agents. Horvitz's abstract frames mixed-initiative as an "elegant coupling" of the two ([Horvitz 1999 PDF](https://www.erichorvitz.com/chi99horvitz.pdf)). Heer (2019) is a good retrospective on how that debate ended up: the consensus was automation that amplifies users while keeping them in control ([PNAS, open access](https://pmc.ncbi.nlm.nih.gov/articles/PMC6369770)).

---

## Four ways users hit AI

Ways AI shows up in an interface:
- **Augmentation** — amplifies human capability. Ex: autocorrect lets you type faster despite errors.
- **Dialogue** — back-and-forth to reach a goal. Ex: user clicks a system suggestion, or speaks to an assistant.
- **Monitoring** — system watches in background, acts when conditions hit. Ex: gesture detection, smart home temp/humidity triggers.
- **Recommendations** — system proposes songs, routes, decisions. Ex: playlists, map routes.

**Check.** I could not trace this four-way split to a published source; it reads as the course's taxonomy. Cite it as "Kristensson, lecture" unless you find otherwise. The categories overlap in practice (an autocorrect bar is augmentation *and* a dialogue of suggestions), so treat them as lenses, not bins.

**Look at (one real system per lens).**
- *Augmentation, and its failure mode:* Kristensson & Müllners (2021, see Module 2 notes) show predictive text where the best strategy saves only ~9.4% of keystrokes, and regions with >40% keystroke savings have *negative* net entry rate. Augmentation that looks good on one metric can slow people down. [Paper](https://www.pokristensson.com/pubs/KristenssonMullnersCHI2021.pdf).
- *Dialogue:* [Parakeet](https://keithv.com/software/parakeet/) (Vertanen & Kristensson 2009), the speech-recognition interface from Module 2. The recogniser shows a word confusion network and the user *clicks the right alternative* or types with a predictive keyboard. This is exactly "user clicks a system suggestion". Novices reached 18 WPM seated and 13 WPM walking ([paper](https://www.keithv.com/pub/parakeet/parakeet.pdf)).
- *Monitoring:* the Nest learning thermostat, studied by Yang & Newman (2013): 23 interview participants, 10 of them also in a three-week diary study. People were frustrated that it could not tell routine behaviour from a one-off exception. Their three design directions: exception flagging, incidental intelligibility, constrained engagement ([PDF](https://www.mwnewman.people.si.umich.edu/fulltext/ubicomp2013-learningtherm.pdf)).
- *Recommendations:* Konstan & Riedl (2012) is the standard "from algorithms to user experience" overview (not re-verified by me; see end).

---

## The four classic interaction styles

Before direct manipulation, these were the options. The are still relevant because mixed-initiative builds on top of them:

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

**Check.**
- *Count:* you list three styles under a "four classic" heading; the fourth is direct manipulation in the next section. In Shneiderman & Plaisant's textbook the usual list is menu selection, form fill-in, command language, natural language, and direct manipulation, so "four" is the course's cut. Say so, or add natural language as the missing one.
- *`gg`:* that motion is a Vim addition. Classic vi used `1G`. Try `:help gg` in Vim to see it documented. Vim and vi get conflated in lecture; worth one line in your notes.
- *Pie menus:* "6–8 slices" is a fair rule of thumb, but the primary source is subtler. Kurtenbach & Buxton report that marking menus with 2, 4, 6, 8 and 12 items work well, and that errors rise as breadth *and depth* grow, even for experts ([Limits of expert performance](https://www.billbuxton.com/MMExpert.html)). Callahan et al. (1988) tested 8-item pie menus against linear menus. Radial menus were designed with stylus input in mind: Kurtenbach tested mouse, trackball and stylus ([study](https://billbuxton.com/PieMenus.html)).

**Look at.** Pie menus shipped in games and CAD packages, notably *The Sims* (Don Hopkins). For the original quantitative case, Callahan et al., [doi:10.1145/57167.57182](https://doi.org/10.1145/57167.57182).

---

## Direct manipulation

Shneiderman's principle that underpins GUIs.

**Original 3 properties (1982):**
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

**Check (this section is the one most worth tidying).**
- *Dates and counts.* Most sources give **four** principles, from Shneiderman's 1983 *IEEE Computer* paper "Direct manipulation: a step beyond programming languages": continuous representation, physical actions instead of syntax, rapid/incremental/reversible operations, and a **layered or spiral approach to learning**. Hutchins et al. credit the term to Shneiderman's 1974, 1982 and 1983 writing. Later textbook editions (from 1997) reworded the first principle ("objects *and actions* of interest, with meaningful visual metaphors") and dropped the fourth, per Beaudouin-Lafon & Mackay's footnote ([chapter](https://ex-situ.lri.fr/content/7-workshops/1-ensemble-trans-numerique-design-class/2024_hci_handbook_instrumental_interaction_chapter.pdf)). So your "updated" list matches the later textbooks (it is the three-principle version), and the 1982 list is the three-property summary some sources give. Cite the 1983 paper for the four-principle original, and consider adding it to your bibliography.
- *Distance and engagement are not Shneiderman's.* They come from Hutchins, Hollan & Norman (1985), the cognitive account of *why* DM feels direct. They split distance into **semantic** (does the interface let me say what I mean?) and **articulatory** (does the form of the input/output resemble its meaning?).
- *The sentence that matters for this topic:* the paper's table of contents has a section titled "Automated Behavior Does Not Reduce Semantic Distance". Automation lowers the effort of crossing the gulf, not its width. That is a precise way to say why mixed-initiative must keep DM underneath rather than replacing it.
- *DM has costs.* Hutchins et al. have a "Problems with direct manipulation" section; one trade-off is ease against flexibility and generality. Good counterweight to "why it works".

**Look at.** [Hutchins, Hollan & Norman, Direct Manipulation Interfaces (PDF)](https://vis.csail.mit.edu/classes/6.859/readings/pdfs/Hutchins-DirectManipulationInterfaces.pdf). Section 2 (distance and engagement) is the one your notes summarise.

---

## Mixed-initiative interface

GUI that couples direct manipulation with an automated service. Both user and system can take initiative.

**Basic cross-cuts:**
- Utility — only automate if it adds real value over pure direct manipulation.
- Balance — weigh utility against interruption cost.
- Control — user can override, dismiss, or adjust automation manually.
- Uncertainty — system never fully knows user intent; design for that.

**Check.** The four cross-cuts are the course's synthesis, not Horvitz's wording. They map cleanly onto his 12 principles (next section): Utility → 1; Balance → 3, 4, 7; Control → 6, 9; Uncertainty → 2, 5, 8.

**Reading.** Allen, Guinn & Horvitz (1999) for the field-defining overview in *IEEE Intelligent Systems*; Horvitz's companion piece "Uncertainty, action, and interaction: in pursuit of mixed-initiative computing" (same magazine, Sept 1999); Shneiderman & Maes (1997), the transcript of the DM-vs-agents debate in *Interactions*.

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

**Check.** Horvitz's paper lists **12 numbered principles**; the three groups are the course's. Your bullets map one-to-one, which is a good sign:

| # | Horvitz's principle (short) | Your group |
|---|---|---|
| 1 | Developing significant value-added automation | Value & uncertainty |
| 2 | Considering uncertainty about a user's goals | Value & uncertainty |
| 3 | Considering the status of a user's attention in the timing of services | Prioritise the user |
| 4 | Inferring ideal action in light of costs, benefits and uncertainties | Value & uncertainty |
| 5 | Employing dialog to resolve key uncertainties | Value & uncertainty |
| 6 | Allowing efficient direct invocation and termination | Prioritise the user |
| 7 | Minimizing the cost of poor guesses about action and timing | Prioritise the user |
| 8 | Scoping precision of service to match uncertainty, variation in goals | Prioritise the user |
| 9 | Providing mechanisms for efficient agent–user collaboration to refine results | System refinement |
| 10 | Employing socially appropriate behaviors for agent–user interaction | System refinement |
| 11 | Maintaining working memory of recent interactions | System refinement |
| 12 | Continuing to learn by observing | System refinement |

**Example: the maths behind "sometimes doing nothing wins" (principle 4).** The paper's testbed, LookOut, is an Outlook add-on that reads an email, estimates the probability *p* that the user wants help scheduling, and then chooses between *no action*, *dialog* and *action*. Four utilities on a 0–1 scale, u(A,G), u(A,¬G), u(¬A,G), u(¬A,¬G) (acting or not, when the user does or doesn't have the goal), give expected utilities; the system acts when *p* exceeds the point *p\** where the two are equal. The paper uses symbols only, so here is a *toy* instance:

- u(A,G)=1.0 (helped), u(A,¬G)=0.3 (unwanted action), u(¬A,G)=0.5 (missed chance), u(¬A,¬G)=0.9 (correctly left alone).
- *p\** = (0.9 − 0.3) / [(0.9 − 0.3) + (1.0 − 0.5)] = 0.6 / 1.1 ≈ **0.55**. Check: at 0.55 both options score ≈ 0.68.
- Make unwanted action more costly, u(A,¬G)=0.1 (say the system interrupts the user's flow): *p\** rises to 0.8 / 1.3 ≈ **0.62**. This is the paper's point that a higher cost of unwanted action raises the bar for acting.

**Look at (principle by principle, real systems).**

| Principle | Where to see it |
|---|---|
| 6 invocation / termination | LookOut: invoked manually from a tray icon, or switched off entirely ([paper](https://www.erichorvitz.com/chi99horvitz.pdf)) |
| 8 scope precision to uncertainty | LookOut: if it cannot find a specific time it narrows the calendar to a day, week or month instead of guessing a slot |
| 9 refine results | LookOut pre-fills an appointment you can edit then save; Wrangler's suggested transforms have clickable, editable parameters ([Wrangler](https://homes.cs.washington.edu/~jheer/files/wrangler.pdf)) |
| 7 cheap bad guesses | Eager (next section): a wrong guess costs nothing, you just do something else |
| 10 social appropriateness | Counter-example: the Office Assistant ("Clippy"). Swartz's Stanford thesis [Why People Hate the Paperclip](http://xenon.stanford.edu/~lswartz/paperclip/paperclip.pdf) argues it left users feeling not in control and broke human rules of etiquette |
| 12 keep learning | Tension: Bansal et al. (2019) show an AI update that raises accuracy can *lower* team performance because it breaks the user's mental model of when to trust it ([paper](https://ojs.aaai.org/index.php/AAAI/article/view/4087), [preprint](https://arxiv.org/pdf/1906.01148)). "Keep learning" and "stay predictable" pull against each other |

**Look at (the Horvitz lineage).** The Lumiere project (Horvitz et al., UAI 1998) is the Bayesian user-modelling research behind the Office Assistant work, and his page lists the LookOut demo video: [erichorvitz.com/uiact.htm](https://erichorvitz.com/uiact.htm). The shipped Assistant was famously unloved, which makes the Horvitz-versus-Swartz pairing a useful case: same research field, opposite outcomes.

**Look at (principle 4 and 8 in a user study).** Kocielnik, Amershi & Bennett (2019) tested a scheduling assistant (meeting requests in email). They found false-positive errors were more accepted than false-negative ones, which they attribute to lower recovery cost, and a system tuned to avoid false positives got lower average perceived accuracy and lower acceptance than one tuned to avoid false negatives. That is the cost term u(A,¬G) above measured in people ([PDF](https://microsoft.com/en-us/research/uploads/prod/2019/01/chi19_kocielnik_et_al.pdf)).

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

**Check (steps 4 and 5 are slightly off).** From Cypher's own paper and book chapter:
- The Eager icon pops up when it detects a repetition. It does **not** itself show the predicted step. The prediction is shown by **anticipation highlighting**: menu items, buttons and text selections turn **green** to show what Eager expects you to do next.
- The user never explicitly confirms or rejects: performing the highlighted action is implicit confirmation, doing anything else is implicit rejection.
- Only when the user is confident, they **click the Eager icon**, choose "Finish The Task", and Eager writes and runs a script that completes the loop.
- The macro contrast is from the paper: a macro records the low-level click on, say, the MacWrite icon, so it breaks if the icon moves; Eager generalises over higher-level events.

Suggested rewrite of steps 4–5: *4. Eager detects the loop, its icon appears, and it highlights the next expected action in green. 5. The user keeps working; matching actions confirm the guess. When confident, they click the icon and Eager finishes the task.*

**Look at.**
- [Eager project page with demo movie](https://acypher.com/Eager) (mp4 of the actual system).
- [CHI '91 paper](https://acypher.com/Publications/CHI91/EagerCHI.html), and [book chapter 9 with the numbered-list figure](https://acypher.com/wwid/Chapters/09Eager.html), which is your exact scenario (frames a–l).
- Successor you can try or read: Wrangler (Kandel et al., CHI 2011). As you select data it *suggests* transforms, with natural-language descriptions and visual previews, and keeps an editable script. The follow-up study [Proactive Wrangling](https://idl.uw.edu/papers/proactive-wrangling) (Guo et al., UIST 2011) is the best evidence I know on initiative: users often ignored suggestions shown *before* they touched the data and wanted to keep control, but took suggestions that appeared among reactive ones, and rated them better when they saw themselves as the initiator. The top-ranked suggestion was the preferred one 77% of the time in their algorithm analysis.

**Why this matters for your stance.** Eager and Wrangler are the "silent prediction, user owns the decision to engage" pattern. The Wrangler result suggests *who initiates* matters as much as *what is suggested*.

---

## Alignment, gulfs, and dialogue

User and AI need shared goals. Sounds obvious but it's hard.

**Gulf of execution** — user knows desired state but not what action gets there.
**Gulf of evaluation** — user performed an action but can't tell if system is now in desired state eg. lazy logging.

**Check.**
- The gulfs come from Norman's 1986 chapter "Cognitive engineering" (in Norman & Draper, *User Centered System Design*). Hutchins et al. then tie them to semantic and articulatory distance, which is why they belong in the DM section too.
- *"eg. lazy logging"* reads unclear to me. If you meant a system that records state changes late or not at all, so the user cannot verify what happened, that is a clean evaluation-gulf example and worth spelling out. If it was a class example I am missing, add it.

**Example (toy, in developer terms).** Execution gulf: you know you want to unstage a file but not whether the command is `git reset HEAD <file>` or `git restore --staged <file>`. Evaluation gulf: after a rebase you cannot tell from the output which commits are where. AI version of the second: a coding assistant says "done", and you cannot tell what it changed without reading the diff.

**Look at (the evaluation gulf for AI, measured).**
- Mozannar et al. (CHI 2024, honorable mention) built CUPS, a taxonomy of programmer states with Copilot, from 21 programmers who labelled 3,137 coding segments across 1,096 suggestions. It surfaces time costs of verifying suggestions ([arXiv](https://arxiv.org/abs/2210.14306)).
- Barke et al. (OOPSLA 2023, distinguished paper), a grounded-theory study with 20 participants: interaction is **bimodal**. In *acceleration* mode the programmer knows what to do and Copilot speeds them up; in *exploration* mode they are unsure and use it to explore options. They suggest that in acceleration mode a tool could keep to short, high-confidence suggestions, and that exploration needs better ways to compare alternatives and validate generated code ([arXiv](https://arxiv.org/abs/2206.15000)). That is Horvitz principle 8 (scope precision to uncertainty) applied to a real product.

**Alignment and common ground.**
- Klein et al. (2004) argue joint activity needs a "Basic Compact" plus mutual predictability, mutual directability and **common ground**. Read as a checklist for what "shared goals" demands of an AI teammate ([PDF via Fermat's Library](https://fermatslibrary.com/s/ten-challenges-for-making-automation-a-team-player-in-joint-human-agent-activity)). The common-ground idea comes from Clark & Brennan (1991).
- Bansal et al. (2019, already in your references) is the empirical version: the human learns where the AI errs; an update that is more accurate but *incompatible* with that learning hurts the team. Their studies used a simple AI-advised decision task in which the AI was initially right about 80% of the time ([preprint](https://arxiv.org/pdf/1906.01148)).
- Horvitz & Paek on grounding in conversational systems (AAAI Fall Symposium 1999) take the decision-theoretic view of when to ask a clarifying question.

---

## Referenced sources

### 4.4 Direct manipulation

- Shneiderman, B. (1982). The future of interactive systems and the emergence of direct manipulation. *Behaviour & Information Technology* **1**(3): 237-256.
- Shneiderman, B., & Plaisant, C. (2010). *Designing the User Interface: Strategies for Effective Human-Computer Interaction*. Pearson.
- *Added:* Shneiderman, B. (1983). Direct manipulation: A step beyond programming languages. *IEEE Computer, 16*(8), 57–69.
- *Added:* Hutchins, E. L., Hollan, J. D., & Norman, D. A. (1985). Direct manipulation interfaces. *Human-Computer Interaction, 1*(4), 311–338. (Also in Norman & Draper, 1986.)
- *Added:* Shneiderman, B. (1997). Direct manipulation for comprehensible, predictable and controllable user interfaces. In *Proceedings of IUI '97*. ACM.
- *Added:* Callahan, J., Hopkins, D., Weiser, M., & Shneiderman, B. (1988). An empirical comparison of pie vs. linear menus. In *Proceedings of CHI '88* (pp. 95–100). ACM. https://doi.org/10.1145/57167.57182
- *Added:* Kurtenbach, G., & Buxton, W. (1993). The limits of expert performance using hierarchic marking menus. In *Proceedings of InterCHI '93* (pp. 482–487). ACM.
- *Added:* Norman, D. A. (1986). Cognitive engineering. In D. A. Norman & S. W. Draper (Eds.), *User centered system design: New perspectives on human-computer interaction* (pp. 31–61). Lawrence Erlbaum.

### 4.5 Mixed-initiative interface

- Horvitz, E. (1999). "Principles of mixed-initiative user interfaces." *Proceedings of the SIGCHI conference on Human Factors in Computing Systems* (pp. 159–166).
- *Added:* Allen, J. E., Guinn, C. I., & Horvitz, E. (1999). Mixed-initiative interaction. *IEEE Intelligent Systems, 14*(5), 14–23.
- *Added:* Horvitz, E., Breese, J., Heckerman, D., Hovel, D., & Rommelse, K. (1998). The Lumiere project: Bayesian user modeling for inferring the goals and needs of software users. In *Proceedings of UAI '98*.
- *Added:* Shneiderman, B., & Maes, P. (1997). Direct manipulation vs. interface agents. *Interactions, 4*(6), 42–61.
- *Added:* Cypher, A. (1991). EAGER: Programming repetitive tasks by example. In *Proceedings of CHI '91* (pp. 33–39). ACM. https://acypher.com/Publications/CHI91/EagerCHI.html
- *Added:* Cypher, A. (Ed.). (1993). *Watch what I do: Programming by demonstration*. MIT Press. (Chapter 9 online: https://acypher.com/wwid/Chapters/09Eager.html)
- *Added:* Kandel, S., Paepcke, A., Hellerstein, J. M., & Heer, J. (2011). Wrangler: Interactive visual specification of data transformation scripts. In *Proceedings of CHI '11* (pp. 3363–3372). ACM. https://doi.org/10.1145/1978942.1979444
- *Added:* Guo, P. J., Kandel, S., Hellerstein, J. M., & Heer, J. (2011). Proactive wrangling: Mixed-initiative end-user programming of data transformation scripts. In *Proceedings of UIST '11*. ACM. https://doi.org/10.1145/2047196.2047205
- *Added:* Heer, J. (2019). Agency plus automation: Designing artificial intelligence into interactive systems. *PNAS, 116*(6), 1844–1850. https://doi.org/10.1073/pnas.1807184115
- *Added:* Swartz, L. (2003). *Why people hate the paperclip: Labels, appearance, behavior and social responses to user interface agents* [Honors thesis]. Stanford University.
- *Added:* Kocielnik, R., Amershi, S., & Bennett, P. N. (2019). Will you accept an imperfect AI? Exploring designs for adjusting end-user expectations of AI systems. In *Proceedings of CHI '19*. ACM. https://doi.org/10.1145/3290605.3300641
- *Added:* Yang, R., & Newman, M. W. (2013). Learning from a learning thermostat: Lessons for intelligent systems for the home. In *Proceedings of UbiComp '13* (pp. 93–102). ACM. https://doi.org/10.1145/2493432.2493489
- *Added:* Vertanen, K., & Kristensson, P. O. (2009). Parakeet: A continuous speech recognition system for mobile touch-screen devices. In *Proceedings of IUI '09*. ACM.
- *Added:* Kristensson, P. O., & Müllners, T. (2021). Design and analysis of intelligent text entry systems with function structure models and envelope analysis. In *Proceedings of CHI '21*. ACM. https://doi.org/10.1145/3411764.3445566
- *Added:* Konstan, J. A., & Riedl, J. (2012). Recommender systems: From algorithms to user experience. *User Modeling and User-Adapted Interaction, 22*, 101–123.

### 4.8 Teaming, partnerships and cooperative AI

- Bansal, G., Nushi, B., Kamar, E., Weld, D.S., Lasecki, W.S. and Horvitz, E., (2019,). Updates in human-AI teams: Understanding and addressing the performance/compatibility tradeoff. In *Proceedings of the AAAI Conference on Artificial Intelligence* (Vol. 33, No. 01, pp. 2429-2437). https://doi.org/10.1609/aaai.v33i01.33012429
- *Added:* Klein, G., Woods, D. D., Bradshaw, J. M., Hoffman, R. R., & Feltovich, P. J. (2004). Ten challenges for making automation a "team player" in joint human-agent activity. *IEEE Intelligent Systems, 19*(6), 91–95. https://doi.org/10.1109/MIS.2004.74
- *Added:* Clark, H. H., & Brennan, S. E. (1991). Grounding in communication. In L. B. Resnick, J. M. Levine, & S. D. Teasley (Eds.), *Perspectives on socially shared cognition* (pp. 127–149). APA.
- *Added:* Barke, S., James, M. B., & Polikarpova, N. (2023). Grounded Copilot: How programmers interact with code-generating models. *Proc. ACM Program. Lang., 7*(OOPSLA1), 85–111. https://arxiv.org/abs/2206.15000
- *Added:* Mozannar, H., Bansal, G., Fourney, A., & Horvitz, E. (2024). Reading between the lines: Modeling user behavior and costs in AI-assisted programming. In *Proceedings of CHI '24*. ACM. https://doi.org/10.1145/3613904.3641936