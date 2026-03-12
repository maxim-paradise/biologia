"use client";

import React from "react";
import type { DataLayer, TimeRange } from "./types";
import LayerControls from "./LayerControls";
import { getLayerLabel } from "./utils";

export default function MissionCard(props: {
  activeLayer: DataLayer;
  setActiveLayer: (layer: DataLayer) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}) {
  const { activeLayer, setActiveLayer, timeRange, setTimeRange } = props;
  const layerLabel = getLayerLabel(activeLayer);

  return (
    <article className="card bio-module">
      <div>
        <span className="label">Місія</span>
        <h1 className="display-text">
          Панель даних<br />про Землю
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginTop: 16,
            maxWidth: 400,
          }}
        >
          Візуальний прототип для інтерпретації супутникових спостережень: атмосфера, океан, лід і біосфера —
          в одному інтерфейсі.
        </p>

        <LayerControls
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </div>

      <div className="bio-stats" style={{ marginTop: 32 }}>
        <div className="stat-item">
          <strong>LEO</strong>
          <span>Орбіта</span>
        </div>
        <div className="stat-item">
          <strong>{layerLabel}</strong>
          <span>Шар</span>
        </div>
        <div className="stat-item">
          <strong>{timeRange.toUpperCase()}</strong>
          <span>Вікно</span>
        </div>
      </div>
    </article>
  );
}
