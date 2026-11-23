---
title: "Can RNA Chemistry Build a Code?"
thread: ip
keywords: [biology, origin-of-life]
author: "Federico Caria"
date: "2026-09-12"
summary: "A computational stress test of whether RNA aptazyme systems could meet the Evolution 2.0 Prize's 5-bit threshold without a pre-designed code. I set out four quantities that seem to decide the answer, the architectures my simulations ruled out, a worrying sensitivity in how channel capacity is computed, and the one wet-lab measurement I think everything hangs on. I'd value corrections from anyone who works with RNA."
image:
---

# 1. Why this

I've been looking at whether RNA-based molecular systems could encode enough information to work as a simple communication system. It started as a stress test for a pipeline I'm building, using a specific competition as a target (the Evolution 2.0 Prize, $10M), but the underlying question (how molecular coding systems might originate) interested me more than the prize.

This is a summary of what I computed, what I ruled out, and what I think still stands. **None of it involves wet-lab data.** It's entirely computational and theoretical, which is also why I'm publishing it: I'd like to know whether the proposed rate-limiting experiment makes sense to someone who actually does this work.

# 2. The problem

The Evolution 2.0 Prize asks whether chemicals can self-organise into a coding system without anyone designing the code. In Shannon's terms, it requires an encoder, a code and a decoder, all arising from chemistry. The system has to be digital rather than analog, it must have at least 32 distinguishable states (around 5 bits of channel capacity), and the experimenter can't preprogram the code.

I started from RNA. Riboswitches are natural RNA structures that change shape when they bind a specific small molecule (a ligand). Around 40 structurally distinct classes have been characterised experimentally in bacteria (TPP, FMN, SAM, adenine, glycine and others), each recognising its own ligand with high selectivity. When an aptamer domain, the part that binds the ligand, is fused to a catalytic RNA (a ribozyme), the result is an *aptazyme*: a molecular switch whose catalytic activity is gated by ligand binding.

So the question I tried to answer is whether a system of aptazymes could carry enough information to reach the 32-state threshold, and whether such a system could arise without the experimenter designing the code mapping.

# 3. What to measure, and why

The main thing that came out of these runs isn't a solution to the prize. It's a way of framing the question that tells me which quantities to measure and what thresholds they'd have to meet. Before this, I could ask "can RNA carry a code?" and only get vague answers back. Now I can at least ask which numbers I need.

## 3.1 Four quantities

As far as I can tell, any candidate molecular coding system, engineered or emergent, is characterised by four measurable quantities.

**(1) Per-channel noise (CV).** An aptazyme behaves like a noisy sensor: present it with a ligand at some concentration and it produces a catalytic output, with variation, because molecular processes are stochastic. The coefficient of variation (standard deviation over mean) at each input concentration sets how many concentration levels can be told apart, and so how many bits the channel carries.

**(2) Number of orthogonal channels.** One aptazyme responding to one ligand has limited capacity. Reaching 32 states needs several channels carrying independent information, which only works if each channel's output depends on its own ligand and not on the others.

**(3) Crosstalk between channels.** In practice, aptazymes may respond weakly to ligands that aren't their own. If channel A's output carries information about channel B's ligand, the channels aren't independent and their combined capacity falls. The mutual information between their outputs measures this.

**(4) Dose-response shape (Hill coefficient).** How steep the dose-response curve is determines how the sensor spreads information across the concentration range. A steep curve gives sharp on/off switching but little graded information; a shallow one gives more distinguishable intermediate levels, but with more noise overlap between them.

## 3.2 Thresholds

Three thresholds came out of the simulations:

**CV at or below 15%.** For two orthogonal graded channels to reach 5 bits, each channel needs output noise below about 15%. At 10% CV, two channels give roughly 5.8 bits; at 20%, about 4.7 bits, which is below target; at 30%, even three channels struggle. I think this is the most important number in the whole framework.

