"use client";

import React from "react";
import type { ThemeMode } from "./types";

export default function FooterBar(props: { theme: ThemeMode; setTheme: (t: ThemeMode) => void }) {
  const { theme, setTheme } = props;

  return (
    <div className="settings-module">
      <span className="mono">© 2026 Орбітальна панель. Демонстраційний прототип.</span>
      <div
        className="toggle-switch"
        onClick={() => {
          setTheme(theme === "dark" ? "light" : "dark");
        }}
      >
        <div className={`toggle-option${theme === "dark" ? " active" : ""}`}>НІЧ</div>
        <div className={`toggle-option${theme === "light" ? " active" : ""}`}>ДЕНЬ</div>
      </div>
    </div>
  );
}
