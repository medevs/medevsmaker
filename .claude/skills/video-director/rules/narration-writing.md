---
name: narration-writing
description: Rules for writing narration during /script — scene-type patterns, tone, TTS optimization
metadata:
  tags: narration, writing, script, tts
---

# Narration Writing Rules

Narration is written during `/script` Phase 3. These rules govern how to write natural, engaging voiceover narration for every scene.

## Core Principles

1. **Never read on-screen text verbatim** — narration complements the visuals, it doesn't duplicate them. Check `onScreenText` and use different words.
2. **Write naturally** — durations are computed from your word counts. No artificial word budgets. Write what feels right for the scene.
3. **Conversational peer tone** — talk like a smart friend explaining over coffee, not a professor lecturing. Confident but not preachy.
4. **One idea per scene** — don't try to cover more than what the scene shows
5. **Flow naturally** — use connective phrases: "So here's the thing.", "And this is where it clicks.", "Now pay attention to this.", "Here's why that matters."
6. **Vary sentence rhythm** — alternate short punchy sentences (3-6 words) with medium ones (8-15 words). Never 3+ sentences of the same length in a row.
7. **Front-load the interesting part** — put the payoff at the start, context at the end. "DNS finds the address. Here's how." not "The process of DNS resolution involves..."

## Soft Word-Count Ranges per Scene Type

These are guidelines, not hard constraints. Write naturally — durations are computed from your word counts.

| Scene Type | Typical Range | Notes |
|------------|---------------|-------|
| HookQuestion | 12-20 words | Must hook in first sentence |
| TitleIntro | 15-25 words | Set expectations, tease content |
| SectionTitle | 4-8 words | Brief transition phrase |
| ConceptExplain | 15-30 words | Explain + analogy |
| DiagramFlow | 20-40 words | Walk through flow step by step |
| CodeDisplay | 20-40 words | Explain what code does, never read syntax |
| ComparisonSplit | 15-30 words | Highlight key difference |
| StatHighlight | 12-25 words | Build up to the number |
| BulletRevealScene | 15-30 words | Highlight 2-3 key items |
| VisualMetaphor | 15-30 words | Deliver analogy with personality |
| KeyTakeaway | 10-20 words | One memorable statement |
| SummaryRecap | 15-30 words | Rapid-fire recap |
| EndScreen | 8-15 words | Conversational CTA |
| WarningCallout | 15-25 words | Deliver with urgency |
| StepSequence | 20-35 words | Walk through steps in order |
| BeforeAfter | 15-30 words | Emphasize the contrast |
| TimelineScene | 20-40 words | Narrate the progression |
| DataChart | 15-30 words | Call out standout data points |
| ColdOpen | 12-25 words | Dramatic, jump straight in |
| FeatureIntro | 20-35 words | Build anticipation, explain why it matters |
| ProgressiveTerminal | 20-35 words | Highlight 2-3 most interesting items |
| DecisionTable | 20-35 words | Frame context, call out surprising answers |
| ThreeColumnCompare | 20-35 words | What makes each option distinct |
| FileTreeScene | 20-35 words | Architecture reasoning, not file listing |
| KeyRuleCard | 10-18 words | Short, punchy, let it breathe |
| ArchitectureDiagram | 20-35 words | Start from center, explain outward |

---

## Scene-Type Narration Patterns

### HookQuestion
- **Approach**: Create an open loop that demands closure. Use one of these proven patterns:
  - **Curiosity hook**: "Every click triggers an invisible relay race you'll never see."
  - **Shocking stat**: "Over a trillion DNS lookups happen every single day."
  - **Audience-centric**: "You're sending hundreds of requests a day without knowing it."
  - **Contrarian**: "Your browser does more work than you think."
- **Don't**: Read the question text, start with "So today...", or use generic greetings
- **Critical**: Most viewers drop off in the first 15 seconds. The hook must create immediate curiosity.