**Crosstalk below 0.5 bits.** Two channels look usable in combination only if the mutual information between their outputs stays under 0.5 bits. In my calculations, aptamer pairs sensing ligands from different chemical classes (theophylline and FMN, theophylline and SAM) met this, while pairs from the same class (theophylline and adenosine, both purines) did not. If that holds, chemical diversity among the ligands matters more than the number of them.

**Independent domains for AND-logic.** If tandem riboswitches (two aptamer domains on one RNA) are used as AND gates, the domains have to work independently. With cooperative coupling, as in the natural glycine riboswitch (Hill n ≈ 1.8), the intermediate states collapse: in my simulation the 01 and 10 states became indistinguishable (d′ = 0.035). So a tandem architecture would need engineered domain independence, which is not a small synthetic step.

## 3.3 Why I think this is worth writing up

I haven't found this laid out as a quantitative checklist in the RNA biology, origin-of-life or riboswitch literature, though I may well have missed it, and I'd be glad to be pointed at prior work. Channel capacity has certainly been applied to protein signalling (Cheong et al. 2011 on NF-κB); what I haven't found is the same treatment applied systematically to RNA aptazyme systems. The framing doesn't depend on the molecular system: it works on any dose-response data, whether from an engineered aptazyme, a prebiotically plausible RNA system, or a code that emerged from selection.

The computational tool underneath it is the Blahut-Arimoto algorithm, borrowed from communications engineering. Given dose-response data with replicates, it computes single-channel capacity, the input distribution that achieves it, the crosstalk between channels, and whether a pair of channels is orthogonal enough to combine. As section 5 describes, I found this tool more fragile than I expected.

## 3.4 Computational pilot: capacity against noise

I ran a Python pilot using literature-anchored parameters for theophylline and adenosine hammerhead-like aptazymes (Kd around 0.5 µM, Hill n = 1.5, roughly 100× dynamic range, 12 log-spaced concentrations, 24 simulated replicates). It models Hill dose-responses with Gaussian noise at a range of CV levels and estimates capacity with a conservative approximation consistent with Blahut-Arimoto in low-noise regimes. *These are simulated predictions, not data.* Only the wet-lab experiment in section 6 can give the actual CV values.

| Target CV | Single-channel capacity (bits) | Two channels combined |
| :---- | :---- | :---- |
| 10% | ~1.3–2.0 | ≥5.5 bits |
| 15% | ~1.2–1.7 | ~5.0–5.8 bits |
| 20% | ~1.0–1.4 | ~4.5–5.2 bits (borderline) |
| 30% | **<1.0** | **<4.5 bits (below target)** |

What I take from the pilot:

**Noise is the dominant lever.** The 15% threshold holds directionally. At 10–15%, two orthogonal channels clear 5 bits combined. At 20% it's borderline. Above 30%, single-channel capacity falls below 1 bit, which would force three or more channels, or a different design.

**Noise in the middle of the curve matters most.** Capacity is most sensitive to variation near the Kd, where the curve transitions and most of the information sits. Noise at very low or saturating concentrations matters less, because the output is nearly flat there.

**The noise model matters more than I'd like.** Log-normal noise, which is probably more realistic for catalytic rates, reduces capacity more than additive Gaussian noise. Small changes in the noise model or in how outputs are binned move capacity estimates by 0.3–0.8 bits, which is what led to the finding in section 5.

**Hill coefficient and dynamic range help but don't rescue anything.** n between 1 and 2, and more than 50× dynamic range, look necessary but not sufficient. Without low noise they don't recover the capacity. Shallow curves allow more graded levels but increase the overlap between adjacent ones.

All of this sharpens the question for the wet lab. Published work on enzyme kinetics suggests CVs of 10–30% or more are common in cell-free systems, which makes a 10–20% working hypothesis plausible but far from guaranteed. The 5% benchmark from the SOMAscan platform (Gold et al. 2010) isn't directly transferable: it's a binding measurement on a highly optimised proteomic platform, not a catalytic output.

# 4. What I ruled out

Across four pipeline runs I tested and discarded several routes to 5 bits. The arguments are quantitative, and I think they're right, but I'd value a biologist's view on whether they reflect real biology or artifacts of my models.

