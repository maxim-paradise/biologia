"use client";

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Threat } from "./types";

export default function ThreatLayer(props: {
  threats: Threat[];
  paused: boolean;
}) {
  const { t: tr } = useTranslation();
  const { threats, paused } = props;

  const alive = useMemo(() => threats.filter((t) => !t.resolvedAt), [threats]);

  return (
    <>
      {alive.map((th) => (
        <div
          key={th.id}
          className="mc-threat"
          style={{
            left: `${th.x * 100}%`,
            top: `${th.y * 100}%`,
            transform: "translate(-50%, -50%)",
            opacity: paused ? 0.6 : 1,
          }}
          title={
            th.type === "virus"
              ? tr("mc_legend_pathogen")
              : tr("mc_toxic_spill")
          }
        >
          <div className="core" />
        </div>
      ))}
    </>
  );
}
