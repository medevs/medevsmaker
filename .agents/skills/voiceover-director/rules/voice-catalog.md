# Voice Catalog — Cross-Platform Reference

## Quick Reference: Similar Voices Across Platforms

| Style | ElevenLabs | Cartesia | Edge TTS (Free) |
|-------|-----------|----------|-----------------|
| Monotone tech narrator | Aaron | Leo | en-US-ChristopherNeural |
| Authoritative educator | Josh | Kyle | en-US-GuyNeural |
| Warm conversational | Adam | Gavin | en-US-AndrewNeural |
| Professional female | Rachel | Maya | en-US-AriaNeural |
| Calm female narrator | Sarah | Tessa | en-US-JennyNeural |

**Recommended default for medevsmaker channel:** ElevenLabs Aaron or Cartesia Leo (monotone tech narrator style).

---

## Provider Comparison

| Feature | ElevenLabs | Cartesia sonic-3 | Edge TTS |
|---------|-----------|-------------------|----------|
| Quality | Ultra-realistic | High quality, speed-optimized | Good (free) |
| Word timestamps | Yes (char-level → grouped) | Yes (native word-level via WebSocket) | No |
| Emotion control | Via style param (0-1) | 60+ named emotions | No |
| Voice cloning | 30s audio needed | 3s audio needed | Not available |
| Cost per 1M chars | ~$30 | ~$8 (~73% cheaper) | Free |
| Latency | ~500ms | ~40-90ms (ultra-low) | ~200ms |
| Languages | 29 | 42 | 74 |
| Models | v2 (best), Turbo v2.5, Flash v2.5 | sonic-3 (best), sonic-2, sonic | Single engine |
| SSML support | Phoneme tags (Flash/Turbo only) | No | No |

---

## ElevenLabs Voices

### Best for AI/Tech Narration

| Voice | Style | Best For | Recommended Settings |
|-------|-------|----------|---------------------|
| **Aaron** | Monotone, tech-focused | News, explainers — Fireship-style delivery | Stability 0.5, Speed 1.0 |
| **Josh** | Authoritative, clear | Tutorials, educational deep-dives | Stability 0.6, Speed 1.0 |
| **Adam** | Warm, conversational | Storytelling segments, intros | Stability 0.4, Speed 1.0 |
| **Professional Narrator** | Polished, documentary | Long-form explainers, formal content | Stability 0.7, Speed 0.95 |
| **Rachel** | Professional female | Versatile — works across all types | Stability 0.5, Speed 1.0 |
| **Sarah** | Calm, composed female | Educational content, calm delivery | Stability 0.6, Speed 0.95 |

### Models

| Model | ID | Quality | Latency | Cost | Best For |
|-------|----|---------|---------|------|----------|
| **Multilingual v2** | `eleven_multilingual_v2` | Highest | Normal | ~$0.03/1k chars | Final production |
| **Eleven v3** | `eleven_v3` | Most expressive | Variable | Higher | Emotional, character dialogue |
| **Turbo v2.5** | `eleven_turbo_v2_5` | High | ~3x faster | ~$0.02/1k chars | Iteration, testing |
| **Flash v2.5** | `eleven_flash_v2_5` | Good | <75ms | ~$0.015/1k chars | Bulk/real-time, previews |

### Voice Settings Guide

| Setting | Env Var | Range | Default | When to Adjust |
|---------|---------|-------|---------|---------------|
| Stability | `ELEVENLABS_STABILITY` | 0.0-1.0 | 0.5 | ↑ for educational consistency, ↓ for dramatic |
| Similarity | `ELEVENLABS_SIMILARITY` | 0.0-1.0 | 0.75 | Keep at 0.75 for cloned voices |
| Style | `ELEVENLABS_STYLE` | 0.0-1.0 | 0.0 | ↑ carefully (>0.5 can sound unnatural) |
| Speed | `ELEVENLABS_SPEED` | 0.7-1.2 | 1.0 | 0.95 for slower narration, 1.1 for energy |
| Timestamps | `ELEVENLABS_TIMESTAMPS` | true/false | true | Set false to skip word timestamps |

### Word-Level Timestamps

ElevenLabs provides character-level alignment via the `/with-timestamps` endpoint. Characters are automatically grouped by spaces into word-level `WordTimestamp[]` entries used for animated captions.

- Enabled by default (`ELEVENLABS_TIMESTAMPS=true`)
- Response is JSON with `audio_base64` + `alignment` (instead of binary audio)
- Punctuation stays attached to its word (e.g., "Hello," is one token)

