---
name: narration-writing
description: Rules for writing narration during /script — tone, TTS optimization, visual sync, retention
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

### Visual Storytelling Sync
- Narration should describe what the viewer is seeing when possible — "Watch as each node lights up in the diagram" not just "The process has four steps"
- When an animation plays (counter spinning, diagram building, particles dispersing), acknowledge it in narration timing
- Match narration energy to visual intensity — punchy delivery for TextGlitch/ParticleLightning scenes, measured delivery for DiagramFlow/ConceptExplain

### Open Loop Rules
- Every section opener (after SectionTitle narration) should hint at a payoff within the section
- The video's first 3 scenes must each contain a micro-hook: a question, a surprising claim, or a "wait until you see" tease
- Never resolve all tension before the final section — keep one thread open

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
