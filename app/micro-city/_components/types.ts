export type ThreatType = "virus" | "toxin";

export type Threat = {
  id: string;
  type: ThreatType;
  x: number; // 0..1 within stage
  y: number; // 0..1 within stage
  ttlMs: number;
  spawnedAt: number;
  resolvedAt?: number;
  resolvedBy?: "user" | "timeout";
};

export type Resource = {
  id: string;
  x: number; // 0..1 within stage
  y: number; // 0..1 within stage
  value: number; // credits gained
  ttlMs: number;
  spawnedAt: number;
  collectedAt?: number;
};

export type ModuleKind = "scanner" | "shield" | "neutralizer" | "colony";

export type PlacedModule = {
  id: string;
  kind: ModuleKind;
  x: number; // 0..1 within stage
  y: number; // 0..1 within stage
  placedAt: number;
};

export type MissionStep = {
  id: string;
  title: string;
  description: string;
  targetScore?: number;
  targetResolved?: number;
  targetStreak?: number;
  timeLimitMs?: number;
};
