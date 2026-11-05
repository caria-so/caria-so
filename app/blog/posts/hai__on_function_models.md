---
title: "On Function Modelling"
thread: hai
keywords: [HCI, AI tooling, developer workflow, function modelling, function structures, FAST, envelope analysis, KLM-GOMS, Wizard of Oz]
author: "Federico Caria"
date: "2025-07-12"
tags: 
summary: "Notes from class Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristensson - Cambridge University. Expanded with worked examples and literature."
image:
---

Do not commit to specific solutions before modelling and possibly put together quant/qual data. Pure divergence if time allows.

---

## What counts as a system?

A gearbox is part of a car, which operates on roads, which exist inside legal and economic frameworks. So where do we draw the line? A system is layered complexity, the whole point is to take an honest stance. 

A **system boundary** is not a physical fence but a conscious decision about the stuff being designed. Anything outside that boundary becomes noise. Boundary is hard to scope, however so important as it shapes not only what we build, but also what **risks we assess** later in the game.

A functional description that ignores non-functional aspects (like usability or experience) feels increasingly outdated.

**Example.** Take an AI code-completion assistant. Three plausible boundaries:

1. *Plugin only*: editor context in, suggestion out. Risks assessed: latency, suggestion quality.
2. *Plugin + developer*: adds acceptance, rejection, editing. New risks: over-trust, accepting by slip, interruption of flow.
3. *Plugin + developer + review pipeline*: adds code review, CI, team norms. New risks: unreviewed generated code reaching production, reviewers assuming "the AI already checked it".

Same artefact, three different risk registers. Boundary 1 cannot even *see* the failure that matters most in boundary 3. This is the practical meaning of "the boundary shapes what risks we assess".

**Reading.**
- Meadows (2008) is the most readable intro to boundaries and why they are always a choice.
- Ulrich (1983) and Midgley (2000) go further: boundary judgements are value judgements, and someone should be asked who is inside and outside. Useful if the "noise" outside the boundary is actually a stakeholder.
- For the non-functional point: ISO 9241-11 defines usability as effectiveness, efficiency and satisfaction in a context of use, i.e. a standards-level statement that function alone is not enough.

---

## Functions vs. function carriers: separating the *what* from the *how*

This distinction is key. A **function** describes an integral element — the *what*. A **function carrier** is a particular solution that realises it — the *how*. A functional description is therefore intentionally abstract; it wants to avoid **design fixation**, that tendency to lock onto the first plausible solution and miss better alternatives.

Spending time at the functional level is not a delay. Rushing to the detailed description too early closes off branches of possibility before we have even mapped them.

**Example.** Function: *Accept suggestion*. Carriers: Tab key, a click, a voice command ("accept"), a gaze dwell, automatic acceptance after a pause. If the design brief says "add a Tab-to-accept button" the function has already been collapsed into one carrier. Note too that a *human* can be a function carrier: *Judge candidate* is carried by the developer, with a latency, an error rate and fatigue. That is why the human belongs inside the model rather than outside it.

**Example (fixation).** In Jansson and Smith's original experiments, participants who were shown an example solution reproduced its features in their own designs, including flawed ones; a control group without the example fixated less. The design lesson: the first screenshot of "ghost text in grey" that lands on the team's table behaves like that example.

**Reading.**
- Pahl et al. (2007) is the source of the function / function carrier split in engineering design, and the textbook behind most of this module.
- Jansson & Smith (1991) coined *design fixation*; Crilly & Cardoso (2017) is the best map of what has been studied since, and what is contested.

---

## Function structures: following the flows

Function structures model a system through inputs and outputs of **signals, energy, and material** between subfunctions. In human–AI systems, the emphasis is typically on **signals** rather than energy or material.

The approach makes the *interactions* between functions visible. Decomposing an overall function into subfunctions with explicit input/output flows forces me to ask: what does each step actually need in order to proceed, and what does it pass on? The example of the touchscreen keyboard helped me see how a seemingly simple interaction can be unpacked into a chain of signal transformations.

This is so useful when looping. It's already a sort of contract.

**Example (from the paper).** Kristensson and Müllners decompose *Type Word* into *Type Key*, *Predict Word* and *Select Word Prediction*. A key press becomes an observation; the observation plus a language-context signal becomes word hypotheses; hypotheses plus a word-selection signal become the typed word. They also sketch an auto-correct variant that adds an uncertainty signal, which is a nice demonstration of a function structure growing by adding one signal instead of redrawing everything.

**Example (my transposition to code completion).**

