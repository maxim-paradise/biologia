"use client";

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ModuleKind, PlacedModule } from "./types";

export default function ModuleBank(props: {
  unlocked: ModuleKind[];
  placed: PlacedModule[];
  credits?: number;
  disabled: boolean;
}) {
  const { t } = useTranslation();
  const { unlocked, placed, disabled, credits = 0 } = props;

  const placedKinds = useMemo(() => new Set(placed.map((p) => p.kind)), [placed]);

  const items = useMemo(
    () =>
      unlocked.map((kind) => {
        const titleKey = `mc_mod_${kind}_title`;
        const descKey = `mc_mod_${kind}_desc`;
        return {
          kind,
          title: t(titleKey),
          desc: t(descKey),
          canPlace: !placedKinds.has(kind),
          cost:
            kind === "scanner"
              ? 10
              : kind === "shield"
                ? 12
                : kind === "neutralizer"
                  ? 18
                  : 22,
        };
      }),
    [placedKinds, t, unlocked],
  );

  return (
    <div className="mc-module-bank">
      <div className="mc-panel">
        <div className="mc-panel-title">{t("mc_modules")}</div>
        <div style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.4 }}>
          {t("mc_modules_hint")}
        </div>

        <div className="mc-mod-grid">
          {items.map((it) => (
            (() => {
              const affordable = credits >= it.cost;
              const canDrag = !disabled && it.canPlace && affordable;
              const opacity = disabled ? 0.6 : it.canPlace ? (affordable ? 1 : 0.55) : 0.55;
              return (
            <div
              key={it.kind}
              className="mc-mod-card"
              draggable={canDrag}
              aria-disabled={disabled || !it.canPlace || !affordable}
              style={{ opacity }}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", `module:${it.kind}`);
              }}
              title={
                !it.canPlace
                  ? t("mc_mod_already_placed")
                  : !affordable
                    ? t("mc_mod_need_credits")
                    : it.desc
              }
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                {it.title}
                <span style={{ opacity: 0.8, fontSize: 12 }}>${it.cost}</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 6, lineHeight: 1.35 }}>
                {it.desc}
              </div>
            </div>
              );
            })()
          ))}
        </div>
      </div>
    </div>
  );
}
