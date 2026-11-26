---
title: "What breaks when you run heuristic evaluation at scale"
thread: ecommerce
keywords: [ux research, heuristic evaluation, evaluator effect, data quality, usability]
author: "Federico Caria"
date: "2026-11-24"
tags:
summary: "Heuristic evaluation is built for a handful of experts looking at one interface. At hundreds of sites, over years, you can't average disagreement out afterwards. It has to be held down before it happens: by the protocol, and by QA that can see where the criterion is being read differently."
image:
sections:
  - id: benchmark-built
    type: methodology
    label: Methodology
    title: How a Baymard benchmark is built
    content: |
      <p>Baymard publishes its methodology. The part that matters for what follows is small: the scorecard is a closed list of guidelines, one reviewer scores each site, and the scores accumulate over years against a normalisation that tracks the field, not the criterion.</p>
    detail_label: The published method
    case_study:
      method: |
        <p>The research runs in three stages, and the benchmark itself is the third.</p>
        <p><strong>1. Usability testing.</strong> Large-scale qualitative usability testing with participants on live sites.</p>
        <p><strong>2. Guidelines.</strong> The findings are distilled into usability guidelines: 822 at the last published count. Each one also records how severe the problem is and how often participants ran into it.</p>
        <p><strong>3. Heuristic evaluation.</strong> Those 822 guidelines become the review heuristics and the scoring parameters. Baymard reports 54 rounds of manual benchmarking covering 344 top-grossing US and European sites.</p>
      decisions: |
        <p><strong>Compliance rating.</strong> For each guideline a reviewer records how far the site adheres to it: Adhered High, Adhered Low, Neutral, Issue Resolved, Violated Low, Violated High, or N/A. It is set according to Baymard's "How to Review" protocol, after accounting for the site's context and target audience.</p>
        <p><strong>Theme scores.</strong> Scores are summed across the guidelines in a theme — typically 50 to 130 guidelines, across 7 overarching themes — then divided by the number of applicable guidelines, so that N/A does not influence the score.</p>
        <p><strong>Normalisation.</strong> Each theme score is normalised by a factor Baymard calls self-healing. Half of it comes from a state-of-the-art implementation definition set by senior staff from the underlying usability test data; the other half from how the 344 benchmarked sites are distributed. Because the second half moves as sites improve, what counts as poor, mediocre, decent, good or perfect rises over time. This is what allows comparison across themes and across benchmark years.</p>
      evidence:
        - image: /static/assets/images/blog/benchmarking/benchmark_plot.png
          caption: Each row is a theme, each dot a site. The product is this picture of relative position. The rest of this post is about whether those positions remain comparable.
      metrics:
        - label: Usability guidelines
          before: "—"
          after: "822"
        - label: Sites benchmarked
          before: "—"
          after: "344"
        - label: Benchmark rounds
          before: "—"
          after: "54"
        - label: Weighted performance scores
          before: "—"
          after: "275,000+"
        - label: Annotated examples
          before: "—"
          after: "175,000+"
  - id: readiness-cta
    type: callout
    title: The evaluator in the readiness study isn't a person.
    content: |
      <p>The interpretative gap is still there. If you need an analytical method to stay comparable at scale — human reviewers or an agent — I can help you design the protocol and the QA around it.</p>
    button: Get in touch
---

For about eight years I worked on evaluating e-commerce user experience at scale, at Baymard Institute. The output is called a *benchmark*, and the method inside it, as Baymard's published methodology says plainly, is **heuristic evaluation**: experts inspecting an interface against a fixed set of criteria and recording where it falls short. Does this site let you check out as a guest? Is the error message next to the field it refers to? Thousands of small judgments, across hundreds of sites in the same niche, all scored against the same scorecard. The judgments themselves were rarely the hard part. Heuristic evaluation was designed for a handful of experts looking at one interface. Scale that to hundreds of sites over several years and the thing that decays isn't the judgments but their comparability. I'm writing this now because in the [readiness study](/post/ecommerce__ecommerce_readiness_method) the evaluator isn't a person at all, and that turns out to change less than I expected.

---

## The usual remedy doesn't travel

The distinction matters for what follows:

- **Usability benchmarking** in the strict sense measures participants attempting tasks, and the numbers come from what people actually do.
- **Heuristic evaluation** has *no participants at all*. It's purely *analytical*: an expert reads the interface and applies a criterion.[^1]

