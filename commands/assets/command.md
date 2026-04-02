---
name: assets
description: "Generate SEO-optimized titles, description, tags, chapters, and thumbnail for YouTube upload."
user-invocable: true
---

# /assets — Title, Description, Tags, Thumbnail

Generates all YouTube publishing metadata and optionally creates AI-generated thumbnails. Reads script.json and manifest.json to produce copy-paste-ready upload assets.

## Usage

```
/assets <VideoName>
/assets <VideoName> --no-thumbnail
```

## Examples

```
/assets HowTheWebWorks
/assets TheAIStackExplained --no-thumbnail
```

## Prerequisites

- Run `/video <VideoName>` first — script.json + manifest.json must exist
- `/voiceover` recommended (provides total duration for description)
- `REPLICATE_API_TOKEN` in `.env` for thumbnail generation (optional)

## Flags

```
--no-thumbnail     Skip AI thumbnail generation (outputs text brief only)
--titles-only      Generate only the 5 title variants (quick mode)
```

## What happens

### Phase A: CONTEXT GATHERING

Read these files automatically — do NOT ask the user for this information:

1. `src/<VideoName>/script.json` — topic, narration text, sections, scene types, meta fields (ideaSource, researchFile), sources
2. `src/<VideoName>/manifest.json` — section names, durationFrames, fps, totalDurationFrames
3. `productions/<date>-<slug>/research.md` — if available (via meta.researchFile or scanning productions/)
4. `src/<VideoName>/voiceover.ts` — if available (VOICEOVER_SCENES timing)

Extract and note:
- **Primary topic/keyword** from script.json meta or first section narration
- **Video type** (news/explainer/tutorial) from script.json meta
- **Key concepts** — the 3-5 main ideas covered
- **Section names + durations** from manifest.json (needed for chapters)
- **Total video duration** in MM:SS
- **Sources mentioned** in script.json scenes (for description links)

### Phase B: TITLES (5 variants, scored)

Read the youtube skill's SEO knowledge:
- `.agents/skills/youtube/sub-skills/seo.md` — title generation framework
- `.agents/skills/youtube/references/seo-playbook.md` — title rules + 2025 updates

Generate **5 title variants**, each using a different strategy:

| # | Strategy | Template Pattern |
|---|----------|-----------------|
| 1 | **Search-optimized** | Primary keyword first, clear promise. `"[Keyword]: [What You'll Learn]"` |
| 2 | **Browse/curiosity** | Curiosity gap, emotional hook. `"Why [Surprising Claim]"`, `"The [Adjective] Truth About [Topic]"` |
| 3 | **Hybrid** | Keyword + curiosity combined. `"[Keyword] — [Curiosity Hook]"` |
| 4 | **Contrarian** | Hot take, challenges assumptions. `"Stop Using [Popular Thing]"`, `"[Topic] Is Dead (Here's Why)"` |
| 5 | **Number/listicle** | Specific + scannable. `"[N] [Topic] [Outcome] in [Timeframe]"` |

**Score each title** on 5 dimensions (1-10 each, max 50):

| Dimension | Scoring Criteria |
|-----------|-----------------|
| **Keyword position** | 10 = keyword in first 20 chars. 7 = first 40 chars. 3 = present but late. 0 = absent. |
| **Length** | 10 = 60-70 chars. 8 = 70-80. 6 = 80-100 or 50-60. 4 = <50. 2 = >100 (truncated). |
| **Curiosity gap** | 10 = creates a question the viewer MUST answer. 5 = mildly interesting. 1 = fully descriptive. |
| **Thumbnail independence** | 10 = leaves room for completely different visual info. 5 = some overlap. 1 = thumbnail would just repeat title. |
| **Pattern match** | 10 = matches a proven high-CTR formula in the niche. 5 = generic but fine. 1 = unusual format. |

Present as a ranked table. **Recommend the top pick** with a one-sentence rationale.

Note: Suggest the user try YouTube's built-in A/B title testing after upload (test top 2-3 variants).

### Phase C: DESCRIPTION + TAGS + CHAPTERS

Read the youtube skill's metadata knowledge:
- `.agents/skills/youtube/sub-skills/metadata.md` — full metadata package template
- `.agents/skills/youtube/references/seo-playbook.md` — description/tag rules

#### Chapter Timestamps (auto-generated)

Calculate timestamps from `manifest.json`:

```
cumulativeSeconds = 0
for each section in manifest.sections:
    timestamp = formatAsMMSS(cumulativeSeconds)
    label = section.name (keyword-enriched)
    chapters.push({ timestamp, label })
    cumulativeSeconds += section.durationFrames / manifest.fps
```

First chapter MUST be `0:00`. Minimum 3 chapters. Labels should include relevant keywords naturally.

#### Description

Structure (per seo-playbook.md):