### TitleIntro
- **Approach**: Set expectations and welcome the viewer — this is the video's "hello"
- **Don't**: List the objectives verbatim — tease what's coming
- **Include**: "In this video" or "In this one" to orient viewers who land mid-scroll
- **Example**: "In this video, we'll break down every step from URL to fully rendered page."

### SectionTitle
- **Approach**: Always add a brief transition phrase to avoid silent gaps between sections
- **Example**: "Next up, the internet's phone book." or "Now, the server side."

### ConceptExplain
- **Approach**: Explain the concept in your own words, then reinforce with the analogy
- **Don't**: Read the heading or body text
- **Example**: "Think of it this way — your browser doesn't actually know where any website lives. It needs to ask for directions first."

### DiagramFlow
- **Approach**: Walk through the diagram step by step, connecting each node
- **Don't**: Just list the node labels — explain the flow
- **Example**: "First, you type in the URL. Your browser parses that into a domain name, sends it to DNS which finds the IP address, then fires off an HTTP request to that address."

### CodeDisplay
- **Approach**: Explain what the code does and why it matters — never read the code
- **Don't**: Read line-by-line syntax
- **Example**: "This is what an HTTP response actually looks like. That 200 status code means everything went well, and the server is sending back HTML."

### ComparisonSplit
- **Approach**: Highlight the key difference between the two sides
- **Don't**: List all items from both sides
- **Example**: "SQL gives you structure and relationships, while NoSQL gives you flexibility and scale. Different tools for different problems."

### StatHighlight
- **Approach**: Build up to the number, then add context
- **Don't**: Just say the number — frame why it matters
- **Example**: "Here's a number that'll blow your mind. One point one trillion DNS queries happen every single day."

### VisualMetaphor
- **Approach**: Deliver the analogy with personality and humor
- **Don't**: Read the analogy text verbatim — add flair
- **Example**: "Think of your browser as a waiter. It takes your order, sprints to the kitchen, and brings back whatever the chef prepared. Tip not required."

### KeyTakeaway
- **Approach**: Reinforce the section's key point concisely
- **Don't**: Repeat everything from the section — distill it
- **Example**: "Bottom line: the client sends requests, the server sends responses. That's the core of everything."

### BulletRevealScene
- **Approach**: Briefly introduce what's being listed, then mention key items
- **Don't**: Read every bullet — highlight 2-3 important ones

### StepSequence
- **Approach**: Walk through steps in order with brief connecting phrases
- **Example**: "Step one, parse the URL. Step two, resolve the IP. Step three, send the request. Same dance, every single time."

### BeforeAfter
- **Approach**: Emphasize the contrast — what changes and why it matters
- **Example**: "Without a database, your app forgets everything the moment it restarts. With one, your data survives crashes, reboots, even your worst bugs."

### TimelineScene
- **Approach**: Narrate the progression — what happens at each stage
- **Example**: "It starts with your browser's local cache. If that misses, it hits the OS, then your router, then your ISP, and only as a last resort, the root servers."

### DataChart
- **Approach**: Call out the most interesting data points
- **Don't**: Read every bar — pick the standout numbers
- **Example**: "Most of the time, you get a nice 200 OK. But every now and then, a 404 sneaks in — that page you were looking for just doesn't exist."

### WarningCallout
- **Approach**: Deliver with urgency — this is important
- **Example**: "And here's something you absolutely need to remember. Never, ever trust data from the client. Always validate on the server."

### SummaryRecap
- **Approach**: Rapid-fire summary, hit the highlights
- **Example**: "Quick recap: browser sends requests, DNS finds addresses, servers process everything, and databases keep your data safe."

### EndScreen
- **Approach**: Add a brief conversational CTA — silence over the end card feels broken
- **Example**: "If this helped, hit subscribe, I'll catch you in the next one."
- **Don't**: Say generic "Thanks for watching!" — TTS can't deliver enthusiasm naturally

### ColdOpen
- **Approach**: Dramatic, attention-grabbing delivery
- **Don't**: Start slow or with context — jump straight into the statement
- **Example**: "Right now, as you watch this, millions of invisible conversations are happening between your device and servers all over the world."

