/**
 * Generate manifest.json from existing section TSX files.
 *
 * Usage:
 *   node --strip-types scripts/tts/generate-manifest.ts <VideoName>
 *
 * Parses section files to extract scene types, durations, transitions,
 * and props. Works with the standard section structure used by /video.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { VideoManifest, SectionManifest, SceneManifest } from "./types.ts";

const videoName = process.argv[2];
if (!videoName) {
  console.error("Usage: generate-manifest <VideoName>");
  process.exit(1);
}

const rootDir = join(import.meta.dirname, "..", "..");
const videoDir = join(rootDir, "src", "videos", videoName);
const stylesPath = join(videoDir, "styles.ts");
const sectionsDir = join(videoDir, "sections");
const manifestPath = join(videoDir, "manifest.json");

if (!existsSync(videoDir)) {
  console.error(`Video directory not found: ${videoDir}`);
  process.exit(1);
}

// ─── Parse styles.ts ────────────────────────────────────────

const stylesContent = readFileSync(stylesPath, "utf-8");

const fpsMatch = stylesContent.match(/export const FPS\s*=\s*(\d+)/);
const fps = fpsMatch ? parseInt(fpsMatch[1]) : 30;

const totalFramesMatch = stylesContent.match(
  /export const TOTAL_FRAMES\s*=\s*(\d+)/,
);
const totalFrames = totalFramesMatch ? parseInt(totalFramesMatch[1]) : 0;

// Extract section frame constants
const sectionFrames: number[] = [];
const sectionFramePattern =
  /export const SECTION_(\d+)_FRAMES\s*=\s*(\d+)/g;
let frameMatch;
while ((frameMatch = sectionFramePattern.exec(stylesContent)) !== null) {
  const idx = parseInt(frameMatch[1]) - 1;
  sectionFrames[idx] = parseInt(frameMatch[2]);
}

// Extract T (default transition frames)
const tMatch = stylesContent.match(/export const T\s*=\s*(\d+)/);
const defaultT = tMatch ? parseInt(tMatch[1]) : 15;

// ─── Parse section files ────────────────────────────────────

const sectionFiles = existsSync(sectionsDir)
  ? readdirSync(sectionsDir)
      .filter((f) => /^Section\d+\.tsx$/.test(f))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)![0]);
        const numB = parseInt(b.match(/\d+/)![0]);
        return numA - numB;
      })
  : [];

if (sectionFiles.length === 0) {
  console.error(`No section files found in ${sectionsDir}`);
  process.exit(1);
}

let globalSceneIndex = 0;
const sections: SectionManifest[] = [];

for (let si = 0; si < sectionFiles.length; si++) {
  const content = readFileSync(join(sectionsDir, sectionFiles[si]), "utf-8");
  const sectionIndex = si + 1;

  // Try to extract section title from SectionTitle scene
  const sectionTitleMatch = content.match(
    /SectionTitle[\s\S]*?title="([^"]+)"/,
  );
  const sectionTitle = sectionTitleMatch
    ? sectionTitleMatch[1]
    : `Section ${sectionIndex}`;

  const scenes: SceneManifest[] = [];

  // Split by TransitionSeries.Sequence to find each scene
  const sequencePattern =
    /TransitionSeries\.Sequence\s+durationInFrames=\{(\d+)\s*\*\s*FPS\}>([\s\S]*?)<\/TransitionSeries\.Sequence>/g;

  // Find all transitions (in order) to pair with scenes
  const transitionPattern =
    /TransitionSeries\.Transition[\s\S]*?presentation=\{(\w+)\(([^)]*)\)\}[\s\S]*?durationInFrames:\s*(\w+|\d+)/g;

  const transitions: { type: string; frames: number }[] = [];
  let tMatch2;
  while ((tMatch2 = transitionPattern.exec(content)) !== null) {
    const type = tMatch2[1];
    const framesStr = tMatch2[3];
    const frames =
      framesStr === "T" ? defaultT : parseInt(framesStr) || defaultT;
    transitions.push({ type, frames });
  }

  let seqMatch;
  let sceneIdx = 0;
  while ((seqMatch = sequencePattern.exec(content)) !== null) {
    globalSceneIndex++;
    const durationSeconds = parseInt(seqMatch[1]);
    const sceneContent = seqMatch[2];

    // Detect scene type from component name
    const sceneTypeMatch = sceneContent.match(/<(\w+)\s/);
    const sceneType = sceneTypeMatch ? sceneTypeMatch[1] : "Unknown";

    // Extract props
    const props = extractProps(sceneContent, sceneType);

    const scene: SceneManifest = {
      sceneIndex: globalSceneIndex,
      sceneType,
      durationSeconds,
      props,
    };

    // Add transition (one less transition than scenes)
    if (sceneIdx < transitions.length) {
      scene.transitionAfter = transitions[sceneIdx];
    }

    scenes.push(scene);
    sceneIdx++;
  }

  sections.push({
    sectionIndex,
    title: sectionTitle,
    durationFrames: sectionFrames[si] ?? 0,
    scenes,
  });
}

const manifest: VideoManifest = {
  videoName,
  fps,
  totalFrames,
  sections,
};

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Manifest written to ${manifestPath}`);
console.log(
  `  ${sections.length} sections, ${globalSceneIndex} scenes, ${totalFrames} frames (${(totalFrames / fps).toFixed(1)}s)`,
);

// ─── Prop extraction ────────────────────────────────────────

function extractProps(
  content: string,
  _sceneType: string,
): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  // Simple string props: key="value"
  const stringPropPattern = /(\w+)="([^"]+)"/g;
  let m;
  while ((m = stringPropPattern.exec(content)) !== null) {
    const key = m[1];
    // Skip React/Remotion internal props and style keys
    if (
      ["bg", "text", "accent", "muted", "beforeColor", "afterColor", "color"]
        .includes(key) ||
      key === "direction" ||
      key === "fontFamily"
    ) continue;
    props[key] = m[2];
  }

  // Number props: key={123}
  const numPropPattern = /(\w+)=\{(\d+(?:\.\d+)?)\}/g;
  while ((m = numPropPattern.exec(content)) !== null) {
    const key = m[1];
    if (key === "durationInFrames" || key === "sectionNumber") continue;
    props[key] = parseFloat(m[2]);
  }

  // Array props: extract common array structures
  // objectives={[...]}
  const objectivesMatch = content.match(
    /objectives=\{\[([\s\S]*?)\]\}/,
  );
  if (objectivesMatch) {
    props.objectives = extractStringArray(objectivesMatch[1]);
  }

  // items (for SummaryRecap, BulletReveal)
  const itemsMatch = content.match(/items=\{\[([\s\S]*?)\]\}/);
  if (itemsMatch) {
    // Check if it's an array of strings or objects
    if (itemsMatch[1].includes("{")) {
      props.items = extractObjectArray(itemsMatch[1]);
    } else {
      props.items = extractStringArray(itemsMatch[1]);
    }
  }

  // nodes (for DiagramFlow, TimelineScene)
  const nodesMatch = content.match(/nodes=\{\[([\s\S]*?)\]\}/);
  if (nodesMatch) {
    props.nodes = extractObjectArray(nodesMatch[1]);
  }

  // connections (for DiagramFlow)
  const connectionsMatch = content.match(
    /connections=\{\[([\s\S]*?)\]\}/,
  );
  if (connectionsMatch) {
    props.connections = extractObjectArray(connectionsMatch[1]);
  }

  // steps (for StepSequence)
  const stepsMatch = content.match(/steps=\{\[([\s\S]*?)\]\}/);
  if (stepsMatch) {
    props.steps = extractObjectArray(stepsMatch[1]);
  }

  // bars (for DataChart)
  const barsMatch = content.match(/bars=\{\[([\s\S]*?)\]\}/);
  if (barsMatch) {
    props.bars = extractObjectArray(barsMatch[1]);
  }

  // annotations (for CodeDisplay)
  const annotationsMatch = content.match(
    /annotations=\{\[([\s\S]*?)\]\}/,
  );
  if (annotationsMatch) {
    props.annotations = extractObjectArray(annotationsMatch[1]);
  }

  // code prop (multi-line template literal)
  const codeMatch = content.match(/code=\{`([\s\S]*?)`\}/);
  if (codeMatch) {
    props.code = codeMatch[1];
  }

  // before/after objects (for BeforeAfter)
  const beforeMatch = content.match(
    /before=\{\{([\s\S]*?)\}\}/,
  );
  if (beforeMatch) {
    props.before = extractPanelObject(beforeMatch[1]);
  }
  const afterMatch = content.match(
    /after=\{\{([\s\S]*?)\}\}/,
  );
  if (afterMatch) {
    props.after = extractPanelObject(afterMatch[1]);
  }

  // left/right objects (for ComparisonSplit)
  const leftMatch = content.match(/left=\{\{([\s\S]*?)\}\}/);
  if (leftMatch) {
    props.left = extractPanelObject(leftMatch[1]);
  }
  const rightMatch = content.match(/right=\{\{([\s\S]*?)\}\}/);
  if (rightMatch) {
    props.right = extractPanelObject(rightMatch[1]);
  }

  return props;
}

function extractStringArray(content: string): string[] {
  const results: string[] = [];
  const pattern = /"([^"]+)"/g;
  let m;
  while ((m = pattern.exec(content)) !== null) {
    results.push(m[1]);
  }
  return results;
}

function extractObjectArray(
  content: string,
): Record<string, unknown>[] {
  const results: Record<string, unknown>[] = [];
  const objPattern = /\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
  let m;
  while ((m = objPattern.exec(content)) !== null) {
    const obj: Record<string, unknown> = {};
    // Extract string fields
    const strPattern = /(\w+):\s*"([^"]+)"/g;
    let sm;
    while ((sm = strPattern.exec(m[1])) !== null) {
      obj[sm[1]] = sm[2];
    }
    // Extract number fields
    const numPattern = /(\w+):\s*(\d+(?:\.\d+)?)/g;
    let nm;
    while ((nm = numPattern.exec(m[1])) !== null) {
      if (!obj[nm[1]]) {
        obj[nm[1]] = parseFloat(nm[2]);
      }
    }
    if (Object.keys(obj).length > 0) {
      results.push(obj);
    }
  }
  return results;
}

function extractPanelObject(
  content: string,
): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  if (titleMatch) obj.title = titleMatch[1];
  const itemsMatch = content.match(/items:\s*\[([\s\S]*?)\]/);
  if (itemsMatch) {
    obj.items = extractStringArray(itemsMatch[1]);
  }
  return obj;
}
