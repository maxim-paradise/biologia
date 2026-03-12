import type { DataLayer } from "./types";

export function clamp01(x: number) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function getLayerLabel(layer: DataLayer) {
  if (layer === "atmosphere") return "Атмосфера";
  if (layer === "ocean") return "Океан";
  if (layer === "ice") return "Лід";
  return "Біосфера";
}

export function getLayerAccent(layer: DataLayer) {
  if (layer === "atmosphere") return { hex: "#00ff66", dim: "rgba(0, 255, 102, 0.1)" };
  if (layer === "ocean") return { hex: "#4ea1ff", dim: "rgba(78, 161, 255, 0.12)" };
  if (layer === "ice") return { hex: "#b8d7ff", dim: "rgba(184, 215, 255, 0.12)" };
  return { hex: "#ffcc66", dim: "rgba(255, 204, 102, 0.12)" };
}

export function getTimeRangeMs(range: "24h" | "7d" | "30d") {
  if (range === "24h") return 24 * 60 * 60 * 1000;
  if (range === "7d") return 7 * 24 * 60 * 60 * 1000;
  return 30 * 24 * 60 * 60 * 1000;
}
