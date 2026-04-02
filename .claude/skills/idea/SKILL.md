---
name: idea
description: "Find viral trending AI/tech topics and generate ranked video ideas."
disable-model-invocation: true
---

# /idea — Find What to Make Today

Scans leading signal sources for viral AI/tech topics, identifies what's getting outsized attention on YouTube, cross-references the content plan, and presents 5-10 ranked video ideas so you can pick a topic and run `/script`.

## Usage

```
/idea                    # General AI/tech trend scan
/idea AI agents          # Focused scan on a specific subtopic
/idea coding tools       # Another focused example
```

## What happens

### Phase 1: RESEARCH (3 parallel agents)

Launch **3 agents in parallel** using the Agent tool. All agents use WebSearch and web research tools.

#### Agent 1 — Signal Scanner

Hunt for **leading indicators** — topics that are blowing up RIGHT NOW but haven't been fully covered by YouTube creators yet. Check these sources in order of signal strength:

**GitHub Trending** (strongest leading indicator — viral repos become viral videos):
1. WebSearch: `"GitHub trending repositories today"`, `"GitHub trending AI"`, `"GitHub trending machine learning"`
2. Look for: repos with sudden star spikes, new AI tools/frameworks, open-source releases

**Twitter/X** (where AI discourse starts):
3. WebSearch: `"AI Twitter viral today"`, `"AI announcement Twitter/X"`, `"most discussed AI Twitter this week"`
4. Look for: viral threads, founder announcements, product launches, AI drama/debates

**Hacker News + Reddit** (community amplifiers):
5. WebSearch: `"Hacker News AI front page"`, `"Hacker News trending"`
6. WebSearch: `"Reddit r/MachineLearning hot"`, `"Reddit r/LocalLLaMA trending"`, `"Reddit r/programming AI"`

**Product Hunt + Launches**:
7. WebSearch: `"Product Hunt AI today"`, `"new AI tool launch this week"`

**Research / Papers** (explainer goldmines):
8. WebSearch: `"viral AI paper this week"`, `"ArXiv AI trending"`, `"AI research breakthrough"`

**Tech News** (lagging indicator — by now everyone knows, but confirms importance):
9. WebSearch: `"AI news today"`, `"AI developments this week"`

**If user provided a focus topic** (e.g., `/idea AI agents`), add focused searches across ALL sources: `"AI agents GitHub"`, `"AI agents Twitter"`, `"AI agents news"`, `"AI agents new tools"`, etc.

**Collect**: 10-15 trending topics. For each: topic summary, source URL, how many independent sources mention it (multi-source = stronger signal).

#### Agent 2 — YouTube Demand Scanner

Find what's getting **outsized views on YouTube right now** — this reveals audience demand regardless of which channel posted it.

**High-performing video discovery** (primary goal):
1. WebSearch: `"AI YouTube videos most viewed this week"`, `"trending AI videos YouTube"`
2. WebSearch: `"AI tutorial YouTube popular this month"`, `"AI explained YouTube trending"`
3. WebSearch: `"best AI videos YouTube 2026"`, `"viral AI YouTube"`
4. Look for: videos with view counts way above channel average, topics multiple channels covered simultaneously

**Competitor pulse check** (secondary — see what the space is covering):

Channels to check:
- Fireship, NetworkChuck, Theo (t3.gg), Matt Wolfe
- AI Jason, Cole Medin, Dave Ebbelaar, WorldofAI
- The AI Advantage, All About AI, IndyDevDan, ByteByteGo

5. WebSearch: `"Fireship latest video"`, `"Theo t3gg latest"`, `"Matt Wolfe AI latest"` (batch 3-4 channels per search)
6. WebSearch: `"AI Jason latest"`, `"Cole Medin latest"`, `"The AI Advantage latest video"`
7. WebSearch: `"NetworkChuck latest"`, `"ByteByteGo latest"`, `"WorldofAI latest"`

**What to extract**:
- Topics that multiple competitors covered = confirmed demand (but also confirmed competition)
- Topics with high views that only 1-2 channels covered = gap opportunity
- Topics NO competitor covered yet but are trending elsewhere = best opportunity

**Collect**: List of high-performing videos (title, channel, approximate views, topic) + gap analysis.

#### Agent 3 — Content Gap Analyzer

1. Read `youtube-content-plan.md` from the project root
2. List all topics from the content plan that haven't been produced yet (check `src/` for existing video folders)
3. Identify which planned topics are NOW trending (cross-reference with common AI/tech trends)
4. If the user provided a **focus topic**, flag any content plan items that relate to it

**Collect**: Unproduced topics from the plan, with flags for any that are currently trending.

### Phase 2: SYNTHESIS & RANKING

After all 3 agents complete, synthesize their results:

1. **Merge candidate topics** — Combine signal scanner finds, YouTube demand gaps, and content plan items into a single candidate list
2. **Deduplicate** — Remove near-duplicates, merge related topics into single stronger ideas
3. **Score each candidate** on 4 dimensions (1-10 each, max 40):

