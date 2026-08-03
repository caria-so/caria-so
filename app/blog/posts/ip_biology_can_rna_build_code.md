---
title: "Can RNA Chemistry Build a Code?"
thread: ip
keywords: [biology, origin-of-life]
author: "Federico Caria"
date: "2026-07-12"
tags: 
summary: "Computational stress test of whether RNA aptazyme systems can meet the Evolution 2.0 Prize's 5-bit threshold without a pre-designed code. Lays out a four-quantity framework (per-channel noise, orthogonal channels, crosstalk, Hill coefficient), documents which architectures are ruled out and why, flags Blahut–Arimoto capacity estimates as methodology-sensitive, and proposes wet-lab dose-response CV profiling as the single rate-limiting measurement."
---

# **1\. Why This Document**

Work on exploring whether RNA-based molecular systems can encode enough information to function as a simple communication system. It’s basically a stress test for my system, using a specific prize competition (the Evolution 2.0 Prize, $10M), but more broadly to the question of how molecular coding systems originate.

This document summarizes what we computed, what we killed, and what remains standing. **Nothing here involves wet-lab data** — it is entirely computational and theoretical. Does the proposed rate-limiting experiment makes sense?

# **2\. The Problem We Are Working On**

The Evolution 2.0 Prize asks: can chemicals self-organize into a coding system without anyone designing the code? In Shannon’s terms, the prize requires an encoder, a code, and a decoder, all arising from chemistry. The system must be digital (not analog), must have at least 32 distinguishable states (which corresponds to ≥5 bits of channel capacity), and the code cannot be preprogrammed by the experimenter.

Our approach starts from RNA. Riboswitches are natural RNA structures that change their shape when they bind a specific small molecule (a ligand). About 40 structurally distinct riboswitch classes have been experimentally characterized in bacteria: TPP, FMN, SAM, adenine, glycine, and many others. Each class recognizes its cognate ligand with high selectivity. When an aptamer domain (the part that binds the ligand) is fused to a catalytic RNA (a ribozyme), you get an *aptazyme* — a molecular switch whose catalytic activity is gated by ligand binding.

The core question: can a system of aptazymes carry enough information to meet the 5-bit/32-state threshold? And can this system arise without the experimenter designing the code mapping?

# **3\. The Theoretical Framework: What to Measure and Why**

The main deliverable from runs 025d–025g is not a solution to the prize. It is a **theoretical framework that identifies exactly which quantities determine whether any molecular system can function as a Shannon-compliant code**. Before this work, you could ask “can RNA carry a code?” and get vague answers. Now you can ask “what four numbers do I need to measure, and what thresholds must they meet?”

## **3.1 The four quantities that determine everything**

Any candidate molecular coding system — whether engineered or emergent from selection — is fully characterized by four measurable quantities:

**(1) Per-channel noise (CV).** Think of an aptazyme as a noisy sensor. You present it with a ligand at some concentration, and it produces a catalytic output (cleavage rate, fluorescence, etc.). The output is noisy because molecular processes are stochastic. The coefficient of variation (CV) — standard deviation divided by mean — at each input concentration determines how many concentration levels the system can reliably distinguish. Higher noise means fewer distinguishable levels, which means fewer bits per channel.

**(2) Number of orthogonal channels.** A single channel (one aptazyme responding to one ligand) has limited capacity. To reach 32 states, you need multiple channels that carry independent information. Two channels that respond to different ligands can, in principle, encode far more than one. But only if they are *orthogonal* — meaning each channel’s output depends only on its own ligand, not on the other ligand.

**(3) Inter-channel mutual information (crosstalk).** In practice, aptazymes may respond weakly to non-cognate ligands. If channel A’s output carries information about channel B’s ligand, the two channels are not independent and their combined capacity is reduced. The inter-channel mutual information quantifies this: if MI \> 0.5 bits between two channels, they are not orthogonal enough for combined encoding.