```
Complete Code
│
├─ Observe Context    in:  editor state (cursor, buffer, repo)      out: context
├─ Generate Candidates in:  context                                  out: candidates + confidence
├─ Present Candidate  in:  top candidate, confidence                 out: rendered suggestion
├─ Judge Candidate    in:  rendered suggestion, developer intent    out: accept | reject | edit   ← human carrier
└─ Commit Edit        in:  decision                                  out: buffer change  ──┐
        ▲                                                                                 │
        └────────────────────────── loop: new context ◄───────────────────────────────────┘
```

Why this earns its keep: the *confidence* signal flows from Generate to Present, so it is a design decision whether the interface exposes it at all. Amershi et al.'s guidelines on conveying uncertainty and supporting efficient correction map directly onto which signals you choose to pass along. In the loop, each arrow is also a testable interface: you can mock the upstream function and test the downstream one. That is the "contract" intuition made concrete.

**Reading.**
- Kristensson & Müllners (2021) for the method applied to text entry. Same group's earlier envelope-analysis paper: Kristensson et al. (2020).
- Pahl et al. (2007) for the original formulation (flows of material, energy, signals).
- Amershi et al. (2019) for 18 guidelines that can be read as constraints on which signals a human-AI function structure must contain. Horvitz (1999) for the older mixed-initiative principles (when should the system act vs ask).

---

## FAST diagrams: abstraction over time

Where function structures emphasise *flow*, **FAST diagrams** (Function Analysis Systems Technique) emphasise *abstraction*. They decompose an overall function into successively more specific, **time-ordered** functions, each expressed as a verb and a noun.

FAST diagrams forces answers to *how* questions at every level of abstraction. They also help surface operational modes we might otherwise forget — configuration, updating, error recovery — because the method asks us to chronologically trace everything the system must do.

FAST diagrams are a way to break down workflow stages, whereas function structures help see the exchange of information between components. Both can be parameterised, which leads into good numbers.

**Example.** Read left to right asks *how?*; right to left asks *why?*. If a box fails either test, it is at the wrong level.

```
 why? ◄──────────────────────────────────────────────── how? ►

Help developer      Suggest code        Read context
write correct   ──► ────────────────►   Rank candidates
code                                    Display suggestion
                    Let developer       Accept suggestion
                    control output ──►  Reject suggestion
                                        Edit suggestion

   (operational modes the chronological trace forces us to add)
                    Configure triggers ─► Set pause threshold / enable per language
                    Recover from error ─► Undo accepted suggestion / report bad output
                    Update model ───────► Refresh index / change model version
```

Check the *why* direction on "Undo accepted suggestion": why? to recover from error; why? to let the developer control output; why? to help write correct code. Chain holds. "Display suggestion" is a function; "ghost text" is a carrier and does not belong on the diagram.

**Caveat on the "time-ordered" wording.** Classical FAST (Bytheway) is organised by the how–why logic and is not strictly a timeline; the chronological reading is how the course (and several later variants) use it. Worth stating explicitly when comparing with the value-engineering literature, where the method comes from.

**Reading.**
- Bytheway (2007) is the originator's own book. He presented FAST at the 1965 SAVE conference as an extension of Miles's value analysis.
- Miles (1972) for the value-engineering root: define what a thing *does* before arguing about what it *is*.
- Pahl et al. (2007) place function structures and the broader function-based design process in the same toolbox.

---

## From functions to concepts: morphological charts and evaluation

Once functions are clear, we can populate a **morphological chart**: a table that maps each function to possible **function carriers**. Each row is a function; each cell in the row is a candidate solution. A **concept** is then simply a combination of carriers, one per function.

The module introduces formal **concept evaluation** through weighted scoring. Numbers are rough. Weightings come from things like focus group priorities; scores come from expert judgment. Because of that intrinsic uncertainty, the narrative explanation matters as much as the score. 

We are not optimising for the highest number; we are making explicit trade-offs and explaining why a particular concept is preferable despite (or because of) its weaknesses.

**Example (chart).**

| Function | Carrier 1 | Carrier 2 | Carrier 3 | Carrier 4 |
|---|---|---|---|---|
| Trigger suggestion | every keystroke | after pause | explicit shortcut | on newline |
| Present suggestion | inline ghost text | popup list | side panel | |
| Accept suggestion | Tab | click | voice | |
| Communicate confidence | none | colour/opacity | numeric | hide below threshold |

4 × 3 × 3 × 4 = 144 possible concepts. Nobody evaluates 144; the chart's job is to make the space visible so that the 3 or 4 concepts you carry forward are *chosen*, not inherited.