```
[First 150 chars: primary keyword + hook — this is visible before "Show More"]

[One blank line]

⏱️ Chapters
0:00 - [First section]
[auto-generated timestamps]

[250-word body with natural keyword integration (2-4x density)]
[Include key takeaways, what the viewer will learn]

📚 Resources
[Links from script.json sources — label each]

🔔 Subscribe for more AI explainers: [channel URL]

#[hashtag1] #[hashtag2] #[hashtag3]
```

Character limit: 5000 total. Show count.

#### Tags

Generate 10-15 tags within 500-char limit. Order by priority:
1. Exact primary keyword
2. Keyword variations (reworded, plural/singular)
3. Related concepts from the video
4. Broad niche terms (AI, programming, etc.)

Note: Tags are vestigial in 2026 (Gemini reads content directly). Spend minimal effort here.

#### VideoObject Schema

Generate JSON-LD `VideoObject` markup with:
- name, description, thumbnailUrl, uploadDate, duration (ISO 8601)
- Clip markup for each chapter
- SeekToAction for deep-link support

### Phase D: THUMBNAIL BRIEF

Read the youtube skill's thumbnail knowledge:
- `.agents/skills/youtube/sub-skills/thumbnail.md` — design brief format + A/B variants
- `.agents/skills/youtube/references/thumbnail-ctr-guide.md` — CTR benchmarks + design rules

**Step 1: Information Split Analysis**

Look at the recommended title. Determine:
- What information is IN the title? (keyword, promise, hook)
- What DIFFERENT information should the thumbnail convey? (visual proof, emotion, outcome)
- Text overlay on thumbnail must NOT repeat the title

**Step 2: Primary Thumbnail Brief**