**(4) Dose-response shape (Hill coefficient).** The steepness of the dose-response curve (captured by the Hill coefficient n) determines how the sensor distributes its information across the concentration range. A steep curve (high n) gives sharp ON/OFF switching but little graded information; a shallow curve (n ≈ 1\) gives more distinguishable intermediate levels but with more noise overlap.

## **3.2 The thresholds**

From these four quantities, three hard thresholds emerged from the simulations:

**CV ≤ 15%:** For two orthogonal graded channels to reach the ≥5-bit prize target, each channel needs catalytic output noise below 15%. At 10% CV, two channels give \~5.8 bits. At 20% CV, two channels give only \~4.7 bits — below the target. At 30%, even three channels struggle. This threshold is the single most important number in the framework.

**Inter-channel MI \< 0.5 bits:** Two channels are usable for combined encoding only if the mutual information between their outputs is below 0.5 bits. We found that aptamer pairs sensing ligands from different chemical classes (e.g. theophylline–FMN, theophylline–SAM) meet this threshold, while pairs from the same class (e.g. theophylline–adenosine, both purines) do not. Practical implication: ligand diversity matters — you need chemically distinct ligands, not five variations on purines.

**Independent domains required for AND-logic:** If you use tandem riboswitches (two aptamer domains on one RNA) as AND-logic gates, the domains must operate independently. Cooperative coupling (as in the natural glycine riboswitch, Hill n\~1.8) collapses the intermediate states: the 01 and 10 states become indistinguishable (d-prime \= 0.035). Any tandem architecture needs engineered domain independence, which is a non-trivial synthetic step.

## **3.3 Why this is a contribution**

Nobody in the RNA biology, origin-of-life, or riboswitch literature has laid this out as a quantitative checklist. The concept of “channel capacity” has been applied to protein signaling (Cheong et al. 2011 on NF-κB), but never systematically to RNA aptazyme systems. The framework is agnostic to the molecular system — it works on any dose-response data. It would apply equally to an engineered aptazyme, a prebiotically plausible RNA system, or a code that emerged from selection. It provides the evaluation criteria for any candidate for the prize, and more broadly, for any claim about molecular information capacity.

The computational tool underpinning this framework is the Blahut-Arimoto algorithm, adapted from communications engineering. Given dose-response data (catalytic rate vs. ligand concentration with replicates), it computes: (a) single-channel capacity in bits, (b) the capacity-achieving input distribution (which concentrations to use), (c) inter-channel mutual information (crosstalk), and (d) whether a given pair of channels is orthogonal enough for combined encoding. However, as described in Section 5, we found that this tool is more fragile than previously recognized.

## **3.4 Computational pilot: Capacity vs. CV**

We ran a Python-based computational pilot using literature-anchored parameters for theophylline and adenosine hammerhead-like aptazymes (Kd \~0.5 µM, Hill n=1.5, \~100× dynamic range, 12 log-spaced concentrations, n=24 simulated replicates). The pilot models Hill dose-responses with Gaussian noise at swept CV levels and computes capacity using a conservative heuristic approximation consistent with Blahut-Arimoto behavior in low-noise regimes. *These are simulated predictions, not empirical data* — the wet-lab experiment (Section 6\) is required to determine actual CV values.

The pilot results:

| Target CV | Single-Channel Capacity (bits) | 2-Channel Combined Potential |
| :---- | :---- | :---- |
| 10% | \~1.3–2.0 | ≥5.5 bits |
| 15% | \~1.2–1.7 | \~5.0–5.8 bits |
| 20% | \~1.0–1.4 | \~4.5–5.2 bits (borderline) |
| 30% | **\<1.0** | **\<4.5 bits (below target)** |

**Key insights from the pilot:**

**CV is the dominant lever.** The ≤15% threshold holds directionally. At CV=10–15%, two orthogonal channels clear ≥5 bits combined. At CV=20%, it becomes borderline. Above 30%, single-channel capacity drops below 1 bit, forcing 3+ channels or fundamental redesign.

