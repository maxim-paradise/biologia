"use client";

import React from "react";
import type { DataLayer, TimeRange } from "./types";

export default function LayerControls(props: {
  activeLayer: DataLayer;
  setActiveLayer: (layer: DataLayer) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}) {
  const { activeLayer, setActiveLayer, timeRange, setTimeRange } = props;

  return (
    <div className="pill-row">
      <button
        type="button"
        className={`mc-pill${activeLayer === "atmosphere" ? " active" : ""}`}
        onClick={() => setActiveLayer("atmosphere")}
      >
        Атмосфера
      </button>
      <button
        type="button"
        className={`mc-pill${activeLayer === "ocean" ? " active" : ""}`}
        onClick={() => setActiveLayer("ocean")}
      >
        Океан
      </button>
      <button
        type="button"
        className={`mc-pill${activeLayer === "ice" ? " active" : ""}`}
        onClick={() => setActiveLayer("ice")}
      >
        Лід
      </button>
      <button
        type="button"
        className={`mc-pill${activeLayer === "biosphere" ? " active" : ""}`}
        onClick={() => setActiveLayer("biosphere")}
      >
        Біосфера
      </button>

      <select
        className="mini-select"
        value={timeRange}
        onChange={(e) => {
          const v = e.target.value as TimeRange;
          if (v === "24h" || v === "7d" || v === "30d") setTimeRange(v);
        }}
      >
        <option value="24h">Останні 24h</option>
        <option value="7d">Останні 7d</option>
        <option value="30d">Останні 30d</option>
      </select>
    </div>
  );
}
