---
name: hook-selection
description: How /script uses the youtube skill to generate and select opening hooks
metadata:
  tags: hooks, youtube, retention, opening
---

# Hook Selection

Defines how `/script` Phase 3 uses the youtube skill to craft the video's opening hook. The youtube skill provides hook frameworks — this file defines how to apply them.

## Generate 3 Hook Variants

For every script, generate 3 hook variants using these archetypes:

1. **Shock / Contradiction** — Challenge an assumption the viewer holds
   - "Your code is running on someone else's computer, and you have no idea whose."
   - "The most popular database in the world has no schema."

2. **Curiosity Gap** — Create an open loop that demands closure
   - "Every click triggers an invisible relay race you'll never see."
   - "There's a reason your AI app is slow, and it's not what you think."

3. **One of** (rotate per video):
   - **Problem-Agitation** — Name a pain the viewer feels, then twist the knife
     - "You've been deploying the wrong way. Here's what happens next."
   - **Story Open** — Drop into a micro-story mid-action
     - "Last week, a single API call cost a developer twelve thousand dollars."

## Hook → Scene Mapping

| Hook Element | Remotion Scene | Notes |
|-------------|---------------|-------|
| **Grab** (first sentence) | `HookQuestion` or `ColdOpen` | The hook text itself |
| **Promise** (what they'll learn) | `TitleIntro` | Objectives frame the promise |

The hook's grab goes into Scene 1 (`HookQuestion.question` or `ColdOpen.statement`). The promise flows into Scene 2 (`TitleIntro.objectives`).

## Selection Criteria

For medevsmaker's channel (nano channel, search-first strategy):

**Prefer**: Curiosity Gap or Shock/Contradiction — these perform best in search because they create immediate tension without requiring channel trust.

**Use Problem-Agitation** when: The topic is a common pain point (debugging, deployment, performance).

**Use Story Open** when: You have a specific, concrete incident to reference (sourced from research).

## Competitive Angle from idea.md

When `--from-idea` provides competitive gap analysis:
- Identify what competitors' hooks do (usually generic curiosity gaps)
- Differentiate by being more specific or more contrarian
- If competitor uses "What is X?", counter with "X is broken, here's why" or "You're using X wrong"

## Output

Present all 3 variants to the scene plan, marking the selected one:

```
Hook Variants:
1. [SELECTED] Curiosity Gap: "Every click triggers an invisible relay race..."
2. Shock: "Your browser makes 300 requests before you see a single pixel..."
3. Problem-Agitation: "Your website is slow, and it's not your hosting provider's fault..."

Selected: #1 — strongest curiosity gap for search-first discovery
```

The selected hook's text goes into `HookQuestion.props.question` (or `ColdOpen.props.statement`).
