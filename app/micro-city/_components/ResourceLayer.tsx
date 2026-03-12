"use client";

import React, { useMemo } from "react";
import type { Resource } from "./types";

export default function ResourceLayer(props: {
  resources: Resource[];
  paused: boolean;
}) {
  const { resources, paused } = props;

  const alive = useMemo(
    () => resources.filter((r) => !r.collectedAt),
    [resources],
  );

  return (
    <>
      {alive.map((r) => (
        <div
          key={r.id}
          className="mc-resource"
          style={{
            left: `${r.x * 100}%`,
            top: `${r.y * 100}%`,
            transform: "translate(-50%, -50%)",
            opacity: paused ? 0.55 : 1,
          }}
        >
          <div className="ring" />
          <div className="dot" />
        </div>
      ))}
    </>
  );
}