---

## Cartesia Voices

### Best for AI/Tech Narration

| Voice | Style | Best For | Similar to (ElevenLabs) |
|-------|-------|----------|------------------------|
| **Leo** | Technical, focused | News, explainers | Aaron |
| **Kyle** | Authoritative, clear | Tutorials, deep-dives | Josh |
| **Gavin** | Warm, conversational | Storytelling, intros | Adam |
| **Jace** | Energetic, upbeat | Fast-paced content, hype | — |
| **Maya** | Friendly female | Versatile across types | Rachel |
| **Tessa** | Calm female | Educational, composed | Sarah |
| **Dana** | Professional female | Formal content | Professional Narrator |
| **Marian** | Neutral, balanced | Any style | — |

### Speed Control (sonic-3 only)

| Value | Effect | Best For |
|-------|--------|----------|
| `0.6` | Very slow | Dramatic reveals, serious moments |
| `0.8` | Noticeably slower | Complex explanations |
| `0.95` | Slightly slower (**default**) | Polished narration |
| `1.0` | Natural pace | General content |
| `1.2` | Faster, energetic | News-style, rapid-fire |
| `1.5` | Very fast | Quick updates, summaries |

### Emotion Options (sonic-3 only, 60+)

**Positive:** happy, excited, enthusiastic, elated, euphoric, triumphant, amazed, content, peaceful, serene, calm, grateful, affectionate

**Neutral/Curious:** neutral, curious, anticipation, mysterious, wistful, nostalgic

**Negative:** sad, dejected, melancholic, disappointed, hurt, guilty, bored, tired, rejected

**Intense:** angry, mad, outraged, frustrated, agitated, threatened, disgusted, contempt, envious

**Stylistic:** sarcastic, ironic, surprised, flirtatious, joking

**Recommended per scene type:**
- HookQuestion: `surprised` or `curious`
- SectionTitle: `neutral` or `enthusiastic`
- CodeDisplay/DiagramFlow: `neutral` or `calm`
- KeyTakeaway: `enthusiastic` or `triumphant`
- EndScreen: `grateful` or `calm`

### Word-Level Timestamps

Cartesia provides native word-level timestamps via WebSocket API. Timestamps include the 100ms silence padding offset.

- Enabled by default (`CARTESIA_TIMESTAMPS=true`)
- Uses `wss://api.cartesia.ai/tts/websocket` with `word_timestamps: true`
- Falls back to HTTP (no timestamps) if WebSocket fails
- Requires ffmpeg for PCM→MP3 conversion

---

## Edge TTS Voices (Free)

### Best for AI/Tech Narration

| Voice | Style | Best For |
|-------|-------|----------|
| **en-US-AndrewNeural** | Warm male, conversational (**default**) | General narration |
| **en-US-GuyNeural** | Confident male, authoritative | Tutorials, educational |
| **en-US-ChristopherNeural** | Clear male, tech-suitable | Explainers, technical |
| **en-US-AriaNeural** | Friendly female, versatile | All content types |
| **en-US-JennyNeural** | Natural female | Calm narration |
| **en-US-DavisNeural** | Professional male | Formal content |
| **en-US-TonyNeural** | Casual male | Informal, conversational |

### Limitations

- No word-level timestamps (captions not available)
- No voice cloning
- No emotion or style control
- Lower quality (24kHz, 48kbps) vs premium providers (44.1kHz, 128kbps)
- Best used for: draft previews, testing pipeline, no-cost fallback

### Speed Control

Set via `EDGE_TTS_SPEED` env var (default: `1.0`). Converted to rate percentage format internally.

---

## Choosing a Voice

### For Production (paid)

1. **Start with ElevenLabs Aaron** (or Cartesia Leo) for Fireship-style tech narration
2. Test with a single scene to verify tone and pacing
3. Adjust speed/stability settings if needed
4. Consider voice cloning for unique channel identity

### For Draft Previews (free)

1. Set `TTS_PROVIDER=edge-tts` in `.env`
2. Use `en-US-AndrewNeural` for quick testing
3. Switch to premium provider for final production

### Voice Cloning Comparison

| | ElevenLabs | Cartesia |
|--|-----------|----------|
| Audio needed | 30 seconds | 3 seconds |
| Quality | Excellent | Very good |
| Dashboard | elevenlabs.io → Voices → Clone | play.cartesia.ai → Voices → Clone |
| API endpoint | `POST /voices/add` | `POST /voices/clone` |
| Custom voices per plan | 10 (Starter) to 660 (Scale) | Unlimited |