### FeatureIntro
- **Approach**: Build anticipation, then explain what this feature/concept is in your own words. Frame why it matters before defining it.
- **Don't**: Read the definition card verbatim. Don't read pill badge labels.
- **Example**: "This one is huge. Model Context Protocol, or MCP, gives AI tools a standard way to talk to external services. And it changes everything about how agents interact with the world."

### ProgressiveTerminal
- **Approach**: Walk through the list conversationally, highlighting the 2-3 most interesting items.
- **Don't**: Read every item verbatim. Don't use "first, second, third" pacing.
- **Example**: "It handles authentication, caching, rate limiting, and a whole lot more. But the one that really matters here is the built-in retry logic, because without it, one network hiccup takes down your entire pipeline."

### DecisionTable
- **Approach**: Frame the decision context first, then call out the most surprising or counterintuitive rows.
- **Don't**: Read every question/answer pair. Don't just list "if X then Y."
- **Example**: "So when should you use each one? If you need real-time updates, WebSockets wins hands down. But here's the surprise, for most use cases, simple polling is actually good enough."

### ThreeColumnCompare
- **Approach**: Highlight what makes each option distinct, not what they have in common.
- **Don't**: Read all bullet items from all three columns.
- **Example**: "Three tools, three philosophies. Redis is pure speed, PostgreSQL is pure reliability, and MongoDB is pure flexibility. The one you pick depends entirely on what you're optimizing for."

### FileTreeScene
- **Approach**: Walk through the key structural decisions, not every file. Explain why the project is organized this way.
- **Don't**: Read the full directory tree.
- **Example**: "Here's how the project is organized. The src folder holds your components, the API routes live in app slash api, and your database schema sits in prisma. Everything has a clear home."

### KeyRuleCard
- **Approach**: Deliver the key insight with emphasis and conviction. Short, punchy, memorable.
- **Don't**: Add extra context or qualifiers. Let the statement breathe.
- **Example**: "Here's the golden rule. Never trust the client. Always validate on the server. No exceptions."

### ArchitectureDiagram
- **Approach**: Start from the center hub and explain outward connections. Match the visual reveal rhythm.
- **Don't**: List every satellite node. Don't describe the visual layout.
- **Example**: "At the center is your API gateway, and everything flows through it. Your auth service, your database, your cache layer, your message queue, all connected through that single entry point."

### Scene Variant Narration Notes

- **StepSequence `variant="card"`**: Steps in colored cards. Narration unchanged.
- **DiagramFlow `variant="pipeline"`**: Horizontal rectangles with arrows. Narration unchanged.
- **ComparisonSplit `variant="cards"`**: Each side in a ColorBorderCard. Narration unchanged.
- **CodeDisplay `layout="annotated"`**: Annotations as small colored cards. Narration unchanged.
- **DataChart `variant="labeled"`**: Bars with pill badge labels. Mention severity labels if meaningful.
- **KeyTakeaway `variant="insight"`**: Gradient text. Narration should be shorter and punchier.

---

## TTS Text Optimization

Neural TTS (ElevenLabs, Cartesia) responds to text formatting in specific ways:

### Sentence Structure
- **Short sentences** — TTS sounds most natural with 5-15 word sentences
- **One clause per comma** — avoid 3+ comma chains
- **Use contractions** — "we'll", "it's", "don't" sound conversational

### Punctuation for Pacing
- **Commas** create 0.2-0.3s pauses — use for natural breath points
- **Periods** create 0.4-0.6s pauses — use to separate distinct ideas
- **Avoid standalone em-dashes** (`—`) — use commas instead
- **Avoid standalone ellipses** (`...`) — attach to preceding word
- **Avoid exclamation marks** — use word choice for emphasis instead

### Word Choice
- **Spell out numbers** — "two hundred" not "200"
- **Spell out abbreviations** — "four oh four" not "404", "HTTP" is fine
- **Avoid emotional openers** — jump straight to content
- **Use concrete words** — "sprinting between you and the kitchen" over "facilitating communication"

