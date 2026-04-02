---
name: distribute
description: "Generate cross-platform distribution content from a completed video — blog post, social threads, email newsletter, community post, and posting schedule."
disable-model-invocation: true
---

# /distribute — Content Cascade Across Platforms

Generates ready-to-post content for 5 platforms from a completed video. Reads script.json, manifest.json, assets.md, and research.md to produce platform-native content — not transcript copy-paste. Each output is a self-contained markdown file you can paste directly into the target platform.

## Usage

```
/distribute <VideoName>
/distribute <VideoName> --video-url <YouTube-URL>
/distribute <VideoName> --platforms blog,twitter,linkedin
/distribute <VideoName> --no-blog
```

## Examples

```
/distribute HowTheWebWorks --video-url https://youtube.com/watch?v=abc123
/distribute TheAIStackExplained --platforms twitter,linkedin
/distribute CursorVsCopilot --no-blog
```

## Prerequisites

- Run `/assets <VideoName>` first — assets.md must exist (provides chosen title, tags, SEO keyword)
- `src/<VideoName>/script.json` — narration text, topic, meta, sources
- `src/<VideoName>/manifest.json` — section names, durations
- `productions/<date>-<slug>/research.md` — recommended for blog depth (stats, sources, context)

## Flags

| Flag | Description |
|------|-------------|
| `--video-url <URL>` | YouTube video URL for CTAs. If omitted, uses `[VIDEO_URL]` placeholder. |
| `--platforms <list>` | Comma-separated: `blog`, `twitter`, `linkedin`, `email`, `community`, `all` (default: `all`) |
| `--no-blog` | Skip blog post generation (faster run) |

## What happens

### Phase A: CONTEXT GATHERING

Read these files automatically — do NOT ask the user for this information:

1. `src/<VideoName>/script.json` — topic, narration text per scene, sections, meta fields (ideaSource, researchFile, type), sources array
2. `src/<VideoName>/manifest.json` — section names, durationFrames, fps, totalDurationFrames
3. `productions/<date>-<slug>/assets.md` — chosen title, description, tags, chapters (via meta.researchFile path or scanning productions/ for matching slug)
4. `productions/<date>-<slug>/research.md` — if available (original research with sources, stats, context)
5. `src/<VideoName>/transcript.json` — if available (scene-by-scene narration with timing)

Also scan:
6. `src/<VideoName>Short*/script.json` — detect if `/repurpose` has been run, count how many shorts exist

Load platform formatting knowledge:
7. `.agents/skills/youtube/sub-skills/repurpose.md` — platform-specific templates and quality rules
8. `.agents/skills/youtube/references/repurposing-guide.md` — cross-platform best practices

Extract and note:
- **Video title** — from assets.md recommended pick (or script.json meta.topic as fallback)
- **Primary SEO keyword** — from assets.md tags (first tag) or script.json meta
- **Core message** — single sentence: what does the viewer learn?
- **Key insights** — 5-7 distinct takeaways from the narration
- **Quotable lines** — 3-5 punchy narration lines that work standalone (for tweets/LinkedIn)
- **Sources with URLs** — from script.json sources array and research.md
- **Video duration** — from manifest.json totalDurationFrames / fps, formatted as MM:SS
- **Shorts count** — how many `<VideoName>Short*` folders exist (0 if `/repurpose` not run)
- **Chapter timestamps** — from assets.md (for blog embeds)