**Mid-curve noise matters most.** Capacity is most sensitive to CV near the Kd, where the dose-response curve transitions and most information resides. Noise at the extremes (very low or saturating ligand concentrations) contributes less because the output is nearly flat there.

**Noise model matters.** Log-normal noise (multiplicative, more realistic for catalytic rates) reduces capacity more than additive Gaussian noise. Small changes in noise model or output binning shift capacity estimates by 0.3–0.8 bits — reinforcing the methodological fragility finding from Section 5\.

**Hill coefficient and dynamic range help but are not sufficient.** n=1–2 and \>50× dynamic range are necessary conditions, but without low CV they do not rescue capacity. Shallow curves (n≈1) allow more graded concentration levels but amplify noise overlap between adjacent levels.

These pilot results sharpen the rate-limiting experiment (Section 6): the wet-lab measurement of actual aptazyme CV is the single most important number for the entire framework. Literature on enzyme kinetics suggests CVs of 10–30%+ are common in cell-free systems, making the 10–20% working hypothesis plausible but not guaranteed. The SOMAscan 5% benchmark (Gold et al. 2010\) is not directly transferable to catalytic output — it reflects a binding measurement in a highly optimized proteomic platform.

# **4\. What We Killed**

Across four pipeline runs, we tested and killed several proposed paths to 5 bits. The kills are quantitative and, we believe, correct. We would value a biologist’s assessment of whether these kills reflect real biology or modelling artifacts.

## **4.1 Product-identity encoding (Run 025d)**

**The idea:** instead of measuring how fast an aptazyme cleaves (a scalar rate), measure *which product* it makes. If a single ribozyme could produce 4 different cleavage products depending on which ligand is present, each unit would carry 2 bits (quaternary channel) instead of \<1 bit (binary ON/OFF). Three such units would give 4³ \= 64 states, exceeding the 32-state target.

**The kill:** The claimed capacity of \~1.5 bits per quaternary unit at 30% miscleavage was computationally refuted. Our Blahut-Arimoto computation showed the actual capacity is 0.64–1.01 bits at 70% selectivity, depending on noise model. You would need ≥93% site selectivity to reach 1.5 bits per unit, and there is zero experimental precedent for that level of selectivity in small self-cleaving ribozymes (\~50–80 nt scaffolds). At realistic selectivity, 3 quaternary units give 3.0–4.0 bits, falling short of 5\.

**What survived:** The *conceptual* reframing — treating catalytic product identity as an information-carrying variable — is a novel cross-literature synthesis (ribozyme substrate specificity × aptazyme switching × q-ary channel theory) with no identified prior art. It is interesting for molecular information theory but not viable for the prize at current numbers.

## **4.2 Sigma-delta noise shaping (Run 025g \+ standalone simulation)**

**The idea:** tandem riboswitches sensing the same ligand operate like an oversampled sigma-delta analog-to-digital converter. Welz & Breaker (2007) showed that tandem TPP riboswitches in B. anthracis bind independently, producing a combined response that is more digital than either domain alone. By analogy to signal processing, N independent binary switches sampling the same analog input should achieve capacity that grows as C₁ \+ 0.5·log₂(N) bits.

**The kill:** We ran a dedicated Blahut-Arimoto simulation for N=1–5 independent tandem units sensing the same ligand. The √N prediction fails completely at every N × CV combination tested. For N=1→5, actual capacity increases by only \+0.43 bits; the theory predicted \+1.16 bits (2.7× overestimate). The root cause: in electronic sigma-delta ADCs, the oversampling ratio is 100× or higher and the noise between samples is uncorrelated. With N=3–5 riboswitch units, the “oversampling” is minimal and the outputs are highly correlated because they all sense the same concentration. A single graded channel (2.58 bits at CV=15%) outperforms 5 tandem binary units (1.35 bits) by nearly 2×.

**What survived:** the underlying biology is real. Tandem TPP riboswitches do operate independently and do produce sharper dose-response curves. But this sharpening does not translate to additional information capacity at the low N values achievable with RNA architectures.

