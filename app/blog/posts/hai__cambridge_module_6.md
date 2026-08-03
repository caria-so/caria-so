---
title: "HAI Cambridge Module 1 - Notes on Agency and Control"
thread: hai
keywords: [HCI, AI tooling, user experience, design, agency, control]
author: "Federico Caria"
date: "2025-06-01"
tags: 
summary: "Notes from class Human–Computer Interaction (HCI) for AI Systems Design by Prof Ola Kristennson - Cambridge University"
---

# Module 6: Managing Control and Agency — Raw Notes

This one is about keeping the user in the driver’s seat. It covers what control actually means, how to measure the feeling of ownership, and ways users can steer or even teach the system rather than just obey it.

---

## Agency and the sense of ownership

Agency = the perception that you’re the one making things happen. Humans don’t just move; they check that the world changed because of their deliberate action. If that link snaps, the system feels like it’s acting on its own and your inputs feel pointless.

- Direct manipulation (dragging stuff, undoable micro-steps) builds strong agency because feedback is immediate and physical.
- Command lines give more raw options but weaker agency because the path from intent to result is abstract and hard to reverse. Deleting a file via `rm` versus dragging it to trash is the classic contrast.
- Mentioned that disorders like schizophrenia involve this self-monitoring mechanism misfiring.

---

## When machines feel like social actors

People constantly assign human-like agency to non-human things: cartoon characters, chatbots, robot vacuums.

- **Media equation** (Reeves & Nass, 1996): people treat screens and devices as social partners. Larger displays amplify the effect.
- **Uncanny valley**: faux-human faces get more likable as they approach realism, then suddenly become repulsive before recovering at true human likeness. Relevant for avatars, games, dialogue agents.
- Bottom line: your interface will be read as a social actor whether you intended it or not.

---

## Measuring agency in the lab

Since mind-reading is off the table, agency is proxied through **time perception distortion**.

- **Intentional binding**: when people feel in command, they perceive the gap between their action and the outcome as shorter than it objectively is (time compression). When they feel like a passenger, the gap feels longer.
- **Action binding** = the pull to sense your own action as occurring *later* than it really did, provided you believe it caused something.
- **Outcome binding** = the pull to sense the consequence as arriving *earlier* than it really did, provided you believe you triggered it.
- **Total binding** = action binding + outcome binding. Smaller total binding = stronger sense of agency.

**Body-as-interface study** (Coyle et al., 2012; building on Harrison et al., 2010)
- A pico-projector paints a keypad onto your palm; touches are detected via vibration waves traveling through skin.
- Users felt more ownership pressing a virtual button on their own body than pressing a plastic physical button.
- Mouse-target “gravity” assistance: mild help preserves agency; medium or strong help makes agency collapse entirely. There is a sharp tipping point where assistance turns into takeover.

---

## Two mathematical framings of control

**Information-theory view**
- Interaction as signal transmission: the person = information source; neuromuscular system = transmitter; device sensors + decoder = receiver.
- The channel is noisy: sensor error, biological jitter, human mistakes, environmental distractions, slips.
- Autocorrect recovers intent by leveraging two things: the spatial nearness of touch points and the built-in redundancy of natural language (statistical patterns). Language carries extra structure beyond the bare minimum → lets you reconstruct the intended message despite noise.
- **Self-information**: I(m) = log₂(1/P(m)). Rare events carry more bits (higher surprisal).
- **Entropy** H(M): average uncertainty across a message space. Zero entropy = perfect predictability = no information per message.
- **Redundancy**: gap between actual encoding and optimal encoding. Natural languages are heavily redundant; that’s why statistical language models work for speech recognition, spell-check, GPT, etc.

**Control-theory view**
- The person navigates a state space. Objective: drive a controlled variable into a target condition.
- Two feedback routes: tactile/proprioceptive feedback from manipulating the tool itself, plus visual feedback from seeing the controlled variable react on screen.
- Example: the mouse is the instrument; the cursor is the controlled variable; you feel the mouse glide and you see the pointer respond.
- Works well for low-level motor tasks; too cumbersome for complex interaction design in practice.

---

## Shared control: the horse-rider metaphor

H-metaphor: rider + horse.

- **Loose rein**: the animal knows the route; the rider relaxes. System handles low-level execution.
- **Tight rein**: the rider micromanages every motion. Needed when the route is novel or the animal misbehaves.
- Communication flows both ways.
- Four altitude levels of sharing:
1. **Strategic** — pick the destination.
  2. **Tactical** — pick a maneuver (e.g., park here).
  3. **Operational** — set constraints (keep a set distance from the car ahead).
  4. **Execution** — physically turn the wheel.
- Loose/tight doesn’t map cleanly onto the four levels. Treat them as perspectives, not a rigid lattice.

---

## Prompting as a control mechanism

A prompt = user submits a trigger, the machine generates a response.

- Functionally similar to command entry: powerful but opaque. Users often don’t know what’s possible or how to phrase it.
- Settings like “temperature” manipulate randomness (high = more entropy/surprise; low = more predictable). Most users don’t know these dials exist or what they change.
- Leads to guess-and-check exploration.

**KWickChat example** (Shen et al., 2022)
- AAC tool for non-speaking users with motor disabilities. Feeds GPT-2 via:
  - Persona tags (identity, preferences).
  - Dialogue transcript so far.
  - A bag of keywords typed by the user.
- Machine produces candidate sentences; user selects one; text-to-speech voices it.
- Demonstrates that scaling data and model size lifts output quality, but you still need a specialized interface to turn raw prompting into usable interaction.

---

## Reasons to keep a human in the loop

Three distinct motives:

1. **Supervisory control** — person oversees automation. Air-traffic control, aircraft cockpit, command centers, power-plant monitors. Human watches readouts and steps in when needed.
2. **Human computation** — algorithm delegates steps it cannot do reliably to a person.
   - Original reCAPTCHA: two 