"use client";

import React, { useEffect, useState } from "react";

export type ApodData = {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
};

export default function ApodCard(props: {
  status: "idle" | "loading" | "ok" | "error";
  data: ApodData | null;
  onRefresh: () => void;
}) {
  const { status, data, onRefresh } = props;

  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [data?.url]);

  return (
    <article className="card" style={{ gridColumn: "span 1" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <span className="label">NASA APOD</span>
        <button type="button" className="mc-pill" onClick={onRefresh}>
          Оновити
        </button>
      </div>

      {status === "loading" ? (
        <div className="mono" style={{ marginTop: -4 }}>
          Статус: завантаження
        </div>
      ) : null}

      {data ? (
        <>
          <div style={{ marginTop: 12, borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-color)" }}>
            {data.media_type === "image" ? (
              imgFailed ? (
                <div
                  style={{
                    height: 140,
                    background: "linear-gradient(135deg, var(--bg-card-hover) 0%, var(--accent-green-dim) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 12,
                    textAlign: "center",
                  }}
                >
                  <div className="mono" style={{ color: "var(--text-primary)" }}>
                    Зображення недоступне
                  </div>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.url}
                  alt={data.title}
                  onError={() => setImgFailed(true)}
                  style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
                />
              )
            ) : (
              <div
                style={{
                  height: 140,
                  background: "var(--bg-card-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 12,
                  textAlign: "center",
                }}
              >
                <a className="mono" href={data.url} target="_blank" rel="noreferrer" style={{ color: "var(--text-primary)" }}>
                  Відео дня (відкрити)
                </a>
              </div>
            )}
          </div>

          <div style={{ marginTop: 12, fontWeight: 600, letterSpacing: "-0.01em" }}>{data.title}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 4 }}>
            {data.date}
            {data.copyright ? ` • © ${data.copyright}` : ""}
          </div>
          <div className="hint" style={{ marginTop: 10 }}>
            {data.explanation.length > 160 ? `${data.explanation.slice(0, 160)}…` : data.explanation}
          </div>

          <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <a
              className="mono"
              href={data.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              Відкрити оригінал →
            </a>
            {status === "error" ? <div className="hint">Fallback дані</div> : null}
          </div>
        </>
      ) : (
        <div className="hint" style={{ marginTop: 12 }}>
          Немає даних.
        </div>
      )}
    </article>
  );
}
