"use client";

import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

import HUD from "./_components/HUD";
import IsoCards from "./_components/IsoCards";
import IsometricScene from "./_components/IsometricScene";
import ModuleBank from "./_components/ModuleBank";
import PlacedModulesLayer from "./_components/PlacedModulesLayer";
import MicroCityStyles from "./_components/MicroCityStyles";
import ResourceLayer from "./_components/ResourceLayer";
import ThreatLayer from "./_components/ThreatLayer";
import { useMicroCityGame } from "./_components/useMicroCityGame";

export default function MicroCityPage() {
  const { t } = useTranslation();
  const stageRef = useRef<HTMLDivElement>(null);

  const {
    snapshot,
    currentMission,
    missionsCount,
    start,
    reset,
    togglePause,
    resolveThreat,
    resolveThreatAt,
    placeModule,
    removeModule,
    acknowledgeMission,
    clearFinal,
    advanceMission,
    scanPulse,
    boostShield,
    purgeThreats,
  } = useMicroCityGame();

  const onCardAction = useCallback(
    (action: "scan" | "shield" | "colony") => {
      if (!snapshot.running || snapshot.paused) return;
      if (action === "scan") scanPulse();
      if (action === "shield") boostShield();
      if (action === "colony") purgeThreats();
    },
    [boostShield, purgeThreats, scanPulse, snapshot.paused, snapshot.running],
  );

  const sweepAt = useCallback(
    (clientX: number, clientY: number) => {
      if (snapshot.paused) return;
      const el = stageRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = (clientX - r.left) / r.width;
      const ny = (clientY - r.top) / r.height;
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return;
      resolveThreatAt(nx, ny);
    },
    [resolveThreatAt, snapshot.paused, snapshot.running],
  );

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <MicroCityStyles />

      <div className="micro-city-body" onClick={() => snapshot.running && !snapshot.paused && acknowledgeMission()}>
        <header className="mc-top-nav">
          <div className="mc-logo">
            <div className="mc-logo-mark" />
            {t("landing_card_micro_city_title")}
          </div>

          <a href="/" className="mc-pill" style={{ textDecoration: "none" }}>
            {t("nav_back_home")}
          </a>

          <div className="mc-status-row">
            <div className="mc-pill">
              <div className="dot green" />
              {snapshot.running ? t("mc_online") : t("mc_idle")}
              {t("mc_defense")}: {snapshot.defense >= 45 ? t("mc_defense_active") : t("mc_defense_weak")}
            </div>
            <div className="mc-pill">
              <div className="dot" />
              {t("mc_threat")}: {snapshot.threatLevel}
            </div>
          </div>
        </header>

        <HUD
          snapshot={snapshot}
          mission={currentMission}
          missionsCount={missionsCount}
          onStart={start}
          onReset={reset}
          onPause={togglePause}
          onNextMission={advanceMission}
          onDismissMessage={acknowledgeMission}
        />

        <main
          className="mc-stage"
          ref={stageRef}
          onPointerDown={(e) => {
            sweepAt(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 0) return;
            sweepAt(e.clientX, e.clientY);
          }}
          onTouchMove={(e) => {
            const touch = e.touches.item(0);
            if (!touch) return;
            sweepAt(touch.clientX, touch.clientY);
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (snapshot.paused) return;
            const data = e.dataTransfer.getData("text/plain");
            if (!data.startsWith("module:")) return;
            const kind = data.replace("module:", "");
            if (
              kind !== "scanner" &&
              kind !== "shield" &&
              kind !== "neutralizer" &&
              kind !== "colony"
            )
              return;
            const el = stageRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width;
            const ny = (e.clientY - r.top) / r.height;
            placeModule(kind, Math.min(1, Math.max(0, nx)), Math.min(1, Math.max(0, ny)));
          }}
        >
          <IsometricScene />

          <IsoCards onCardAction={onCardAction} />

          <PlacedModulesLayer
            placed={snapshot.placedModules}
            disabled={snapshot.paused}
            onRemove={removeModule}
          />

          <ResourceLayer resources={snapshot.resources} paused={snapshot.paused} />

          <ThreatLayer
            threats={snapshot.threats}
            paused={!snapshot.running || snapshot.paused}
          />
        </main>

        <ModuleBank
          unlocked={snapshot.unlockedModules}
          placed={snapshot.placedModules}
          credits={snapshot.credits}
          disabled={snapshot.paused}
        />

        <footer className="mc-bottom">
          <div className="mc-legend">
            <div className="mc-legend-item">
              <div className="mc-swatch macrophage" />
              {t("mc_legend_macrophage")}
            </div>
            <div className="mc-legend-item">
              <div className="mc-swatch bacteria" />
              {t("mc_legend_flora")}
            </div>
            <div className="mc-legend-item">
              <div className="mc-swatch virus" />
              {t("mc_legend_pathogen")}
            </div>
          </div>

          <div className="mc-metrics">
            <div className="mc-metric-label">{t("mc_integrity")}</div>
            <div className="mc-metric-value">{snapshot.integrity.toFixed(1)}%</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
