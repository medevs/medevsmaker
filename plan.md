MEDEVSMAKER — COMPREHENSIVE PIPELINE AUDIT REPORT

  WHAT THIS PROJECT IS

  medevsmaker is an AI-powered video production pipeline that turns ideas into fully rendered YouTube videos using Remotion (React-based video
  framework). It's a 9-command pipeline controlled entirely through Claude Code slash commands:

  /idea → /script → /video → /voiceover → /music → /assets → /distribute
                                                      ↓
                                            /repurpose → (repeat)

  Use Cases

  - Tech explainer videos (primary) — "What is GraphRAG?", "How DNS Works"
  - News/trending topic videos — fast-turnaround coverage of tech developments
  - Tutorial/walkthrough videos — step-by-step coding guides
  - Short-form content — TikTok/Reels/Shorts (auto-detected or --format short)
  - Content repurposing — extract 3-5 shorts from long-form videos
  - Full publishing workflow — titles, descriptions, tags, thumbnails, cross-platform distribution

  How It Works

  1. /idea scans trends (GitHub, HN, Twitter, ArXiv) and scores topic ideas
  2. /script runs a 6-phase pipeline: context → research → hooks → scenes → narration → critic review → outputs script.json
  3. /video generates Remotion React code + manifest + transcript from the script
  4. /voiceover synthesizes TTS audio (ElevenLabs/Cartesia/Edge TTS) and integrates it
  5. /music adds breathing background music from a royalty-free library
  6. /assets generates titles, descriptions, tags, chapters, thumbnail briefs
  7. /distribute creates platform-native content for blog, Twitter, LinkedIn, email, community
  8. /repurpose extracts short-form clips from long-form videos
  9. npx remotion render produces the final MP4

  ---
  OVERALL SCORES BY SYSTEM

  ┌───────────────────────────────────────────────┬────────┬────────────────────────────────────────┐
  │                    System                     │ Score  │                Verdict                 │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ Project Structure & Config                    │ 9.5/10 │ Exemplary organization, zero cruft     │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ Design System (styles/animations/transitions) │ 8.5/10 │ Strong foundation, coherent tokens     │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ Shared Components (28)                        │ 7.8/10 │ Polished visuals, some DRY violations  │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ Shared Scenes (35)                            │ 7.8/10 │ Good variety, responsive gaps          │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ /idea Command                                 │ 8.7/10 │ Excellent multi-source signal scanning │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ /script Pipeline (6 phases)                   │ 7.5/10 │ Strong architecture, validation gaps   │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ /video Code Generation                        │ 7.0/10 │ Descriptive not prescriptive           │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ /voiceover Pipeline                           │ 7.5/10 │ Robust TTS with 3 providers            │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ /music Pipeline                               │ 7.5/10 │ Excellent BreathingMusicLayer (9/10)   │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ /assets Command                               │ 8.3/10 │ Well-crafted title/SEO generation      │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ /distribute Command                           │ 8.7/10 │ Platform-native content, not paste     │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ /repurpose Command                            │ 6.3/10 │ Weakest link — vague hook rewriting    │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ Script Critic                                 │ 7.5/10 │ Read-only, can't fix issues            │
  ├───────────────────────────────────────────────┼────────┼────────────────────────────────────────┤
  │ Error Handling (cross-cutting)                │ 6.0/10 │ Silent failures, no schema validation  │
  └───────────────────────────────────────────────┴────────┴────────────────────────────────────────┘

  OVERALL PIPELINE: 7.7/10 — Solid, Production-Ready with Known Gaps

  ---
  WHAT'S EXCELLENT (Preserve These)

  1. Script-first architecture — narration drives durations, which drives code, which drives audio. This is the correct order and prevents sync
  issues downstream.
  2. BreathingMusicLayer (9/10) — Sophisticated multi-zone volume control (hook 0.30 → narration 0.05 → gaps 0.15 → transitions 0.25 → outro
  0.30). Matches how MKBHD/Fireship use music. Best component in the codebase.
  3. Design system coherence — styles.ts with BRAND palette, spring configs, section theming, glass morphism tokens. Everything flows from a
  single source of truth.
  4. /idea signal scanning — 3 parallel agents hitting 9 sources (GitHub Trending, Twitter, HN, Reddit, Product Hunt, ArXiv, News), scoring on 4
  dimensions. Real production output (GraphRAG idea.md) shows excellent quality.
  5. /distribute platform-native content — Blog posts are 1500-2000 words of rewritten prose (not transcript dumps). Tweets under 280 chars.
  LinkedIn leads with insight. This is correct.
  6. Scene catalog — 35 scenes covering hooks, content, data viz, diagrams, code, comparisons, summaries, and end screens. Covers 80%+ of
  educational video needs.
  7. Project structure — Zero dead code, strategic .gitignore (generated artifacts excluded), clean separation between shared library and
  per-video output.

  ---
  CRITICAL ISSUES (Fix Before Next Production Video)

  1. Hook Duration Conflict

  - Problem: Hook rules say "1-3 second hook window" but HookQuestion scene minimum is 4-5s. Narration ends at 1-3s, leaving 1-2s of awkward
  visual padding.
  - Fix: Document that hook narration should be 12-20 words (filling the 4-5s), or allow shorter scene minimums for hooks.

  2. Pronunciation Dictionary Regex Injection

  - File: scripts/tts/generate-audio.ts:25
  - Problem: Dictionary keys are used raw in new RegExp(\\b${word}\b`). Keys like C++` would break silently.
  - Fix: Escape regex metacharacters before building the pattern.

  3. No Schema Validation on Pipeline Data

  - Problem: script.json, manifest.json, transcript.json have no schema validation. Malformed data cascades silently through the pipeline.
  - Fix: Add Zod validation at pipeline entry points (you already have Zod 4.3.6 installed).

  4. Empty Narration Silent Failure

  - File: scripts/tts/generate-audio.ts:113-117
  - Problem: Scenes with empty narration are silently skipped. If ALL scenes are empty, generates a voiceover.ts with an empty array — user won't
  know.
  - Fix: Fail explicitly if >50% of scenes have no narration.

  5. Music Library Has No Actual MP3 Files

  - Problem: scripts/music/library.ts defines 9 tracks with Pixabay download links, but public/music/library/ likely has no files. --library mode
  will fail with "No tracks found."
  - Fix: Either pre-download all 9 tracks or provide an automated download script.

  ---
  HIGH-PRIORITY IMPROVEMENTS (Quality Uplift)

  Visual Quality

  ┌─────────────────────────────────────────────────────────────┬──────────────────────────────────────┬─────────────────────────────────────┐
  │                            Issue                            │                Impact                │                 Fix                 │
  ├─────────────────────────────────────────────────────────────┼──────────────────────────────────────┼─────────────────────────────────────┤
  │ Typewriter effect copied 3x (ColdOpen, ConceptExplain,      │ Maintenance burden, inconsistent     │ Extract to                          │
  │ HookQuestion)                                               │ behavior                             │ src/shared/utils/typewriter.ts      │
  ├─────────────────────────────────────────────────────────────┼──────────────────────────────────────┼─────────────────────────────────────┤
  │ 6 components hardcode 1920x1080 coords                      │                                      │                                     │
  │ (ArchitectureDiagram, AnimatedDiagram, DiagramFlow,         │ Breaks on portrait/square formats    │ Use useVideoConfig() dimensions     │
  │ DataChart, ProcessAnimation)                                │                                      │                                     │
  ├─────────────────────────────────────────────────────────────┼──────────────────────────────────────┼─────────────────────────────────────┤
  │                                                             │ Conflicts with Remotion's            │ Remove CSS transition, use          │
  │ ProgressBar uses CSS transition (transition: "width 0.3s")  │ frame-based model, causes            │ interpolate() only                  │
  │                                                             │ double-animation                     │                                     │
  ├─────────────────────────────────────────────────────────────┼──────────────────────────────────────┼─────────────────────────────────────┤
  │ clockWipe hardcoded to 1920x1080 in transitions.ts          │ Breaks on portrait                   │ Accept dimensions from composition  │
  │                                                             │                                      │ config                              │
  ├─────────────────────────────────────────────────────────────┼──────────────────────────────────────┼─────────────────────────────────────┤
  │ No exit animations                                          │ All animations are entrances only —  │ Add fadeOut, slideOut variants      │
  │                                                             │ scenes "pop" out                     │                                     │
  ├─────────────────────────────────────────────────────────────┼──────────────────────────────────────┼─────────────────────────────────────┤
  │ AnimatedDiagram responsive broken (6.25/10)                 │ Absolute pixel coords, no scaling    │ Rewrite with percentage-based       │
  │                                                             │                                      │ layout                              │
  └─────────────────────────────────────────────────────────────┴──────────────────────────────────────┴─────────────────────────────────────┘

  Pipeline Quality

  ┌────────────────────────────────────────────┬────────────────────────────────────────────────┬────────────────────────────────────────────┐
  │                   Issue                    │                     Impact                     │                    Fix                     │
  ├────────────────────────────────────────────┼────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Script critic is optional                  │ Users can skip quality review                  │ Make mandatory with explicit user approval │
  ├────────────────────────────────────────────┼────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Visual ratio (60%+) enforced in Phase 6,   │ Bad scene plans discovered after narration is  │ Check ratio immediately during scene       │
  │ not Phase 4                                │ written                                        │ planning                                   │
  ├────────────────────────────────────────────┼────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Research phase has no conflict resolution  │ /idea sources can contradict /research         │ Add source validation + conflict flagging  │
  │                                            │ findings                                       │                                            │
  ├────────────────────────────────────────────┼────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ WPM formula not validated against actual   │ 155 WPM assumes generic voice; ElevenLabs      │ Add per-provider WPM calibration           │
  │ TTS voice                                  │ Turbo is faster                                │                                            │
  ├────────────────────────────────────────────┼────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ /repurpose hook rewriting is vague         │ "Apply shorts playbook" without concrete       │ Add hook rewrite patterns with             │
  │ (6.3/10)                                   │ examples                                       │ before/after examples                      │
  ├────────────────────────────────────────────┼────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ /script is a thin wrapper around /video    │ Users don't know they're invoking /video       │ Merge or add full phase descriptions       │
  │ (6.0/10)                                   │                                                │                                            │
  ├────────────────────────────────────────────┼────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ No pipeline validation command             │ No way to verify all outputs are present and   │ Add /validate that checks file existence + │
  │                                            │ consistent                                     │  schema                                    │
  ├────────────────────────────────────────────┼────────────────────────────────────────────────┼────────────────────────────────────────────┤
  │ Retry logic uses hardcoded 1ms delay       │ Rate-limited APIs fail again                   │ Use exponential backoff                    │
  └────────────────────────────────────────────┴────────────────────────────────────────────────┴────────────────────────────────────────────┘

  Audio Quality

  ┌───────────────────────────────────────────────┬──────────────────────────────────────────────────┬───────────────────────────────────────┐
  │                     Issue                     │                      Impact                      │                  Fix                  │
  ├───────────────────────────────────────────────┼──────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ Audio overflow clamping cuts narration        │ Words cut off at end without reporting WHICH     │ Add detailed clamping report          │
  │ silently                                      │ words                                            │                                       │
  ├───────────────────────────────────────────────┼──────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ Pronunciation dictionary not sorted by length │ "API" could match before "APIS"                  │ Sort by word length descending        │
  ├───────────────────────────────────────────────┼──────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ No voice ID validation before synthesis       │ Invalid IDs fail during expensive API call       │ Pre-validate against cached voice     │
  │                                               │                                                  │ list                                  │
  ├───────────────────────────────────────────────┼──────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ Cartesia WebSocket timeout 30s                │ Network latency spikes cause failures            │ Increase to 45s + add retry           │
  └───────────────────────────────────────────────┴──────────────────────────────────────────────────┴───────────────────────────────────────┘

  ---
  MEDIUM-PRIORITY IMPROVEMENTS

  Code & Architecture

  - Add .env.example with all supported providers documented
  - Add Prettier configuration for consistent formatting
  - Deprecate ColdOpen (duplicate of FullScreenText), merge Outro into EndScreen
  - Merge duplicate gradient-highlight logic between KeyRuleCard and KeyTakeaway
  - BreathingMusicLayer is 227 lines — split into useVoiceoverDucking() + useTransitionSwell() hooks
  - glowPulse recalculates hex alpha every frame — memoize with frame bucketing
  - Add phase offset parameter to pulse/float/shimmer animations to prevent sync

  Pipeline & Skills

  - Document /sfx as explicitly "future/not implemented" or build it
  - Fix distribute-status.json — Phase G doesn't populate shorts.schedule array
  - Add version field to script.json for change tracking
  - Specify rotating 3rd hook archetype selection criteria (currently "one of these, somehow")
  - Add scene sequencing rules (valid transitions between scene types)

  ---
  COMPONENT SCORECARDS

  Top 5 Components (Ship Confidently)

  ┌────────────────────────┬────────┬──────────────────────────────────────────────────┐
  │       Component        │ Score  │                       Why                        │
  ├────────────────────────┼────────┼──────────────────────────────────────────────────┤
  │ BreathingMusicLayer    │ 9/10   │ Sophisticated breathing volume, production-grade │
  ├────────────────────────┼────────┼──────────────────────────────────────────────────┤
  │ BackgroundMusicLayer   │ 9/10   │ Clean ducking model, smooth transitions          │
  ├────────────────────────┼────────┼──────────────────────────────────────────────────┤
  │ VoiceoverLayer         │ 9/10   │ Minimal, correct, no bugs                        │
  ├────────────────────────┼────────┼──────────────────────────────────────────────────┤
  │ FullScreenText (scene) │ 9/10   │ Responsive, 3 entrance variants, exemplar        │
  ├────────────────────────┼────────┼──────────────────────────────────────────────────┤
  │ EndScreen (scene)      │ 8.5/10 │ Polished CTA, social links, particles            │
  └────────────────────────┴────────┴──────────────────────────────────────────────────┘

  Bottom 5 Components (Need Work)

  ┌─────────────────────────────────────────┬─────────┬─────────────────────────────────────────────────┐
  │                Component                │  Score  │                       Why                       │
  ├─────────────────────────────────────────┼─────────┼─────────────────────────────────────────────────┤
  │ AnimatedDiagram (scene)                 │ 6.25/10 │ Hardcoded coords, not responsive                │
  ├─────────────────────────────────────────┼─────────┼─────────────────────────────────────────────────┤
  │ ColdOpen (component)                    │ 6.75/10 │ Duplicate of FullScreenText, deprecate          │
  ├─────────────────────────────────────────┼─────────┼─────────────────────────────────────────────────┤
  │ CaptionOverlay                          │ 6.5/10  │ WCAG contrast issues, pop flicker at 60fps      │
  ├─────────────────────────────────────────┼─────────┼─────────────────────────────────────────────────┤
  │ ConceptExplain (scene)                  │ 7.0/10  │ Copy-pasted typewriter, incomplete icon support │
  ├─────────────────────────────────────────┼─────────┼─────────────────────────────────────────────────┤
  │ BreathingMusicLayer (code quality only) │ 5.5/10  │ Too complex, no memoization, hardcoded ramps    │
  └─────────────────────────────────────────┴─────────┴─────────────────────────────────────────────────┘

  ---
  PIPELINE STEP QUALITY CHAIN

  /idea (8.7) → /script (7.5) → /video (7.0) → /voiceover (7.5) → /music (7.5) → /assets (8.3) → /distribute (8.7)
                                                                         ↓
                                                                /repurpose (6.3) ← weakest link

  Bottleneck: The chain is only as strong as its weakest phases. /video code generation (7.0) and /repurpose (6.3) are where quality drops. A
  brilliant script can produce mediocre code if Phase 8 doesn't enforce animation patterns, and repurposed shorts lack strong hook rewriting
  guidance.

  ---
  FOUND CONTRADICTIONS IN RULES

  1. "Write naturally" (Phase 5) vs "Apply minimum durations" (Phase 7) — 4-word SectionTitle narration gets padded to 3s, creating awkward
  silence
  2. "Hook window 1-3s" vs "HookQuestion min 4-5s" — scene outlasts narration
  3. "Visual change every 3s" vs "max 8s scene" (shorts) — unclear which timer drives transitions
  4. springFade is identical to fade in transitions.ts — dead duplicate

  ---
  FINAL VERDICT

  Is It Solid?

  Yes. This is a well-architected, production-grade system. The script-first pipeline is the correct design. The component library is polished.
  The design system is coherent. The skill prompts are among the best I've seen for AI video production — detailed, example-driven,
  audience-aware.

  Where Does Quality Drop?

  1. Validation gaps — data flows between phases without schema checks. Errors surface late (during rendering) instead of early (during
  scripting).
  2. Responsive design — 6 components/scenes break on portrait/square. The useLayoutMode() hook exists but isn't used consistently.
  3. Code generation — Phase 8 is descriptive ("generate clean code") not prescriptive ("use this exact pattern"). This is where AI inconsistency
  creeps in.
  4. Error handling — Silent failures throughout (empty narration skipped, missing files ignored, regex injection possible).

  What Would Make It 9/10?

  1. Add Zod validation schemas for all pipeline JSON files
  2. Fix the 6 hardcoded-coordinate components for responsive
  3. Make script-critic mandatory with user approval gate
  4. Add a /validate command that checks pipeline integrity
  5. Strengthen /repurpose with concrete hook rewrite examples
  6. Extract the 3 duplicated typewriter implementations
  7. Pre-download the music library tracks (or add download script)
  8. Resolve the narration-duration contradictions in the rules

  The gap between 7.7 and 9.0 is mostly validation, consistency, and edge-case hardening — not architecture or design. The foundation is
  excellent.


  -------------------


  RESEARCH REPORT: How to Produce High-Quality, Viral YouTube Videos

  Based on analysis of: YouTube algorithm data, top creator techniques (Fireship, 3Blue1Brown, Veritasium, MKBHD, Kurzgesagt), motion design
  principles, and skills.sh marketplace

  ---
  PART 1: THE YOUTUBE ALGORITHM (What Actually Gets Views)

  The 2025-2026 Algorithm Priorities

  YouTube has shifted from raw watch time to satisfaction signals:

  ┌───────────────────────────────────────┬───────────┬────────────────────────────────────────────────┐
  │                Signal                 │  Weight   │                 What It Means                  │
  ├───────────────────────────────────────┼───────────┼────────────────────────────────────────────────┤
  │ Satisfaction (surveys, likes, shares) │ Highest   │ Did the viewer enjoy it?                       │
  ├───────────────────────────────────────┼───────────┼────────────────────────────────────────────────┤
  │ Retention curve shape                 │ Very High │ Flat = good, cliff = bad                       │
  ├───────────────────────────────────────┼───────────┼────────────────────────────────────────────────┤
  │ CTR + Quality CTR                     │ High      │ Clicks AND 30s+ retention after click          │
  ├───────────────────────────────────────┼───────────┼────────────────────────────────────────────────┤
  │ Session time                          │ Medium    │ Does your video lead to more YouTube watching? │
  ├───────────────────────────────────────┼───────────┼────────────────────────────────────────────────┤
  │ Comments & engagement                 │ Medium    │ Real discussion signals quality                │
  └───────────────────────────────────────┴───────────┴────────────────────────────────────────────────┘

  Critical finding: YouTube's 2026 "Quality CTR" update now evaluates what happens 30 seconds AFTER the click. High CTR + low retention = active
  demotion. This means clickbait is now punished by the algorithm.

  The Numbers That Matter

  - 30-second retention threshold: 70%+ needed or the video gets suppressed
  - Sweet spot video length: 7-15 minutes for explainers (8-15 for tutorials)
  - 5-10 minute videos achieve the highest average retention at 31.5%
  - Channels improving retention by 10 points see 25%+ more impressions
  - Hybrid creators (Shorts + long-form) grow 3x faster
  - Educational how-to's average 42.1% retention rate
  - Clear value proposition in first 15 seconds → 18% higher retention at 1 minute

  The TTS Reality Check

  AI narration has a 35% higher drop-off rate vs human narration. This is the biggest challenge for your pipeline. Mitigation strategies:

  1. Compensate with visual quality — stronger visuals offset voice personality gap
  2. Use lower-pitched TTS voices — they perform significantly better
  3. Iterate on TTS output — creators who test with beta listeners see 2.5x higher retention
  4. Add more visual variety — change something every 2-3 seconds
  5. Write humor into scripts — personality gap is narrowed by funnier content
  6. Use sound design — whooshes, clicks, risers fill the "personality void"

  ---
  PART 2: HOOKS — The First 8 Seconds Decide Everything

  The Data

  - Viewers decide within 8 seconds whether to stay
  - Videos with effective pattern interrupts see 65% longer watch times
  - Open loops boost watch time by 32%
  - Cold opens crush title cards — MrBeast removed all intros after measuring retention drops

  9 Proven Hook Formulas (Ranked by Effectiveness)

  ┌─────┬────────────────────────────────────┬────────────────────────────────────────────────────────────────────┬──────────────────────────┐
  │  #  │              Formula               │                              Example                               │     Retention Boost      │
  ├─────┼────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼──────────────────────────┤
  │ 1   │ Pattern Interrupt                  │ "Delete your database. Seriously."                                 │ +23%                     │
  ├─────┼────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼──────────────────────────┤
  │ 2   │ Counterintuitive Question          │ "What if everything you know about DNS is wrong?"                  │ +20%                     │
  │     │ (Veritasium)                       │                                                                    │                          │
  ├─────┼────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼──────────────────────────┤
  │ 3   │ Shocking Stat                      │ "90% of AI projects fail before production"                        │ +18%                     │
  ├─────┼────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼──────────────────────────┤
  │ 4   │ Open Loop                          │ "By the end of this video, you'll understand why Google is         │ +32% watch time          │
  │     │                                    │ mass-deleting repos"                                               │                          │
  ├─────┼────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼──────────────────────────┤
  │ 5   │ Misconception Challenge            │ "You think you understand how HTTPS works. You don't."             │ High (Veritasium         │
  │     │                                    │                                                                    │ PhD-proven)              │
  ├─────┼────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼──────────────────────────┤
  │ 6   │ Curiosity Gap                      │ "There's a 5-line code change that makes your app 10x faster"      │ High                     │
  ├─────┼────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼──────────────────────────┤
  │ 7   │ Story Open                         │ "Last week, a single API call cost a developer $12,000"            │ Medium-High              │
  ├─────┼────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼──────────────────────────┤
  │ 8   │ Problem-Agitation                  │ "Your CI pipeline is wasting 40% of your build time"               │ Medium                   │
  ├─────┼────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼──────────────────────────┤
  │ 9   │ Controversy                        │ "React Server Components were a mistake"                           │ Medium (risky)           │
  └─────┴────────────────────────────────────┴────────────────────────────────────────────────────────────────────┴──────────────────────────┘

  What Your Pipeline Should Do

  Your current hook system has 3 archetypes (Shock/Contradiction, Curiosity Gap, rotating 3rd). Based on research, expand to:

  1. Always generate 3 hook variants (already doing this — good)
  2. Lead with Curiosity Gap or Counterintuitive Question for explainers (highest retention)
  3. Lead with Shocking Stat or Pattern Interrupt for news videos
  4. Lead with Problem-Agitation for tutorials
  5. Never use a title card — always cold open directly into the hook
  6. Fill the full 4-5 second HookQuestion scene — 12-20 words, not 4-8

  ---
  PART 3: TITLES & THUMBNAILS — What Drives Clicks

  Title Formulas (Data-Backed)

  ┌──────────────────┬─────────────────────────────────────────────────────┬────────────────────┐
  │     Formula      │                       Example                       │     CTR Impact     │
  ├──────────────────┼─────────────────────────────────────────────────────┼────────────────────┤
  │ Compression      │ "GraphRAG in 100 Seconds"                           │ Highest for tech   │
  ├──────────────────┼─────────────────────────────────────────────────────┼────────────────────┤
  │ Blueprint        │ "The Complete Guide to Docker in 2026"              │ High for search    │
  ├──────────────────┼─────────────────────────────────────────────────────┼────────────────────┤
  │ Mystery/Question │ "Why Are 96 Million Black Balls on This Reservoir?" │ Highest for browse │
  ├──────────────────┼─────────────────────────────────────────────────────┼────────────────────┤
  │ Identity         │ "What Senior Devs Know That Juniors Don't"          │ High engagement    │
  ├──────────────────┼─────────────────────────────────────────────────────┼────────────────────┤
  │ Number + Benefit │ "5 Git Commands That Will Save You Hours"           │ +20-30% CTR        │
  └──────────────────┴─────────────────────────────────────────────────────┴────────────────────┘

  Title Rules

  - 60-70 characters total, first 45 are critical (mobile truncation)
  - Good CTR: 4-6%, Excellent: 6%+
  - Numbers in titles boost CTR by 20-30%
  - Frame as mystery, not topic: "Why X?" > "How X Works"
  - YouTube now offers native A/B testing for titles AND thumbnails (since Dec 2025)

  Thumbnail Rules

  - 0-3 words on thumbnails for highest CTR (max 5)
  - Dark background + high-contrast accent color + simple icon
  - Before/after thumbnails generate 35% higher CTR
  - Custom thumbnails see 60-70% higher CTR vs auto-generated
  - Title and thumbnail should tell a cohesive story together — don't repeat the same information

  What Your Pipeline Should Do

  Your /assets skill scores titles on 5 dimensions — good. Add:
  1. Mystery framing check — does the title ask a question or create a gap?
  2. Mobile truncation preview — show how title looks at 45 chars
  3. Title-thumbnail synergy score — do they complement (not repeat)?
  4. A/B test recommendation — suggest which variants to test with YouTube's native tool

  ---
  PART 4: SCRIPT STRUCTURE — The Architecture of Retention

  The HIVES Framework (Ali Abdaal)

  ┌───────────────────┬────────────────┬──────────────────────────────────────────┐
  │       Phase       │    Duration    │                 Purpose                  │
  ├───────────────────┼────────────────┼──────────────────────────────────────────┤
  │ H — Hook          │ 0-10s          │ Grab attention, create curiosity gap     │
  ├───────────────────┼────────────────┼──────────────────────────────────────────┤
  │ I — Intro         │ 10-30s         │ Establish credibility, preview value     │
  ├───────────────────┼────────────────┼──────────────────────────────────────────┤
  │ V — Value         │ 30s-80%        │ Main content delivery                    │
  ├───────────────────┼────────────────┼──────────────────────────────────────────┤
  │ E — re-Engagement │ At 50-60% mark │ Surprise/unexpected insight to recapture │
  ├───────────────────┼────────────────┼──────────────────────────────────────────┤
  │ S — Sale/CTA      │ Final 10-20s   │ Subscribe, next video, action item       │
  └───────────────────┴────────────────┴──────────────────────────────────────────┘

  The Veritasium Misconception Framework

  1. Present what most people believe (the misconception)
  2. Create cognitive conflict (show why it's wrong)
  3. Reveal the correct explanation (now they're primed to listen)
  4. Reinforce with demonstration (proof)

  This framework was proven in Muller's PhD research to dramatically improve learning AND retention.

  Retention Danger Zones

  ┌─────────────┬───────────────────────┬─────────────────────────────┐
  │  Timestamp  │     What Happens      │          Solution           │
  ├─────────────┼───────────────────────┼─────────────────────────────┤
  │ 0-8 seconds │ 30% of viewers leave  │ Strong hook, no title cards │
  ├─────────────┼───────────────────────┼─────────────────────────────┤
  │ 30 seconds  │ Second major drop-off │ Must be past intro by now   │
  ├─────────────┼───────────────────────┼─────────────────────────────┤
  │ 55-65% mark │ 15% secondary exodus  │ Re-engagement beat needed   │
  ├─────────────┼───────────────────────┼─────────────────────────────┤
  │ Last 20%    │ Gradual decline       │ Forward-hook to next video  │
  └─────────────┴───────────────────────┴─────────────────────────────┘

  Pacing Rules

  - Curiosity gap every 90 seconds using "Micro-Loop" structure
  - Tension-release cycles: build 45-90s, release 15-30s, repeat
  - Open loops: Plant a question, answer it 2-3 minutes later
  - Forward hooks: "But first, you need to understand X" keeps viewers watching
  - 150 WPM standard for educational, 170 WPM for shorts, 200+ WPM for Fireship-style rapid

  What Your Pipeline Should Do

  1. Add HIVES phase markers to script.json — tag each section as H/I/V/E/S
  2. Enforce re-engagement beat at 55-60% — currently checked by critic but not mandatory
  3. Add open loop tracking — each opened loop must be closed before video ends
  4. Add the Misconception framework as a hook variant — "What you think you know is wrong"
  5. Validate pacing: curiosity gaps every 90s, tension-release cycles every 45-90s

  ---
  PART 5: VISUAL QUALITY — What Separates Pro from Amateur

  The #1 Rule: Every Animation Must Serve the Narrative

  Kurzgesagt, 3Blue1Brown, and TED-Ed all follow this principle: animations replace words, not decorate them. If a visual doesn't help explain the
   concept, remove it.

  Professional vs. Amateur Markers

  ┌──────────────────────────────────┬──────────────────────────────────────┐
  │             Amateur              │             Professional             │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ Linear easing (robotic movement) │ Spring/bezier easing (natural)       │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ Inconsistent spacing             │ 8px grid system throughout           │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ 3+ fonts mixed randomly          │ 2 fonts max (sans-serif + monospace) │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ Everything same size/prominence  │ Clear visual hierarchy               │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ Abrupt transitions               │ Smooth, consistent transitions       │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ Cluttered frames (8+ elements)   │ Max 5-7 elements, 30-40% whitespace  │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ Pure black background (#000)     │ Dark gray (#0f0f1a, #121212)         │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ Purposeless motion               │ Every animation explains something   │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ Random color usage               │ Limited palette (3-5 colors)         │
  ├──────────────────────────────────┼──────────────────────────────────────┤
  │ No sound design                  │ Subtle whooshes, clicks, risers      │
  └──────────────────────────────────┴──────────────────────────────────────┘

  Motion Design Numbers

  ┌─────────────────────────┬───────────────────────────────────┐
  │        Parameter        │        Professional Value         │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Entrance animation      │ 300-500ms                         │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Micro-interaction       │ 150-250ms                         │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Transition duration     │ 500-833ms (15-25 frames at 30fps) │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Stagger delay per item  │ 50-100ms                          │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Visual change frequency │ Every 3-5 seconds                 │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Max words on screen     │ 12-15                             │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Max elements on screen  │ 5-7                               │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Content frame fill      │ 60-70% (30-40% negative space)    │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Outer padding (1080p)   │ 80px+                             │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Noise/grain on dark BG  │ 2-5% opacity                      │
  ├─────────────────────────┼───────────────────────────────────┤
  │ Border radius           │ 12-16px (consistent)              │
  └─────────────────────────┴───────────────────────────────────┘

  Spring Physics (Your Pipeline's Sweet Spot)

  ┌─────────────────┬───────────┬──────────────┬────────────────────────────────────────┐
  │      Feel       │ Stiffness │   Damping    │                Use Case                │
  ├─────────────────┼───────────┼──────────────┼────────────────────────────────────────┤
  │ Smooth/silky    │ 90        │ 200          │ Cards, panels, content transitions     │
  ├─────────────────┼───────────┼──────────────┼────────────────────────────────────────┤
  │ Snappy          │ 200       │ 20           │ Buttons, toggles, quick reveals        │
  ├─────────────────┼───────────┼──────────────┼────────────────────────────────────────┤
  │ Bouncy          │ 200       │ 8            │ Attention alerts, playful elements     │
  ├─────────────────┼───────────┼──────────────┼────────────────────────────────────────┤
  │ Heavy/cinematic │ 80        │ 15 (mass: 2) │ Hero sections, full-screen transitions │
  └─────────────────┴───────────┴──────────────┴────────────────────────────────────────┘

  Your pipeline already has these in styles.ts — this validates your current config. The research confirms your spring values are
  industry-standard.

  Color Theory for Tech Content

  - Dark mode is strongly preferred — reduces eye strain, makes colors pop, feels premium
  - Never pure black (#000000) — use #0f0f1a or #121212 (your pipeline already does this correctly)
  - Primary: Deep indigo/violet (#6366f1) — signals innovation
  - Accent: Cyan (#06b6d4) for highlights, green (#10b981) for success
  - Warning: Amber (#f59e0b), red (#ef4444)
  - Your BRAND palette aligns well with these recommendations

  Typography for Video

  - 2 fonts max: Sans-serif heading (Inter, Poppins) + Monospace for code (JetBrains Mono)
  - Hero text: 64-80px, Headings: 48-64px, Body: 32-40px, Labels: 18-24px
  - Your pipeline uses Inter + JetBrains Mono — perfect match with research

  Audio Quality Standards

  ┌────────────────────┬───────────────────────────────┐
  │      Element       │             Level             │
  ├────────────────────┼───────────────────────────────┤
  │ Voiceover target   │ -12 to -8 LUFS                │
  ├────────────────────┼───────────────────────────────┤
  │ Music under voice  │ -15 to -20 dB below voice     │
  ├────────────────────┼───────────────────────────────┤
  │ Music in gaps      │ -6 to -10 dB below voice peak │
  ├────────────────────┼───────────────────────────────┤
  │ Music duck attack  │ 200-500ms                     │
  ├────────────────────┼───────────────────────────────┤
  │ Music duck release │ 500-1000ms                    │
  ├────────────────────┼───────────────────────────────┤
  │ Sound effects      │ Match or slightly below voice │
  └────────────────────┴───────────────────────────────┘

  Your BreathingMusicLayer volumes (narration 0.05, gap 0.15, transition 0.25, hook 0.30) — these ratios align well with industry standards. The
  0.05 for narration ducking is aggressive but effective for TTS clarity.

  ---
  PART 6: SHORT-FORM SPECIFIC

  Platform-Specific Sweet Spots

  ┌─────────────────┬────────────────┬─────────────────────────────────────────┐
  │    Platform     │ Optimal Length │             Key Difference              │
  ├─────────────────┼────────────────┼─────────────────────────────────────────┤
  │ YouTube Shorts  │ 50-58 seconds  │ Loop counts as rewatch since March 2025 │
  ├─────────────────┼────────────────┼─────────────────────────────────────────┤
  │ TikTok          │ 24-38 seconds  │ Algorithm favors completion rate        │
  ├─────────────────┼────────────────┼─────────────────────────────────────────┤
  │ Instagram Reels │ 15-30 seconds  │ Discovery through Explore tab           │
  └─────────────────┴────────────────┴─────────────────────────────────────────┘

  Short-Form Rules

  - First 1-2 seconds determine survival — visual shock, text hook, or audio hook
  - Shorts average 73% retention vs 52% for long-form
  - Loop technique (seamless end-to-start) counts as additional views on YouTube
  - Captions reliably boost watch time — 85% of social video watched without sound
  - Visual change every 5-10 seconds (faster than long-form)
  - 170-190 WPM pacing for short-form (faster energy)

  What Your Pipeline Should Do

  Your short-form rules are solid but add:
  1. Loop setup must be concrete — "final 1-2s mirrors opening" needs specific implementation: same color, same phrase, same visual
  2. First frame optimization — the thumbnail for Shorts IS the first frame; design it accordingly
  3. Caption style matters — bold, centered, word-by-word highlight (your CaptionOverlay does this)

  ---
  PART 7: CREATOR TECHNIQUES TO STEAL

  From Fireship

  - 200+ WPM delivery with humor makes dense content entertaining
  - Dark backgrounds + code animations = your exact Remotion capability
  - Meme insertions as pattern interrupts (consider adding image/meme scene type)
  - Consistent thumbnail style creates brand recognition

  From 3Blue1Brown

  - Every animation expresses the concept — not decoration
  - Programmatic animation (Manim = Remotion's philosophy)
  - Slower pacing (130-150 WPM) for complex concepts
  - Visual metaphors that make abstract ideas spatial

  From Veritasium

  - Misconception framework is the most powerful hook structure for educational content
  - "Legitbait" — titles that attract AND deliver
  - Frame content as mystery, not topic
  - A/B test everything

  From MKBHD

  - J-cuts — start audio before visual transition (achievable in Remotion with Sequence offsets)
  - Clean, minimal aesthetic
  - "Think about how it looks good in small" (thumbnail test)

  From Kurzgesagt

  - Limited color palette (4-5 colors) throughout entire video
  - Every animation serves the narrative
  - Original music scored to visual pacing
  - ~200 unique visual assets per 10-min video (aspirational for automation)

  From Ali Abdaal

  - HIVES framework maps directly to automated sections
  - Re-engagement beat at 50-60% is critical
  - Spend disproportionate time on the first 10 seconds

  ---
  PART 8: SKILLS.SH — What to Install

  High-Priority Installs (Direct Pipeline Enhancement)

  ┌─────────────────────────────────────┬──────────┬─────────────────────┬────────────────────────────────────────────────────────────────────┐
  │                Skill                │ Installs │      Enhances       │                                Why                                 │
  ├─────────────────────────────────────┼──────────┼─────────────────────┼────────────────────────────────────────────────────────────────────┤
  │ copywriting (coreyhaines31)         │ 52.4K    │ /script, /assets    │ Conversion-focused copy, CTA formulas, hook strengthening          │
  ├─────────────────────────────────────┼──────────┼─────────────────────┼────────────────────────────────────────────────────────────────────┤
  │ marketing-psychology                │ 38.3K    │ /script, /assets    │ 50+ psychological models (JTBD, scarcity, social proof, AIDA)      │
  │ (coreyhaines31)                     │          │                     │                                                                    │
  ├─────────────────────────────────────┼──────────┼─────────────────────┼────────────────────────────────────────────────────────────────────┤
  │ social-content (coreyhaines31)      │ 33.6K    │ /distribute         │ Platform-native content rules, hook formulas, repurposing          │
  ├─────────────────────────────────────┼──────────┼─────────────────────┼────────────────────────────────────────────────────────────────────┤
  │ storybrand-messaging (wondelai)     │ 572      │ /script             │ Viewer = hero, brand = guide. 7-element narrative framework        │
  ├─────────────────────────────────────┼──────────┼─────────────────────┼────────────────────────────────────────────────────────────────────┤
  │ ai-seo (coreyhaines31)              │ 21.5K    │ /assets,            │ Optimization for AI search citation (Google AI Overviews,          │
  │                                     │          │ /distribute         │ Perplexity)                                                        │
  ├─────────────────────────────────────┼──────────┼─────────────────────┼────────────────────────────────────────────────────────────────────┤
  │ content-strategy (coreyhaines31)    │ 34.6K    │ /idea               │ Content pillars, topic clusters, "searchable vs shareable"         │
  └─────────────────────────────────────┴──────────┴─────────────────────┴────────────────────────────────────────────────────────────────────┘

  Medium-Priority Installs

  ┌───────────────────────────────────────┬──────────┬─────────────┬──────────────────────────────────────────────────────────┐
  │                 Skill                 │ Installs │  Enhances   │                           Why                            │
  ├───────────────────────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────┤
  │ design-motion-principles (kylezantos) │ 571      │ /video      │ Motion audit with 3 expert perspectives, severity-ranked │
  ├───────────────────────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────┤
  │ seo-content-writer (aaron-he-zhu)     │ 2.7K     │ /distribute │ 12-step SEO content workflow, E-E-A-T checklist          │
  ├───────────────────────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────┤
  │ customer-research (coreyhaines31)     │ 3.8K     │ /idea       │ Audience research from Reddit, HN, G2, LinkedIn          │
  ├───────────────────────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────┤
  │ copy-editing (coreyhaines31)          │ 30.1K    │ /script     │ Professional editing pass (complement to script-critic)  │
  ├───────────────────────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────┤
  │ email-sequence (coreyhaines31)        │ 30.1K    │ /distribute │ 7 sequence types, subject line patterns                  │
  ├───────────────────────────────────────┼──────────┼─────────────┼──────────────────────────────────────────────────────────┤
  │ brand-guidelines (anthropics)         │ 20.2K    │ /video      │ Enforce consistent brand identity across compositions    │
  └───────────────────────────────────────┴──────────┴─────────────┴──────────────────────────────────────────────────────────┘

  Bulk Install Option

  The coreyhaines31/marketingskills collection has 34 skills, 1M+ total installs, 18.4K GitHub stars. You can install the entire bundle:
  npx skills add coreyhaines31/marketingskills

  Skills NOT Found (Gaps in Marketplace)

  - No YouTube-specific optimization skill (your custom /youtube skill fills this)
  - No thumbnail design skill (closest: canvas-design by Anthropics)
  - No sound design/SFX skill
  - No data visualization skill
  - No AI video generation skill

  ---
  PART 9: SPECIFIC RECOMMENDATIONS FOR YOUR PIPELINE

  Script Quality Improvements

  ┌────────────────────────────────┬──────────────────────────────────────────────────┬──────────────────────────────────────────────────┐
  │         Current State          │                  Research Says                   │                      Action                      │
  ├────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ 3 hook archetypes              │ Need 5-6 + Misconception framework               │ Add Veritasium's misconception hook as a variant │
  ├────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Re-engagement at 60% "checked" │ Must be mandatory, not optional                  │ Enforce in Phase 4, not just Phase 6             │
  ├────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Narration at 155 WPM           │ Good for explainers, too slow for Fireship-style │ Add WPM profile per video type (150/170/200)     │
  ├────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Forward hooks "suggested"      │ Open loops boost watch time +32%                 │ Track opened/closed loops in script.json         │
  ├────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Script-critic optional         │ Quality review is critical                       │ Make mandatory gate before /video                │
  ├────────────────────────────────┼──────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ No HIVES phase tagging         │ Top creators all structure this way              │ Add H/I/V/E/S phase markers                      │
  └────────────────────────────────┴──────────────────────────────────────────────────┴──────────────────────────────────────────────────┘

  Visual Quality Improvements

  ┌─────────────────────────────┬────────────────────────────────────────────────────┬──────────────────────────────────────────────────┐
  │        Current State        │                   Research Says                    │                      Action                      │
  ├─────────────────────────────┼────────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Visual change "every scene" │ Every 3-5 seconds within scenes                    │ Add intra-scene visual beats                     │
  ├─────────────────────────────┼────────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ 35 scene types              │ Missing: meme/reaction insert, before/after reveal │ Add 2-3 pattern interrupt scenes                 │
  ├─────────────────────────────┼────────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ No sound design             │ SFX = production value multiplier                  │ Add /sfx command with whoosh/click/riser library │
  ├─────────────────────────────┼────────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Animations use springs      │ Confirmed industry-standard                        │ No change needed                                 │
  ├─────────────────────────────┼────────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Dark BG + limited palette   │ Confirmed best practice for tech                   │ No change needed                                 │
  ├─────────────────────────────┼────────────────────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Content fills ~65% of frame │ Research says 60-70% ideal                         │ No change needed                                 │
  └─────────────────────────────┴────────────────────────────────────────────────────┴──────────────────────────────────────────────────┘

  Audio Quality Improvements

  ┌───────────────────────────────────┬───────────────────────────────────────────┬───────────────────────────────────────────────────────┐
  │           Current State           │               Research Says               │                        Action                         │
  ├───────────────────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────────────────┤
  │ BreathingMusicLayer ducks to 0.05 │ -15 to -20 dB recommended                 │ Your 0.05 is aggressive but effective for TTS clarity │
  ├───────────────────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────────────────┤
  │ No sound effects                  │ SFX for transitions = premium feel        │ Build /sfx with curated library                       │
  ├───────────────────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────────────────┤
  │ No strategic silence              │ Pauses before reveals create anticipation │ Add 0.5-1.5s silence markers in script.json           │
  ├───────────────────────────────────┼───────────────────────────────────────────┼───────────────────────────────────────────────────────┤
  │ TTS voice selection               │ Lower-pitched voices perform better       │ Document voice pitch guidance                         │
  └───────────────────────────────────┴───────────────────────────────────────────┴───────────────────────────────────────────────────────┘

  Distribution Improvements

  ┌─────────────────────────┬────────────────────────────────┬────────────────────────────────────────────┐
  │      Current State      │         Research Says          │                   Action                   │
  ├─────────────────────────┼────────────────────────────────┼────────────────────────────────────────────┤
  │ Single upload           │ Shorts + long-form = 3x growth │ Always pair with /repurpose                │
  ├─────────────────────────┼────────────────────────────────┼────────────────────────────────────────────┤
  │ SEO-focused             │ AI SEO is the future           │ Install ai-seo skill                       │
  ├─────────────────────────┼────────────────────────────────┼────────────────────────────────────────────┤
  │ Platform-native copy    │ Confirmed best practice        │ Install social-content skill for framework │
  ├─────────────────────────┼────────────────────────────────┼────────────────────────────────────────────┤
  │ No A/B testing guidance │ YouTube now offers native A/B  │ Add A/B test plan to /assets output        │
  └─────────────────────────┴────────────────────────────────┴────────────────────────────────────────────┘

  ---
  PART 10: THE PRODUCTION-GRADE WORKFLOW

  Based on all research, here's the optimal workflow for maximum quality and viral potential:

  1. /idea [focus]
     ├── Trend scan + competitor analysis
     ├── Content pillar alignment (install content-strategy skill)
     ├── Audience pain point matching (install customer-research skill)
     └── Output: ranked ideas with "mystery framing" titles

  2. /script <idea> --from-idea
     ├── Phase 1: Context + type detection
     ├── Phase 2: Deep research (MANDATORY for all types)
     ├── Phase 3: Hook generation (5+ variants, misconception framework)
     │   └── Apply marketing-psychology + copywriting skills
     ├── Phase 4: Scene planning with HIVES markers
     │   ├── Visual ratio enforced HERE (60%+ visual-heavy)
     │   ├── Re-engagement beat at 55-60% mandatory
     │   ├── Open loop tracking
     │   └── Pattern interrupt every 90 seconds
     ├── Phase 5: Narration with tension-release cycles
     │   └── Apply storybrand-messaging framework
     ├── Phase 6: Script critic (MANDATORY gate)
     │   └── Additional pass with copy-editing skill
     └── Output: script.json with HIVES tags + loop tracking

  3. /video <VideoName>
     ├── Duration calculation (WPM by type: 150/170/200)
     ├── Code generation with motion-principles audit
     ├── Intra-scene visual beats every 3-5s
     └── Output: Remotion code + manifest + transcript

  4. /voiceover <VideoName>
     ├── TTS synthesis (lower-pitched voice preferred)
     ├── Strategic pause insertion
     └── Auto-sync for duration matching

  5. /music <VideoName>
     ├── Breathing music with research-validated levels
     ├── Tempo matching (60-80 BPM explain, 100-120 BPM energy)
     └── Music changes at section boundaries

  6. /sfx <VideoName>  [BUILD THIS]
     ├── Whooshes for transitions
     ├── Clicks for text/icon appearance
     ├── Risers before section reveals
     └── Strategic silence before key moments

  7. /assets <VideoName>
     ├── 5 title variants (mystery framing preferred)
     ├── Mobile truncation preview (45-char check)
     ├── Thumbnail with 0-3 words, high contrast
     ├── Title-thumbnail synergy score
     ├── A/B test plan for YouTube's native tool
     └── Apply ai-seo for AI search citation

  8. /repurpose <VideoName>  [ALWAYS DO THIS]
     ├── Extract 3-5 shorts (50-58s optimal)
     ├── Loop setup (concrete mirror of opening)
     ├── First-frame = thumbnail optimization
     └── Platform-specific length variants

  9. /distribute <VideoName>
     ├── Platform-native content (apply social-content skill)
     ├── Blog post with SEO + AI-SEO optimization
     ├── Shorts posting schedule (2-3 day spacing)
     └── Cross-platform cascade with UTM tracking

  Quality Gates (Mandatory Checkpoints)

  1. After /script: Script critic must pass with 0 critical issues
  2. After /video: Preview in Remotion Studio, check visual change frequency
  3. After /voiceover: Listen to full audio, check WPM and pauses
  4. After /music: Verify ducking levels match during narration
  5. After /assets: Test thumbnail at small size (mobile preview)

  ---
  SUMMARY: Your Pipeline's Position

  What you're already doing right (validated by research):
  - Script-first architecture (narration drives everything)
  - Dark mode + limited palette (industry standard for tech)
  - Spring physics animations (confirmed professional)
  - BreathingMusicLayer (matches Kurzgesagt/MKBHD audio approach)
  - 155 WPM for explainers (within recommended range)
  - Inter + JetBrains Mono fonts (ideal pairing)
  - 80px+ outer padding (matches professional standards)
  - Content fills 60-65% of frame (within 60-70% recommendation)

  What would make the biggest quality jump (priority order):
  1. Add sound design (/sfx) — single biggest production value gap
  2. Install copywriting + marketing-psychology skills — immediately better hooks and titles
  3. Add Misconception hook framework — Veritasium's most powerful technique
  4. Enforce re-engagement beat at 55-60% — prevents the secondary viewer exodus
  5. Add intra-scene visual beats every 3-5s — currently only scene-level changes
  6. Make script-critic mandatory — quality gate before code generation
  7. Strengthen /repurpose — shorts drive 3x channel growth
  8. Install storybrand-messaging — viewer-as-hero narrative structure