"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  MissionStep,
  ModuleKind,
  PlacedModule,
  Resource,
  Threat,
  ThreatType,
} from "./types";

function uid() {
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

const missionDefs: Omit<MissionStep, "title" | "description">[] = [
  {
    id: "boot",
    targetResolved: 6,
  },
  {
    id: "streak",
    targetStreak: 5,
  },
  {
    id: "score",
    targetScore: 120,
  },
];

export type MicroCitySnapshot = {
  running: boolean;
  paused: boolean;
  integrity: number; // 0..100
  defense: number; // 0..100
  threatLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  score: number;
  streak: number;
  resolved: number;
  missed: number;
  missionIndex: number;
  missionDone: boolean;
  missionStartedAt: number;
  message: string | null;
  threats: Threat[];
  resources: Resource[];
  unlockedModules: ModuleKind[];
  placedModules: PlacedModule[];
  credits: number;
  finalReady: boolean;
  finalSvg: string;
};

export function useMicroCityGame() {
  const { t } = useTranslation();

  const missions: MissionStep[] = useMemo(
    () => [
      {
        ...missionDefs[0],
        title: t("mc_mission_1_title"),
        description: t("mc_mission_1_desc"),
      },
      {
        ...missionDefs[1],
        title: t("mc_mission_2_title"),
        description: t("mc_mission_2_desc"),
      },
      {
        ...missionDefs[2],
        title: t("mc_mission_3_title"),
        description: t("mc_mission_3_desc"),
      },
    ],
    [t],
  );

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const [integrity, setIntegrity] = useState(94.2);
  const [defense, setDefense] = useState(72);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [missed, setMissed] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);
  const [missionStartedAt, setMissionStartedAt] = useState<number>(Date.now());
  const [message, setMessage] = useState<string | null>(
    t("mc_msg_intro"),
  );

  const [threats, setThreats] = useState<Threat[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const [placedModules, setPlacedModules] = useState<PlacedModule[]>([]);
  const [credits, setCredits] = useState(0);
  const [finalReady, setFinalReady] = useState(false);
  const [finalSvg, setFinalSvg] = useState<string>("");

  const lastSweepResolveAtRef = useRef<number>(0);

  const leakTimerRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);

  const currentMission = missions[missionIndex] ?? missions[missions.length - 1];

  const unlockedModules = useMemo<ModuleKind[]>(() => {
    if (missionIndex <= 0) return ["scanner"];
    if (missionIndex === 1) return ["scanner", "shield"];
    if (missionIndex === 2) return ["scanner", "shield", "neutralizer", "colony"];
    return ["scanner", "shield", "neutralizer", "colony"];
  }, [missionIndex]);

  const threatLevel = useMemo(() => {
    const danger = clamp01((100 - integrity) / 35) * 100;
    if (danger < 20) return "LOW";
    if (danger < 45) return "MODERATE";
    if (danger < 70) return "HIGH";
    return "CRITICAL";
  }, [integrity]);

  const missionDone = useMemo(() => {
    if (!currentMission) return true;
    if (currentMission.targetResolved && resolved < currentMission.targetResolved)
      return false;
    if (currentMission.targetStreak && streak < currentMission.targetStreak)
      return false;
    if (currentMission.targetScore && score < currentMission.targetScore) return false;
    return true;
  }, [currentMission, resolved, score, streak]);

  const reset = useCallback(() => {
    setRunning(false);
    setPaused(false);
    setIntegrity(94.2);
    setDefense(72);
    setScore(0);
    setStreak(0);
    setResolved(0);
    setMissed(0);
    setMissionIndex(0);
    setMissionStartedAt(Date.now());
    setMessage(t("mc_msg_intro"));
    setThreats([]);
    setPlacedModules([]);
    setCredits(24);
    setFinalReady(false);
    setFinalSvg("");
  }, [t]);

  const clearFinal = useCallback(() => {
    setFinalReady(false);
  }, []);

  const spawnResource = useCallback((valueOverride?: number) => {
    setResources((prev) => {
      const alive = prev.filter((r) => !r.collectedAt);
      if (alive.length >= 7) return prev;

      const value = valueOverride ?? (Math.random() < 0.25 ? 5 : 2);
      const r: Resource = {
        id: uid(),
        x: 0.18 + Math.random() * 0.64,
        y: 0.24 + Math.random() * 0.58,
        value,
        ttlMs: 2600 + Math.random() * 1700,
        spawnedAt: Date.now(),
      };
      return [...prev, r];
    });
  }, []);

  const start = useCallback(() => {
    setRunning(true);
    setPaused(false);
    setMissionStartedAt(Date.now());
    setMessage(t("mc_msg_online"));
    setFinalReady(false);
    setFinalSvg("");
  }, [t]);

  const togglePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  const acknowledgeMission = useCallback(() => {
    setMessage(null);
  }, []);

  const advanceMission = useCallback(() => {
    setMissionIndex((idx) => {
      const next = Math.min(idx + 1, missions.length - 1);
      return next;
    });
    setMissionStartedAt(Date.now());
    setMessage(t("mc_msg_mission_updated"));
  }, [t]);

  const spawnThreat = useCallback(() => {
    setThreats((prev) => {
      if (prev.filter((t) => !t.resolvedAt).length >= 6) return prev;

      const type: ThreatType = Math.random() > 0.25 ? "virus" : "toxin";

      const t: Threat = {
        id: uid(),
        type,
        x: 0.2 + Math.random() * 0.6,
        y: 0.25 + Math.random() * 0.55,
        ttlMs: 2600 + Math.random() * 1700,
        spawnedAt: Date.now(),
      };

      return [...prev, t];
    });
  }, []);

  const purgeThreats = useCallback(() => {
    const now = Date.now();
    setThreats((prev) =>
      prev.map((t) => (t.resolvedAt ? t : { ...t, resolvedAt: now, resolvedBy: "user" })),
    );
    setMessage(t("mc_msg_colony"));
  }, [t]);

  const boostShield = useCallback(() => {
    setDefense((d) => clamp01((d + 18) / 100) * 100);
    setIntegrity((i) => clamp01((i + 2.8) / 100) * 100);
    setScore((s) => s + 5);
    setMessage(t("mc_msg_shield"));
  }, [t]);

  const scanPulse = useCallback(() => {
    // small burst of threats to keep the gameplay busy
    spawnThreat();
    window.setTimeout(() => spawnThreat(), 140);
    window.setTimeout(() => spawnThreat(), 280);
    setScore((s) => s + 3);
    setMessage(t("mc_msg_scan"));
  }, [spawnThreat, t]);

  const resolveThreat = useCallback((id: string) => {
    setThreats((prev) => {
      const now = Date.now();
      return prev.map((t) =>
        t.id === id && !t.resolvedAt
          ? { ...t, resolvedAt: now, resolvedBy: "user" }
          : t,
      );
    });

    setResolved((r) => r + 1);
    setScore((s) => s + 20);
    setCredits((c) => c + 2);
    setDefense((d) => clamp01((d + 6) / 100) * 100);
    setStreak((st) => st + 1);
    setIntegrity((i) => clamp01((i + 1.1) / 100) * 100);
  }, []);

  const placeModule = useCallback(
    (kind: ModuleKind, x: number, y: number) => {
      if (placedModules.some((p) => p.kind === kind)) return;

      const now = Date.now();
      const cost =
        kind === "scanner"
          ? 10
          : kind === "shield"
            ? 12
            : kind === "neutralizer"
              ? 18
              : 22;

      let allowed = true;
      setCredits((c) => {
        if (c < cost) {
          allowed = false;
          return c;
        }
        return c - cost;
      });
      if (!allowed) return;

      setPlacedModules((prev) => {
        if (prev.some((p) => p.kind === kind)) return prev;
        const next: PlacedModule = {
          id: uid(),
          kind,
          x,
          y,
          placedAt: now,
        };
        return [...prev, next];
      });
    },
    [placedModules],
  );

  const removeModule = useCallback((id: string) => {
    setPlacedModules((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resolveThreatAt = useCallback(
    (nx: number, ny: number) => {
      const now = Date.now();
      if (now - lastSweepResolveAtRef.current < 45) return;

      // collect resource first (earning)
      let collected = false;
      setResources((prev) => {
        if (collected) return prev;
        let picked: Resource | null = null;
        let pickedDist = Infinity;
        for (const r of prev) {
          if (r.collectedAt) continue;
          const dx = r.x - nx;
          const dy = r.y - ny;
          const d = dx * dx + dy * dy;
          if (d < pickedDist) {
            pickedDist = d;
            picked = r;
          }
        }
        const radius = 0.06;
        if (!picked || pickedDist > radius * radius) return prev;
        collected = true;
        setCredits((c) => c + picked.value);
        return prev.map((r) =>
          r.id === picked!.id ? { ...r, collectedAt: now } : r,
        );
      });

      let picked: Threat | null = null;
      let pickedDist = Infinity;

      for (const t of threats) {
        if (t.resolvedAt) continue;
        const dx = t.x - nx;
        const dy = t.y - ny;
        const d = dx * dx + dy * dy;
        if (d < pickedDist) {
          pickedDist = d;
          picked = t;
        }
      }

      const radius = 0.06;
      if (!picked || pickedDist > radius * radius) return;

      lastSweepResolveAtRef.current = now;
      resolveThreat(picked.id);
    },
    [resolveThreat, threats],
  );

  const leakThreat = useCallback((id: string) => {
    setThreats((prev) => {
      const now = Date.now();
      return prev.map((t) =>
        t.id === id && !t.resolvedAt
          ? { ...t, resolvedAt: now, resolvedBy: "timeout" }
          : t,
      );
    });

    setMissed((m) => m + 1);
    setScore((s) => Math.max(0, s - 10));
    setCredits((c) => Math.max(0, c - 1));
    setStreak(0);
    setDefense((d) => clamp01((d - 10) / 100) * 100);
    setIntegrity((i) => {
      const shielded = placedModules.some((m) => m.kind === "shield");
      const loss = shielded ? 3.2 : 4.8;
      return clamp01((i - loss) / 100) * 100;
    });
  }, [placedModules]);

  useEffect(() => {
    if (paused) return;
    const incomePerSec = placedModules.length * 0.6;
    if (incomePerSec <= 0) return;
    const timer = window.setInterval(() => {
      setCredits((c) => Math.round((c + incomePerSec) * 10) / 10);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paused, placedModules.length]);

  useEffect(() => {
    if (!running || paused) return;
    const hasNeutralizer = placedModules.some((m) => m.kind === "neutralizer");
    if (!hasNeutralizer) return;

    const timer = window.setInterval(() => {
      const alive = threats.filter((t) => !t.resolvedAt);
      if (alive.length === 0) return;

      // neutralize closest threat to any neutralizer
      let pick: Threat | null = null;
      let pickD = Infinity;
      const nz = placedModules.filter((m) => m.kind === "neutralizer");
      for (const th of alive) {
        for (const m of nz) {
          const dx = th.x - m.x;
          const dy = th.y - m.y;
          const d = dx * dx + dy * dy;
          if (d < pickD) {
            pickD = d;
            pick = th;
          }
        }
      }
      const radius = 0.09;
      if (pick && pickD <= radius * radius) resolveThreat(pick.id);
    }, 550);

    return () => window.clearInterval(timer);
  }, [paused, placedModules, resolveThreat, running, threats]);

  useEffect(() => {
    if (!running || paused) return;
    const hasColony = placedModules.some((m) => m.kind === "colony");
    if (!hasColony) return;
    if (threatLevel !== "CRITICAL") return;
    purgeThreats();
  }, [paused, placedModules, purgeThreats, running, threatLevel]);

  useEffect(() => {
    if (!running || paused) return;

    const hasScanner = placedModules.some((m) => m.kind === "scanner");
    const interval = hasScanner ? 760 : 900;
    spawnTimerRef.current = window.setInterval(() => {
      spawnThreat();
    }, interval);

    return () => {
      if (spawnTimerRef.current) window.clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    };
  }, [paused, placedModules, running, spawnThreat]);

  useEffect(() => {
    if (paused) return;
    const hasScanner = placedModules.some((m) => m.kind === "scanner");
    const interval = hasScanner ? 980 : 1200;
    const timer = window.setInterval(() => {
      spawnResource();
    }, interval);
    return () => window.clearInterval(timer);
  }, [paused, placedModules, spawnResource]);

  useEffect(() => {
    if (!running || paused) return;

    leakTimerRef.current = window.setInterval(() => {
      const now = Date.now();
      setThreats((prev) => {
        prev.forEach((t) => {
          if (t.resolvedAt) return;
          const elapsed = now - t.spawnedAt;
          if (elapsed >= t.ttlMs) leakThreat(t.id);
        });
        return prev;
      });
    }, 120);

    return () => {
      if (leakTimerRef.current) window.clearInterval(leakTimerRef.current);
      leakTimerRef.current = null;
    };
  }, [paused, running, leakThreat]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      setResources((prev) =>
        prev.map((r) =>
          r.collectedAt
            ? r
            : now - r.spawnedAt >= r.ttlMs
              ? { ...r, collectedAt: now }
              : r,
        ),
      );
    }, 120);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (!running) return;
    if (integrity <= 0) {
      setRunning(false);
      setPaused(false);
      setMessage(t("mc_msg_integrity_failed"));
    }
  }, [integrity, running, t]);

  useEffect(() => {
    if (!running) return;
    if (missionDone && missionIndex < missions.length - 1) {
      setMessage(t("mc_msg_mission_complete"));
    }
  }, [missionDone, missionIndex, missions.length, running, t]);

  useEffect(() => {
    setFinalReady(false);
  }, [credits]);

  const snapshot: MicroCitySnapshot = useMemo(
    () => ({
      running,
      paused,
      integrity,
      defense,
      threatLevel,
      score,
      streak,
      resolved,
      missed,
      missionIndex,
      missionDone,
      missionStartedAt,
      message,
      threats,
      resources,
      unlockedModules,
      placedModules,
      credits,
      finalReady,
      finalSvg,
    }),
    [
      defense,
      integrity,
      finalReady,
      finalSvg,
      placedModules,
      unlockedModules,
      credits,
      message,
      missed,
      missionDone,
      missionIndex,
      missionStartedAt,
      paused,
      resolved,
      resources,
      running,
      score,
      streak,
      threatLevel,
      threats,
    ],
  );

  return {
    snapshot,
    currentMission,
    start,
    reset,
    togglePause,
    resolveThreat,
    resolveThreatAt,
    placeModule,
    removeModule,
    clearFinal,
    acknowledgeMission,
    advanceMission,
    scanPulse,
    boostShield,
    purgeThreats,
    missionsCount: missions.length,
  };
}

function buildFinalSvg(
  placed: PlacedModule[],
  threats: Threat[],
  integrity: number,
  score: number,
  resolved: number,
  missed: number,
) {
  const w = 900;
  const h = 540;
  const bgTop = "#8bfeba";
  const bgBottom = "#f8f698";
  const base = "#2a0a5e";

  const header = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bgTop}"/>
      <stop offset="1" stop-color="${bgBottom}"/>
    </linearGradient>
  </defs>`;

  const modules = placed
    .map((m) => {
      const x = Math.round(m.x * w);
      const y = Math.round(m.y * h);
      const fill =
        m.kind === "scanner"
          ? "#ffa4f0"
          : m.kind === "shield"
            ? "#00d287"
            : m.kind === "neutralizer"
              ? base
              : "#ffffff";
      const stroke = base;
      const label = m.kind.toUpperCase().slice(0, 4);
      return `<g>
        <rect x="${x - 26}" y="${y - 26}" width="52" height="52" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
        <text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Space Grotesk, Arial" font-size="12" font-weight="800" fill="${base}" letter-spacing="2">${label}</text>
      </g>`;
    })
    .join("\n");

  const stats = `<g font-family="Inter, Arial" font-size="14" fill="${base}">
    <text x="22" y="28">INTEGRITY: ${integrity.toFixed(1)}%</text>
    <text x="22" y="50">SCORE: ${score}</text>
    <text x="22" y="72">RESOLVED: ${resolved}</text>
    <text x="22" y="94">MISSED: ${missed}</text>
  </g>`;

  const threatDots = threats
    .filter((t) => t.resolvedAt)
    .slice(-60)
    .map((t) => {
      const x = Math.round(t.x * w);
      const y = Math.round(t.y * h);
      const c = t.resolvedBy === "timeout" ? "#e87bcf" : "#00d287";
      return `<circle cx="${x}" cy="${y}" r="4" fill="${c}" opacity="0.55"/>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${header}
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect x="14" y="14" width="${w - 28}" height="${h - 28}" rx="22" fill="rgba(255,255,255,0.42)" stroke="${base}" stroke-width="3"/>
  ${stats}
  ${threatDots}
  ${modules}
</svg>`;
}

function clamp01(x: number) {
  if (Number.isNaN(x) || !Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}