The method has a known weakness, and it has a name. Evaluators working on the same interface, with the same method, produce substantially different lists of problems. This is the **evaluator effect**,[^2] and it is large: across the studies Hertzum and Jacobsen reviewed, the average agreement between any two evaluators ranged from 5% to 65%. Nielsen's own experiments had found individual evaluators catching somewhere between 20% and 51% of the problems in an interface.[^3]

That literature is mostly about *discovery*: different experts notice different problems. We weren't discovering problems. We were rating a closed list. The usual answers — pool three to five people on the same interface,[^4] measure agreement afterwards[^5] — still assume two people saw the same cases. At 344 sites they didn't. One reviewer sees one site. There is no second evaluator on site 40 whose findings can be pooled with the first, so the variance can't be averaged out afterwards.

It has to be held down *before it happens*: by the protocol going in, and by what you check once the data exists. That second part is QA. Protocol can freeze the wording. It cannot freeze the reading. The reading is the interpretative work, and the only place left to do it consistently, across the dataset, is QA.

So the question changes. It is no longer whether a problem on one site was missed. It is whether the same criterion was applied the same way on site 2 as on site 70 — and, as it turned out, whether it still meant the same thing two years later.

<!-- post-section: benchmark-built -->

## Three ways the instrument moves

Working on this for years, I ended up thinking of it as three separate problems that happen to look alike from a distance. They are the three questions QA has to be able to ask.

**Between evaluators.** The textbook case, and the easiest to act on. Two people reading the same guideline draw the line in slightly different places, and because each of them is alone on their own sites, the difference is invisible in the output. It shows up only when you deliberately put their judgments side by side.

**Inside one evaluator, over months.** For the first stretch I was reviewing on my own, so there was no disagreement between people to measure. That doesn't mean there was no variance; it means it had nowhere to show up. The same criterion gets read a little differently in November than it was in March, and with a single reviewer there's nothing to compare against except your own memory of what you decided last time. When other researchers joined, that private drift became disagreement between people, which is at least observable. That is when I introduced a QA step.

**In the criterion, over years.** This is the most interesting. Our benchmark product isn't a single round. Rounds accumulate, and the point of accumulating them is to plot change: sites on an axis, years on another, the same scorecard underneath. But the scorecard doesn't sit still. A guideline written in one year is read against a web that has moved by the next: patterns that were rare become conventional, a requirement that was demanding becomes the default, and the wording that captured a real problem starts capturing something slightly different. Two scores on that scatterplot can be numerically identical and not mean the same thing.

Normalisation doesn't fix this. Our normalisation mostly handles the *distribution* moving: as sites improve, the bar for a good score rises with them. That's a real problem solved. But it assumes the criterion is stable while the field moves underneath it. The drift I'm describing is **the criterion moving too**, and no amount of rescaling recovers it, because the information needed to correct it was never recorded.

---

## The interpretative part

There's a reason that last one is unavoidable rather than sloppy. A guideline is distilled from behaviour observed in a particular scenario, on a limited set of sites, with a limited set of participants. Applying it to hundreds of sites means meeting implementations the original scenario never anticipated: a layout that resolves the underlying problem by a route nobody tested, or one that satisfies the wording while reproducing the problem somewhere else.

So the expert reviewer ends up doing **two things at once**.

1. Applying the criterion strictly, because loosening it on one site makes that site incomparable with the others.
2. Working out what the original scenario meant for a case it didn't cover.

That second step is a reinterpretation of the guideline, even though what gets recorded is a single named rating. Being strict and revising the criterion are not opposed; you do both on the same site, in the same hour. Protocol can demand the first. It cannot do the second. QA can — but only if it can see the cases where the reading is moving. That surface is much larger than the set of things anyone would call a mistake.

---

## What actually helped

Now picture the raw output: a spreadsheet with thousands of rows, each one a judgment about a site you haven't seen, written by someone else (in most cases, even if you are correcting yourself, you are not the same as the day you made the decision). That is what quality control actually looks like at this scale, and it is why the three problems above are so easy to leave alone. Nothing in 5,000 Excel rows tells you which ones are the interpretative cases.

<div class="post-image">
<img src="/static/assets/images/blog/benchmarking/raw_excel_benchmark.jpeg" alt="Sample of benchmark data" />
<p class="post-image-caption">This is what the dataset looks like in Excel.</p>
</div>

