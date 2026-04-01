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
```

## Examples

```
/script Latest AI agent frameworks this week
/script How the Web Actually Works
/script What is an API and why should you care
/script The AI Stack Explained: Models, APIs, and Agents
/script Tutorial: how to set up a Next.js project
/script Claude Code vs Cursor — which AI coding tool wins?
```

## What happens

1. **Research** (if topic requires it):
   - For **news** topics: Web search is mandatory — gather latest developments, key facts, and sources
   - For **explainer/tutorial** topics: Web search recommended for claims involving statistics, benchmarks, or current tech state
   - Skip research only for purely conceptual topics where no external data is needed
   - Goal: 3-5 key facts/sources to ground narration in real data

2. Your idea is analyzed — type detection (news/explainer/tutorial), audience matching, and content plan lookup
3. A **structured production brief** is generated with sections, scene types, colors, and typography
4. A **scene plan** maps every scene to a reusable template type with visual direction
5. **Full narration** is written for every scene — natural, conversational voiceover text
6. Everything is saved to `src/<VideoName>/script.json`
7. **Script review**: The `script-critic` agent reviews the generated script for quality issues (unattributed claims, weak hooks, pacing, tone)
8. You review the scene plan, narration, and critic feedback before proceeding

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
