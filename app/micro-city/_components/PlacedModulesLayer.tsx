"use client";

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ModuleKind, PlacedModule } from "./types";

function kindColor(kind: ModuleKind) {
  if (kind === "scanner") return "#ffa4f0";
  if (kind === "shield") return "#00d287";
  if (kind === "neutralizer") return "#2a0a5e";
  return "#f8f698";
}

export default function PlacedModulesLayer(props: {
  placed: PlacedModule[];
  disabled: boolean;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslation();
  const { placed, disabled, onRemove } = props;

  const nodes = useMemo(() => placed, [placed]);

  return (
    <>
      {nodes.map((m) => (
        <div
          key={m.id}
          className="mc-module-node"
          style={{
            left: `${m.x * 100}%`,
            top: `${m.y * 100}%`,
            transform: "translate(-50%, -50%)",
            opacity: disabled ? 0.65 : 1,
            background: kindColor(m.kind),
          }}
          title={t(`mc_mod_${m.kind}_title`)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            onRemove(m.id);
          }}
        >
          <div className="mc-module-node-label">{t(`mc_mod_${m.kind}_short`)}</div>
        </div>
      ))}
    </>
  );
}
