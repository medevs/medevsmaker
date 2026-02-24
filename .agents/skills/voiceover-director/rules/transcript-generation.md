# Transcript Generation Rules

## narrationIntent-First Writing Process

Each scene in manifest.json includes a `narrationIntent` field written by the video director during scene planning. This is your primary creative input.

### How to use narrationIntent

1. **Read the intent** — understand what the narration should accomplish
2. **Check onScreenText** — know what's already on screen (never repeat it)
3. **Apply narratorTone** — match the emotional guidance
4. **Write to word budget** — stay within the adaptive WPM budget
5. **Apply scene-type patterns** — use the narration approach for this scene type

### Example

```
narrationIntent: "Create urgency — everyone clicks links but nobody knows what happens"
onScreenText: ["What actually happens when you click a link?"]
narratorTone: "mysterious, slightly playful"
wordBudget: 17
```

Result: "You click a link fifty times a day, but do you actually know what happens behind the scenes?"

### Fallback (no narrationIntent)

If a manifest doesn't include `narrationIntent` (older videos), fall back to writing narration from visual props alone — the current behavior. Check `onScreenText` from the transcript skeleton and apply scene-type patterns as usual.

---

## Core Principles

1. **Never read on-screen text verbatim** — narration complements the visuals, it doesn't duplicate them
2. **Respect word budgets** — calculated with adaptive WPM (190 for short scenes < 3s, 160 for medium 3-7s, 140 for long > 7s). Going over means the audio will extend past the scene
3. **Conversational peer tone** — talk like a smart friend explaining over coffee, not a professor lecturing. Confident but not preachy.
4. **One idea per scene** — don't try to cover more than what the scene shows
5. **Flow naturally** — use connective phrases: "So here's the thing.", "And this is where it clicks.", "Now pay attention to this.", "Here's why that matters."
6. **Vary sentence rhythm** — alternate short punchy sentences (3-6 words) with medium ones (8-15 words). Never 3+ sentences of the same length in a row. This is the biggest factor preventing robotic-sounding narration.
7. **Front-load the interesting part** — put the payoff at the start, context at the end. "DNS finds the address. Here's how." not "The process of DNS resolution involves..."

## Word Budget Calculation

Scenes in `TransitionSeries` share frames with neighbors. The **effective duration** subtracts the transition overlap.

Budget uses **adaptive WPM** calibrated from measured Cartesia pacing (raised ~15% from original thresholds to reduce silent gaps):
- **Short scenes (< 3s effective)**: 190 WPM — TTS speaks brief phrases very fast
- **Medium scenes (3-7s effective)**: 160 WPM — typical single-sentence narration
- **Long scenes (> 7s effective)**: 140 WPM — multi-sentence narrations are spoken slower

```
effectiveDuration = durationSeconds - transitionAfterFrames / fps
wpm = effectiveDuration < 3 ? 190 : effectiveDuration < 7 ? 160 : 140
wordBudget = floor(effectiveDuration × wpm / 60)
```

| Raw Duration | Transition | Effective | WPM | Budget |
|-------------|------------|-----------|-----|--------|
| 3s          | 15f (0.5s) | 2.5s      | 190 | 7 words |
| 5s          | 15f (0.5s) | 4.5s      | 160 | 12 words |
| 6s          | 15f (0.5s) | 5.5s      | 160 | 14 words |
| 6s          | 20f (0.67s)| 5.33s     | 160 | 14 words |
| 8s          | 15f (0.5s) | 7.5s      | 140 | 17 words |
| 8s          | 20f (0.67s)| 7.33s     | 140 | 17 words |
| 10s         | 15f (0.5s) | 9.5s      | 140 | 22 words |
| 10s         | 18f (0.6s) | 9.4s      | 140 | 21 words |
| 10s         | 20f (0.67s)| 9.33s     | 140 | 21 words |
| 12s         | 18f (0.6s) | 11.4s     | 140 | 26 words |
| 12s         | 20f (0.67s)| 11.33s    | 140 | 26 words |
| 5s          | 0f (last)  | 5.0s      | 160 | 13 words |

