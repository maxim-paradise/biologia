"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { MissionStep } from "./types";
import type { MicroCitySnapshot } from "./useMicroCityGame";

export default function HUD(props: {
  snapshot: MicroCitySnapshot;
  mission: MissionStep;
  missionsCount: number;
  onStart: () => void;
  onReset: () => void;
  onPause: () => void;
  onNextMission: () => void;
  onDismissMessage: () => void;
}) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    snapshot,
    mission,
    missionsCount,
    onStart,
    onReset,
    onPause,
    onNextMission,
    onDismissMessage,
  } = props;

  const integrityStr = useMemo(() => snapshot.integrity.toFixed(1), [snapshot.integrity]);
  const defenseStr = useMemo(() => Math.round(snapshot.defense).toString(), [snapshot.defense]);

  const missionTitle =
    mission.id === "boot"
      ? t("mc_mission_1_title")
      : mission.id === "streak"
        ? t("mc_mission_2_title")
        : mission.id === "score"
          ? t("mc_mission_3_title")
          : mission.title;

  const missionDesc =
    mission.id === "boot"
      ? t("mc_mission_1_desc")
      : mission.id === "streak"
        ? t("mc_mission_2_desc")
        : mission.id === "score"
          ? t("mc_mission_3_desc")
          : mission.description;

  const canNext = snapshot.missionDone && snapshot.missionIndex < missionsCount - 1;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setCollapsed(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <>
      <div className="mc-hud">
        <div className="mc-panel">
          <div className="mc-row" style={{ marginBottom: 8 }}>
            <div className="mc-panel-title" style={{ marginBottom: 0 }}>
              {t("mc_system_hud")}
            </div>
            <button
              className="mc-btn"
              style={{ padding: "8px 10px", fontSize: 11 }}
              onClick={() => setCollapsed((p) => !p)}
            >
              {collapsed ? "+" : "–"}
            </button>
          </div>

          {!collapsed && (
            <>
              <div className="mc-row">
                <div style={{ fontWeight: 800 }}>{t("mc_integrity")}</div>
                <div
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  {integrityStr}%
                </div>
              </div>
              <div className="mc-progress" style={{ marginTop: 8 }}>
                <div style={{ width: `${snapshot.integrity}%` }} />
              </div>

              <div className="mc-row" style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 800 }}>{t("mc_defense")}</div>
                <div
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  {defenseStr}%
                </div>
              </div>
              <div className="mc-progress" style={{ marginTop: 8 }}>
                <div style={{ width: `${snapshot.defense}%` }} />
              </div>

              <div className="mc-row" style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 800 }}>{t("mc_threat")}</div>
                <div
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  {snapshot.threatLevel}
                </div>
              </div>

              <div className="mc-row" style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 800 }}>{t("mc_score")}</div>
                <div
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  {snapshot.score}
                </div>
              </div>

              <div className="mc-row" style={{ marginTop: 6 }}>
                <div style={{ opacity: 0.85, fontWeight: 800 }}>
                  {t("mc_credits")}
                </div>
                <div
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  {snapshot.credits.toFixed(1)}
                </div>
              </div>

              <div className="mc-row" style={{ marginTop: 6 }}>
                <div style={{ opacity: 0.85, fontWeight: 800 }}>
                  {t("mc_streak")}
                </div>
                <div
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  {snapshot.streak}
                </div>
              </div>

              <div className="mc-row" style={{ marginTop: 6 }}>
                <div style={{ opacity: 0.85, fontWeight: 800 }}>
                  {t("mc_resolved")}
                </div>
                <div
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  {snapshot.resolved}
                </div>
              </div>

              <div className="mc-row" style={{ marginTop: 6 }}>
                <div style={{ opacity: 0.85, fontWeight: 800 }}>
                  {t("mc_missed")}
                </div>
                <div
                  style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
                >
                  {snapshot.missed}
                </div>
              </div>

              <div className="mc-btn-row">
                {!snapshot.running ? (
                  <button className="mc-btn primary" onClick={onStart}>
                    {t("mc_start")}
                  </button>
                ) : (
                  <button className="mc-btn" onClick={onPause}>
                    {snapshot.paused ? t("mc_resume") : t("mc_pause")}
                  </button>
                )}

                <button className="mc-btn danger" onClick={onReset}>
                  {t("mc_restart")}
                </button>

                {canNext && (
                  <button className="mc-btn primary" onClick={onNextMission}>
                    {t("mc_next")}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {!collapsed && (
          <div className="mc-panel">
            <div className="mc-panel-title">
              {t("mc_mission")} {snapshot.missionIndex + 1}/{missionsCount}
            </div>
            <div
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14 }}
            >
              {missionTitle}
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 6, lineHeight: 1.4 }}>
              {missionDesc}
            </div>
            <div style={{ marginTop: 10, fontSize: 12, fontWeight: 800 }}>
              {t("mc_status")}: {snapshot.missionDone ? t("mc_complete") : t("mc_in_progress")}
            </div>
          </div>
        )}
      </div>

      {snapshot.message && (
        <div className="mc-toast">
          <div className="mc-panel">
            <div className="mc-panel-title">{t("mc_operator_message")}</div>
            <div style={{ fontSize: 13, lineHeight: 1.45, fontWeight: 700 }}>
              {snapshot.message}
            </div>
            <div className="mc-btn-row">
              <button className="mc-btn" onClick={onDismissMessage}>
                {t("mc_ok")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
