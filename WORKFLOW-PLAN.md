# Workflow Plan — Full Pipeline Rebuild

## End Goal

A daily video production workflow for a YouTube channel (medevsmaker) covering AI news, tutorials, and technical topics. Programmatic video with Remotion + TTS voiceover. No camera, no manual editing.

**Target**: 1 long-form video + 2-3 shorts per day.
**Creative energy goes to**: Topic selection, script review, final approval. Everything else is automated.

---

## Tools

| Tool | Purpose | Cost |
|------|---------|------|
| **Claude Code** | Orchestrator — research, writing, coding, API calls | Subscription |
| **Remotion** | Programmatic video rendering (React) | Free |
| **ElevenLabs** | TTS voiceover (primary) | $5-22/mo |
| **Cartesia** | TTS voiceover (alternative) | Pay-per-use |
| **Image generator** (Flux/DALL-E) | Thumbnail generation | Pay-per-use |
| **Suno AI or royalty-free library** | Background music | Free-$10/mo |
| **NotebookLM** | Deep analysis of competitor YouTube videos (free, runs on Google servers, saves Claude tokens) | Free |

**Skills** (installed in `.agents/skills/`):
- `youtube` — YouTube domain expertise (hooks, retention, SEO, competitor analysis, titles, ideation)
- `research` / `research-deep` — Structured web research
- `video-director` — Narration rules, scene planning, duration calculation
- `voiceover-director` — TTS synthesis + audio integration
- `remotion-best-practices` — Remotion API patterns

**Sub-agents** (in `.claude/agents/`):
- `script-critic` — Read-only script quality reviewer

---

## Pipeline Overview

```
/idea                    → Find trending topic + competitive landscape
                           Output: productions/<date>-<slug>/idea.md
                           YOU pick the topic

/script <topic>          → Research + write script with narration + scene plan
                           Output: productions/<date>-<slug>/research.md, script.json
                           YOU review + iterate

/video <VideoName>       → Generate Remotion code + manifest + transcript
                           Output: src/<VideoName>/ (code, manifest.json, transcript.json)
                           YOU preview in Remotion Studio

/voiceover <VideoName>   → TTS synthesis + audio integration
                           Output: public/vo/<VideoName>/*.mp3, voiceover.ts
                           YOU listen to the audio

/music <VideoName>       → Background music selection/generation + integration
                           Output: public/music/<VideoName>/, updated composition
                           YOU approve the vibe

/assets <VideoName>      → Title, description, tags, thumbnail
                           Output: productions/<date>-<slug>/assets.md, thumbnail image
                           YOU pick title + thumbnail

Manual: Upload to YouTube with generated metadata
```

---

## Directory Structure

Each video gets a production folder that accumulates outputs as you go through phases:

```
productions/
  <date>-<slug>/                    # e.g. 2026-04-01-mcp-servers
    idea.md                          # Phase 1 output: topic ideas, competitive landscape
    research.md                      # Phase 2 output: web research, competitor analysis
    script.json                      # Phase 2 output: narration + scene plan
    assets.md                        # Phase 6 output: titles, description, tags, thumbnail concepts
    thumbnail.png                    # Phase 6 output: generated thumbnail

src/<VideoName>/                    # Phase 3 output: Remotion code (existing pattern)
  index.tsx
  manifest.json
  transcript.json
  styles.ts
  voiceover.ts
  sections/
  scenes/

public/vo/<VideoName>/             # Phase 4 output: TTS audio (existing pattern)
  scene-01.mp3
  scene-02.mp3
  ...

public/music/<VideoName>/          # Phase 5 output: background music
  background.mp3
```

---

## Phases (one session each)

### Phase 1: `/idea` — Find What to Make Today

**Status**: Does not exist. Needs to be built.

**What it should do**:
1. Search the web for trending AI/tech topics (last 24-48 hours)
2. Check what competitors posted recently on YouTube
3. Rank 5-10 topic ideas by: newness, gap opportunity, audience interest
4. Use youtube skill's ideation + competitor knowledge internally
5. Create `productions/<date>-<slug>/idea.md` with:
   - Ranked topic ideas
   - For each: what exists, what's missing, suggested angle
   - Competitive landscape summary

**Skills used internally**: youtube (ideate, competitor), research (web search)

**What to build**:
- New slash command: `commands/idea/command.md`
- The command should create the productions directory + idea.md
- Human checkpoint: you read idea.md, pick a topic, then run `/script`

**Session goal**: Build `/idea` command, test it on a real topic, review output quality.

---

### Phase 2: `/script` — Research + Write the Script

**Status**: Exists but needs improvement. Currently does light research. Should do deep research, competitive analysis, and use youtube skill knowledge for hooks/retention.