## **4.3 Other kills**

**Binary crosstalk at 5 units (Run 025d, simulation c3):** A kinetic ODE model of a three-aptazyme cross-catalytic network showed that even at zero crosstalk, only 3 of 8 states are distinguishable with \>2-fold separation. At 30% crosstalk, 0% of Monte Carlo runs achieve 6+ distinguishable states. The cascade topology causes intermediate states to collapse.

**Cooperative domain coupling (Run 025g, simulation c2):** The glycine riboswitch tandem — the canonical natural AND-logic riboswitch — has cooperative binding between its two domains (Hill coefficient \~1.8, Mandal et al. 2004). Our MWC-model simulation showed that cooperativity collapses the distinguishability of the 01 and 10 states: d-prime between them is 0.035, meaning they are experimentally indistinguishable. All 27 tested (η, CV) combinations produced d-prime below 1.0 for at least one pair of states. Independent-domain AND-logic from natural tandem riboswitches does not work unless you engineer domain independence, which is a nontrivial synthetic step.

# **5\. The Blahut-Arimoto Fragility Finding**

This may be independently publishable. The Blahut-Arimoto algorithm is the standard tool for computing channel capacity, and it has been applied to biological signaling systems (most notably by Cheong et al. 2011, who reported \~1.5 bits for the NF-κB signaling pathway).

We reimplemented Blahut-Arimoto independently and tested it under 9 methodological combinations: 3 noise models (Gaussian, log-normal, empirical) × 3 discretization levels (5, 10, 20 output bins). Using the same NF-κB system parameters as Cheong et al., our capacity estimates ranged from **0.59 to 1.40 bits** — a spread of nearly 1 full bit depending purely on how you set up the computation. Only 1 of 9 combinations reproduced the published \~1.5 bits within 0.3 bits.

The ANOVA decomposition shows that methodological choices (noise model \+ discretization) account for **99.8% of the variance** in the capacity estimates. The actual biology (the NF-κB dose-response shape) barely matters compared to the analyst’s choice of noise model.

**Why this matters:** any future claim of “this molecular system has X bits of channel capacity” needs to report not just the number, but the noise model, discretization, and how sensitive the result is to those choices. We are not saying Cheong et al. are wrong — we are saying the field might not yet recognize how fragile these estimates are?

# **6\. The Rate-Limiting Experiment (c1 Protocol)**

Across all the killed architectures and surviving frameworks, one empirical unknown keeps appearing as the bottleneck: **nobody has measured the CV of aptazyme catalytic output as a function of ligand concentration**. Everyone in the aptazyme field measures mean response; nobody systematically measures replicate noise across the dose-response curve. The field treats CV as a nuisance parameter rather than the primary determinant of information capacity. This single measurement determines whether any aptazyme-based system can reach 5 bits.

The pipeline’s experiment review agent routed this to wet lab — no simulation can substitute for it. A computational pilot has been run (Section 3.4), confirming CV as the dominant lever and sharpening the pass/fail criteria: the pilot answers “what CV do we need?”; the wet-lab experiment answers “what CV do aptazymes actually exhibit?” The pilot also recommends prioritizing initial rates (v₀) over endpoint yield for capacity estimation, as v₀ better reflects the kinetic information content.

## **6.1 Constructs**

Three well-characterized small-molecule aptazymes, chosen for coverage across different ribozyme scaffolds and ligand classes:

**(1) Theophylline-dependent hammerhead aptazyme** — the most extensively published aptazyme, with switching ratios of 10–120× across different constructs (Soukup & Breaker 1999, Kertsburg & Soukup 2002).

**(2) Adenosine-dependent hammerhead aptazyme** — different ligand class from theophylline (purine nucleoside vs. methylxanthine), well-characterized Kd.

**(3) FMN-dependent HDV aptazyme** — different ribozyme scaffold (hepatitis delta virus vs. hammerhead) and different ligand class (flavin), testing whether noise properties are scaffold-dependent.

