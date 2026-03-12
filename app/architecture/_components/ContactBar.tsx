"use client";

import React, { useCallback } from "react";

export default function ContactBar() {
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
  }, []);

  return (
    <div
      style={{
        gridColumn: "span 4",
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 32,
      }}
    >
      <span className="label" style={{ margin: 0, whiteSpace: "nowrap" }}>
        Канали зв’язку
      </span>
      <div
        style={{
          flex: 1,
          height: 1,
          background: "var(--border-color)",
          marginLeft: 16,
          marginRight: 16,
        }}
      />
      <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
        <button
          type="button"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            cursor: "pointer",
            position: "relative",
            background: "transparent",
            border: "none",
            padding: 0,
            color: "inherit",
            textAlign: "left",
          }}
          onClick={() => copy("19129516960")}
        >
          <span
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-tertiary)",
            }}
          >
            Чергова лінія
          </span>
          <span className="mono" style={{ color: "var(--text-primary)", fontSize: 13 }}>
            19129516960
          </span>
        </button>
        <div style={{ width: 1, height: 32, background: "var(--border-color)" }} />
        <button
          type="button"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            cursor: "pointer",
            position: "relative",
            background: "transparent",
            border: "none",
            padding: 0,
            color: "inherit",
            textAlign: "left",
          }}
          onClick={() => copy("yeung-wat")}
        >
          <span
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-tertiary)",
            }}
          >
            Пейджер
          </span>
          <span className="mono" style={{ color: "var(--text-primary)", fontSize: 13 }}>
            yeung-wat
          </span>
        </button>
        <div style={{ width: 1, height: 32, background: "var(--border-color)" }} />
        <button
          type="button"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            cursor: "pointer",
            position: "relative",
            background: "transparent",
            border: "none",
            padding: 0,
            color: "inherit",
            textAlign: "left",
          }}
          onClick={() => copy("qu1091962215@gmail.com")}
        >
          <span
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-tertiary)",
            }}
          >
            Пошта
          </span>
          <span className="mono" style={{ color: "var(--accent-green)", fontSize: 13 }}>
            qu1091962215@gmail.com
          </span>
        </button>
      </div>
    </div>
  );
}
