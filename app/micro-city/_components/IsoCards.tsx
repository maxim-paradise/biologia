"use client";

import React from "react";

export default function IsoCards(props: {
  onCardAction: (action: "scan" | "shield" | "colony") => void;
}) {
  const { onCardAction } = props;

  return (
    <div className="mc-floating-ui">
      <div
        className="mc-iso-card mc-card-1"
        onClick={(e) => {
          e.stopPropagation();
          onCardAction("scan");
        }}
      >
        <div className="mc-card-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-pink)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5l-10 14M22 12H2M19 17L5 7" />
          </svg>
        </div>
        <div className="mc-card-data">
          <div className="mc-card-label">Threat.Scan</div>
          <div className="mc-data-line pink" />
          <div className="mc-data-line dark" />
        </div>
      </div>

      <div
        className="mc-iso-card mc-card-2"
        onClick={(e) => {
          e.stopPropagation();
          onCardAction("shield");
        }}
      >
        <div className="mc-card-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--ui-white)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="mc-card-data">
          <div className="mc-card-label">Defense.Shield</div>
          <div className="mc-data-line green" />
          <div className="mc-data-line pink" style={{ width: "40%" }} />
        </div>
      </div>

      <div
        className="mc-iso-card mc-card-3"
        onClick={(e) => {
          e.stopPropagation();
          onCardAction("colony");
        }}
      >
        <div className="mc-card-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-green)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <div className="mc-card-data">
          <div className="mc-card-label">Colony.Gen</div>
          <div className="mc-data-line dark" style={{ width: "70%" }} />
          <div className="mc-data-line green" />
        </div>
      </div>
    </div>
  );
}