## 4.1 Product-identity encoding

**The idea.** Instead of measuring how fast an aptazyme cleaves, measure *which product* it makes. If one ribozyme could produce four different cleavage products depending on the ligand present, each unit would carry 2 bits instead of less than 1, and three units would give 64 states.

**Why I dropped it.** The claimed capacity of around 1.5 bits per quaternary unit at 30% miscleavage didn't survive computation. My Blahut-Arimoto calculation gives 0.64–1.01 bits at 70% selectivity, depending on the noise model. Reaching 1.5 bits per unit would need 93% or better site selectivity, and I couldn't find any experimental precedent for that in small self-cleaving ribozymes (scaffolds of roughly 50–80 nt). At realistic selectivity, three such units give 3.0–4.0 bits.

**What I'd keep.** The reframing itself, treating catalytic product identity as an information-carrying variable, draws together ribozyme substrate specificity, aptazyme switching and q-ary channel theory. I haven't found prior art for that combination. It interests me for molecular information theory, even though the numbers don't work for the prize.

## 4.2 Sigma-delta noise shaping

**The idea.** Tandem riboswitches sensing the same ligand might work like an oversampled sigma-delta analog-to-digital converter. Welz & Breaker (2007) showed that tandem TPP riboswitches in *B. anthracis* bind independently and give a combined response more digital than either domain alone. By analogy with signal processing, N independent binary switches sampling the same input should give capacity growing as C₁ + 0.5·log₂(N).

**Why I dropped it.** I ran a Blahut-Arimoto simulation for N = 1 to 5 independent tandem units sensing one ligand, and the √N prediction failed at every combination of N and CV I tried. Going from N = 1 to 5 added only 0.43 bits where the analogy predicted 1.16, an overestimate of 2.7×. The reason seems clear in hindsight: in electronic converters the oversampling ratio is 100× or more and the noise between samples is uncorrelated, whereas with three to five riboswitch units the oversampling is minimal and the outputs are strongly correlated, since they all sense the same concentration. A single graded channel (2.58 bits at 15% CV) beat five tandem binary units (1.35 bits) by nearly two to one.

**What I'd keep.** The biology is real. Tandem TPP riboswitches do operate independently and do sharpen the dose-response curve. That sharpening just doesn't seem to buy information capacity at the small N that RNA architectures allow.

## 4.3 Others

**Binary crosstalk at five units.** A kinetic ODE model of a three-aptazyme cross-catalytic network gave only 3 of 8 states distinguishable at better than two-fold separation, even with zero crosstalk. At 30% crosstalk, none of the Monte Carlo runs reached six or more distinguishable states. The cascade topology collapses the intermediate states.

**Cooperative domain coupling.** The glycine riboswitch tandem, the canonical natural AND-logic riboswitch, has cooperative binding between its domains (Hill n ≈ 1.8, Mandal et al. 2004). My MWC-model simulation showed cooperativity collapsing the distinguishability of the 01 and 10 states, with d′ = 0.035, which would make them indistinguishable experimentally. All 27 combinations of parameters I tested gave d′ below 1.0 for at least one pair of states.

# 5. A fragility I didn't expect

This is the finding I'm least sure what to do with, and the one I'd most like a second opinion on. Blahut-Arimoto is the standard tool for computing channel capacity, and it has been applied to biological signalling, most prominently by Cheong et al. (2011), who reported around 1.5 bits for the NF-κB pathway.

I reimplemented the algorithm independently and tested it under nine methodological combinations: three noise models (Gaussian, log-normal, empirical) by three discretisation levels (5, 10 and 20 output bins). Using the same NF-κB parameters, my capacity estimates ranged from **0.59 to 1.40 bits**, a spread of nearly a full bit depending only on how the computation was set up. One of the nine combinations reproduced the published figure within 0.3 bits.

An ANOVA decomposition puts **99.8% of the variance** in my estimates down to those methodological choices rather than to the dose-response shape itself.

