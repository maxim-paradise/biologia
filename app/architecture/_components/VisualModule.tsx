"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { DataLayer, TimeRange } from "./types";
import { getLayerLabel } from "./utils";
import GlobeCanvas from "./GlobeCanvas";

export default function VisualModule(props: {
  activeLayer: DataLayer;
  timeRange: TimeRange;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const { activeLayer, timeRange, canvasRef } = props;
  const [vmIndex, setVmIndex] = useState(0);
  const vmTimerRef = useRef<number | null>(null);

  const layerLabel = getLayerLabel(activeLayer);

  const vmGoTo = useCallback((idx: number) => {
    setVmIndex((prev) => {
      const next = ((idx % 2) + 2) % 2;
      if (prev === next) return prev;
      return next;
    });
  }, []);

  const resetVmTimer = useCallback(() => {
    if (vmTimerRef.current) window.clearInterval(vmTimerRef.current);
    vmTimerRef.current = window.setInterval(() => {
      setVmIndex((i) => (i + 1) % 2);
    }, 7000);
  }, []);

  useEffect(() => {
    resetVmTimer();
    return () => {
      if (vmTimerRef.current) window.clearInterval(vmTimerRef.current);
      vmTimerRef.current = null;
    };
  }, [resetVmTimer]);

  return (
    <article
      className="card visual-module"
      onMouseEnter={() => {
        if (vmTimerRef.current) window.clearInterval(vmTimerRef.current);
        vmTimerRef.current = null;
      }}
      onMouseLeave={() => {
        resetVmTimer();
      }}
    >
      <div
        className={`vm-slide${vmIndex === 0 ? " vm-slide-active" : ""}`}
        style={{
          background:
            "radial-gradient(120% 120% at 30% 20%, rgba(230,126,34,0.14) 0%, rgba(253,242,233,0.98) 48%, rgba(255,255,255,1) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GlobeCanvas canvasRef={canvasRef} timeRange={timeRange} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(100% 90% at 50% 50%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.85) 100%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "absolute", top: 20, left: 24, zIndex: 4 }}>
          <span className="label" style={{ color: "var(--text-secondary)" }}>
            Сектор
          </span>
        </div>

        <div style={{ position: "absolute", bottom: 20, left: 24, zIndex: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--accent-green)",
                boxShadow: "0 0 10px var(--accent-green)",
                animation: "locPulse 2s infinite",
              }}
            />
            <span
              style={{
                color: "var(--text-primary)",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Геопанорама: {layerLabel}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              borderTop: "1px solid var(--border-color)",
              paddingTop: 10,
            }}
          >
            <span className="mono" style={{ color: "var(--text-tertiary)", fontSize: 10 }}>
              SIG: {activeLayer.toUpperCase()}
            </span>
            <span className="mono" style={{ color: "var(--text-tertiary)", fontSize: 10 }}>
              RANGE: {timeRange.toUpperCase()}
            </span>
            <span className="mono" style={{ color: "var(--text-tertiary)", fontSize: 10 }}>
              UTC
            </span>
          </div>
        </div>
      </div>

      <div className={`vm-slide${vmIndex === 1 ? " vm-slide-active" : ""}`} style={{ background: "var(--bg-card)" }}>
        <div
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div>
            <span className="label" style={{ color: "var(--text-secondary)", zIndex: 3 }}>
              Канали даних
            </span>
            <div className="hint">Стисла карта доступних продуктів для шару {layerLabel}.</div>
          </div>
          <div className="hobby-grid">
            <div className="hobby-chip">
              <div className="hobby-chip-label">Атмосфера</div>
              <div className="hobby-chip-sub">AOD / CO₂ / Хмари</div>
            </div>
            <div className="hobby-chip">
              <div className="hobby-chip-label">Океан</div>
              <div className="hobby-chip-sub">SST / Колір / Рівень</div>
            </div>
            <div className="hobby-chip">
              <div className="hobby-chip-label">Лід</div>
              <div className="hobby-chip-sub">Площа / Товщина</div>
            </div>
            <div className="hobby-chip">
              <div className="hobby-chip-label">Біосфера</div>
              <div className="hobby-chip-sub">NDVI / Біомаса</div>
            </div>
          </div>
        </div>
      </div>

      <div className="vm-nav">
        <div className={`vm-dot${vmIndex === 0 ? " vm-dot-active" : ""}`} onClick={() => vmGoTo(0)} />
        <div className={`vm-dot${vmIndex === 1 ? " vm-dot-active" : ""}`} onClick={() => vmGoTo(1)} />
      </div>
    </article>
  );
}