**Aim for 90-100% of budget.** Under-filling creates awkward silence before the next scene. Going 1-2 words over is tolerable for short narrations but risky for longer ones. If you have 19 words of budget, write 17-19 words, not 12. Add context, elaboration, or a connecting phrase to fill available time. Prefer flowing sentences over staccato fragments — TTS adds pauses for periods and commas that inflate duration beyond word count.

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
- **Budget**: 4-6 words
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
- **Budget**: 8-12 words
- **Example**: "If this helped, hit subscribe, I'll catch you in the next one."
- **Don't**: Say generic "Thanks for watching!" — TTS can't deliver enthusiasm naturally

### ColdOpen
- **Approach**: Dramatic, attention-grabbing delivery
- **Don't**: Start slow or with context — jump straight into the statement
- **Example**: "Right now, as you watch this, millions of invisible conversations are happening between your device and servers all over the world."

### FeatureIntro
- **Approach**: Build anticipation, then explain what this feature/concept is in your own words. Frame why it matters before defining it. The visual shows a card with the definition, so your narration should complement with context and enthusiasm.
- **Don't**: Read the definition card verbatim. Don't read pill badge labels. Don't start with "so" or "now let's talk about."
- **Example**: "This one is huge. Model Context Protocol, or MCP, gives AI tools a standard way to talk to external services. And it changes everything about how agents interact with the world."
- **Variant note**: If the scene has a `breadcrumb` ("FEATURE 2 OF 5"), don't narrate the breadcrumb — the viewer can read it.

### ProgressiveTerminal
- **Approach**: Walk through the list conversationally, highlighting the 2-3 most interesting items. The visual reveals items one by one, so your narration should match the staggered pacing — start broad, then zoom into standout items.
- **Don't**: Read every item verbatim. Don't use "first, second, third" pacing — the visual already shows the sequence.
- **Example**: "It handles authentication, caching, rate limiting, and a whole lot more. But the one that really matters here is the built-in retry logic, because without it, one network hiccup takes down your entire pipeline."

### DecisionTable
- **Approach**: Frame the decision context first ("so when do you pick which one?"), then call out the most surprising or counterintuitive rows. The visual shows question/answer pairs with colored pill badges, so narrate the *reasoning* behind the answers, not the answers themselves.
- **Don't**: Read every question/answer pair. Don't just list "if X then Y" for each row.
- **Example**: "So when should you use each one? If you need real-time updates, WebSockets wins hands down. But here's the surprise, for most use cases, simple polling is actually good enough."

### ThreeColumnCompare
- **Approach**: Highlight what makes each option *distinct*, not what they have in common. The visual shows three cards side by side, so your narration should create a narrative arc — maybe start with the most common choice and contrast against the others.
- **Don't**: Read all bullet items from all three columns. Don't treat it as three separate lists.
- **Example**: "Three tools, three philosophies. Redis is pure speed, PostgreSQL is pure reliability, and MongoDB is pure flexibility. The one you pick depends entirely on what you're optimizing for."

### FileTreeScene
- **Approach**: Walk through the key structural decisions, not every file. Explain *why* the project is organized this way. The visual shows a directory tree with highlighted important files, so narrate the architecture reasoning.
- **Don't**: Read the full directory tree. Don't say "and then we have" for each folder.
- **Example**: "Here's how the project is organized. The src folder holds your components, the API routes live in app slash api, and your database schema sits in prisma. Everything has a clear home."

### KeyRuleCard
- **Approach**: Deliver the key insight with emphasis and conviction. This is a *statement* scene, not an explanation scene. The visual shows a large statement with gradient text on the key word, so your narration should match that weight — short, punchy, memorable.
- **Don't**: Add extra context or qualifiers. Don't say "what I mean by that is." Let the statement breathe.
- **Budget**: Usually 5-7s scene, so 12-16 words max. Keep it tight.
- **Example**: "Here's the golden rule. Never trust the client. Always validate on the server. No exceptions."

