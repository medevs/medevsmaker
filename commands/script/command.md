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
/script How the Web Actually Works
/script What is an API and why should you care
/script The AI Stack Explained: Models, APIs, and Agents
/script Understanding databases for non-technical founders
/script Promo for AI note-taking app
/script Tutorial: how to set up a Next.js project
/script Instagram reel announcing our new dashboard feature
```

## What happens

1. Your idea is analyzed — type detection, audience matching, and content plan lookup
2. A **structured production brief** is generated with sections, scene types, colors, and typography
3. A **scene plan** maps every scene to a reusable template type with visual direction
4. **Full narration** is written for every scene — natural, conversational voiceover text
5. Everything is saved to `src/<VideoName>/script.json`
6. You review the scene plan and narration before proceeding

## After reviewing

Run `/video <VideoName>` to generate Remotion code with durations computed from your narration.

## Supported video types

| Type | Auto-detected when you say... | Typical length |
|------|-------------------------------|---------------|
| Educational | conceptual topics, "how X works", "understanding Y" | 3-10 min |
| Promo | "promo", "ad", "marketing", "launch" | 15-30s |
| Tutorial | "tutorial", "how to", "guide", "walkthrough" | 60-120s |
| Explainer | "explainer", "explain", "how it works" | 30-60s |
| Social Clip | "reel", "tiktok", "shorts", "clip" | 15-30s |
| Announcement | "announcing", "announcement", "new feature" | 15-30s |
| Demo | "demo", "showcase", "preview" | 30-60s |

Educational is auto-detected for conceptual/learning topics even without explicit keywords.

## Platform detection

Mention a platform to auto-set resolution:
- **YouTube** → 1920x1080
- **Instagram Reel / TikTok / Shorts** → 1080x1920
- **Instagram Post** → 1080x1080
- **Twitter/X** → 1280x720