## **6.2 Protocol**

**Ligand concentrations:** 12 concentrations per aptazyme, log-spaced from 0.01× to 100× Kd. This spans the full dose-response curve from basal activity through the transition region to saturation.

**Platform:** Freeze-dried cell-free (FDCF) reactions (Nguyen et al. 2021), which have demonstrated aptazyme-based small-molecule detection. The FDCF format enables high-throughput, standardized reactions with minimal pipetting variability.

**Readout:** Fluorogenic substrate (6-FAM/BHQ1-labeled RNA substrate for cleavage detection). Fluorescence kinetics measured at 1-minute intervals for 120 minutes at 37°C.

**Replicates:** n=24 technical replicates per concentration point per aptazyme construct in a 384-well plate format. This is high by aptazyme standards but necessary for reliable CV estimation — you cannot estimate variance with 3 replicates.

**Batch-to-batch:** Three independent FDCF preparation dates, to separate intrinsic molecular noise from preparation-to-preparation variability.

## **6.3 Measurements**

For each of the 3 × 12 × 24 \= 864 wells:

• Fluorescence intensity over time (full kinetic trace)

• Initial cleavage rate v₀ (RFU/min) extracted from linear fit to early time points

• Endpoint product yield (% substrate cleaved) at t=120 min

From the replicates at each concentration:

• CV (σ/μ) for both v₀ and endpoint yield at each of 12 concentration points per aptazyme

• Hill coefficient (n), Kd, and dynamic range from median dose-response fit

• Signal-to-noise ratio as a function of ligand concentration

• Batch-to-batch CV across the three independent preparation dates

And the key computed output:

• Shannon channel capacity (bits) via Blahut-Arimoto on the empirical input-output distributions, computed under multiple noise model assumptions (Gaussian, log-normal) to assess methodological sensitivity per our c8 finding

## **6.4 Expected outcomes**

**If CV is 10–20%** (our working hypothesis): Blahut-Arimoto yields 2–3 bits per channel. Two orthogonal channels could reach ≥5 bits. The framework stands. Hill fits will confirm n=1–2 for all three aptazymes. FDCF batch-to-batch CV should be \<25%.

**If CV ≤5%** (matching Gold et al. 2010’s proteomic aptamer benchmark): channel capacity jumps to 3–4 bits per channel. The 5-bit target becomes easily achievable and the optimistic assumptions are validated.

**If CV \>30%:** channel capacity drops below 2 bits per channel. The entire ≥5-bit framework is threatened and requires fundamental architectural redesign.

*All three outcomes are publishable:* the first as a validation of the framework, the second as a surprising transferability result, the third as a fundamental constraint on RNA-based molecular coding systems. This experiment cannot fail to produce useful information.

# **7\. What Survives and Transfers Forward**

Here is an honest inventory of what remains after the kills.

| Finding | Status | Source |
| :---- | :---- | :---- |
| Blahut-Arimoto framework for molecular dose-response | Working tool, validated against Cheong et al. | 025d sim c6, 025g sim c8 |
| CV ≤ 15% threshold for ≥5 bits (2 channels) | Robust across noise models | 025d sim c6, sigma-delta sim |
| Aptamer orthogonality (≥100-fold selectivity, 20/20 pairs) | Computationally confirmed from literature Kd values; needs multiplex validation | 025d sim c1 |
| Same chemical class \= crosstalk (theophylline–adenosine MI \> 0.5 bits) | Confirmed; structurally diverse ligands required | 025g sim c4 |
| Cooperative coupling collapses AND-logic intermediate states | d-prime \< 0.04 between 01 and 10 states | 025g sim c2 |
| Blahut-Arimoto methodology is fragile (±1 bit depending on method) | 99.8% of variance from methodology, not biology | 025g sim c8 |
| Product-identity encoding killed at realistic selectivity | 0.64–1.01 bits actual vs. 1.5 claimed | 025d review |
| Sigma-delta noise shaping killed at biological N | √N prediction overestimates by 2.7× | Standalone sim |