**What it currently does**:
1. Light web research
2. Detects video type (news/explainer/tutorial)
3. Plans scenes from 27 templates
4. Writes narration
5. Script-critic reviews
6. Outputs script.json

**What it should do**:
1. Accept a topic from `/idea` output (read the idea.md for context)
2. Deep web research with real facts + sources (research skill)
3. Optionally analyze competitor videos via NotebookLM
4. Find the angle based on competitive gaps (youtube competitor knowledge)
5. Generate 3 hook variants using youtube hook frameworks, pick the strongest
6. Write narration with retention patterns (youtube script + video-director narration rules)
7. Plan visual scenes with 60%+ visual-heavy ratio
8. Script-critic auto-reviews
9. Output to `productions/<date>-<slug>/research.md` + `script.json`
10. Link script.json to `src/<VideoName>/script.json` for next phase

**Skills used internally**: research (web search), youtube (hook, competitor, script), video-director (narration, scenes), script-critic agent

**What to analyze/improve**:
- Is the current narration-writing rules file good enough or over-engineered?
- Are the 27 scene types well-documented? Are the "Core 12" actually the best 12?
- Is the youtube skill's hook/retention knowledge being used at all right now? (Spoiler: no)
- Should NotebookLM integration be built now or later?
- Is the script-critic agent catching real issues or just noise?
- Is the prompt-expansion rule file (354 lines) too bloated?
- Channel identity in audience-profile.md — is it specific enough?

**Session goal**: Revise `/script` to incorporate research + youtube expertise. Test on a real topic. Compare output quality before vs after.

---

### Phase 3: `/video` — Generate Remotion Visuals

**Status**: Exists and works. Reads script.json, computes durations, generates Remotion code.

**What it currently does**:
1. Reads script.json
2. Computes durations from narration word counts (155 WPM formula)
3. Assigns transitions (fade, slide, wipe, clockWipe)
4. Generates Remotion TypeScript code using shared scenes/components
5. Outputs manifest.json + transcript.json
6. Updates Root.tsx

**What to analyze/improve**:
- Are the 27 scene templates producing good-looking videos? Review actual rendered output.
- Is the duration calculation accurate? Do scenes feel rushed or too slow?
- Is the generated code clean or does it need manual fixes every time?
- Are transitions varied enough or repetitive?
- Does the design system (styles, animations) need updates for better visual quality?
- Are there scene types missing that would make videos more engaging?
- Is the long-form architecture (Series + sections) working well?
- Test with Remotion Studio: does the preview look professional?

**Session goal**: Generate a video from a real script, preview in Studio, identify visual quality issues, fix what's broken.

---

### Phase 4: `/voiceover` — TTS Voice Generation

**Status**: Exists and works. Calls ElevenLabs/Cartesia, generates MP3s, integrates into Remotion.

**What it currently does**:
1. Reads transcript.json (pre-populated with narration from /script)
2. Calls TTS provider API for each scene
3. Generates MP3 files in public/vo/<VideoName>/
4. Creates voiceover.ts with VOICEOVER_SCENES array
5. Updates transcript.json with actual audio durations

**What to analyze/improve**:
- Voice quality: which ElevenLabs voice + model sounds best for this channel?
- Speed/pacing: is the default speed right or should it be faster/slower?
- Are there gaps or timing mismatches between audio and visuals?
- Does the buffer frames (5 frames) work or cause issues?
- Should we A/B test voices early and pick one as the channel voice?
- Are narration text tips (commas not em-dashes, contractions, spell out numbers) making a real difference in TTS output?
- Edge TTS as fallback: is it good enough for drafts/previews?

**Session goal**: Generate voiceover for a real video, listen to it, evaluate quality, pick the channel voice.

---

### Phase 5: `/music` — Background Music + Ducking

**Status**: Built (2026-04-01).

**What it does**:
1. Reads script.json section tones to determine music mood
2. Generates instrumental background music via ElevenLabs Music API (or accepts manual MP3 via `--manual`)
3. Integrates into Remotion composition via `BackgroundMusicLayer` with automatic voiceover ducking
4. Outputs MP3 to `public/music/<VideoName>/`, config to `src/<VideoName>/music.ts`

**Decisions made**:
- **Music source**: ElevenLabs Music API (default) — same API key as TTS. Manual fallback via `--manual`.
- **Ducking**: Automatic frame-level volume interpolation using VOICEOVER_SCENES timing data. Ramps 0.5s before/after each voiceover scene.
- **One track per video**: Single background track, loops if shorter than video. Per-section music deferred.
- **Copyright**: ElevenLabs-generated music is royalty-free for subscribers. Manual files are user's responsibility.
- **Sound effects**: Deferred to separate `/sfx` command (different UX, per-scene timing).

