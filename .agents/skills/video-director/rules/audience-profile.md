---
name: audience-profile
description: Target audience definition and content tone rules for medevsmaker educational videos
metadata:
  tags: audience, tone, content, educational
---

# Audience Profile

## Who They Are

**Primary**: Vibe coders — people who build with AI tools (Cursor, Claude, Copilot) without deep CS background. They can ship but don't fully understand what's happening under the hood.

**Secondary**: Non-technical AI builders — product managers, designers, founders who use no-code/low-code + AI to build. They need conceptual understanding, not implementation details.

**Common traits**:
- Learn by doing, not by reading docs
- Visual thinkers — diagrams > paragraphs
- Short attention spans — need frequent payoffs
- Already building things — not starting from zero
- Value "good enough" understanding over completeness
- Active on YouTube, Twitter/X, Discord

## Tone Rules

### Voice
- **Direct, not condescending** — "Here's how it works" not "Let me explain this simply"
- **Peer, not teacher** — "You've probably done this" not "Students should note"
- **Confident, not academic** — State things clearly, skip hedging
- **Practical, not theoretical** — Always connect to what they're building

### Language
- Use "you" and "your" — speak directly to the viewer
- Avoid jargon without context — if you use a term, explain it immediately
- No filler phrases: "basically", "essentially", "in other words"
- No academic framing: "it is important to note", "one should consider"
- Short sentences preferred — max 15 words per line on screen

### Content Rules
- **Every concept needs an analogy** — "A database is like a spreadsheet on steroids"
- **Show the 'why' before the 'what'** — Why does this matter to them?
- **One concept per scene** — Never stack two ideas in one visual
- **Alternate dense and light scenes** — Heavy concept → visual metaphor → next concept
- **Real examples over abstract ones** — "Your Next.js app" not "a hypothetical system"
- **Acknowledge what they already know** — "You've used an API before — here's what's actually happening"

## Text Constraints

### On-Screen Text
- **Headings**: Max 6 words
- **Body text**: Max 15 words per line, max 2 lines
- **Code snippets**: Max 5 lines
- **Bullet points**: Max 8 words each, max 5 bullets per scene
- **Stats**: One number per scene

### Reading Time
- Minimum 3 seconds for any text on screen
- Add 1 second per additional line of text
- Code blocks need 50% more reading time than prose

## Content Progression Pattern

For any concept, follow this order:
1. **Hook** — Why should they care?
2. **Analogy** — Connect to something they know
3. **Explain** — The actual concept
4. **Show** — Visual/diagram/code
5. **Summarize** — One-line takeaway

Not every scene needs all 5, but the overall section should cover them.

## Humor & Personality

### Voice
- **Dry tech humor** (Fireship style) — one-liners, not comedy sketches
- **Frequency**: 1 humor beat per section (place in HookQuestion, VisualMetaphor, or WarningCallout)
- **Types**: Absurd analogies, self-deprecating dev jokes, unexpected emoji punchlines, exaggerated consequences ("Your app crashes. Your users cry. Your boss sends a Slack.")

### Anti-Patterns
- No memes or dated references
- No inside jokes that exclude beginners
- No forced humor — if it doesn't land naturally, skip it

### Hook Humor
- Opening HookQuestion should be surprising or slightly funny to create curiosity
- Example: "Ever wonder why your app is slower than your grandma's WiFi?"

## YouTube Engagement Psychology

### 3-Second Rule
First 3 seconds must create a **curiosity gap** or provoke a reaction. The viewer decides to stay or leave in this window.

### Pattern Interrupts
Every 25-35 seconds, break the visual rhythm:
- Switch scene type (diagram after text, metaphor after code)
- Drop a humor beat
- Show an unexpected stat
- Change the visual energy (calm → dramatic or vice versa)

### Open Loops
Tease upcoming sections early to keep viewers watching:
- "We'll see why this breaks in Section 3"
- "The surprising part comes next"
- Use TitleIntro objectives as open loops: "You'll be surprised by #3"

### Progress Anchoring
ProgressBar + SectionTitle give viewers a sense of advancement through the video. This reduces drop-off by showing them how far they've come and how much is left.

### Payoff Cadence
Every 60-90 seconds, deliver a concrete "aha moment" or surprising insight. Viewers need regular rewards for continued attention.

### End Screen Retention
Last 10 seconds should prompt next video / subscribe. Use EndScreen (not basic Outro) for gradient text, glow CTA, and optional social links.

## Visual-First Content Philosophy

### Core Rule
Visuals explain, voiceover narrates — on-screen text is supplementary, not primary.

### Target Ratio
- **60%+ visual scenes**: DiagramFlow, VisualMetaphor, ComparisonSplit, BeforeAfter, TimelineScene, DataChart, StepSequence, StatHighlight, ColdOpen
- **40% max text scenes**: ConceptExplain, BulletRevealScene, CodeDisplay, WarningCallout

### When Using Text-Heavy Scenes
- Keep body text to 1 line max — voiceover carries the detail
- Use bold headings as anchors, not full explanations

### Prefer
- Diagrams over bullet lists
- Metaphors over explanations
- Comparisons over descriptions
- Charts over number lists

### Scene Replacement Guidance
If planning 3+ ConceptExplain in a row, replace the middle one(s) with DiagramFlow or VisualMetaphor. No two text-heavy scenes should be adjacent.