### Anti-Patterns
- **Staccato fragments**: "Step one. Step two. Step three." — each period adds dead air
- **Lists with colons**: awkward colon pause in TTS
- **Rhetorical questions**: TTS can't deliver questioning intonation naturally
- **Repeated words**: "very very important" — TTS doesn't emphasize repetition

---

## Narration-Visual Sync

- **Never narrate overlay text** — SectionTracker and FeatureCounter are read by the viewer
- **Never read pill badge labels** — weave the concept naturally into your sentence
- **GradientText words are key phrases** — emphasize the same concept through word choice
- **ColorBorderCard content is on-screen text** — don't read it verbatim, complement it

---

## Tone Guidelines

- **Casual but knowledgeable** — you understand this stuff deeply but explain it simply
- **Active voice** — "DNS finds the IP" not "the IP is found by DNS"
- **Direct address** — "you", "your browser", "your data" — speak to one person
- **Confident, not hedging** — "Here's how it works." not "I'm going to try to explain..."
- **Avoid filler** — no "basically", "essentially", "actually" (unless for emphasis)
- **Avoid textbook language** — no "furthermore", "in conclusion", "it should be noted that"

### Humor Archetypes (1 per section)
- **Absurd analogy**: Compare tech to something wildly unrelated
- **Exaggerated consequence**: Blow up what happens when things fail
- **Dry sarcasm**: Deadpan delivery — works especially well for TTS
- **Developer in-group joke**: Shared pain points only devs understand
- **Never**: Two jokes in a row. Jokes requiring 1+ sentence setup. Puns that only work visually.

## Source Attribution in Narration

### When to Attribute
- **Always**: Specific numbers, percentages, benchmarks, release dates, quotes
- **Never**: General CS concepts, widely known facts, narrator's own analysis/opinion

### Natural Attribution Patterns

**Good** — weave the source into the sentence:
- "According to OpenAI's latest blog post, GPT-5 can process..."
- "Google just released a paper showing a forty percent improvement..."
- "The Node.js team announced version twenty two ships with..."
- "Cloudflare reported handling over fifty seven million requests per second..."

**Bad** — vague or missing source (script-critic will flag these):
- "Studies show that..." (which studies?)
- "Research suggests..." (whose research?)
- "Most developers prefer..." (based on what?)
- "It's widely known that..." (by whom?)

### Integration with script.json

Scenes with sourced claims include a `sources` array (see `research-integration.md` for format). Scenes with no sourced claims omit the field entirely. The sources array is metadata for verification — it doesn't appear in the video.

---

## Retention Patterns

### Forward Hooks (1 per section)
End content scenes with a tease of what's coming next:
- "But here's where it gets interesting..."
- "That sets up the real question..."
- "Now that you know how X works, wait until you see what Y does with it."

Place forward hooks in the last content scene before KeyTakeaway. Not every section needs a dramatic tease — a natural connective phrase works.

### Re-hook at 60% Mark
At roughly the 60% mark of the video (by scene count), insert a stronger narration beat to combat the mid-video retention valley:
- Restate the stakes: "And this is exactly where most people get it wrong."
- Tease the payoff: "The best part is coming up."
- Drop an unexpected fact or stat

This maps to approximately Section 3-4 in a 5-section video, or Section 4-5 in a 7-section video.

### Energy Oscillation
Alternate narration energy every 4-6 scenes:
- **Calm**: Explanatory, measured, laying groundwork
- **Burst**: Punchy, surprising, delivering a payoff or stat

Don't script energy literally — it emerges from sentence length and word choice. Short sentences with active verbs = burst. Longer connective sentences = calm.

---

## Silence Strategy

- **SectionTitle**: Always narrate (4-8 words) — silent gaps confuse viewers
- **EndScreen**: Always narrate (8-15 words) — silence over end cards feels unfinished
- **Very short scenes** (< 3s): May skip, but only if preceded/followed by narrated scenes
- Never have 2+ consecutive scenes without narration