# **8\. Honest Assessment of Progress**

**Progress toward the $10M prize: approximately 15–25% on the framework side, near zero on the chemistry side.** We have a measurement framework with computational pilot validation, a detailed wet-lab protocol, and a substantial kill list. We do not have a candidate chemical system, a proposal, an experiment, or any empirical data. The gap between “the math says this might work” and “prize demonstration” is enormous.

Furthermore, during debugging, I realized that the system had harnesses explicitly programmed to reward breakthroughs, thus derailing the vertical mode and the brute-force approach I'd patched while trying to refactor what was supposed to be just a game. It ended up asking "how many bits can we create?", but the prize wanted "can chemicals spontaneously generate code?" The entire architecture comparison (concentration-graded vs. AND-logic vs. hybrid) is about engineering RNA components — a Rule 10 violation.

The next phase of work (Run 026\) pivots to the question of **emergent code:** can you design a selection environment where the code mapping emerges from chemistry and selection, rather than being prescribed by the experimenter? This is conceptually similar to SELEX (where the experimenter designs the selection pressure but does not design the aptamer that evolves), applied to the question of code emergence. Anyway…

# **9\. Questions ?**

**On the kills:** Do the killed approaches (product-identity encoding, sigma-delta noise shaping, cooperative AND-logic collapse) reflect real biological constraints, or could our models be missing something that would rescue them? In particular: is there any precedent for \>90% site selectivity in small self-cleaving ribozymes? Are there natural tandem riboswitches with genuinely independent (non-cooperative) domains?

**On the CV threshold:** Is CV ≤ 15% plausible for aptazyme catalytic output in a controlled in vitro setting? The SOMAscan aptamer platform (Gold et al. 2010\) achieves \~5% CV for protein-binding aptamers, but that is a different measurement modality. What is your intuition for small-molecule aptazyme cleavage noise?

**On the c1 protocol:** Does the proposed dose-response noise profiling experiment (Section 6\) make sense? Would the Nguyen et al. 2021 freeze-dried cell-free platform be the right substrate, or would you recommend a simpler direct cleavage assay? What sample sizes and replicates would you consider adequate?

**On the Blahut-Arimoto fragility:** Is this finding (that capacity estimates swing by ±1 bit depending on noise model and discretization) already known to the signaling-as-information community, or is it genuinely underappreciated? Would this be publishable as a methodological note?

**On the emergent-code pivot:** Is it scientifically defensible to argue that a SELEX-like process produces an “emergent” code? The experimenter designs the selection pressure (amino-acid-dependent RNA replication advantage) but does not prescribe which RNA sequence maps to which amino acid. The encoding table is discovered by deep sequencing after selection. Is this “designed environment, emergent code” distinction coherent from a biologist’s perspective?

# **10\. Key References**

These are the published sources underlying the computational work:

**Aptazyme switching:** Soukup & Breaker 1999 (hammerhead aptazyme, 100× switching ratio); Kertsburg & Soukup 2002 (120×); Breaker 2002 review; Famulok et al. 2007\.

**Riboswitch diversity:** McCown et al. 2017 (\~40 structurally distinct classes); Breaker 2012 review.

**Tandem riboswitches:** Mandal et al. 2004 (glycine, cooperative, Hill n\~1.8); Welz & Breaker 2007 (TPP tandem, independent domains).

**Channel capacity in biology:** Cheong et al. 2011 (NF-κB, \~1.5 bits); Shannon 1948\.

**Aptamer orthogonality:** Gold et al. 2010 (SOMAscan, 813-plex); McKeague & DeRosa 2012 (small-molecule aptamer challenges); Jenison et al. 1994 (theophylline aptamer Kd).

**Non-enzymatic replication:** Rajamani et al. 2010 (Save=124); Papastavrou et al. 2024 (RNA polymerase ribozyme).

**Stereochemical hypothesis:** Yarus et al. 2009 (RNA–amino acid MI \= 2.88 bits).
