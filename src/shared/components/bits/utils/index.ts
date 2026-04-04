// Re-export utilities — consumers should import specific modules for types that conflict
// (Vector3/Matrix4/Quaternion exist in both transform3d and particles/types)
export * from "./interpolate";
export * from "./color";
export * from "./gradient";
export * from "./random";
export * from "./StepContext";
export * from "./motion";
export * from "./geometry";

// These have overlapping exports (Vector3, Matrix4, Quaternion) — import directly when needed:
// import { Transform3D } from "./utils/transform3d";
// import { interpolateMatrix4 } from "./utils/interpolate3d";
// import { type Vector3 as ParticleVector3 } from "./utils/particles/types";