**If `type: "short"`** in script.json: skip the blog post and email newsletter (shorts don't have enough content). Generate only twitter, linkedin, and community post.

### Phase B: BLOG POST (1500-2000 words)

The blog post serves dual purpose: SEO capture for Google and embed destination for the YouTube video.

**Inputs**: narration from script.json/transcript.json (raw content), research.md (depth, sources, stats), assets.md (SEO keyword, title, chapters)

**Process**:

1. **Target keyword**: Use the primary SEO keyword from assets.md tags
2. **Structure from sections**: Map manifest.json section names to H2 headings — the article follows the video's logical flow
3. **Rewrite narration into prose** — this is NOT a transcript paste. Transform spoken narration into written article style:
   - Remove verbal patterns ("so", "now", "right?", "let's talk about")
   - Expand abbreviations and add context that was visual-only in the video
   - Add paragraph breaks, subheadings, formatting for scannability
   - Convert conversational tone to written tone (still accessible, not academic)
4. **Enrich with research.md** — add statistics, source citations, and context that was cut from the video for brevity
5. **YouTube embeds**: Place iframe embeds with `?t=XXs` timestamp parameters at each H2 section (timestamps from assets.md chapters)
6. **SEO elements**:
   - Meta description (155 chars max, includes primary keyword)
   - Primary keyword in H1 + first paragraph + 2-3 H2 headings naturally
   - Alt text for any embedded images
7. **Internal link placeholders**: Add `[INTERNAL LINK: related topic]` where a link to related content would strengthen SEO
8. **Article JSON-LD schema**: Generate `Article` structured data markup

**Output format**:

```markdown
<!-- META: keyword "[keyword]" | [word count] words | reading time: [N] min -->
<!-- META DESCRIPTION: [155 chars max] -->

# [Article Title — may differ slightly from video title for search intent]

[Opening paragraph — hook + primary keyword + what the reader will learn]

[YouTube embed: full video]

## [H2 from section 1]

[Prose content — 200-400 words per section]

[YouTube embed with ?t=XXs if section has a chapter timestamp]

## [H2 from section 2]

[Continue for each major section...]

## Key Takeaways

- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]

## Sources

- [Source 1 with URL]
- [Source 2 with URL]

---

<!-- ARTICLE SCHEMA -->
```json
{ "@context": "https://schema.org", "@type": "Article", ... }
```
```

### Phase C: X/TWITTER THREAD

**Process**:

1. Extract 4-6 key insights from the narration that each stand alone as independent value
2. Write a **hook tweet** — standalone insight + curiosity gap, under 280 chars. Must work for someone who has NEVER seen the video.
3. Write **4-6 insight tweets** — each delivers one distinct takeaway, under 280 chars each
4. Write a **CTA tweet** with video link and 1-2 relevant hashtags
5. Show character count for every tweet

**Rules**:
- Every tweet under 280 characters — show `[N/280 chars]` after each
- Hook tweet must create a curiosity gap or pattern interrupt
- No "Thread:" or "1/" prefix (outdated pattern)
- Hashtags only on the CTA tweet (1-2 max)
- Each insight tweet works independently — a reader can screenshot any single tweet and it makes sense

**Output format**:

```markdown
# X/Twitter Thread — [N] tweets

**Tweet 1 (Hook):**
> [Hook tweet text]

[N/280 chars]

**Tweet 2:**
> [Insight tweet]

[N/280 chars]

**Tweet 3:**
> [Insight tweet]

[N/280 chars]

[...repeat for each insight tweet...]

**Tweet [N] (CTA):**
> [CTA with video link + hashtags]

[N/280 chars]

---
**Best posting time**: Within 2 hours of video going live
**Engagement tip**: Reply to your own thread with the video thumbnail image for higher impressions
```

### Phase D: LINKEDIN POST

**Process**:

1. Extract the professional or industry angle from the video content
2. Write a **150-word hook paragraph** — lead with a contrarian insight, surprising stat, or professional observation. NOT a video promotion.
3. List **3 key takeaways** with professional context (what this means for developers/teams/industry)
4. Add a **CTA** — either link to the video or ask an engagement question ("What's your experience with X?")
5. Total word count: 200-300 words

**Rules**:
- LinkedIn tone is professional and insight-driven, never clickbaity
- No emojis in the first line
- Lead with value, not promotion — the post should be worth reading even without watching the video
- Line breaks after every 1-2 sentences (LinkedIn mobile formatting)
- No hashtags in the body — add 3-5 at the very end if desired

**Output format**:

```markdown
# LinkedIn Post — [word count] words

---

[150-word hook paragraph]

[blank line]

3 things I learned:

1. [Takeaway with professional context]

2. [Takeaway]

3. [Takeaway]

[blank line]

[CTA — video link or engagement question]

[optional: 3-5 hashtags]

---
**Best posting time**: Weekday morning (Tue-Thu, 8-10 AM)
**Engagement tip**: Reply to your own post with a question within 30 minutes to boost reach
```

### Phase E: EMAIL NEWSLETTER

**Process**:

1. Generate **2 subject line variants** for A/B testing:
   - Variant A: curiosity-driven (creates an open loop)
   - Variant B: benefit-driven (states what the reader gains)
2. Write **preview text** (40-90 characters) — supplements the subject line, does NOT repeat it
3. Write a **200-word distillation** of the video's core value — this is a synthesis, not a summary. Extract the single most important insight and expand on it.
4. Include a **CTA button**: "Watch the full breakdown" with video link
5. Add a **P.S. line** with a secondary CTA (reply with thoughts, share with a colleague, or pointer to related content)

**Rules**:
- The newsletter is a distillation (200 words), NOT a summary of the entire video
- Subject lines are under 50 characters (mobile inbox truncation)
- Preview text adds new information — never repeats the subject line
- One primary CTA only (the video link) — don't split attention

**Output format**:

```markdown
# Email Newsletter

**Subject Line A**: [curiosity variant] — [char count]
**Subject Line B**: [benefit variant] — [char count]
**Preview text**: [40-90 chars]

---

[200-word body — distilled insight, not a summary]

[CTA: Watch the full breakdown → VIDEO_URL]

P.S. [Secondary CTA — reply, share, or related content pointer]

---
**Send timing**: Day after video publish (morning, 8-10 AM)
**Segment tip**: Send to most engaged subscribers first for better deliverability
```

### Phase F: YOUTUBE COMMUNITY POST

**Process**:

1. Choose post type — **Poll** is preferred (highest engagement and algorithm signal):
   - Poll: 4 options related to the video topic + a question that creates curiosity
   - Image: Key visual from the video + caption
   - Text: Short teaser + CTA (least effective, use only as fallback)
2. Write caption text (2-3 sentences max)
3. Include CTA driving to the video
4. Note timing: **publish within 1 hour of video going live** (same-day algorithm boost)

**Rules**:
- Community posts are for engagement, not description — keep it short
- Polls drive 2-3x more engagement than text posts
- Poll options should be interesting enough that people want to vote AND see results
- The poll question should create curiosity about the video answer

**Output format**:

```markdown
# YouTube Community Post

**Post type**: Poll
**Timing**: Publish within 1 hour of video going live

**Question:**
> [Poll question related to video topic]

**Options:**
1. [Option A]
2. [Option B]
3. [Option C]
4. [Option D]

**Caption:**
> [2-3 sentence teaser + CTA to watch the video]
> [VIDEO_URL]

---
**Why poll**: Polls get 2-3x more engagement than text posts, boosting the community tab algorithm signal which helps your video's initial push.
```

### Phase G: CROSS-POSTING SCHEDULE

Generate a day-by-day posting schedule that maximizes algorithmic reach across all platforms. Account for whether `/repurpose` was run (shorts in the schedule) and the `--video-url` flag.

| Day | Platform | Content | Time | File |
|-----|----------|---------|------|------|
| Day 0 | YouTube | Long-form video | Optimal upload time | (uploaded manually) |
| Day 0 | YouTube Community | Poll/post | +1 hour after publish | `community-post.md` |
| Day 0 | X/Twitter | Thread | +2 hours | `twitter-thread.md` |
| Day 0 | LinkedIn | Post | +3 hours | `linkedin-post.md` |
| Day 1 | Email | Newsletter | Morning (8-10 AM) | `email-newsletter.md` |
| Day 1 | Blog | Article | Afternoon | `blog-post.md` |
| Day 3 | YouTube Shorts | Short #1 | Morning | (from `/repurpose`) |
| Day 5-6 | YouTube Shorts | Short #2 | Morning | (from `/repurpose`) |
| Day 8-9 | YouTube Shorts | Short #3 | Morning | (from `/repurpose`) |

If no shorts exist (no `/repurpose`), omit the Shorts rows and add a note: "Consider running `/repurpose <VideoName>` to extract 3-5 shorts for extended reach."

**Output format**:

```markdown
# Cross-Posting Schedule

| Day | Platform | Content | Time | File | Status |
|-----|----------|---------|------|------|--------|
| ... | ... | ... | ... | ... | [ ] |

## Notes
- Community post is the highest-urgency item — same-day algorithm boost
- Shorts spacing: 2-3 days apart for algorithm diversity
- Blog indexing takes 1-3 days — publish Day 1 for optimal Google pickup
- [If no shorts]: Consider running `/repurpose <VideoName>` to extract shorts
```

### Phase H: ASSEMBLY + OUTPUT

1. Resolve the production folder path (from script.json meta.ideaSource or scan `productions/` for matching date-slug)
2. Create `productions/<date>-<slug>/distribute/` subfolder
3. Write all platform files to the subfolder (skip any excluded by `--platforms` flag)
4. Replace `[VIDEO_URL]` with `--video-url` value in all files if provided, otherwise leave placeholder
5. Write `productions/<date>-<slug>/distribute-status.json` (see Status Tracking below)
6. Present summary to user:
   - Blog: word count + target keyword
   - Thread: tweet count + hook preview (first 80 chars)
   - LinkedIn: word count + hook angle
   - Email: both subject line variants
   - Community: post type + question
   - Schedule: posting window overview
   - Shorts: count detected (or "none — suggest /repurpose")
7. End with: **"Review each file in `distribute/`, then post to each platform following the schedule. Update distribute-status.json as you publish."**

## Status Tracking

Write `productions/<date>-<slug>/distribute-status.json`:

```json
{
  "videoName": "<VideoName>",
  "generatedAt": "<ISO timestamp>",
  "videoUrl": "<URL or null>",
  "platforms": {
    "blog": {
      "status": "generated",
      "file": "distribute/blog-post.md",
      "wordCount": 1750,
      "targetKeyword": "<keyword>",
      "publishedAt": null,
      "url": null
    },
    "twitter": {
      "status": "generated",
      "file": "distribute/twitter-thread.md",
      "tweetCount": 7,
      "publishedAt": null,
      "url": null
    },
    "linkedin": {
      "status": "generated",
      "file": "distribute/linkedin-post.md",
      "wordCount": 250,
      "publishedAt": null,
      "url": null
    },
    "email": {
      "status": "generated",
      "file": "distribute/email-newsletter.md",
      "subjectLineA": "<subject A>",
      "subjectLineB": "<subject B>",
      "publishedAt": null
    },
    "community": {
      "status": "generated",
      "file": "distribute/community-post.md",
      "postType": "poll",
      "publishedAt": null
    },
    "shorts": {
      "status": "pending",
      "count": 0,
      "schedule": [],
      "published": []
    }
  }
}
```

Status lifecycle per platform: `skipped` | `generated` | `posted`
- `skipped` — excluded via `--platforms` flag or not applicable (e.g., blog for short-form videos)
- `generated` — content file created, not yet posted
- `posted` — user has manually posted and updated this field

The user updates `publishedAt` and `url` manually after posting to each platform.

## Channel Identity (Hardcoded)

Do NOT ask the user for this. Use for all content generation:

- **Channel**: medevsmaker
- **Niche**: AI news, AI agents, coding tutorials, developer tools, software engineering
- **Style**: Fireship-inspired — fast, visual, conversational
- **Audience**: Developers and vibe coders
- **Tone**: Peer-to-peer, confident, slightly irreverent
- **Channel URL**: https://youtube.com/@medevsmaker

## Output Structure

```
productions/<date>-<slug>/
  distribute-status.json              # Tracking file
  distribute/
    blog-post.md                      # 1500-2000 word SEO article
    twitter-thread.md                 # Hook + insights + CTA thread
    linkedin-post.md                  # Professional post with takeaways
    email-newsletter.md               # Subject lines + distillation
    community-post.md                 # Poll/post for YouTube Community
    schedule.md                       # Day-by-day posting calendar
```

## Quality Criteria

- Blog post is 1500-2000 words of original prose rewritten from narration — NOT a transcript dump
- Blog includes YouTube embeds with `?t=XXs` timestamps at each major section
- Blog has proper SEO: meta description (155 chars), keyword in H1 + first paragraph, Article JSON-LD
- Every tweet is under 280 characters with character count displayed
- Twitter hook tweet works standalone for someone who has never seen the video
- LinkedIn post leads with a professional insight, not a video promotion
- LinkedIn post is worth reading even without watching the video
- Email newsletter is a 200-word distillation, not a summary of the entire video
- Email subject lines are under 50 characters
- Community post is a poll (preferred) designed for same-day publishing
- Cross-posting schedule includes detected shorts if `/repurpose` was run
- All CTAs use the `--video-url` value or `[VIDEO_URL]` placeholder
- No content is duplicated from `/assets` output — `/distribute` references the chosen title, does not regenerate metadata
- `distribute-status.json` accurately reflects what was generated vs skipped
- Each platform's content is natively formatted — adapted to the platform's audience and format, not copy-pasted across platforms