For a faceless tech/AI channel:
- **Focal point**: Recognizable tech iconography, product screenshot, or conceptual visual. Position at rule-of-thirds intersection.
- **Background**: Dark with high contrast (BRAND.bg #0f0f1a base). Dramatic lighting.
- **Text overlay**: 3 words MAX. White text with black stroke. Upper portion of image (avoid YouTube timestamp in bottom-right).
- **Color palette**: 60-30-10 rule. Provide hex codes. Use BRAND colors as base (indigo #6366f1, cyan #06b6d4).
- **Composition**: Negative space for text. Test mentally at 168x94px (mobile feed size).

**Step 3: A/B Variants (3 total)**

Each variant changes exactly ONE variable from the primary:
- Variant A: Different text overlay (different angle/emotion)
- Variant B: Different color scheme (swap accent color)
- Variant C: Different composition (move focal point, change text position)

State the hypothesis for each: "This variant tests whether [change] increases CTR because [reasoning]."

### Phase E: THUMBNAIL IMAGE GENERATION (optional)

**If Replicate MCP is available** (check for `mcp__replicate` tools):

1. Craft a Flux image prompt from the primary brief:
   - Describe the scene, mood, lighting, colors — NO text in the prompt
   - Include: "photorealistic, high contrast, dramatic lighting, dark background, YouTube thumbnail style, 16:9 aspect ratio"
   - Map BRAND hex colors to English names for the prompt (e.g., #6366f1 = "indigo/purple tones")
2. Call Replicate MCP to generate with Flux 1.1 Pro (or black-forest-labs/flux-schnell for fast drafts)
3. Download the image to `public/thumbnails/<VideoName>/bg-primary.png`
4. Run Remotion still rendering:
   ```bash
   npx remotion still ThumbnailComposition \
     --props='{"backgroundImage":"./public/thumbnails/<VideoName>/bg-primary.png","textOverlay":"<3 words>","textPosition":"bottom-left","textColor":"#FFFFFF","strokeColor":"#000000","strokeWidth":4,"accentColor":"<hex>","channelBadge":true}' \
     --output=public/thumbnails/<VideoName>/thumbnail-primary.png
   ```
5. Repeat for A/B variants (generate new backgrounds or reuse with different text/composition)
6. Present all thumbnails to the user

**If Replicate MCP is NOT available**: Skip image generation entirely. The text brief from Phase D is the deliverable. Note that the user can create thumbnails manually from the brief using Canva, Figma, or any design tool.

### Phase F: ASSEMBLY + OUTPUT

1. Get the production folder path (from script.json meta.ideaSource, or scan `productions/` for matching slug)
2. If no production folder found, create `productions/<date>-<slug>/`
3. Write `productions/<date>-<slug>/assets.md` using the output template below
4. If thumbnails were generated, copy to production folder
5. Present to the user:
   - Top 3 title recommendations
   - Description first 150 chars (the preview)
   - Chapter count
   - Thumbnail image(s) or brief summary
6. Pre-publish checklist
7. End with: **"Review the assets, pick a title and thumbnail, then upload to YouTube."**

## Channel Identity (Hardcoded)

Do NOT ask the user for this. Use for all metadata decisions:

- **Channel**: medevsmaker
- **Niche**: AI news, AI agents, coding tutorials, developer tools, software engineering
- **Style**: Fireship-inspired — fast, visual, conversational
- **Audience**: Developers and vibe coders
- **Tone**: Peer-to-peer, confident, slightly irreverent
- **Channel URL**: https://youtube.com/@medevsmaker
- **Category**: Science & Technology

## Output Template

Write to `productions/<date>-<slug>/assets.md`:

```markdown
# Publishing Assets: <VideoName>
Generated: YYYY-MM-DD

---

## Title Options (ranked)

| Rank | Title | Chars | Type | Score |
|------|-------|-------|------|-------|
| 1 | [title] | [N] | [type] | [N/50] |
| 2 | [title] | [N] | [type] | [N/50] |
| 3 | [title] | [N] | [type] | [N/50] |
| 4 | [title] | [N] | [type] | [N/50] |
| 5 | [title] | [N] | [type] | [N/50] |

**Recommended**: #[N] — [one-sentence rationale]

**A/B test suggestion**: Upload #[N] as primary, add #[N] and #[N] as test variants in YouTube Studio.

---

## Description (copy-paste ready)

```
[full description — first 150 chars are the visible preview]
```

**Character count**: [N]/5000

---

## Tags (copy-paste ready)

```
[comma-separated tags]
```

**Character count**: [N]/500

---

## Chapters

| Timestamp | Label |
|-----------|-------|
| 0:00 | [section name] |
| [MM:SS] | [section name] |
| ... | ... |

---

## Thumbnail

### Information Split
- **Title conveys**: [what the title tells the viewer]
- **Thumbnail conveys**: [what the thumbnail adds — must be different]

### Primary Brief
- **Focal point**: [description + position]
- **Background**: [description + mood]
- **Text overlay**: "[3 words max]" — [font, size, position, color + stroke]
- **Color palette**: [hex codes with 60-30-10 breakdown]
- **Composition**: [rule of thirds, negative space notes]
- **Mobile check**: [will this read at 168x94px?]

### A/B Variants
| Variant | Change | Hypothesis |
|---------|--------|------------|
| A | [one change] | [predicted CTR effect] |
| B | [one change] | [predicted CTR effect] |
| C | [one change] | [predicted CTR effect] |

### Generated Images
- Primary: `public/thumbnails/<VideoName>/thumbnail-primary.png`
- Variant A: `public/thumbnails/<VideoName>/thumbnail-a.png`
- Variant B: `public/thumbnails/<VideoName>/thumbnail-b.png`
- Variant C: `public/thumbnails/<VideoName>/thumbnail-c.png`

(If not generated: "Thumbnail images not generated — use the brief above to create manually.")

---

## VideoObject Schema

```json
[JSON-LD markup]
```

---

## Cards & End Screens

- **Card 1** (at ~[MM:SS], 20% mark): [CTA + linked content suggestion]
- **Card 2** (at ~[MM:SS], 70% mark): [CTA + linked content suggestion]
- **End screen** (final 20 seconds, from [MM:SS]): Subscribe button + best video suggestion

---

## Publish Settings

- **Category**: Science & Technology
- **Language**: English
- **Audience**: Not made for kids
- **Visibility**: Public (or schedule for optimal time)
- **Optimal upload time**: [day/time recommendation for tech niche]

---

## Pre-Publish Checklist

- [ ] Title selected from options above
- [ ] Thumbnail selected (or created from brief) and uploaded
- [ ] Description pasted into YouTube Studio
- [ ] Tags pasted
- [ ] Chapters verified — play video and check timestamp accuracy
- [ ] End screen configured (final 20 seconds)
- [ ] Cards added at recommended timestamps
- [ ] Category set to Science & Technology
- [ ] "Not made for kids" selected
- [ ] Subtitles/captions uploaded or auto-captions reviewed
- [ ] Visibility set (Public / Scheduled)
- [ ] VideoObject schema added to blog/embed page (if applicable)
- [ ] A/B title test configured in YouTube Studio (optional)
- [ ] Share link ready for social posts
```

## Quality Criteria

- All 5 titles are genuinely distinct strategies (not word-swap variations)
- Primary keyword appears in first 40 characters of at least 3 titles
- All titles are 60-100 characters
- Description first 150 chars contain primary keyword + a compelling hook
- Description body is 200-350 words with natural keyword density (not stuffed)
- Chapters start at 0:00 with minimum 3 entries, each 10+ seconds
- Tags total under 500 characters
- Thumbnail text overlay is 3 words or fewer
- Thumbnail text does NOT duplicate the title
- Thumbnail color palette includes hex codes
- A/B variants each change exactly ONE variable
- VideoObject schema is valid JSON-LD
- All source links in description are real URLs from research
- Pre-publish checklist has no items that don't apply