**Files created**:
- `src/shared/components/BackgroundMusicLayer.tsx` — Remotion component with ducking
- `scripts/music/types.ts` + `scripts/music/generate-music.ts` — Generation pipeline
- `commands/music/command.md` — Slash command
- `.agents/skills/music-director/SKILL.md` — Skill definition

**Volume defaults**: base=0.20, ducked=0.06, fadeIn=1s, fadeOut=2s, ramp=0.5s

---

### Phase 6: `/assets` — Title, Description, Tags, Thumbnail

**Status**: Built (2026-04-02).

**What it does**:
1. Reads script.json + manifest.json + research.md for context
2. Generates 5 title variants (search/browse/hybrid/contrarian/listicle) scored on 5 dimensions (max 50)
3. Writes SEO-optimized description with auto-generated chapter timestamps from manifest.json
4. Generates 10-15 tags within 500-char limit
5. Creates primary thumbnail brief + 3 A/B variants (each changes ONE variable)
6. Optionally generates AI thumbnails via Replicate MCP (Flux 1.1 Pro) + Remotion `renderStill()` compositing
7. Outputs to `productions/<date>-<slug>/assets.md` + thumbnail PNGs

**Decisions made**:
- **Architecture**: Standalone command, no new skill. Orchestrates youtube sub-skills (seo, metadata, thumbnail) internally.
- **Thumbnail generation**: Replicate MCP (Flux 1.1 Pro) for photorealistic background (~$0.04/image) + Remotion `renderStill()` for text compositing. Guarantees crisp text with brand fonts/colors.
- **Title scoring**: Heuristic 5-dimension scoring (keyword position, length, curiosity gap, thumbnail independence, pattern match). No external API dependency. Suggests YouTube's built-in A/B testing after upload.
- **Chapters**: Auto-generated from manifest.json section durations. Zero manual effort.
- **Tags**: Minimal effort (vestigial in 2026 — Gemini reads content directly).
- **Fallback**: If Replicate MCP unavailable, outputs detailed text brief for manual thumbnail creation.

**Files created**:
- `commands/assets/command.md` — Slash command (6-phase orchestration)
- `src/shared/scenes/Thumbnail.tsx` — Remotion composition for thumbnail compositing
- `.mcp.json` — Replicate MCP server configuration

**Files modified**:
- `src/Root.tsx` — Registered ThumbnailComposition
- `CLAUDE.md` — Updated pipeline documentation (5→6 commands)

---

### Phase 7: End-to-End Test

**Status**: Never been done with the full pipeline.

**What to do**:
1. Pick a real trending AI topic
2. Run the full pipeline: `/idea` → `/script` → `/video` → `/voiceover` → `/music` → `/assets`
3. Render the final video
4. Upload to YouTube with generated metadata
5. Document: total time, pain points, quality issues, what broke

**Evaluate**:
- Total time from idea to upload — is it under 1 hour?
- Script quality — is the narration natural and engaging?
- Visual quality — do the Remotion scenes look professional?
- Audio quality — does the TTS sound good? Does music fit?
- Metadata quality — are titles clickable? Description SEO-friendly?
- Thumbnail quality — would you click on it?
- What's the weakest phase?
- What needs the most manual intervention?

**Session goal**: One complete video, start to finish. Identify bottlenecks. Prioritize fixes.

---

### Phase 8: Short-Form Pipeline

**Status**: Built (2026-04-02).

**What was built**:

1. **Format foundation** (`src/shared/formats.ts`): FORMAT_PRESETS (landscape/portrait/square), SAFE_ZONES, `useLayoutMode()` hook providing responsive tokens (isVertical, contentPadding, fontScale, maxItems, layoutDirection)

2. **Fixed hardcoded dimensions**: ParticleField.tsx uses `useVideoConfig()` instead of 1920/1080. transitions.ts has `createClockWipe()` factory + `shortFade` (8f) preset.

3. **6 responsive scenes**: CodeDisplay, ComparisonSplit, BeforeAfter, ThreeColumnCompare, MetricDashboard, SplitCodeComparison — all use `useLayoutMode()` to switch between row/column layout.

4. **CaptionOverlay vertical mode**: Auto-detects vertical, defaults to bold style with 400ms combineMs, scales fonts 1.3x, positions above 350px safe zone.

5. **Short video type**: Added to video-types.md, context-gathering.md, duration-calculation.md. New `rules/short-form.md` with scene catalog, pacing (170 WPM), structure (Hook → Value Bomb → Loop Setup), safe zones, and flat architecture.