Three things changed that, in this order, over several years. Only two of them worked.

### A process, with no signal

When we started hiring more staff, I introduced a systematic QA step: review passes, a protocol, someone accountable for each batch. I'd like to say this fixed it but, honestly, its main effect was to make people nervous, including myself, about who would be picked for review. Process alone didn't tell anyone where to point it, and the rows all still look identical on screen. You cannot do the interpretative work if you cannot see where the criterion is moving.

### Mechanical checks, then slices

What changed things was automation, which came later and with a narrower aim: hand every mechanical check to the machine, and keep the human in the loop only for the judgment. It took the form of a notebook I ran for everyone, and which people would write to me about at the end of a project, usually happily. It did a few things, none of them clever.

**Let the machine have the mechanical errors first.** Typos, formatting, values in the wrong column, empty cells, the same implementation judged differently on two platforms, obvious false positives. These are real errors, but they are the cheap ones, and fixing them feels productive enough that the expensive ones never get looked at. Anything mechanical can be flagged automatically. The point isn't speed; it's what the reviewer is left looking at once the machine has had its turn.

**Look at slices, not rows.** A single wrong judgment is usually harmless. What damages a dataset is systematic difference, and you can't see that by reading rows in order. You see it by grouping: one criterion across every site, one site across every criterion, the same criterion across platforms and across years. Inconsistency is a shape in the aggregate. That shape is the signal. It is where the interpretative work should go.

### Evidence next to the cell

The notebook still had a limit: it could tell you which rows to look at, but not what they were about. Reviewers were working blind. Someone would read a recorded judgment about a field in a checkout form and have to decide whether it was right, without the checkout in front of them. To check properly they'd have to open a browser, find the site, navigate to the right page and get into the same state the original reviewer had been in. For one judgment that's tedious; for a few thousand it simply doesn't happen, and people start trusting the text in the cell.

So the last step was a small web application that put the evidence back next to the data: the judgment, the scenario it was written against, and the screenshot, on one screen. Then the slices themselves, so a reviewer could actually move through one guideline across a batch, which is where disagreement between people becomes visible instead of staying theoretical.

The feature I'd defend the longest was comparing the same implementation across years. Put a site's page from one round next to the same site's page from the next, with both judgments and both scenarios visible, and the drift stops being an abstraction. Either the implementation changed, or the way we read it did. You cannot recover a criterion's history from the scores alone, but you can at least see the two readings together and decide which one you still believe.

This generalises past UX work. Any time you ask someone to verify a recorded observation, ask how far they have to travel to see what it was about. If the answer is "open another application", the verification is mostly theoretical.

Which is the whole point, really. Quality control on an analytical method isn't there to catch mistakes one at a time. It's there to tell you whether the instrument was behaving the same way throughout. The three axes above are three different ways of asking that question. The tooling only has to make the question visible.

<!-- post-section: readiness-cta -->

## References

[^1]: Nielsen, J. and Molich, R. (1990). [Heuristic evaluation of user interfaces](https://dl.acm.org/doi/10.1145/97243.97281). *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '90)*, 249–256.

[^2]: Hertzum, M. and Jacobsen, N. E. (2001). [The evaluator effect: a chilling fact about usability evaluation methods](https://doi.org/10.1207/S15327590IJHC1304_04). *International Journal of Human-Computer Interaction* 13(4), 421–443. The metric usually reported is *any-two agreement*: of the problems found by two evaluators, the share found by both.

[^3]: Nielsen, J. and Molich, R. (1990) (see [^1]); Nielsen, J. (1992). [Finding usability problems through heuristic evaluation](https://dl.acm.org/doi/10.1145/142750.142834). *Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '92)*, 373–380. Nielsen reports individual evaluators catching roughly 20–51% of problems in his experiments.

[^4]: Nielsen, J. (1994). [How to conduct a heuristic evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/). *Nielsen Norman Group*. Recommends three to five evaluators, each inspecting the interface alone before results are aggregated; beyond five, added findings rarely justify the cost.

[^5]: For a closed coding scheme the usual measures are *inter-rater reliability* (agreement between people) and *intra-rater reliability* (agreement of one person with themselves over time). Both are often summarised with a [kappa coefficient](https://en.wikipedia.org/wiki/Cohen%27s_kappa), which discounts agreement expected by chance. Those measures still need overlapping cases. We mostly didn't have them.
