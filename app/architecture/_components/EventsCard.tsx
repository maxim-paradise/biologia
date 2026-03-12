"use client";

import React, { useMemo, useState } from "react";
import type { EonetEvent } from "./types";

export default function EventsCard(props: {
  status: "idle" | "loading" | "ok" | "error";
  events: EonetEvent[];
}) {
  const { status, events } = props;

  const [limit, setLimit] = useState(3);
  const visible = useMemo(() => events.slice(0, limit), [events, limit]);
  const canLoadMore = events.length > visible.length;

  return (
    <article className="card" style={{ gridColumn: "span 1" }}>
      <span className="label">Події (NASA EONET)</span>
      <div className="mono" style={{ marginTop: -4 }}>
        Статус: {status === "loading" ? "завантаження" : status === "ok" ? "онлайн" : "fallback"}
      </div>
      <div className="event-list">
        {visible.map((ev) => {
          const href = ev.link ?? "https://eonet.gsfc.nasa.gov/";
          const dt = ev.geometryDate ?? ev.updatedAt;
          return (
            <a key={ev.id} className="event-item" href={href} target="_blank" rel="noreferrer">
              <div style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>{ev.title}</div>
              <div className="event-meta">
                {ev.categories.slice(0, 2).map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
                {dt && (
                  <span className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
                    {new Date(dt).toLocaleString()}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <div className="hint">
          Показано: {visible.length}/{events.length}
        </div>
        <button
          type="button"
          className="mc-pill"
          onClick={() => setLimit((l) => l + 3)}
          disabled={!canLoadMore}
          style={{ opacity: canLoadMore ? 1 : 0.5, cursor: canLoadMore ? "pointer" : "default" }}
        >
          Догрузити
        </button>
      </div>
    </article>
  );
}
