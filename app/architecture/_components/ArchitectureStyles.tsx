"use client";

import React from "react";

export default function ArchitectureStyles() {
  return (
    <style jsx global>{`
      :root {
        --bg-body: #fdf2e9;
        --bg-card: #ffffff;
        --bg-card-hover: rgba(230, 126, 34, 0.05);
        --border-color: rgba(74, 44, 42, 0.18);
        --border-active: rgba(74, 44, 42, 0.35);
        --text-primary: #4a2c2a;
        --text-secondary: rgba(74, 44, 42, 0.7);
        --text-tertiary: rgba(74, 44, 42, 0.45);
        --accent-green: #e67e22;
        --accent-green-dim: rgba(230, 126, 34, 0.12);
        --accent-orange: #e67e22;
        --radius-sm: 2px;
        --radius-md: 4px;
        --radius-lg: 8px;
        --gap: 16px;
        --font-stack: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif;
      }

      [data-theme="dark"] {
        --bg-body: #050505;
        --bg-card: #0a0a0a;
        --bg-card-hover: #111111;
        --border-color: #222222;
        --border-active: #444444;
        --text-primary: #ffffff;
        --text-secondary: #888888;
        --text-tertiary: #444444;
        --accent-green: #00ff66;
        --accent-green-dim: rgba(0, 255, 102, 0.1);
      }

      .arch-page {
        background-color: var(--bg-body);
        color: var(--text-primary);
        font-family: var(--font-stack);
        font-size: 14px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px;
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      .arch-topbar {
        position: fixed;
        top: 18px;
        left: 18px;
        z-index: 50;
      }

      .arch-back {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 999px;
        border: 1px solid var(--border-color);
        background: var(--bg-card);
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 12px;
        transition: border-color 0.2s ease, color 0.2s ease;
      }

      .arch-back:hover {
        border-color: var(--border-active);
        color: var(--text-primary);
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto auto auto;
        gap: var(--gap);
        max-width: 1400px;
        width: 100%;
      }

      .card {
        background-color: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 24px;
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s ease, transform 0.3s ease;
        display: flex;
        flex-direction: column;
      }

      .card:hover {
        border-color: var(--border-active);
      }

      h1,
      h2,
      h3,
      h4 {
        font-weight: 600;
        letter-spacing: -0.02em;
        margin-bottom: 8px;
      }

      .label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--text-secondary);
        margin-bottom: 12px;
        display: block;
      }

      .display-text {
        font-size: 48px;
        line-height: 0.95;
        letter-spacing: -0.04em;
        background: linear-gradient(180deg, var(--text-primary) 0%, var(--text-secondary) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .mono {
        font-family: 'SF Mono', 'Fira Code', monospace;
        font-size: 12px;
        color: var(--text-secondary);
      }

      .bio-module {
        grid-column: span 2;
        grid-row: span 2;
        justify-content: space-between;
      }

      .bio-stats {
        display: flex;
        gap: 24px;
        border-top: 1px solid var(--border-color);
        padding-top: 24px;
        margin-top: auto;
      }

      .stat-item strong {
        display: block;
        font-size: 18px;
        color: var(--text-primary);
      }

      .stat-item span {
        font-size: 11px;
        color: var(--text-secondary);
      }

      .visual-module {
        grid-column: span 2;
        grid-row: span 2;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        padding: 0;
        overflow: hidden;
        position: relative;
        box-shadow: 0 18px 55px rgba(74, 44, 42, 0.08);
      }

      [data-theme="dark"] .visual-module {
        box-shadow: 0 18px 55px rgba(0, 0, 0, 0.5);
      }

      .vm-slide {
        display: none;
        flex-direction: column;
        height: 100%;
        animation: vmSlideIn 0.4s ease;
        flex: 1;
      }

      .vm-slide-active {
        display: flex;
      }

      @keyframes vmSlideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .vm-nav {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 6px;
        z-index: 10;
      }

      .vm-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(74, 44, 42, 0.25);
        cursor: pointer;
        transition: all 0.3s;
      }

      [data-theme="dark"] .vm-dot {
        background: rgba(255, 255, 255, 0.3);
      }

      .vm-dot-active {
        background: var(--accent-green);
        width: 16px;
        border-radius: 2px;
      }

      [data-theme="dark"] .vm-dot-active {
        background: rgba(255, 255, 255, 0.9);
      }

      .hobby-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        z-index: 3;
      }

      .hobby-chip {
        background: var(--bg-card-hover);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        transition: border-color 0.2s;
      }

      .hobby-chip:hover {
        border-color: var(--border-active);
      }

      .hobby-chip-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-primary);
        letter-spacing: -0.01em;
      }

      .hobby-chip-sub {
        font-size: 10px;
        color: var(--text-secondary);
        font-family: 'SF Mono', monospace;
      }

      .pill-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }

      .mc-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        background: var(--bg-card-hover);
        border-radius: 999px;
        color: var(--text-secondary);
        font-size: 11px;
        cursor: pointer;
        user-select: none;
        transition: border-color 0.2s ease, color 0.2s ease;
      }

      .mc-pill:hover {
        border-color: var(--border-active);
        color: var(--text-primary);
      }

      .mc-pill.active {
        border-color: var(--border-active);
        color: var(--text-primary);
      }

      .mini-select {
        padding: 8px 10px;
        border: 1px solid var(--border-color);
        background: var(--bg-card-hover);
        color: var(--text-secondary);
        border-radius: var(--radius-md);
        font-size: 11px;
        outline: none;
      }

      .mini-select:focus {
        border-color: var(--border-active);
        color: var(--text-primary);
      }

      .event-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 12px;
      }

      .event-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 12px;
        border: 1px solid var(--border-color);
        background: var(--bg-card-hover);
        border-radius: var(--radius-md);
        text-decoration: none;
        color: inherit;
        transition: border-color 0.2s ease;
      }

      .event-item:hover {
        border-color: var(--border-active);
      }

      .event-meta {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
      }

      .chip {
        font-size: 10px;
        padding: 3px 7px;
        border: 1px solid var(--border-color);
        border-radius: 999px;
        color: var(--text-secondary);
      }

      .hint {
        font-size: 10px;
        color: var(--text-tertiary);
        font-family: 'SF Mono', 'Fira Code', monospace;
        min-height: 12px;
      }

      .product-module {
        grid-column: span 1;
        padding: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .product-slider {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .product-image {
        width: 100%;
        height: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid var(--border-color);
        position: relative;
        flex-shrink: 0;
      }

      .product-image::after {
        content: '';
        position: absolute;
        width: 60px;
        height: 60px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
      }

      .product-details {
        padding: 14px 16px 10px;
        flex: 1;
      }

      .tag-group {
        display: flex;
        gap: 6px;
        margin-top: 8px;
        flex-wrap: wrap;
      }

      .tag {
        font-size: 10px;
        padding: 4px 8px;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
      }

      .product-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        border-top: 1px solid var(--border-color);
      }

      .product-dots {
        display: flex;
        gap: 5px;
        align-items: center;
      }

      .product-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--border-active);
        cursor: pointer;
        transition: all 0.2s;
      }

      .product-dot.active {
        background: var(--accent-green);
        width: 16px;
        border-radius: 2px;
      }

      .product-arrows {
        display: flex;
        gap: 4px;
      }

      .product-arrow {
        width: 22px;
        height: 22px;
        background: var(--bg-card-hover);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-secondary);
        transition: all 0.2s;
      }

      .product-arrow:hover {
        border-color: var(--border-active);
        color: var(--text-primary);
      }

      .product-counter {
        font-size: 10px;
        color: var(--text-tertiary);
        font-family: 'SF Mono', 'Fira Code', monospace;
      }

      .social-module {
        grid-column: span 1;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 8px;
        padding: 0;
        border: none;
        background: transparent;
      }

      .social-btn {
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        text-decoration: none;
        transition: all 0.2s;
        font-size: 12px;
        flex-direction: column;
        gap: 4px;
      }

      .social-btn:hover {
        background: var(--bg-card-hover);
        color: var(--text-primary);
        border-color: var(--text-tertiary);
      }

      .settings-module {
        grid-column: span 4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 0;
        background: transparent;
        border-top: 1px solid var(--border-color);
        border-radius: 0;
        margin-top: 24px;
      }

      .toggle-switch {
        display: flex;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        padding: 2px;
        cursor: pointer;
        user-select: none;
      }

      .toggle-option {
        padding: 6px 12px;
        font-size: 11px;
        color: var(--text-secondary);
        border-radius: var(--radius-sm);
        transition: all 0.2s;
      }

      .toggle-option.active {
        background: var(--text-primary);
        color: var(--bg-body);
      }

      @keyframes locPulse {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.4;
          transform: scale(1.6);
        }
      }

      @media (max-width: 1024px) {
        .grid-container {
          grid-template-columns: repeat(2, 1fr);
        }
        .bio-module {
          grid-column: span 2;
        }
        .visual-module {
          grid-column: span 2;
        }
        .settings-module {
          grid-column: span 2;
        }
      }

      @media (max-width: 600px) {
        .arch-page {
          padding: 16px;
        }
        .grid-container {
          display: flex;
          flex-direction: column;
        }
      }
    `}</style>
  );
}
