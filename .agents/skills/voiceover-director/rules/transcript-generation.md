# Transcript Generation Rules

## Core Principles

1. **Never read on-screen text verbatim** — narration complements the visuals, it doesn't duplicate them
2. **Respect word budgets** — calculated at 130 WPM (calibrated for Fish Audio TTS pacing). Going over means the audio will extend past the scene
3. **Conversational peer tone** — talk like a smart friend explaining over coffee, not a professor lecturing
4. **One idea per scene** — don't try to cover more than what the scene shows
5. **Flow naturally** — use connective phrases between scenes ("Now here's where it gets interesting...", "But wait...")

## Word Budget Calculation

Scenes in `TransitionSeries` share frames with neighbors. The **effective duration** subtracts the transition overlap. Budget uses 130 WPM — calibrated for Fish Audio TTS pacing (actual rate varies ~115-145 WPM depending on sentence complexity). The clamping mechanism in `buildVoiceoverScenes` handles minor overflow, but exceeding the budget risks audible cutoff.

```
effectiveDuration = durationSeconds - transitionAfterFrames / fps
wordBudget = floor(effectiveDuration × 130 / 60)
```

| Raw Duration | Transition | Effective | Budget |
|-------------|------------|-----------|--------|
| 3s          | 15f (0.5s) | 2.5s      | 5 words |
| 5s          | 15f (0.5s) | 4.5s      | 9 words |
| 6s          | 15f (0.5s) | 5.5s      | 11 words |
| 6s          | 20f (0.67s)| 5.33s     | 11 words |
| 8s          | 15f (0.5s) | 7.5s      | 16 words |
| 8s          | 20f (0.67s)| 7.33s     | 15 words |
| 10s         | 15f (0.5s) | 9.5s      | 20 words |
| 10s         | 18f (0.6s) | 9.4s      | 20 words |
| 10s         | 20f (0.67s)| 9.33s     | 20 words |
| 12s         | 18f (0.6s) | 11.4s     | 24 words |
| 12s         | 20f (0.67s)| 11.33s    | 24 words |
| 5s          | 0f (last)  | 5.0s      | 10 words |

**Stay at or under budget.** The 130 WPM rate already includes margin for TTS pauses. Going 1-2 words over is tolerable for short narrations (< 10 words) but risky for longer ones. Prefer flowing sentences over staccato fragments — TTS adds pauses for periods and commas that inflate duration beyond word count. Longer narrations (20+ words) tend to be spoken slower (~115-120 WPM) so budget is tighter.

## Scene-Type Narration Patterns

### HookQuestion
- **Approach**: Deliver the question with curiosity and energy
- **Don't**: Read the question text — add personality and context instead
- **Example**: On-screen shows "What happens when you click a link?" → Narrate: "Every single day, you click dozens of links without thinking about it. But have you ever wondered what actually happens in that split second?"

### TitleIntro
- **Approach**: Set expectations, build anticipation
- **Don't**: List the objectives verbatim — tease what's coming
- **Example**: "Today we're going to break down how the entire web works, from the moment you type a URL to the page appearing on your screen."

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
- **Approach**: Skip narration or keep to a brief CTA
- **Budget**: 0-5 words
- **Example**: "" (empty) or "Thanks for watching."

### ColdOpen
- **Approach**: Dramatic, attention-grabbing delivery
- **Example**: "Right now, as you watch this, millions of invisible conversations are happening between your device and servers all over the world."

## Tone Guidelines

- **Casual but knowledgeable** — you understand this stuff deeply but explain it simply
- **Brief humor** — one light joke or analogy per section is perfect
- **Active voice** — "DNS finds the IP" not "the IP is found by DNS"
- **Direct address** — "you", "your browser", "your data"
- **Avoid filler** — no "basically", "essentially", "actually" (unless for emphasis)
- **Vary sentence length** — mix short punchy statements with longer explanations

## Silence Strategy

Not every scene needs narration, but avoid long silent gaps that make the audio feel broken:
- **SectionTitle**: Always narrate with a brief transition phrase (4-6 words) — silent section gaps confuse viewers
- **EndScreen**: Skip narration — let the CTA visuals speak
- **Very short scenes** (< 3s without transition): May skip, but only if preceded/followed by narrated scenes
- Never have 2+ consecutive scenes without narration (except EndScreen)

## Word Count Verification Checklist

Before presenting the transcript for review, verify EVERY narrated scene:

1. **Count words** — count each narration's words (contractions = 1 word, hyphenated = 1 word)
2. **Compare to budget** — narration word count MUST be ≤ `wordBudget` in transcript.json
3. **Flag violations** — if any scene exceeds its budget, rewrite it shorter before presenting
4. **Check effective durations** — confirm `effectiveDurationSeconds` and `transitionAfterFrames` are populated
5. **Verify humor** — at least 1 light humor beat per section (absurd analogy, dev joke, exaggerated consequence)
6. **Verify no verbatim** — no narration should read on-screen text word-for-word
