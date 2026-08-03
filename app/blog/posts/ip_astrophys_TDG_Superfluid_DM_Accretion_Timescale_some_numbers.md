---
title: "Superfluid Dark Matter and Tidal Dwarf Galaxies: Some Numbers"
thread: ip
keywords: [astrophysics, dark-matter]
author: "Federico Caria"
date: "2026-07-12"
tags: 
summary: "Bondi–Hoyle accretion gives a ~1,280 Gyr timescale (93× the age of the universe), a thermalization bug in the original simulation is corrected from 10⁹ Gyr to ~260 seconds, and the open question becomes whether TDGs must accrete DM at all if they already sit inside the host galaxy's condensate."
image: "/static/assets/images/blog/ip_astrophys_TDG_Superfluid_DM_Accretion_Timescale_some_numbers.jpg"
---

# **1\. The Arithmetic**

This section contains one formula, five inputs, and one output. You can verify the output in five minutes. Everything that follows — whether the physics is right, whether the result means anything — is built on this arithmetic.

## **1.1 The formula**

Bondi-Hoyle accretion rate for a mass M moving through a medium of density ρ at velocity v:

dM/dt \= 4πG²M²ρ / (v² \+ cₛ²)³˲

## **1.2 The five inputs**

| Symbol | What it is | SI value | Source |
| :---- | :---- | :---- | :---- |
| *G* | Gravitational constant | 6.674 × 10⁻¹¹ m³ kg⁻¹ s⁻² | CODATA |
| *M* | TDG mass (10⁸ M☉) | 1.989 × 10³⁸ kg | Typical observed TDG |
| *ρ* | Ambient DM density | 1.78 × 10⁻²³ kg/m³ (0.01 GeV/cm³) | NFW at 50 kpc, MW-like halo |
| *v* | Orbital velocity | 2 × 10⁵ m/s (200 km/s) | Circular velocity at 50 kpc |
| *cₛ* | Sound speed in SFDM | 5 × 10³ m/s (5 km/s) | Berezhiani & Khoury fiducial |

Note: v ≫ cₛ, so the sound speed is negligible. The result is dominated by orbital velocity.

## **1.3 The output**

**dM/dt \= 4.93 × 10¹⁸ kg/s \= 7.82 × 10⁻⁵ M☉/yr**

**t\_accrete \= M / (dM/dt) \= 1,278 Gyr \= 93 × t\_Hubble**

This number was independently verified by a stress test script (comp\_023\_stress\_test\_3.py). The arithmetic is correct.

## **1.4 Sensitivity**

| Vary | Range | Effect on t\_accrete |
| :---- | :---- | :---- |
| ρ | ×0.1 to ×10 | Inversely: ×10 density → \~128 Gyr (still ≫ Hubble) |
| v | 100–300 km/s | Scales as v³: halving v → \~160 Gyr (still too long) |
| M | 10⁷–10⁹ M☉ | Inversely: 10⁹ M☉ → \~13 Gyr (marginal, extreme TDG) |
| **Best case** | All combined | **\~10–15 Gyr — marginal, not comfortably below Hubble time** |

That is the end of the arithmetic. Everything below is physics.

# **2\. The Bug We Found**

The original simulation made two claims: (1) TDGs can’t accrete DM fast enough (1,280 Gyr), and (2) even if they did, TDGs can’t thermalize it into a condensate (10⁹ Gyr). Both were supposed to support the same conclusion.

**Claim 2 is wrong.** The thermalization calculation had a unit conversion bug. The original script used *sigma\_over\_m \= 0.01e-4 \= 10⁻⁶ m²/kg*. The correct conversion of 0.01 cm²/g to SI is 10⁻³ m²/kg. The cross-section was 1,000× too small.

The stress test recalculated with the actual Berezhiani-Khoury parameters:

| Parameter | Original (buggy) | Corrected |
| :---- | :---- | :---- |
| Number density n | — | 3.8 × 10¹⁴ m⁻³ |
| Cross-section σ | \~10⁻¹² m² (too small) | 2.8 × 10⁻⁸ m² |
| Velocity | — | 10⁵ m/s (100 km/s) |
| **τ \= 1/(nσv)** | **\~10⁹ Gyr** | **\~260 seconds** |
| **Discrepancy** | **\~23 orders of magnitude** |  |

With the correct BK cross-section (σ \~ 2.8 × 10⁻⁸ m², which is 10¹² times larger than atomic cross-sections), thermalization is instantaneous. Any DM a TDG manages to capture thermalizes into a condensate in minutes, not gigayears.

This leaves claim 1 standing but reframes the problem. The bottleneck is purely accretion rate. The question becomes: *can a TDG capture enough dark matter?*

# **3\. Why the Physics May Be Wrong**

The 1,278 Gyr number is arithmetically correct for Bondi-Hoyle with those inputs. But there are two reasons the physical setup itself may not apply.

## **3.1 Bondi-Hoyle assumes a classical gas**

Bondi-Hoyle describes a gravitating point mass moving through a weakly-interacting medium that streams past it. The formula was derived for classical gas accretion (Bondi 1952).

Superfluid dark matter is not a classical gas. It has:

• A finite sound speed and quantum pressure

• Long-range phonon-mediated forces

• Quantum coherence over macroscopic scales (healing length)

