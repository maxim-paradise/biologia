"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function FinalScreen(props: {
  open: boolean;
  svgMarkup: string;
  score: number;
  resolved: number;
  missed: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { open, svgMarkup, score, resolved, missed, onClose } = props;

  if (!open) return null;

  const download = () => {
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "micro-city-final.svg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mc-final-overlay" role="dialog" aria-modal>
      <div className="mc-final-card">
        <div className="mc-final-head">
          <div>
            <div className="mc-panel-title" style={{ marginBottom: 6 }}>
              {t("mc_final_title")}
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, fontWeight: 700 }}>
              {t("mc_final_sub")}
            </div>
          </div>
          <button className="mc-btn" onClick={onClose}>
            {t("mc_close")}
          </button>
        </div>

        <div className="mc-final-meta">
          <div>
            <strong>{t("mc_score")}</strong>: {score}
          </div>
          <div>
            <strong>{t("mc_resolved")}</strong>: {resolved}
          </div>
          <div>
            <strong>{t("mc_missed")}</strong>: {missed}
          </div>
        </div>

        <div
          className="mc-final-preview"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />

        <div className="mc-btn-row" style={{ justifyContent: "flex-end" }}>
          <button className="mc-btn primary" onClick={download}>
            {t("mc_download_svg")}
          </button>
        </div>

        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 8 }}>
          {t("mc_final_hint")}
        </div>
      </div>
    </div>
  );
}