**Example (weighted scoring, and why the narrative matters).** Criteria and weights: low interruption 0.4, low acceptance cost 0.3, verifiability 0.3. Scores 1-5.

| | Interruption (0.4) | Accept cost (0.3) | Verifiability (0.3) | Total |
|---|---|---|---|---|
| Concept A: ghost text, Tab, no confidence | 4 | 5 | 2 | **3.7** |
| Concept B: popup list, click, confidence shown | 3 | 3 | 5 | **3.6** |

A wins by 0.1, which is inside the noise of expert scoring. Shift 0.1 of weight from interruption to verifiability (0.3 / 0.3 / 0.4) and it flips: A = 3.5, B = 3.8. A rank that flips under a 0.1 change in one weight is not a result; it is a prompt for the narrative ("A is better if you trust your users to review, B if the cost of an undetected error is high"). This is the same logic as the sensitivity analysis in the Parameters section, applied to the weights.

**Reading.**
- Zwicky (1969) is the origin of the morphological box (for jet engines and astronomy), and Álvarez & Ritchey (2015) surveys later applications.
- Pugh (1990) for concept selection against a datum (a reference concept). Note it is a *relative* comparison (better / same / worse), different from the absolute weighted sum above. Useful as a cross-check when the weights are the contested part.
- A note on provenance: Kristensson & Müllners (2021) apply function structures and envelope analysis but, as far as I can see, do not use a morphological chart; the chart and weighted scoring come from the wider engineering-design toolchain (Pahl et al.) as taught in the module.

---

## Parameters: what we can tune and what we cannot

Every functional model can be parameterised. 

**Controllable parameters** are those the design team can adjust — the number of recommendations shown, the modality of the interface, the choice of algorithm, the training data. 

**Uncontrollable parameters** belong to the environment or the user population — accuracy ceilings, noise, human error (mistakes and slips), and the variety of user strategies.

Understanding this split is formative. It clarifies where design effort goes and where we need **sensitivity analysis**. Instead of pretending we can control everything, we model how the system behaves when uncontrollable factors shift. Honest stance Per!

**Example (from the paper).** In the predictive-text model the cost parameters are the time to press a key (baseline 0.26 s) and the time to react to and select a prediction (baseline 0.45 s); prediction accuracy is modelled with a stochastic oracle blended with a real language model. Alongside these sit *latent* user-strategy parameters: minimum word length worth predicting, how many letters the user types before looking at predictions, and how long they persevere. The designer cannot set those, only influence them through the interface. That "uncontrollable but influenceable" middle category is worth naming.

**Example (code completion).**

| Controllable | Uncontrollable | Latent / user strategy |
|---|---|---|
| number of candidates shown | model accuracy on *this* codebase | how long devs wait before typing on |
| trigger policy (keystroke / pause) | developer review diligence | when they bother to check suggestions |
| latency budget | slips (accidental Tab-accept) | tolerance for wrong suggestions |
| confidence threshold | codebase idiosyncrasy | |

**Reading.**
- On the human-error line: Norman (1981) for the classic taxonomy of action slips, and Reason (1990) for the slip / lapse / mistake distinction. The notes' "mistakes and slips" is this.
- Saltelli et al. (2008) for sensitivity analysis done properly (global vs one-at-a-time). The weight-flip above is the one-at-a-time version.

---

## Envelope analysis: testing ideas before building them

Now three methods for early-stage analysis.

**Wizard of Oz studies** are useful when the underpinning AI does not yet exist or is too expensive to build. A human operator simulates the system so we can observe user behaviour and collect data early. The trade-off is realism: response times may be off, and it can be hard to simulate truly representative tasks.

**Example.** Kelley's CAL (Calendar Access Language, 1984) is the classic. Participants believed they were typing English to a calendar program; for the first run the experimenter simulated the whole system, and in a later phase the partly built program ran with the experimenter stepping in when it made mistakes. The point: build the grammar from what users actually say, not from what designers expect. A modern equivalent for the code assistant: a human senior developer typing the "suggestions" behind a mock IDE, to see how people react to a *good* suggester before one exists. Gould et al.'s simulated "listening typewriter" (1983) did the same for speech dictation. The honest caveat is the one in the note: the wizard is faster, more consistent and smarter than the real thing will be, so treat results as an upper bound on the experience.

**KLM-GOMS** offers a lightweight way to estimate expert task times without recruiting users. The standard operators (K, P, B, BB, H, M, W(t)) let us sketch how long a workflow might take. Its major limitation is that it assumes error-free expert behaviour, so it cannot model learning curves or slips. Quick comparative tool early on. Needs validation through actual user studies before anyone treats the numbers as ground truth.