| Dimension | What to assess |
|-----------|---------------|
| **Virality Signal** | How many independent sources are talking about this? (GitHub + Twitter + Reddit + HN = strong). Single source = weak signal. |
| **Coverage Gap** | Is there a good explainer video on this yet? High views + few videos = opportunity. Many videos already = saturated. |
| **Audience Fit** | Does this match medevsmaker's audience? (devs + vibe coders, AI/tech, Fireship-style) |
| **Time Sensitivity** | Is this a 24h news window, a 1-2 week trend, or evergreen? Shorter windows score higher for urgency but lower for longevity. |

4. **Rank by composite score** (highest first)
5. **Select top 5-10 ideas** — Include all strong ideas, but don't pad to 10 if only 5-7 are genuinely good
6. **Top 3 get full treatment** (detailed table + analysis). Ideas 4+ get a compact one-line summary row.

### Phase 3: OUTPUT

1. Get today's date in `YYYY-MM-DD` format
2. Create `productions/YYYY-MM-DD/idea.md` (create the date folder if it doesn't exist)
3. Format using the output template below
4. Print a summary to the user with the top 3 ideas and the file path
5. End with: **"Pick a topic and run `/script <topic>`"**

## Channel Identity (Hardcoded)

Do NOT ask the user for channel info. Use this identity for all scoring and angle decisions:

- **Channel**: medevsmaker
- **Focus**: AI news, AI agents, coding tutorials, developer tools, software engineering
- **Style**: Fireship-inspired — fast, visual, conversational, polished
- **Audience**: Developers and vibe coders (people who build with AI tools without deep CS background)
- **Format**: Script-first animated explainers (Remotion)
- **Tone**: Peer-to-peer, confident, slightly irreverent, dry tech humor

## Output Template

The `idea.md` file should follow this format:

```markdown
# Video Ideas — YYYY-MM-DD

## Signal Scan

### Sources Checked
- [List key sources checked with brief findings — GitHub Trending, Twitter/X, HN, Reddit, Product Hunt, ArXiv, tech news]

### Hottest Signals (Last 48h)
- [Bullet list of what's trending, sorted by signal strength (multi-source mentions first)]
- [Include source links for each]

### YouTube Demand (What's Getting Views)
- [High-performing AI videos this week — title, channel, approximate views]
- [Note: topics with outsized views vs channel average]

### Competitor Activity (Last 7 days)
- [What the space is covering — grouped by topic, not by channel]
- [Flag: topics multiple competitors covered vs topics nobody covered yet]

---

## Top 3 Ideas (Detailed)

### 1. [Working Title]

| Attribute | Value |
|-----------|-------|
| **Type** | news / explainer / tutorial |
| **Traffic strategy** | Search-first / Browse-first / Trending |
| **Coverage gap** | Low competition / Some coverage / Saturated |
| **Audience fit** | High / Medium |
| **Urgency** | Make today / This week / Anytime |
| **Score** | N/40 |

**Signal strength**: [Where this was spotted — GitHub trending? Twitter viral? Multi-source?]
**Hook angle**: [One sentence — the curiosity gap]
**Thumbnail concept**: [15-word visual description]
**Why this topic**: [What signal suggests this will perform — view counts, trend velocity, search volume]
**What exists**: [Current YouTube coverage — who covered it, how many views, what's missing]
**Our angle**: [What medevsmaker brings that doesn't exist yet]
**Key sources**: [URLs for /script research phase]

---

### 2. [Working Title]

[Same detailed structure]

---

### 3. [Working Title]

[Same detailed structure]

---

## More Ideas (4-10)

| Rank | Title | Type | Score | Urgency | Signal | Gap |
|------|-------|------|-------|---------|--------|-----|
| 4 | [Title] | [type] | N/40 | [urgency] | [where spotted] | [coverage level] |
| 5 | [Title] | [type] | N/40 | [urgency] | [where spotted] | [coverage level] |
| ... | ... | ... | ... | ... | ... | ... |

---

## Production Priority

**Make today** (trending/time-sensitive — window closing):
- [Ideas where the trend has a short shelf life]

**This week** (strong signal, window still open):
- [Ideas trending but not yet peaking]

**Backlog** (solid demand, no urgency):
- [Evergreen ideas with strong scores]

---

## From Content Plan (Trending Now)

Topics from youtube-content-plan.md that align with current signals:
- [Any planned ideas that are NOW timely, with trend evidence]

(If none are currently trending, note that.)

---

## Next Step

Pick a topic and run:
```
/script <your chosen topic>
```
```

## Quality Criteria

- Every idea has source URLs — no hallucinated claims or unsourced trend assertions
- Signal strength is grounded in real sources (GitHub stars, Twitter engagement, Reddit upvotes, view counts)
- Composite scores are internally consistent — higher-scored ideas are clearly stronger
- Hook angles create genuine curiosity gaps, not generic statements
- Thumbnail concepts are specific enough to visualize (15 words: subject, emotion, text, colors)
- Video types are correctly assigned (news for time-sensitive coverage, explainer for concepts, tutorial for how-to)
- "Make today" urgency is reserved for genuinely time-sensitive topics with a closing window
- Coverage gap assessment is based on actual YouTube search results, not assumptions
- Content plan cross-reference is thorough — don't miss obvious matches
- Ideas are distinct — no near-duplicates or minor variations of the same topic
- "Our angle" explains a specific gap medevsmaker fills, not just "we'll do it better"
- Top 3 ideas are clearly the strongest — if #4 is arguably better than #3, re-rank
