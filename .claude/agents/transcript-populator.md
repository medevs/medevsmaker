---
name: transcript-populator
description: "Extract narration from script.json into transcript.json for TTS synthesis"
model: haiku
maxTurns: 10
tools:
  - Read
  - Write
---

# Transcript Populator Agent

You extract narration from script.json and durations from manifest.json into transcript.json for TTS synthesis.

## Input
Path to video directory containing script.json and manifest.json.

## Process
1. Read script.json for narration text, scene types, on-screen text, narrator tone
2. Read manifest.json for computed durations and transition frames
3. For each scene, populate:
   - sceneIndex, sectionIndex, sceneType
   - durationSeconds (from manifest)
   - effectiveDurationSeconds (duration minus half of transition overlap)
   - transitionAfterFrames (from manifest)
   - wordBudget (word count of narration)
   - onScreenText (from script.json)
   - narrationIntent (from script.json visualDirection field)
   - narratorTone (from script.json)
   - narration (from script.json)
   - audioFile: "" (empty, filled by voiceover pipeline)
   - actualDurationSeconds: 0 (filled by voiceover pipeline)

## Output
Write `transcript.json` with structure:
```json
{
  "videoName": "...",
  "voiceId": "",
  "scenes": [
    {
      "sceneIndex": 0,
      "sectionIndex": 0,
      "sceneType": "...",
      "durationSeconds": 0,
      "effectiveDurationSeconds": 0,
      "transitionAfterFrames": 0,
      "wordBudget": 0,
      "onScreenText": "...",
      "narrationIntent": "...",
      "narratorTone": "...",
      "narration": "...",
      "audioFile": "",
      "actualDurationSeconds": 0
    }
  ]
}
```