**Example.** Textbook operator times: K (keystroke) 0.2 s, P (point) 1.1 s, H (home hands) 0.4 s, M (mental preparation) 1.35 s, BB (click) 0.2 s. Accept a suggestion:

- Keyboard: M K = 1.35 + 0.2 = **1.55 s**
- Mouse: M H P BB H = 1.35 + 0.4 + 1.1 + 0.2 + 0.4 = **3.45 s**

So Tab saves about 1.9 s per acceptance, before anyone has built anything. What the model does *not* say is the cost of deciding whether the suggestion is right; M lumps that into 1.35 s of "mental preparation". For AI suggestions that verification cost is the whole game, which is exactly the limitation the note flags. Treat KLM as a way to compare *mechanics*, and a user study as the way to measure *judgement*.

**Example (validation).** Project Ernestine is the evidence that this style of modelling can be trusted at all. NYNEX was considering new workstations for telephone operators; a GOMS analysis (the CPM-GOMS variant, not plain KLM) predicted the new one would be slower, which was contrary to expectations. The field trial confirmed it: 0.65 s slower per call observed against 0.63 s predicted, which Gray et al. put at almost $2 million a year in extra costs. Worth citing whenever someone says cheap models can't beat user studies. Worth remembering that it worked for expert, routine, error-free-ish work.

**Computational experiments** use simulated oracles — ideal or deliberately imperfect — to explore how system outcomes change as parameters shift. FAVOURITE! The *Parakeet* case study was particularly clarifying: by simulating a word-confusion network with varying numbers of alternatives, deletion features, and morphological support, the researchers could optimise parameters before committing to a full prototype. The insight that more than two or three word hypotheses yield diminishing returns is exactly the kind of evidence that saves expensive iteration later.

*[Check: the oracle word-error-rate vs cluster-size curve is in Vertanen & Kristensson (2010), Fig. 6, if you want the exact shape behind the "two or three" figure. Also in the same paper: they chose morphological variants despite their lower performance in the computational experiments, for other design reasons. A nice real-life case of the "narrative beats the number" point.]*

