"use client";

import React from "react";
import type { DataLayer, TimeRange } from "./types";

export default function MetricsCard(props: {
  timeRange: TimeRange;
  exportHint: string;
  onExport: () => void;
  layer: DataLayer;
}) {
  const { timeRange, exportHint, onExport } = props;

  return (
    <article className="card" style={{ gridColumn: "span 1" }}>
      <span className="label">Метрики</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontWeight: 600 }}>Стан каналу</div>
          <div className="mono" style={{ color: "var(--accent-green)" }}>
            STABLE
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontWeight: 600 }}>Частота зрізу</div>
          <div className="mono">{timeRange === "24h" ? "15m" : timeRange === "7d" ? "3h" : "1d"}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div style={{ fontWeight: 600 }}>Джерело</div>
          <div className="mono">NASA / EONET</div>
        </div>
        <div className="hint">Порада: обери шар і діапазон — інтенсивність на глобусі зміниться.</div>

        <button type="button" className="mc-pill" onClick={onExport} style={{ alignSelf: "flex-start" }}>
          Експорт PNG (глобус)
        </button>
        <div className="hint">{exportHint}</div>
      </div>
    </article>
  );
}