### ArchitectureDiagram
- **Approach**: Start from the center hub and explain outward connections. The visual reveals the center node first, then satellites stagger in. Match this rhythm — introduce the center, then walk through 2-3 key connections.
- **Don't**: List every satellite node. Don't describe the visual layout ("on the left we have...").
- **Example**: "At the center is your API gateway, and everything flows through it. Your auth service, your database, your cache layer, your message queue, all connected through that single entry point."

### Scene Variant Narration Notes

Some existing scenes have new visual variants. The narration approach stays the same, but be aware of what the viewer sees:

- **StepSequence `variant="card"`**: Steps appear in colored cards instead of plain list. Narration unchanged — walk through steps in order.
- **DiagramFlow `variant="pipeline"`**: Horizontal rectangles with → arrows instead of SVG boxes. Narration unchanged — explain the flow left to right.
- **ComparisonSplit `variant="cards"`**: Each side in a ColorBorderCard instead of plain panel. Narration unchanged — highlight the key difference.
- **CodeDisplay `layout="annotated"`**: Annotations appear as small colored cards instead of plain text. Narration unchanged — explain what the code does.
- **DataChart `variant="labeled"`**: Bars have colored pill badge labels (e.g. "CRITICAL", "LOW"). Mention the severity labels if they add meaning: "Notice how the top three are all marked critical."
- **KeyTakeaway `variant="insight"`**: Shows gradient text instead of accent box. Narration should be shorter and punchier — the visual is more dramatic, so match the energy. Closer to KeyRuleCard style.

## ElevenLabs-Ready Speech Patterns

When writing narration optimized for premium TTS (ElevenLabs, Cartesia sonic-3):

### Flowing Sentences
- Prefer longer flowing sentences (10-15 words) over staccato fragments (3-5 words)
- Use bridge phrases to connect ideas: "and that means", "which is why", "so what happens next is"
- Avoid bullet-point delivery: "First this. Then this. Then this." — sounds robotic in TTS

### Natural Rhythm
- Vary sentence length: short (5-7 words) → medium (10-14 words) → short → long (15-18 words)
- Use commas for natural pauses, not periods for every phrase
- Contractions are essential: "it's", "you'll", "that's", "we're", "doesn't"

### Emphasis Through Word Choice
- TTS can't emphasize words, so choose impactful vocabulary: "crucial" not "important", "massive" not "big"
- Front-load the interesting part of each sentence
- Use concrete imagery: "your browser sprints to the server" not "the browser communicates with the server"

### Narration-Visual Sync for New Components
The new visual system uses persistent overlays (SectionTracker, FeatureCounter) and signature elements (ColorBorderCards, PillBadges, GradientText). Narration rules for these:
- **Never narrate overlay text** — SectionTracker ("NOW COVERING: DNS") and FeatureCounter ("FEATURE 2 OF 5") are read by the viewer. Narrating them sounds redundant.
- **Never read pill badge labels** — "REQUIRED", "OPTIONAL", "CRITICAL" etc. are visual labels. If they matter, weave the concept into your sentence naturally: "and this one is absolutely required" not "the badge says required."
- **GradientText words are key phrases** — these are visually emphasized. Your narration should naturally emphasize the same concept through word choice, not by saying "notice the highlighted word."
- **ColorBorderCard content is on-screen text** — standard rule applies: don't read it verbatim. Complement it.

## Tone Guidelines

- **Casual but knowledgeable** — you understand this stuff deeply but explain it simply
- **Active voice** — "DNS finds the IP" not "the IP is found by DNS"
- **Direct address** — "you", "your browser", "your data" — speak to one person, not an audience
- **Confident, not hedging** — "Here's how it works." not "I'm going to try to explain how this might work."
- **Avoid filler** — no "basically", "essentially", "actually" (unless for emphasis)
- **Avoid textbook language** — no "furthermore", "in conclusion", "it should be noted that"

