
This is the first question to ask: a system is layered complexity and wants a choice that can be defended. The whole point is to take an honest stance when sketching the **system boundary**, aka a conscious decision about the stuff being designed. The boundary sets the rules,  anything outside that becomes *noise*. Boundary is hard to scope, however so important as it shapes not only what we are going to build, but also what **risks we assess** later in the game.

**Example.** Take an AI code-completion assistant. Three plausible boundaries:

1. *Plugin only*: editor context in, suggestion out. Risks assessed: latency, suggestion quality.
2. *Plugin + developer*: adds acceptance, rejection, editing. New risks: over-trust, accepting by slip, interruption of flow.
3. *Plugin + developer + review pipeline*: adds code review, CI, team norms. New risks: unreviewed generated code reaching production, reviewers assuming "the AI already checked it".

Same artefact, three different risk registers. Boundary 1 cannot even *see* the failure that matters most in boundary 3. This is the practical meaning of "the boundary shapes what risks we assess".

**Useful Reading.**
- Meadows (2008) is the most readable intro to boundaries and why they are always a choice.
- Ulrich (1983) and Midgley (2000) go further: boundary judgements are value judgements, and someone should be asked who is inside and outside. Useful if the "noise" outside the boundary is actually a stakeholder.
- For the non-functional point: ISO 9241-11 defines usability as effectiveness, efficiency and satisfaction in a context of use, i.e. a standards-level statement that function alone is not enough.
---

## Tools for exploring boundaries
A boundary is *drawing a line in the sand* to quote a famous movie. Depending on how well we know the domain, we might have everything in mind, but that's beside the point. Always prefer a structured approach that is not only defendable but **testable*. 

### Tool 1

### Tool 2

**Example.** Take an AI code-completion assistant. Three plausible boundaries: