---
title: "Conscious Vibing"
thread: vibe-coding
keywords: [vibe coding, AI assistants, technical debt, software architecture]
author: "Federico Caria"
date: "2025-08-1"
tags: ["coding", "vibe", "AI"]
summary: "The freestyle nature that makes vibe coding powerful for ideation becomes its weakness for sustainable development. Without structure, even the most capable AI assistant can turn a promising prototype into an unmaintainable mess."
---

###### Introduction
The complaints are everywhere: "Vibe coding produces spaghetti code," "AI hallucinates features that break everything," "The codebase becomes uncontrollable after a few iterations." These criticisms aren't entirely wrong—but they miss the bigger picture. What if the problem isn't vibe coding itself, but rather the lack of a systematic approach to managing the creative chaos it enables? In what follows, I'll explore this hypothesis.

### 1. The Uncontrolled Vibe Problem
When diving headfirst into conversational coding, the initial results can feel magical. I have great sympathy for those who experience this. Need a new feature? Describe it and watch code materialize. But as the project grows, issues will inevitably emerge:

- **Context overflow**: The AI loses track of architectural decisions across multiple files
- **Inconsistent patterns**: Each new feature follows different implementation approaches  
- **Technical debt accumulation**: Quick fixes compound into maintenance nightmares
- **Integration conflicts**: New code might clash with existing systems in unexpected ways

The freestyle nature that makes vibe coding powerful for ideation becomes its weakness for sustainable development. Without structure, even the most capable AI assistant can turn a promising prototype into an unmaintainable mess.

### 2. The Two-Phase Solution
Wroblewski's *flipped development paradigm* provides an interesting canvas for conceiving a more systematic approach to vibe coding. Rather than fighting the chaos, we might harness it through a deliberate two-phase process, as he seems to suggest.

#### 2.1. Phase One: Ideation and Experimentation
This is where vibe coding shines brightest. Here one should embrace the freestyle approach:

- Describe features in natural language without worrying about implementation details
- Let the AI generate quick prototypes and explore different approaches
- **Make it work first**: Focus on functionality over form
- Accept messy code as the price of rapid iteration
- Experiment with multiple solutions to find what feels right

> **The Rule: In Phase 1, prioritize speed and creativity over code quality**

#### 2.2. Phase 2: Human-Led Structuring
Once the core functionality exists, shift into systematic refactoring mode:

- Review the generated code with fresh eyes
- Apply clean code principles deliberately
- Restructure according to established architectural patterns
- Test thoroughly and document decisions
- Prepare the codebase for future iterations

> **The Rule: In Phase 2, prioritize maintainability and clarity over speed**

### 3. The Systematic Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        PHASE 1: IDEATION                        │
└─────────────────────────────────────────────────────────────────┘
                                   │
                         ┌─────────▼─────────┐
                         │   Vibe Feature    │
                         │ "Build me a..."   │
                         │   AI generates    │
                         │   working code    │
                         └─────────┬─────────┘
                                   │
                         ┌─────────▼──────────┐
                         │   Test Concept     │
                         │ Does it work?      │
                         │ Meets requirements?│
                         └─────────┬──────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │         Working?            │
                    │    ┌─────NO──────┐          │
                    │    │             ▼          │
                    └────┤         Iterate        │
                         │      (Back to Vibe)    │
                         │             │          │
                         └─────YES─────┘          │
                                   │              │
┌───────────────────────────────── ▼──────────────┴──────────────┐
│                      PHASE 2: STRUCTURING                      │
└────────────────────────────────────────────────────────────────┘
                                   │
                         ┌─────────▼─────────┐
                         │ Structure Review  │
                         │ • Readability     │
                         │ • Modularity      │
                         │ • Clean patterns  │
                         └─────────┬─────────┘
                                   │
                         ┌─────────▼──────────┐
                         │ Integration Check  │
                         │ Fits architecture? │
                         │ Consistent style?  │
                         └─────────┬──────────┘
                                   │
                         ┌─────────▼─────────┐
                         │ Document Decisions│
                         │ Record choices    │
                         │ Update AI context │
                         └─────────┬─────────┘
                                   │
                              ┌────▼────┐
                              │ READY   │
                              │FOR NEXT │
                              │ITERATION│
                              └─────────┘
```

### 4. Best Practices

#### 4.1. Creativity and Exploration Dominate Phase One
During the ideation phase, embrace experimentation:
- Encourage bold attempts and creative solutions
- Don't worry about code style or conventions
- Focus on discovering what's possible
- Document interesting approaches, even failed ones

#### 4.2. Clean Code Principles Dominate Phase Two
When transitioning from experimentation to structure, apply these core principles systematically:

- **Readability & Expressiveness**: Rename AI-generated variables and functions with meaningful, intention-revealing names. Replace cryptic logic with self-documenting code.
- **Simplicity**: Identify where the AI over-engineered solutions. Strip unnecessary complexity while preserving functionality.
- **Modularity**: Break down the AI's monolithic implementations into smaller, well-defined functions. Extract reusable components.
- **Testability**: Add proper error handling and reduce side effects. Structure code to enable easy unit testing.
- **DRY Principle**: Consolidate duplicate logic that emerged during rapid prototyping. Create shared utilities and functions.
- **Strategic Comments**: Add comments explaining architectural decisions and business logic—the "why" behind the code, not the "what."
- **Consistency**: Establish and enforce coding conventions across all AI-generated code. Unify naming patterns and structural approaches.
- **Remove Dead Code**: Delete experimental code, commented-out alternatives, and unused imports that accumulated during ideation.
- **Single Responsibility**: Ensure each function and class has one clear purpose. Split bloated components that try to do too much.

#### 4.3. The System Prompt Strategy
In tools like Cursor, you can insert a system prompt—essentially instructions that guide the AI's behavior throughout your entire coding session. Think of it as setting the "personality" and standards for your AI pair programmer before you start working together.

**What is a System Prompt?**
A system prompt is persistent context that tells the AI how to behave, what standards to follow, and what your preferences are. Unlike individual chat messages, it stays active across all interactions in your project. It's like having a senior developer whisper coding standards in the AI's ear before every code generation.

**Maintaining Structure Through System Prompts:**
You can embed your Phase 2 principles directly into the system prompt:
```
You are a senior software engineer who prioritizes clean, maintainable code. 
When generating or modifying code:
- Use descriptive variable names that reveal intent
- Break complex functions into smaller, single-purpose units
- Follow the established architectural patterns in this codebase
- Add meaningful comments for business logic, not obvious code
- Prefer composition over inheritance
- Always consider error handling and edge cases
```

**Refactoring Assistance:**
During Phase 2, your system prompt can guide the AI's refactoring suggestions:
```
When refactoring code:
- Identify and extract repeated patterns into reusable functions
- Suggest more descriptive names for unclear variables/functions
- Point out functions that are doing too many things
- Recommend splitting large files into logical modules
- Highlight potential performance issues or code smells
```

**Variable Naming Guidance:**
Instead of getting generic AI variable names, you can enforce naming conventions:
```
Variable naming rules:
- Use camelCase for JavaScript variables and functions
- Boolean variables should start with 'is', 'has', 'can', or 'should'
- Arrays should be plural nouns (users, items, responses)
- Event handlers should start with 'handle' or 'on'
- Constants should be UPPER_SNAKE_CASE
- Avoid abbreviations unless they're domain-standard (url, api, id)
```

**Function Atomization:**
Guide the AI to create smaller, focused functions:
```
Function design principles:
- Each function should do one thing well
- If a function has more than 20 lines, suggest breaking it down
- Extract complex conditionals into descriptively-named boolean functions
- Create utility functions for repeated logic patterns
- Prefer pure functions when possible (no side effects)
```

**Phase-Specific System Prompts:**
You could even switch system prompts between phases:

*Phase 1 Prompt:*
```
You are in rapid prototyping mode. Prioritize working code over perfect code.
- Generate functional solutions quickly
- Don't worry about perfect naming or structure
- Focus on getting the feature working
- It's okay to be verbose or repetitive
- Explore different approaches if the first doesn't work
```

*Phase 2 Prompt:*
```
You are in refactoring mode. Clean up and structure existing code.
- Apply clean code principles rigorously
- Improve naming and readability
- Extract reusable components
- Add proper error handling
- Ensure consistency with codebase patterns
```

**Contextual Architecture Awareness:**
Your system prompt can also encode project-specific architectural decisions:
```
This project uses:
- React with functional components and hooks
- Material-UI for styling
- Redux Toolkit for state management
- React Query for server state
- Jest and React Testing Library for tests

When suggesting code, prefer patterns consistent with these choices.
```

The system prompt becomes your "architectural memory" that persists across all AI interactions, ensuring that both Phase 1 experimentation and Phase 2 structuring align with your project's standards and your team's preferences. It's like having a coding standards document that the AI actually reads and follows.

### 5. Why This Matters
This two-phase approach leverages the strengths of both human and AI capabilities:

- **AI excels at**: Rapid prototyping, exploring possibilities, generating boilerplate
- **Humans excel at**: Architectural thinking, long-term maintainability, quality standards

By reframing vibe coding within the flipped development approach—separating experimentation from structure—you get the speed benefits of vibe coding without sacrificing code solidity. The result is a more sustainable development process that scales beyond weekend prototypes into production-ready systems. Can we call it "vibe engineering"?

**Key insight**: Vibe engineering isn't the enemy of software development but a creative assistant that potentially enhances the development process when applied systematically.

### Addressing the Blind Spots
Obviously, this is a first attempt at systematizing the question, and more thorough research is necessary, perhaps including interviews. The following questions are among the most pressing that came to mind following this thread:

#### The Context Handoff Problem

**"How do you maintain AI understanding between phases?"**
Treat Phase 2 documentation as "AI memory supplements." When you refactor, explicitly document not just what you changed but why—this becomes context for future Phase 1 sessions. Tools like Cursor already maintain project-wide context; the key is feeding your architectural decisions back into that context deliberately. Think of it as "training your project's AI on your specific patterns."

For team dynamics: Ask team members to write down and maintain documentation. The systematic approach actually helps here. Establish team-wide Phase 2 standards (coding conventions, architectural patterns) that everyone applies during their structuring phase. Let Phase 1 be individual and chaotic, but enforce consistency in Phase 2.

#### Technical Debt Management

**"When does vibe debt become too expensive?"**
The two-phase approach actually prevents runaway debt by forcing regular "debt payment" cycles. Unlike traditional technical debt that accumulates over months, vibe debt gets addressed within days or even hours. The key is never starting a new Phase 1 cycle until you've properly completed Phase 2 on existing features. That morning you wake up knowing you need to roll up your sleeves.

**"What about dependencies that emerge while vibing?"**
Document dependencies as they emerge, but don't solve them immediately. Part of Phase 1's value is discovering what you actually need. In Phase 2, you can make informed decisions about whether to integrate existing libraries, build custom solutions, or refactor the approach entirely.

#### Addressing Criticism

**The "Clean-as-you-go" Crowd: "Why not write clean code from the start?"**
Because creativity and structure are fundamentally different cognitive modes. Asking someone to be creative AND systematic simultaneously is like asking a writer to edit while they brainstorm—it kills the creative flow. The two-phase approach recognizes that optimal creative output often looks messy initially.

**The "AI Will Get Better" Argument: "Won't AI eventually generate clean code directly?"**
Even if AI generates syntactically clean code, it can't read your mind about architectural preferences, business context, or team conventions. Phase 2 isn't just about code cleanliness—it's about human intentionality and architectural coherence.

### Version Control Strategy
Phase 1 commits could be tagged as "experimental" with descriptive commit messages about what was attempted. Phase 2 creates the "canonical" commits with proper documentation. Teams could even have different branch naming conventions: `vibe/feature-name` for Phase 1, `clean/feature-name` for Phase 2.

The systematic approach transforms potential problems into manageable process questions rather than fundamental flaws in vibe coding itself.