• A self-interaction cross-section (σ \~ 2.8 × 10⁻⁸ m²) that is enormous — 10¹²× atomic

Whether the standard Bondi-Hoyle formula captures the relevant accretion physics for a quantum superfluid is an open theoretical question. A stress test on a subsequent run (run 023\) explicitly flagged this: *“the Bondi-Hoyle analogy to quantum condensate accretion is explicitly unvalidated.”*

The accretion rate could be higher (if coherent infall or phonon-mediated attraction enhances capture) or lower (if quantum pressure creates an effective barrier). We do not know which.

## **3.2 TDGs may already be inside the condensate**

This may be the more important objection. In Berezhiani & Khoury’s model, the superfluid condensate of a Milky Way-mass halo extends to a condensate radius Rₜ ≈ 157 kpc. Observed TDGs orbit at 12–85 kpc from their parent galaxy.

**Most TDGs sit inside the host’s condensate.**

If a TDG is already immersed in superfluid dark matter, it does not need to accrete anything. The phonon-mediated MOND-like force arises from the superfluid medium itself. The TDG experiences modified gravity because it is embedded in a condensate, not because it has built its own. The entire accretion calculation becomes moot.

Under this reading, SFDM actually *predicts* that TDGs should follow the RAR (at least while inside the host condensate), which is what observations show. The tension with SFDM dissolves.

# **4\. What Remains**

Here is an honest inventory of what we have and what we don’t.

## **4.1 What is solid**

• The Bondi-Hoyle arithmetic: 1,278 Gyr for fiducial parameters. Verified independently. You can check it in five minutes.

• The thermalization bug: the original 10⁹ Gyr claim was wrong by 23 orders of magnitude. With correct BK parameters, thermalization is \~260 seconds.

• The sensitivity analysis: no combination of fiducial-range parameter variations brings the Bondi-Hoyle timescale comfortably below Hubble time.

## **4.2 What is open**

• Whether Bondi-Hoyle applies to superfluid accretion at all. This is a physics question, not a numbers question. It requires theoretical work on superfluid accretion dynamics.

• Whether TDGs need to accrete in the first place, or inherit modified gravity from the host’s condensate. This depends on the condensate radius relative to TDG orbital radii — a calculable quantity that should be checked against the specific SFDM parameters assumed.

• The observational sample: reliable TDG rotation curves exist for a handful of objects (NGC 5291 system, VCC 2062). More data are needed.

• Whether model extensions (different boson mass, cooling during formation, seeded condensation from parent halo) change the picture.

## **4.3 The three-way discriminant**

Despite the caveats, the TDG test remains useful because three frameworks make distinct predictions:

| Framework | Prediction for TDGs | Matches RAR? |
| :---- | :---- | :---- |
| **ΛCDM** | Newtonian: no DM, no anomalous dynamics | **No** |
| **MOND** | Universal modified gravity regardless of formation history | **Yes** |
| **SFDM** | Depends: inside host condensate → yes; outside → probably no | **Depends on Rₜ** |

The critical observation would be a TDG far enough from its parent galaxy to be outside the condensate radius. If such a TDG still follows the RAR, that would constrain SFDM more tightly. If it doesn’t, that would distinguish SFDM from MOND.

# **5\. For Your Own Calculation**

Everything you need to reproduce or challenge this result:

**Bondi-Hoyle accretion (verified):** Plug G, M \= 10⁸ M☉, ρ \= 0.01 GeV/cm³, v \= 200 km/s, cₛ \= 5 km/s into dM/dt \= 4πG²M²ρ/(v²+cₛ²)³˲. You should get 7.82 × 10⁻⁵ M☉/yr, giving t \= 1,278 Gyr.

**Thermalization (corrected):** τ \= 1/(nσv) with n \= 3.8 × 10¹⁴ m⁻³, σ \= 2.8 × 10⁻⁸ m², v \= 10⁵ m/s. You should get \~260 seconds. The original script’s 10⁹ Gyr used σ that was 1,000× too small (unit bug: 0.01 cm²/g was converted as 10⁻⁶ instead of 10⁻³ m²/kg).

**Condensate radius:** For a MW-mass halo with BK fiducial parameters, Rₜ ≈ 157 kpc. Compare this to TDG orbital radii (typically 12–85 kpc) to determine whether the accretion question is even relevant.

**The physics question:** Does Bondi-Hoyle apply to a quantum superfluid with σ \~ 10⁻⁸ m²? This is the interesting open problem.

**Source scripts:** *runs/run\_022b/simulations/sim\_tdg\_accretion.py (original), comp\_023\_stress\_test\_3.py (correction).*

# **References**

*Berezhiani, L., & Khoury, J. (2015).* Theory of dark matter superfluidity. Phys. Rev. D, 92, 103510\.

*Berezhiani, L., & Khoury, J. (2016).* Dark matter superfluidity and galactic dynamics. Phys. Lett. B, 753, 639\.

*Bondi, H. (1952).* On spherically symmetrical accretion. MNRAS, 112, 195\.

*Lelli, F., et al. (2015).* Gas dynamics in tidal dwarf galaxies. A\&A, 584, A113.

*McGaugh, S.S., et al. (2016).* Radial Acceleration Relation. Phys. Rev. Lett., 117, 201101\.