I want to be careful about what this means. It isn't evidence that Cheong et al. are wrong, and the fault may well be in my reimplementation rather than in the method. What it does suggest is that any claim of the form "this molecular system has X bits of capacity", including my own, should come with its noise model, its discretisation and a sensitivity check. Whether this is already well known in the signalling-as-information community is something I genuinely don't know.

# 6. The measurement everything depends on

One empirical unknown kept surfacing behind every architecture I tested: **the CV of aptazyme catalytic output as a function of ligand concentration.** As far as I can tell from the literature, the aptazyme field reports mean responses rather than replicate noise across the dose-response curve, and treats variation as a nuisance rather than as the thing that sets information capacity. If that's right, this one measurement decides whether any aptazyme-based system can reach 5 bits. If such data already exists and I've simply missed it, I'd be glad to hear.

My pipeline's experiment-review step routed this to the wet lab, and I agree: I don't think a simulation can substitute for it. The pilot in section 3.4 answers "what CV would we need?"; this experiment would answer "what CV do aptazymes actually show?". The pilot also suggests using initial rates rather than endpoint yield, since they seem to carry more of the kinetic information.

## 6.1 Constructs

Three well-characterised small-molecule aptazymes, chosen to span scaffolds and ligand classes:

1. **Theophylline-dependent hammerhead aptazyme**, the most extensively published one, with switching ratios of 10–120× across constructs (Soukup & Breaker 1999; Kertsburg & Soukup 2002).
2. **Adenosine-dependent hammerhead aptazyme**, a different ligand class (purine nucleoside rather than methylxanthine) with a well-characterised Kd.
3. **FMN-dependent HDV aptazyme**, a different ribozyme scaffold and a different ligand class again, to test whether noise behaviour depends on the scaffold.

## 6.2 Protocol

- **Ligand concentrations:** 12 per aptazyme, log-spaced from 0.01× to 100× Kd, spanning basal activity through the transition region to saturation.
- **Platform:** freeze-dried cell-free reactions (Nguyen et al. 2021), which have been used for aptazyme-based small-molecule detection and allow standardised, high-throughput reactions with little pipetting variability.
- **Readout:** a fluorogenic substrate (6-FAM/BHQ1-labelled RNA), with fluorescence measured every minute for 120 minutes at 37°C.
- **Replicates:** 24 technical replicates per concentration per construct, in 384-well format. That's high by the field's standards, but variance can't be estimated from three replicates.
- **Batches:** three independent preparation dates, to separate intrinsic molecular noise from preparation-to-preparation variability.

## 6.3 Measurements

For each of the 3 × 12 × 24 = 864 wells: the full fluorescence trace, the initial cleavage rate from a linear fit to early time points, and the endpoint yield at 120 minutes.

From the replicates at each concentration: the CV for both initial rate and endpoint yield, the Hill coefficient, Kd and dynamic range from the median dose-response fit, the signal-to-noise ratio across the concentration range, and the batch-to-batch CV.

And then the computed output: channel capacity via Blahut-Arimoto on the empirical distributions, under more than one noise-model assumption, given the sensitivity described in section 5.

## 6.4 What different results would mean

- **CV of 10–20%**, my working hypothesis: 2–3 bits per channel, and two orthogonal channels could reach 5 bits. The framework would stand.
- **CV of 5% or below**, matching the proteomic aptamer benchmark: 3–4 bits per channel, and the target becomes comfortably reachable.
- **CV above 30%:** below 2 bits per channel, and the whole approach would need rethinking.

All three outcomes seem worth publishing to me: the first as support for the framework, the second as a surprising transferability result, the third as a real constraint on RNA-based molecular coding.

# 7. What survives

An honest inventory of what's left:

