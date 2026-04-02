---
name: script
description: "Generate a production script with full narration from a simple idea."
disable-model-invocation: true
---

# /script — Generate Production Script

Takes a simple idea and produces a complete production script with full narration for every scene.

## Usage

```
/script <your idea here>
/script --format short <your idea here>
/script --from-idea <YYYY-MM-DD> <topic>
/script --from-idea latest <topic>
```

## Flags

| Flag | Description |
|------|-------------|
| `--format short` | Generate a short-form script (9:16 vertical, 13-60s, for YouTube Shorts / TikTok / Reels) |
| `--from-idea <date>` | Read `productions/<date>/idea.md` for competitive context, sources, angles |
| `--from-idea latest` | Use most recent `productions/*/idea.md` |

## Examples

### Long-form (default)
```
/script Latest AI agent frameworks this week
/script How the Web Actually Works
/script What is an API and why should you care
/script Tutorial: how to set up a Next.js project
/script --from-idea 2026-04-01 How MCP Servers Actually Work
```

### Short-form
```
/script --format short What is MCP in 60 seconds
/script --format short 3 AI tools you need to know
/script --format short The biggest AI news this week in 15 seconds
/script A 60-second TikTok about why APIs matter
/script Quick YouTube Short: Claude Code vs Cursor
```

## What happens

1. **Context Gathering** — type detection (short/news/explainer/tutorial), audience matching, content plan lookup, idea.md reading (if `--from-idea`)
2. **Deep Research** — web research for sourced facts (mandatory for news, recommended for explainer/tutorial with stats)
3. **Angle & Hook** — 3 hook variants generated via youtube hook frameworks, strongest selected for search-first
4. **Scene Planning** — scenes mapped to reusable templates with visual direction
5. **Narration Writing** — full voiceover narration with source attribution and retention patterns
6. **Quality Review** — `script-critic` agent reviews for claims, pacing, tone, sources, retention
7. You review hook variants, scene plan, narration, and critic feedback before proceeding

## Output

```
productions/<date>-<slug>/
  research.md         ← sourced facts from Phase 2
  script.json         ← canonical copy

src/<VideoName>/
  script.json         ← copy for /video compatibility
```

If `--from-idea` points to an existing `productions/<date>/` folder, output goes there. Otherwise a new folder is created.

## After reviewing

Run `/video <VideoName>` to generate Remotion code with durations computed from your narration.

## Supported video types

| Type | Auto-detected when you say... | Typical length | Format |
|------|-------------------------------|---------------|--------|
| Short | `--format short`, TikTok, Shorts, Reel, "60 second" | 13-60s | 1080x1920 |
| News | daily, roundup, coverage, latest, trending, this week | 1-4 min | 1920x1080 |
| Explainer | conceptual topics, "how X works", "understanding Y", deep dive | 3-8 min | 1920x1080 |
| Tutorial | "tutorial", "how to", "guide", "walkthrough" | 3-10 min | 1920x1080 |

Explainer is the default for conceptual/learning topics even without explicit keywords.

### Short-form differences
- 9:16 portrait (1080x1920), 3-8 scenes, single section
- Hook (0-3s) → Value bomb → Loop setup (final 1-2s)
- Faster pacing: 170 WPM, max 8s/scene, visual change every 3s
- CaptionOverlay always on, no ProgressBar/SectionTracker
- No music by default (50% revenue share cost per track)

## Platform detection

Mention a platform to auto-set resolution and type:
- **YouTube** → 1920x1080 (long-form)
- **YouTube Shorts / TikTok / Instagram Reel** → 1080x1920 (auto-detects `short` type)
- **Instagram Post** → 1080x1080
- **Twitter/X** → 1280x720
