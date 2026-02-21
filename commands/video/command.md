---
name: video
description: "Generate a complete Remotion video from a simple idea. Expands the concept into a production brief, then generates all Remotion code."
user-invocable: true
skill: video-director
---

# /video — AI Video Director

Takes a simple idea and produces a complete Remotion video project.

## Usage

```
/video <your idea here>
```

## Examples

```
/video How the Web Actually Works
/video What is an API and why should you care
/video Promo for AI note-taking app
/video Tutorial: how to set up a Next.js project
/video Instagram reel announcing our new dashboard feature
/video Explainer for how our API works
/video Social clip: 3 reasons to use TypeScript
/video Product demo of our analytics dashboard
/video The AI Stack Explained: Models, APIs, and Agents
/video Understanding databases for non-technical founders
```

## What happens

1. Your idea is analyzed — type detection, audience matching, and content plan lookup
2. A **structured production brief** is generated with scenes, timing, sections, colors, and typography
3. For educational videos: a **scene manifest** maps each scene to a reusable template type
4. **Complete Remotion code** is generated — compositions, sections, scenes, components, and styles
5. You get **rendering instructions** to preview and export the video

## Supported video types

| Type | Auto-detected when you say... | Default duration |
|------|-------------------------------|-----------------|
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

## Educational video features

Educational videos (3-10 min) use a special section-based architecture:
- **15 reusable scene types**: diagrams, code blocks, comparisons, stats, bullet reveals, and more
- **Section structure**: Each section groups related scenes with chapter markers
- **Progress bar**: Visual indicator showing video progress
- **Audience-aware tone**: Written for vibe coders and non-technical AI builders