| Finding | Status |
| :---- | :---- |
| Blahut-Arimoto framework for molecular dose-response | A working tool, checked against Cheong et al. |
| CV ≤ 15% needed for 5 bits on two channels | Held across noise models |
| Aptamer orthogonality (100-fold selectivity, 20 of 20 pairs) | From literature Kd values; needs multiplex validation |
| Same chemical class means crosstalk | Suggests structurally diverse ligands are required |
| Cooperative coupling collapses AND-logic intermediates | d′ < 0.04 between the 01 and 10 states |
| Capacity estimates are method-sensitive | 99.8% of variance from methodology in my tests |
| Product-identity encoding | Doesn't reach target at realistic selectivity |
| Sigma-delta noise shaping | √N prediction overestimates by 2.7× |

# 8. Where this actually stands

**Towards the prize: maybe 15–25% on the framework side, and close to nothing on the chemistry side.** I have a measurement framework with a computational pilot behind it, a wet-lab protocol, and a list of things that don't work. I don't have a candidate chemical system, a proposal, an experiment, or any data at all. The distance between "the maths says this might work" and a prize demonstration is very large.

There's also a mistake worth recording. While debugging, I realised my pipeline had been set up to reward breakthroughs, which derailed the mode I was running and the brute-force approach I'd patched in while refactoring what had started as a game. The result was that it kept asking "how many bits can we create?" when the prize asks whether chemicals can spontaneously generate a code. The entire architecture comparison (concentration-graded against AND-logic against hybrid) is about engineering RNA components, which is a different question from the one being asked.

So the next run pivots to the question of an **emergent code**: whether a selection environment can be designed in which the code mapping comes out of chemistry and selection rather than being prescribed. It's conceptually similar to SELEX, where the experimenter designs the selection pressure but not the aptamer that evolves, applied to code emergence instead.

# 9. Questions I'd like help with

**On the things I ruled out.** Do they reflect real biological constraints, or could my models be missing something that would rescue them? In particular: is there any precedent for better than 90% site selectivity in small self-cleaving ribozymes? Are there natural tandem riboswitches with genuinely independent, non-cooperative domains?

**On the noise threshold.** Is a CV of 15% or below plausible for aptazyme catalytic output in a controlled in vitro setting? The SOMAscan platform reaches around 5% for protein-binding aptamers, but that's a different kind of measurement. What would you expect for small-molecule aptazyme cleavage?

**On the protocol.** Does the dose-response noise profiling in section 6 make sense? Would the freeze-dried cell-free platform be the right substrate, or would a simpler direct cleavage assay be better? What sample sizes would you consider adequate?

**On the fragility finding.** Is the sensitivity of capacity estimates to noise model and discretisation already known in the signalling-as-information community, or is it underappreciated? Would it be worth writing up as a methodological note?

**On the emergent-code pivot.** Is it defensible to call a code from a SELEX-like process "emergent"? The experimenter designs the selection pressure (an amino-acid-dependent replication advantage) but doesn't prescribe which RNA sequence maps to which amino acid, and the table is read off by sequencing afterwards. Does that distinction between a designed environment and an emergent code hold up from a biologist's point of view?

# 10. Key references

**Aptazyme switching:** Soukup & Breaker 1999 (hammerhead aptazyme, 100× switching ratio); Kertsburg & Soukup 2002 (120×); Breaker 2002 (review); Famulok et al. 2007.

**Riboswitch diversity:** McCown et al. 2017 (around 40 structurally distinct classes); Breaker 2012 (review).

**Tandem riboswitches:** Mandal et al. 2004 (glycine, cooperative, Hill n ≈ 1.8); Welz & Breaker 2007 (TPP tandem, independent domains).

**Channel capacity in biology:** Cheong et al. 2011 (NF-κB, around 1.5 bits); Shannon 1948.

**Aptamer orthogonality:** Gold et al. 2010 (SOMAscan, 813-plex); McKeague & DeRosa 2012 (small-molecule aptamer challenges); Jenison et al. 1994 (theophylline aptamer Kd).

**Non-enzymatic replication:** Rajamani et al. 2010; Papastavrou et al. 2024 (RNA polymerase ribozyme).

**Stereochemical hypothesis:** Yarus et al. 2009 (RNA–amino acid mutual information of 2.88 bits).