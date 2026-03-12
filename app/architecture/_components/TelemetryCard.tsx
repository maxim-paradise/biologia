"use client";

import React, { useMemo } from "react";
import type { DataLayer, TimeRange } from "./types";

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function makeSeries(seed: number, n: number) {
  const out: number[] = [];
  let v = seed;
  for (let i = 0; i < n; i++) {
    const drift = Math.sin((i + 1) * 0.9 + seed * 3) * 0.06;
    const noise = (Math.sin((i + 1) * 2.1 + seed * 7) + Math.cos((i + 1) * 1.7 + seed * 11)) * 0.03;
    v = clamp01(v + drift + noise);
    out.push(v);
  }
  return out;
}

function layerSeed(layer: DataLayer) {
  if (layer === "atmosphere") return 0.42;
  if (layer === "ocean") return 0.58;
  if (layer === "ice") return 0.31;
  return 0.67;
}

function rangeLen(range: TimeRange) {
  if (range === "24h") return 18;
  if (range === "7d") return 24;
  return 30;
}

export default function TelemetryCard(props: { layer: DataLayer; timeRange: TimeRange }) {
  const { layer, timeRange } = props;

  const series = useMemo(() => {
    const len = rangeLen(timeRange);
    const s = layerSeed(layer);
    return makeSeries(s, len);
  }, [layer, timeRange]);

  const metricLabel = useMemo(() => {
    if (layer === "atmosphere") return "AOD / CO₂ proxy";
    if (layer === "ocean") return "SST proxy";
    if (layer === "ice") return "Ice extent proxy";
    return "NDVI proxy";
  }, [layer]);

  const last = series[series.length - 1] ?? 0;
  const avg = series.reduce((a, b) => a + b, 0) / Math.max(1, series.length);

  const W = 280;
  const H = 86;
  const pad = 6;

  const d = useMemo(() => {
    if (!series.length) return "";
    const xs = series.map((_, i) => pad + (i / Math.max(1, series.length - 1)) * (W - pad * 2));
    const ys = series.map((v) => pad + (1 - v) * (H - pad * 2));
    let path = `M ${xs[0].toFixed(2)} ${ys[0].toFixed(2)}`;
    for (let i = 1; i < xs.length; i++) {
      path += ` L ${xs[i].toFixed(2)} ${ys[i].toFixed(2)}`;
    }
    return path;
  }, [series]);

  return (
    <article className="card" style={{ gridColumn: "span 1" }}>
      <span className="label">Телеметрія</span>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: -6 }}>
        <div style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>{metricLabel}</div>
        <div className="mono">RANGE: {timeRange.toUpperCase()}</div>
      </div>

      <div style={{ marginTop: 12, border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", background: "var(--bg-card-hover)" }}>
          <defs>
            <linearGradient id="telemetryGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="var(--accent-green)" stopOpacity="0.25" />
              <stop offset="1" stopColor="var(--accent-green)" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          <path d={d} fill="none" stroke="url(#telemetryGrad)" strokeWidth="2" />
          <path
            d={`${d} L ${W - pad} ${H - pad} L ${pad} ${H - pad} Z`}
            fill="var(--accent-green-dim)"
            opacity="0.7"
          />
        </svg>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
            Поточне
          </div>
          <div style={{ fontWeight: 700 }}>{Math.round(last * 100)}%</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
            Середнє
          </div>
          <div style={{ fontWeight: 700 }}>{Math.round(avg * 100)}%</div>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
            Індекс
          </div>
          <div style={{ fontWeight: 700, color: "var(--accent-green)" }}>{layer.toUpperCase()}</div>
        </div>
      </div>

      <div className="hint" style={{ marginTop: 10 }}>
        Демо-ряд для візуального відчуття динаміки. (Потім можна під’єднати NASA POWER/NEO тощо.)
      </div>
    </article>
  );
}
