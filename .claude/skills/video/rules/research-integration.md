---
name: research-integration
description: How /script uses the research skill to gather sourced facts for narration
metadata:
  tags: research, sources, facts, script
---

# Research Integration

Defines how `/script` Phase 2 uses the research skill to gather sourced facts. This is a thin integration layer — the research skill itself handles execution.

## When to Research

| Video Type | Research Required? | Reason |
|------------|-------------------|--------|
| `news` | **Always** | News requires current, sourced facts |
| `explainer` | **When claims involve stats, benchmarks, or current tech state** | Conceptual topics with no data claims can skip |
| `tutorial` | **When referencing versions, performance, or comparisons** | Pure how-to with no claims can skip |

If the user ran `/idea` first and `--from-idea` points to an existing `idea.md`, reuse its sources — don't re-research what's already been gathered.

## What to Collect

Gather **5-10 sourced facts** relevant to the topic. Each fact must have:

```
- Claim: [specific factual statement]
- Source: [organization or publication name]
- URL: [link to source]
- Date: [publication date or "accessed YYYY-MM-DD"]
```

Focus on:
- Key statistics that support the narrative
- Recent announcements or releases (for news)
- Benchmark data or performance comparisons
- Official documentation quotes (for technical topics)

## Source Tagging Format

In narration, attribute facts using natural patterns:

**Good attribution**:
- "According to OpenAI's latest blog post, GPT-5 can..."
- "Google just released a paper showing..."
- "The Node.js team announced version twenty two with..."
- "Cloudflare reported handling over fifty seven million requests per second..."

**Bad attribution** (flag in script-critic):
- "Studies show..." (which studies?)
- "Research suggests..." (whose research?)
- "Most developers prefer..." (source?)
- "It's widely known that..." (by whom?)

## When to Attribute vs. Not

- **Always attribute**: Specific numbers, percentages, benchmarks, quotes, release dates
- **Never attribute**: General CS concepts (how TCP works), widely known facts (JavaScript runs in browsers), opinion/analysis by the narrator

## script.json Integration

Each scene with sourced claims includes a `sources` array:

```json
{
  "sceneType": "StatHighlight",
  "narration": "Cloudflare reported handling over fifty seven million requests per second at peak.",
  "sources": [
    {
      "claim": "57M requests/sec at peak",
      "source": "Cloudflare Blog",
      "url": "https://blog.cloudflare.com/...",
      "date": "2026-03-15"
    }
  ]
}
```

Scenes with no sourced claims omit the `sources` field entirely.

## Research Output

Save research findings to `productions/<date>-<slug>/research.md` alongside any existing `idea.md`:

```markdown
# Research: <Topic>

## Key Facts
1. [Claim] — [Source], [Date]
2. [Claim] — [Source], [Date]
...

## Sources
- [Source Name](URL) — accessed [date]
```

## Idea.md Integration

When `--from-idea` is used:
1. Read the `idea.md` from the specified productions folder
2. Extract any sources, competitive gaps, and angles already identified
3. Use these as starting context — research fills gaps, not duplicates
4. Note `ideaSource` path in script.json `meta`
