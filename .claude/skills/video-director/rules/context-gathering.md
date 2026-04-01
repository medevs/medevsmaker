---
name: context-gathering
description: Rules for parsing user input, detecting video type, and gathering context before research
metadata:
  tags: context, parsing, input, planning
---

# Context Gathering

Phase 1 of `/script`. Parses the user's idea, detects video type, applies defaults, and reads any prior `/idea` output.

## Step 1: Parse the Input

Extract from the user's text:
- **Subject**: What the video is about
- **Type**: Detect from keywords (see type detection table)
- **Platform**: Any platform mentions (YouTube, Instagram, TikTok, etc.)
- **Style hints**: Any adjectives like "minimal", "bold", "dark", "playful"
- **Duration hints**: Any time mentions like "30 second", "short", "long"
- **Content source**: Check if the topic matches a content plan entry
- **Idea reference**: Check for `--from-idea` flag

### Type Detection Table

| Keywords | Detected Type |
|----------|--------------|
| news, daily, roundup, coverage, weekly, digest, latest, trending, today, this week | `news` |
| tutorial, how to, guide, walkthrough, step by step, learn, build, setup, install | `tutorial` |
| everything else — conceptual topics, "how X works", "understanding Y", explain, deep dive, educational, fundamentals | `explainer` |

**Default**: If no type is detected, default to `explainer` for conceptual/learning topics, `news` for current events and announcements.

> **Historical alias**: `educational` maps to `explainer`. The two are treated identically.

### Content Plan Lookup

If a `youtube-content-plan.md` file exists in the project root, check if the user's topic matches any entry. If it does:
- Extract the content plan's bullet points and structure
- Use them as the basis for section planning
- Note the content plan match in the brief under "Content Source"

## Step 2: Apply Defaults

After detecting the type, apply defaults from `video-types.md`.

For `explainer` and `tutorial` types (section-based), also apply:
- Audience profile from `audience-profile.md`
- Scene types from `educational-scenes.md`
- Architecture from `long-form-architecture.md`

For `news` type, also apply audience profile but use flat or section-based structure depending on length.

### Per-Section Color Assignment (Explainer / Tutorial)

Assign a color from `SECTION_THEMES` to each section:
```
Section 1 → BRAND.indigo (#6366f1)
Section 2 → BRAND.cyan (#06b6d4)
Section 3 → BRAND.amber (#f59e0b)
Section 4 → BRAND.green (#10b981)
Section 5 → BRAND.violet (#8b5cf6)
Section 6 → BRAND.red (#ef4444)
```

Note the assigned color in each section's brief. All scenes within a section receive the section's color as `sectionColor` prop.

## Step 3: Read idea.md (if `--from-idea` used)

When the user provides `--from-idea <YYYY-MM-DD>` or `--from-idea latest`:

1. **Locate folder**: Find `productions/<date>/idea.md` (or most recent if `latest`)
2. **Extract context**:
   - Ranked ideas and the user's selected topic
   - Competitive gaps identified by the competitor scanner
   - Source URLs already gathered during ideation
   - Audience angle and content strategy notes
3. **Carry forward**: Pass extracted context to Phase 2 (research) and Phase 3 (hooks) so they build on prior work instead of starting from scratch
4. **Record**: Set `meta.ideaSource` in script.json to the idea.md path

If no `--from-idea` flag, skip this step.

## Quality Checklist (Brief-Specific)

Before proceeding to Phase 2:
- [ ] Video type correctly detected
- [ ] Duration and resolution match type defaults
- [ ] Section breakdown has 3-7 sections (explainer/tutorial) or 3-6 items (news)
- [ ] Per-section colors assigned (explainer/tutorial)
- [ ] Content plan match noted if applicable