### Humor Archetypes (1 per section, pick the best fit)
- **Absurd analogy**: Compare tech to something wildly unrelated. "Your browser is a waiter sprinting between you and the kitchen nonstop."
- **Exaggerated consequence**: Blow up what happens when things fail. "No database and your app becomes a goldfish, every restart completely blank."
- **Dry sarcasm**: Deadpan delivery of obviously absurd statements. Works especially well for TTS which naturally delivers deadpan.
- **Developer in-group joke**: Shared pain points only devs understand. Keep accessible — if non-devs won't get it, skip it.
- **Never**: Two jokes in a row. Jokes requiring more than 1 sentence of setup. Puns that only work visually.

## Silence Strategy

Not every scene needs narration, but avoid long silent gaps that make the audio feel broken:
- **SectionTitle**: Always narrate with a brief transition phrase (4-7 words) — silent section gaps confuse viewers
- **EndScreen**: Add a conversational CTA (8-12 words) — silence over the end card feels unfinished
- **Very short scenes** (< 3s without transition): May skip, but only if preceded/followed by narrated scenes
- Never have 2+ consecutive scenes without narration

## TTS Text Optimization

Neural TTS (Cartesia, ElevenLabs, etc.) responds to text formatting in specific ways. Follow these rules for natural-sounding output:

### Sentence Structure
- **Short sentences** — TTS sounds most natural with 5-15 word sentences. Long compound sentences sound robotic.
- **One clause per comma** — "Browser parses the domain, asks DNS for the IP" flows naturally. Avoid 3+ comma chains.
- **Use contractions** — "we'll", "it's", "don't", "you'll" sound conversational. "We will", "it is" sound formal/robotic.

### Punctuation for Pacing
- **Commas** create 0.2-0.3s pauses — use for natural breath points
- **Periods** create 0.4-0.6s pauses — use to separate distinct ideas
- **Avoid standalone em-dashes** (`—`) — TTS may mispronounce or skip them. Use commas instead.
- **Avoid standalone ellipses** (`...`) — inconsistent across providers. Attach to preceding word: `"First up..."` not `"First up ..."`
- **Avoid exclamation marks** — TTS can't deliver genuine excitement. "This is incredible!" sounds sarcastic. Use word choice for emphasis instead.

### Word Choice
- **Spell out numbers** — "two hundred" not "200", "a trillion" not "1,000,000,000,000"
- **Spell out abbreviations** — "four oh four" not "404", "HTTP" is fine (TTS handles common acronyms)
- **Avoid emotional openers** — "Good morning!", "Hey what's up!" sound unnatural in TTS. Jump straight to content.
- **Use concrete words** — "sprinting between you and the kitchen" > "facilitating communication between client and server"

### Word Budget Counting
The pipeline counts words using `text.split(/\s+/).filter(Boolean).length`. This means:
- **Standalone `—`** counts as 1 word of budget (use commas instead)
- **Standalone `...`** counts as 1 word (attach to previous word: `"First up..."`)
- **Hyphenated words** (`short-order`) count as 1 word
- **Contractions** (`we'll`, `it's`) count as 1 word

### Anti-Patterns
- **Staccato fragments**: "Step one. Step two. Step three." — each period adds ~0.5s of dead air
- **Lists with colons**: "Here's what happens: first, second, third" — colon pause is awkward in TTS
- **Rhetorical questions**: "But why?" — TTS can't deliver questioning intonation naturally
- **Repeated words**: "very very important" — TTS doesn't emphasize repetition

## Word Count Verification Checklist

Before presenting the transcript for review, verify EVERY narrated scene:

1. **Count words** — count each narration's words (contractions = 1 word, hyphenated = 1 word)
2. **Compare to budget** — narration word count MUST be ≤ `wordBudget` AND ≥ 90% of `wordBudget`. Under-filling causes silent gaps.
3. **Flag violations** — if any scene exceeds budget OR is below 90%, rewrite it before presenting
4. **Check effective durations** — confirm `effectiveDurationSeconds` and `transitionAfterFrames` are populated
5. **Verify humor** — at least 1 light humor beat per section (absurd analogy, dev joke, exaggerated consequence)
6. **Verify no verbatim** — no narration should read on-screen text word-for-word