6. **`/script --format short`**: Updated command.md with flag docs, examples, and short-form output differences.

7. **`/assets` short-form mode**: Detects `type: "short"`, switches to simplified metadata (4-6 word titles, 125-char description, hashtags, no chapters/thumbnail, music revenue warning).

8. **`/repurpose <VideoName>`**: New command extracting 3-5 short candidates from long-form script.json with rewritten hooks, quality ratings, and posting schedule.

9. **2 new scenes**: FullScreenText (large bold text for hooks/punchlines), SwipeReveal (swipe-up content transition).

10. **SafeZoneOverlay**: Dev tool showing platform UI danger zones in Remotion Studio.

**Decisions made**:
- Both standalone (`--format short`) and repurposed (`/repurpose`) shorts supported
- Scenes are responsive (not separate vertical variants) — `useLayoutMode()` hook
- CaptionOverlay auto-on for shorts (bold style), auto-off for long-form
- 1080x1920 at 30fps, sweet spots at 13s or 60s
- No music by default (50% revenue share per track)
- Flat TransitionSeries, no sections, `shortFade` (8f) transitions

**Session goal**: Render one short-form video. Decide on the short-form workflow.

---

### Phase 9: Distribution + Content Cascade

**Status**: Built. `/distribute` command generates cross-platform content from completed videos.

**What was built**:
- `/distribute <VideoName>` command at `commands/distribute/command.md`
- 8-phase pipeline: context gathering → blog → twitter → linkedin → email → community → schedule → assembly
- Outputs 6 platform-native files to `productions/<date>-<slug>/distribute/`
- `distribute-status.json` tracks generated/posted status per platform
- Blog: 1500-2000 word SEO article (not transcript paste), YouTube embeds with timestamps, Article JSON-LD
- Twitter: hook + 4-6 insight tweets + CTA, each <280 chars
- LinkedIn: professional 200-300 word post with 3 takeaways
- Email: A/B subject lines + 200-word distillation
- Community: poll-first (2-3x engagement), same-day publish
- Cross-posting schedule with shorts integration (if `/repurpose` was run)

**Decisions made**:
- Content generation only, no API posting (V1) — keeps it simple, user reviews everything
- Self-contained command (no separate skill) — same pattern as `/assets`
- Leverages youtube repurpose sub-skill knowledge internally
- Future V2: API posting via flags (--post-twitter, etc.), Buffer/Zernio scheduling

**Session goal**: ~~Generate distribution content for a real video. Evaluate quality. Decide what to automate vs keep manual.~~ Done.

---

## Session Checklist

| # | Phase | Status | Session Done? |
|---|-------|--------|---------------|
| 1 | `/idea` — Find topics | Build from scratch | [ ] |
| 2 | `/script` — Research + write script | Revise existing | [ ] |
| 3 | `/video` — Generate Remotion visuals | Analyze + improve existing | [ ] |
| 4 | `/voiceover` — TTS voice generation | Analyze + improve existing | [ ] |
| 5 | `/music` — Background music | Build from scratch | [ ] |
| 6 | `/assets` — Title, description, thumbnail | Built | [x] |
| 7 | End-to-end test | Full pipeline test | [ ] |
| 8 | Short-form pipeline | Design + build | [x] |
| 9 | Distribution + content cascade | Built | [x] |

---

## Reference

- **Session notes (2026-03-31)**: `SESSION-NOTES-2026-03-31.md` — competitive research, architecture decisions, over-engineering analysis
- **Session transcript**: `session.txt` — full conversation from March 31
- **Competitor transcripts**: 3 YouTube creator workflow breakdowns analyzed in April 1 session
- **Current CLAUDE.md**: Project conventions, Remotion patterns, pipeline documentation
- **Memory**: `~/.claude/projects/.../memory/MEMORY.md` — persistent project knowledge
- **Content plan**: `youtube-content-plan.md` — 65 video ideas across 2 series

---

## Key Principles (from research)

1. **Stay in the driver's seat** — Claude is a collaborator, not an autopilot. Review at every checkpoint. (Chase)
2. **Script quality is 80% of video quality** — invest most time in phases 1-2. (All three creators)
3. **Validate demand before creating** — make sure someone will search for this topic. (Sylvio)
4. **90 jabs, no haymakers** — consistent daily output beats trying to go viral. (Chase)
5. **Faceless channels grow through search** — topic selection matters even more without a face. (Original analysis)
6. **One video → multiple platforms** — every long-form video should cascade into shorts + social + blog. (Chase)
7. **Each phase outputs to a file** — organized, reviewable, resumable. (This session)
