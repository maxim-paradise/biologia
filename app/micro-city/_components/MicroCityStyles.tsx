"use client";

import React from "react";

export default function MicroCityStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

      :root {
        --bg-top: #8bfeba;
        --bg-bottom: #f8f698;
        --base-dark: #2a0a5e;
        --base-dark-alpha: rgba(42, 10, 94, 0.15);
        --accent-green: #00d287;
        --accent-green-dark: #00a86b;
        --accent-pink: #ffa4f0;
        --accent-pink-dark: #e87bcf;
        --ui-white: #ffffff;
        --ui-offwhite: #f3f0f7;
        --shadow-color: rgba(42, 10, 94, 0.9);
        --font-display: 'Space Grotesk', sans-serif;
        --font-ui: 'Inter', sans-serif;
        --grid-size: 40px;
        --radius-sm: 6px;
        --radius-md: 12px;
        --radius-lg: 20px;
      }

      .micro-city-body {
        background: linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%);
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        font-family: var(--font-ui);
        color: var(--base-dark);
        display: flex;
        flex-direction: column;
      }

      .mc-top-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 28px;
        position: relative;
        z-index: 120;
      }

      .mc-logo {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 18px;
        letter-spacing: -0.5px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .mc-logo-mark {
        width: 24px;
        height: 24px;
        background: var(--base-dark);
        border-radius: 6px;
        display: grid;
        place-items: center;
        box-shadow: 3px 3px 0px var(--base-dark);
      }

      .mc-logo-mark::after {
        content: '';
        width: 8px;
        height: 8px;
        background: var(--accent-green);
        border-radius: 50%;
      }

      .mc-status-row {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .mc-pill {
        background: var(--ui-white);
        border: 2px solid var(--base-dark);
        padding: 8px 14px;
        border-radius: 30px;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 3px 3px 0px var(--base-dark);
        user-select: none;
      }

      .mc-pill .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent-pink);
        animation: mc-pulse 2s infinite;
      }

      .mc-pill .dot.green {
        background: var(--accent-green);
      }

      .mc-stage {
        flex: 1;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .mc-isometric-svg {
        width: 100%;
        height: 100%;
        max-width: 1200px;
        max-height: 900px;
        filter: drop-shadow(0px 20px 40px rgba(42, 10, 94, 0.1));
      }

      .mc-floating-ui {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .mc-iso-card {
        position: absolute;
        background: var(--ui-white);
        border: 2px solid var(--base-dark);
        border-radius: var(--radius-md);
        padding: 12px;
        display: flex;
        gap: 12px;
        box-shadow: 6px 6px 0px var(--base-dark);
        pointer-events: auto;
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s;
        animation: mc-float-card 6s ease-in-out infinite;
        width: max-content;
        user-select: none;
      }

      .mc-iso-card:hover {
        transform: translateY(-5px) scale(1.02);
      }

      .mc-card-icon {
        width: 40px;
        height: 40px;
        background: var(--base-dark);
        border-radius: var(--radius-sm);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .mc-card-data {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
        min-width: 140px;
      }

      .mc-data-line {
        height: 6px;
        border-radius: 3px;
        background: var(--ui-offwhite);
        width: 100%;
      }

      .mc-data-line.pink {
        background: var(--accent-pink);
        width: 80%;
      }

      .mc-data-line.green {
        background: var(--accent-green);
        width: 60%;
      }

      .mc-data-line.dark {
        background: var(--base-dark);
        width: 40%;
      }

      .mc-card-label {
        font-family: var(--font-display);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: var(--base-dark);
        margin-bottom: 2px;
      }

      .mc-card-1 {
        top: 18%;
        left: 55%;
        animation-delay: 0s;
      }

      .mc-card-2 {
        top: 34%;
        left: 66%;
        animation-delay: -2s;
      }

      .mc-card-3 {
        top: 62%;
        left: 13%;
        animation-delay: -4s;
      }

      .mc-bottom {
        padding: 24px 28px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        z-index: 120;
        gap: 16px;
      }

      .mc-legend {
        display: flex;
        gap: 16px;
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(10px);
        padding: 14px 18px;
        border-radius: var(--radius-lg);
        border: 2px solid var(--base-dark);
        box-shadow: 4px 4px 0px var(--base-dark);
      }

      .mc-legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 700;
      }

      .mc-swatch {
        width: 14px;
        height: 14px;
        border-radius: 4px;
        border: 2px solid var(--base-dark);
      }

      .mc-swatch.macrophage {
        background: var(--ui-white);
      }

      .mc-swatch.virus {
        background: var(--accent-pink);
      }

      .mc-swatch.bacteria {
        background: var(--accent-green);
      }

      .mc-metrics {
        text-align: right;
        font-family: var(--font-display);
      }

      .mc-metric-value {
        font-size: 42px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -2px;
        text-shadow: 2px 2px 0px var(--ui-white);
      }

      .mc-metric-label {
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1px;
        opacity: 0.85;
      }

      .mc-hud {
        position: fixed;
        top: 80px;
        left: 16px;
        z-index: 200;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: min(360px, calc(100vw - 32px));
        pointer-events: none;
      }

      .mc-panel {
        background: rgba(255, 255, 255, 0.9);
        border: 2px solid var(--base-dark);
        border-radius: 14px;
        box-shadow: 6px 6px 0px var(--base-dark);
        padding: 12px;
        pointer-events: auto;
      }

      .mc-panel-title {
        font-family: var(--font-display);
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-size: 11px;
        opacity: 0.8;
        margin-bottom: 8px;
      }

      .mc-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }

      .mc-progress {
        height: 10px;
        border: 2px solid var(--base-dark);
        border-radius: 999px;
        background: rgba(42, 10, 94, 0.06);
        overflow: hidden;
        box-shadow: 3px 3px 0px var(--base-dark);
      }

      .mc-progress > div {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-green), var(--accent-pink));
        width: 50%;
        transition: width 0.2s ease;
      }

      .mc-btn-row {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }

      .mc-btn {
        border: 2px solid var(--base-dark);
        background: var(--ui-white);
        color: var(--base-dark);
        border-radius: 12px;
        padding: 10px 12px;
        cursor: pointer;
        font-weight: 800;
        letter-spacing: 0.04em;
        font-size: 12px;
        box-shadow: 4px 4px 0px var(--base-dark);
        transition: transform 0.15s ease;
        user-select: none;
      }

      .mc-btn:active {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px var(--base-dark);
      }

      .mc-btn.primary {
        background: var(--base-dark);
        color: var(--ui-white);
      }

      .mc-btn.danger {
        background: var(--accent-pink);
      }

      .mc-threat {
        position: absolute;
        width: 44px;
        height: 44px;
        border-radius: 18px;
        border: 2px solid var(--base-dark);
        background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9), rgba(255, 164, 240, 0.8) 55%, rgba(42, 10, 94, 0.55));
        box-shadow: 8px 8px 0px var(--base-dark);
        display: grid;
        place-items: center;
        pointer-events: auto;
        cursor: crosshair;
        transition: transform 0.15s ease, opacity 0.2s ease;
      }

      .mc-threat:hover {
        transform: translateY(-3px) scale(1.05);
      }

      .mc-threat .core {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--base-dark);
        box-shadow: 0 0 0 6px rgba(255, 164, 240, 0.35);
      }

      .mc-threat.dead {
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
      }

      .mc-resource {
        position: absolute;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 90;
        filter: drop-shadow(0 10px 20px rgba(42, 10, 94, 0.18));
      }

      .mc-resource .ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 2px solid rgba(42, 10, 94, 0.85);
        background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.95), rgba(255, 164, 240, 0.35) 40%, rgba(0, 210, 135, 0.22) 70%, transparent 75%);
        animation: mc-resource-pulse 1.9s ease-in-out infinite;
      }

      .mc-resource .dot {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: var(--base-dark);
        box-shadow: 0 0 0 7px rgba(255, 246, 152, 0.25);
        opacity: 0.95;
      }

      @keyframes mc-resource-pulse {
        0%,
        100% {
          transform: scale(0.92);
          opacity: 0.85;
        }
        50% {
          transform: scale(1.08);
          opacity: 1;
        }
      }

      .mc-toast {
        position: fixed;
        right: 18px;
        top: 82px;
        z-index: 220;
        width: min(360px, calc(100vw - 36px));
        pointer-events: none;
      }

      .mc-toast .mc-panel {
        pointer-events: auto;
      }

      .mc-module-bank {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 210;
        width: min(360px, calc(100vw - 36px));
        pointer-events: none;
      }

      .mc-module-bank .mc-panel {
        pointer-events: auto;
      }

      .mc-mod-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        margin-top: 10px;
      }

      .mc-mod-card {
        border: 2px solid var(--base-dark);
        border-radius: 14px;
        padding: 12px;
        box-shadow: 4px 4px 0px var(--base-dark);
        background: rgba(255, 255, 255, 0.92);
        cursor: grab;
        user-select: none;
      }

      .mc-mod-card[aria-disabled="true"] {
        cursor: not-allowed;
      }

      .mc-module-node {
        position: absolute;
        width: 54px;
        height: 54px;
        border-radius: 18px;
        border: 2px solid var(--base-dark);
        box-shadow: 8px 8px 0px var(--base-dark);
        display: grid;
        place-items: center;
        pointer-events: auto;
        cursor: pointer;
      }

      .mc-module-node-label {
        font-family: var(--font-display);
        font-weight: 900;
        font-size: 12px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--base-dark);
      }

      .mc-final-overlay {
        position: fixed;
        inset: 0;
        background: rgba(42, 10, 94, 0.55);
        backdrop-filter: blur(10px);
        z-index: 1000;
        display: grid;
        place-items: center;
        padding: 18px;
      }

      .mc-final-card {
        width: min(820px, 100%);
        max-height: min(88vh, 920px);
        overflow: auto;
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid var(--base-dark);
        border-radius: 18px;
        box-shadow: 12px 12px 0px var(--base-dark);
        padding: 16px;
      }

      .mc-final-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }

      .mc-final-meta {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        margin-top: 10px;
        font-size: 13px;
      }

      .mc-final-preview {
        margin-top: 12px;
        border: 2px solid var(--base-dark);
        border-radius: 14px;
        background: white;
        padding: 10px;
        overflow: hidden;
      }

      @keyframes mc-pulse {
        0% {
          opacity: 0.5;
          transform: scale(0.85);
        }
        50% {
          opacity: 1;
          transform: scale(1.2);
        }
        100% {
          opacity: 0.5;
          transform: scale(0.85);
        }
      }

      @keyframes mc-float-card {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-12px);
        }
      }

      @media (max-width: 768px) {
        .mc-top-nav {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }
        .mc-bottom {
          flex-direction: column;
          align-items: stretch;
        }
        .mc-metrics {
          text-align: left;
        }
        .mc-card-1 {
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
        }
        .mc-card-2 {
          top: 75%;
          left: 50%;
          transform: translateX(-50%);
        }
        .mc-card-3 {
          display: none;
        }

        .mc-hud {
          top: 132px;
          left: 10px;
          width: calc(100vw - 20px);
        }

        .mc-panel {
          padding: 10px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(6px);
        }

        .mc-metric-value {
          font-size: 34px;
        }

        .mc-toast {
          right: 10px;
          top: auto;
          bottom: 70px;
          width: calc(100vw - 20px);
        }

        .mc-module-bank {
          right: 10px;
          bottom: 12px;
          width: calc(100vw - 20px);
        }

        .mc-mod-grid {
          grid-template-columns: 1fr;
        }

        .mc-bottom {
          padding: 16px 12px;
        }

        .mc-legend {
          flex-wrap: wrap;
          gap: 10px;
        }
      }
    `}</style>
  );
}
