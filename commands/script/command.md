---
name: script
description: "Generate a production script with full narration from a simple idea."
user-invocable: true
skill: video-director
---

# /script — Generate Production Script

Takes a simple idea and produces a complete production script with full narration for every scene.

## Usage

```
/script <your idea here>
/script --from-idea <YYYY-MM-DD> <topic>
/script --from-idea latest <topic>
```

## Flags

| Flag | Description |
|------|-------------|
| `--from-idea <date>` | Read `productions/<date>/idea.md` for competitive context, sources, angles |
| `--from-idea latest` | Use most recent `productions/*/idea.md` |

## Examples

```
/script Latest AI agent frameworks this week
/script How the Web Actually Works
/script What is an API and why should you care
/script The AI Stack Explained: Models, APIs, and Agents
/script Tutorial: how to set up a Next.js project
/script Claude Code vs Cursor — which AI coding tool wins?
/script --from-idea 2026-04-01 How MCP Servers Actually Work
/script --from-idea latest Claude Code vs Cursor
```

## What happens

1. **Context Gathering** — type detection (news/explainer/tutorial), audience matching, content plan lookup, idea.md reading (if `--from-idea`)
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

| Type | Auto-detected when you say... | Typical length |
|------|-------------------------------|---------------|
| News | daily, roundup, coverage, latest, trending, this week | 1-4 min |
| Explainer | conceptual topics, "how X works", "understanding Y", deep dive | 3-8 min |
| Tutorial | "tutorial", "how to", "guide", "walkthrough" | 3-10 min |

Explainer is the default for conceptual/learning topics even without explicit keywords.

## Platform detection

Mention a platform to auto-set resolution:
- **YouTube** → 1920x1080
- **Instagram Reel / TikTok / Shorts** → 1080x1920
- **Instagram Post** → 1080x1080
- **Twitter/X** → 1280x720