**Example (the paper's own envelope analysis).** Kristensson and Müllners sweep the strategy parameters of predictive text and report net entry rates from about −8.8 to +2.9 WPM depending on strategy alone. The best strategy at their baseline gives only about 9.4% keystroke savings, while regions with more than 40% keystroke savings correspond to *negative* net entry rate. Lesson: the metric everyone optimises (keystrokes saved) can point in the opposite direction from the one that matters (words per minute), and you can see it in a simulation before writing a line of product code.

**Example (toy envelope for code completion, built from the paper's baseline costs).** Typing an 8-character token costs 8 × 0.26 = 2.08 s. With a suggestion after 3 characters: if right, 3 × 0.26 + 0.45 = 1.23 s; if wrong, you also type the remaining 5, so 1.23 + 5 × 0.26 = 2.53 s. Break-even accuracy p solves p·1.23 + (1−p)·2.53 = 2.08, so p ≈ 0.35. Below roughly one-in-three correct, suggestions *slow you down* in this simplified model. Now sweep p (accuracy ceiling, uncontrollable) against the review cost (controllable through UI) and you have an envelope: the region of the design space where the idea pays. Simplified on purpose (it ignores the cost of reading a wrong suggestion beyond the reaction time, and it treats strategy as fixed), but it makes the point.

What links all three methods is the idea of **envelope analysis**: exploring the operating envelope of a design before heavy prototyping. I am coming to see this as a form of intellectual prototyping — learning early, failing cheaply, and entering user studies with sharper hypotheses.

**Reading.**
- Kelley (1984); Dahlbäck et al. (1993) for the practical how-to and methodological caveats of Wizard of Oz.
- Card, Moran & Newell (1980) for KLM; John & Kieras (1996) compares KLM, the original GOMS, NGOMSL and CPM-GOMS on a single task, which is the fastest route to understanding the family.
- Gray et al. (1993) for validation.
- Kristensson & Müllners (2021); Vertanen & Kristensson (2009, 2010) for envelope analysis and Parakeet.

---

## Bibliography

Álvarez, A., & Ritchey, T. (2015). Applications of general morphological analysis: From engineering design to policy analysis. *Acta Morphologica Generalis, 4*(1).

Amershi, S., Weld, D., Vorvoreanu, M., Fourney, A., Nushi, B., Collisson, P., Suh, J., Iqbal, S., Bennett, P. N., Inkpen, K., Teevan, J., Kikin-Gil, R., & Horvitz, E. (2019). Guidelines for human-AI interaction. In *Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems*. ACM Press. https://doi.org/10.1145/3290605.3300233

Bytheway, C. W. (2007). *FAST creativity & innovation: Rapidly improving processes, product development and solving complex problems*. J. Ross Publishing.

Card, S. K., Moran, T. P., & Newell, A. (1980). The keystroke-level model for user performance time with interactive systems. *Communications of the ACM, 23*(7), 396–410. https://doi.org/10.1145/358886.358895

Card, S. K., Moran, T. P., & Newell, A. (1983). *The psychology of human-computer interaction*. Lawrence Erlbaum.

Crilly, N., & Cardoso, C. (2017). Where next for research on fixation, inspiration and creativity in design? *Design Studies, 50*, 1–38. https://doi.org/10.1016/j.destud.2017.02.001

Dahlbäck, N., Jönsson, A., & Ahrenberg, L. (1993). Wizard of Oz studies — why and how. *Knowledge-Based Systems, 6*(4), 258–266. https://doi.org/10.1016/0950-7051(93)90017-N

Engelbart, D. C., & English, W. K. (1968). A research center for augmenting human intellect. In *Proceedings of the AFIPS Fall Joint Computer Conference* (Vol. 33, pp. 395–410).

Gould, J. D., Conti, J., & Hovanyecz, T. (1983). Composing letters with a simulated listening typewriter. *Communications of the ACM, 26*(4).

Gray, W. D., John, B. E., & Atwood, M. E. (1993). Project Ernestine: Validating a GOMS analysis for predicting and explaining real-world task performance. *Human-Computer Interaction, 8*(3), 237–309. https://doi.org/10.1207/s15327051hci0803_3

Horvitz, E. (1999). Principles of mixed-initiative user interfaces. In *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '99)* (pp. 159–166). ACM Press.

Jansson, D. G., & Smith, S. M. (1991). Design fixation. *Design Studies, 12*(1), 3–11.

John, B. E., & Kieras, D. E. (1996). The GOMS family of user interface analysis techniques: Comparison and contrast. *ACM Transactions on Computer-Human Interaction, 3*(4), 320–351.

Kelley, J. F. (1984). An iterative design methodology for user-friendly natural language office information applications. *ACM Transactions on Office Information Systems, 2*(1), 26–41. https://doi.org/10.1145/357417.357420

Kieras, D. (2001). *Using the keystroke-level model to estimate execution times*. University of Michigan technical note.

Kristensson, P. O., Lilley, J., Black, R., & Waller, A. (2020). A design engineering approach for quantitatively exploring context-aware sentence retrieval for nonspeaking individuals with motor disabilities. In *Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems* (Paper 398). ACM Press. https://doi.org/10.1145/3313831.3376525

Kristensson, P. O., & Müllners, T. (2021). Design and analysis of intelligent text entry systems with function structure models and envelope analysis. In *Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems* (Article No. 584). ACM Press. https://doi.org/10.1145/3411764.3445566

Meadows, D. H. (2008). *Thinking in systems: A primer*. Chelsea Green.

Midgley, G. (2000). *Systemic intervention: Philosophy, methodology, and practice*. Kluwer/Plenum.

Miles, L. D. (1972). *Techniques of value analysis and engineering* (2nd ed.). McGraw-Hill.

Norman, D. A. (1981). Categorization of action slips. *Psychological Review, 88*(1), 1–15.

Pahl, G., Beitz, W., Feldhusen, J., & Grote, K.-H. (2007). *Engineering design: A systematic approach* (3rd ed.). Springer.

Pugh, S. (1990). *Total design: Integrated methods for successful product engineering*. Addison-Wesley.

Reason, J. (1990). *Human error*. Cambridge University Press.

Saltelli, A., Ratto, M., Andres, T., Campolongo, F., Cariboni, J., Gatelli, D., Saisana, M., & Tarantola, S. (2008). *Global sensitivity analysis: The primer*. Wiley.

Ulrich, W. (1983). *Critical heuristics of social planning: A new approach to practical philosophy*. Haupt.

Vertanen, K., & Kristensson, P. O. (2009). Parakeet: A continuous speech recognition system for mobile touch-screen devices. In *Proceedings of the 14th International Conference on Intelligent User Interfaces* (pp. 237–246). ACM Press.

Vertanen, K., & Kristensson, P. O. (2010). Intelligently aiding human-guided correction of speech recognition. In *Proceedings of the 24th AAAI Conference on Artificial Intelligence* (pp. 1698–1701). https://doi.org/10.1609/aaai.v24i1.7712

Zwicky, F. (1969). *Discovery, invention, research through the morphological approach*. Macmillan.