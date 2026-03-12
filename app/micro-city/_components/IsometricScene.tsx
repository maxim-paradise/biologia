"use client";

import React from "react";

export default function IsometricScene() {
  return (
    <svg
      className="mc-isometric-svg"
      viewBox="0 0 1000 800"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <filter id="iso-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="15"
            dy="15"
            stdDeviation="0"
            floodColor="#2a0a5e"
            floodOpacity="1"
          />
        </filter>
      </defs>

      <g transform="translate(500, 250)">
        <polygon
          points="0,420 -350,220 0,20 350,220"
          fill="#2a0a5e"
          opacity="0.1"
          transform="translate(0, 20)"
        />

        <polygon
          points="0,400 -400,200 0,0 400,200"
          fill="#2a0a5e"
          stroke="#1c073d"
          strokeWidth="4"
        />

        <path
          d="M -300,150 L 100,350 M -200,100 L 200,300 M -100,50 L 300,250 M -100,250 L 300,50 M -200,200 L 200,0 M -300,250 L 100,50"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
        />

        <g transform="translate(-150, 150)">
          <polygon points="0,60 -60,30 0,0 60,30" fill="#14042d" />
          <path d="M 0,50 L -50,25 L -50,-40 L 0,-15 Z" fill="#00a86b" />
          <path d="M 0,50 L 50,25 L 50,-40 L 0,-15 Z" fill="#007a4d" />
          <polygon points="0,-15 -50,-40 0,-65 50,-40" fill="#00d287" />

          <g transform="translate(0, -65)">
            <path d="M 0,20 L -30,5 L -30,-30 L 0,-15 Z" fill="#00a86b" />
            <path d="M 0,20 L 30,5 L 30,-30 L 0,-15 Z" fill="#007a4d" />
            <polygon points="0,-15 -30,-30 0,-45 30,-30" fill="#36f5b0" />
          </g>
        </g>

        <g transform="translate(-250, 200)">
          <polygon points="0,40 -40,20 0,0 40,20" fill="#14042d" />
          <path d="M 0,30 L -30,15 L -30,-20 L 0,-5 Z" fill="#00a86b" />
          <path d="M 0,30 L 30,15 L 30,-20 L 0,-5 Z" fill="#007a4d" />
          <polygon points="0,-5 -30,-20 0,-35 30,-20" fill="#00d287" />
        </g>

        <g transform="translate(50, 220)">
          <polygon points="0,100 -120,40 20,-30 140,30" fill="#14042d" />
          <path d="M 0,80 L -100,30 L -100,-40 L 0,10 Z" fill="#e2e8f0" />
          <path d="M 0,80 L 120,20 L 120,-50 L 0,10 Z" fill="#cbd5e1" />
          <polygon points="0,10 -100,-40 20,-100 120,-50" fill="#ffffff" />

          <g transform="translate(10, -50)">
            <path d="M 0,40 L -60,10 L -60,-40 L 0,-10 Z" fill="#e2e8f0" />
            <path d="M 0,40 L 70,5 L 70,-45 L 0,-10 Z" fill="#cbd5e1" />
            <polygon points="0,-10 -60,-40 10,-75 70,-45" fill="#f8fafc" />
            <polygon
              points="5,-30 -20,-42 5,-55 30,-42"
              fill="#00d287"
              opacity="0.8"
            />
          </g>
        </g>

        <g transform="translate(200, 50)">
          <polygon
            points="0,220 -40,200 0,180 40,200"
            fill="#14042d"
            opacity="0.6"
          />

          <g transform="translate(0, 0)">
            <path d="M 0,40 L -30,20 L -30,-20 L 0,0 Z" fill="#e87bcf" />
            <path d="M 0,40 L 30,20 L 30,-20 L 0,0 Z" fill="#c754ab" />
            <polygon points="0,0 -30,-20 0,-40 30,-20" fill="#ffa4f0" />
            <rect
              x="-15"
              y="-35"
              width="4"
              height="15"
              fill="#2a0a5e"
              transform="rotate(-30)"
            />
            <rect
              x="15"
              y="-15"
              width="4"
              height="15"
              fill="#2a0a5e"
              transform="rotate(30)"
            />
          </g>
        </g>

        <g transform="translate(80, -50)">
          <polygon
            points="0,320 -20,310 0,300 20,310"
            fill="#14042d"
            opacity="0.4"
          />
          <g transform="translate(0, 0)">
            <path d="M 0,20 L -15,10 L -15,-10 L 0,0 Z" fill="#e87bcf" />
            <path d="M 0,20 L 15,10 L 15,-10 L 0,0 Z" fill="#c754ab" />
            <polygon points="0,0 -15,-10 0,-20 15,-10" fill="#ffa4f0" />
          </g>
        </g>

        <g transform="translate(-50, 0)">
          <path
            d="M -50,150 Q 0,200 100,120 Q 150,80 200,100"
            fill="none"
            stroke="#14042d"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.4"
          />

          <path
            d="M -50,50 Q 0,100 100,20 Q 150,-20 200,0 L 200,20 Q 150,0 100,40 Q 0,120 -50,70 Z"
            fill="#f3f0f7"
            stroke="#2a0a5e"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          <path
            d="M -30,68 L -20,80 M 10,75 L 20,88 M 50,58 L 60,72 M 90,38 L 100,52 M 130,18 L 140,30 M 170,8 L 180,20"
            stroke="#00d287"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d="M -15,75 L -5,88 M 30,65 L 40,78 M 70,48 L 80,62 M 110,28 L 120,40 M 150,12 L 160,25"
            stroke="#ffa4f0"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        <path
          d="M -150,85 L 50,170"
          fill="none"
          stroke="#00d287"
          strokeWidth="2"
          strokeDasharray="4,4"
          style={{ animation: "mc-stroke-pulse 2s infinite" }}
        />
        <path
          d="M 200,50 L 60,120"
          fill="none"
          stroke="#ffa4f0"
          strokeWidth="2"
          strokeDasharray="4,4"
          style={{ animation: "mc-stroke-pulse 2s infinite" }}
        />
      </g>
    </svg>
  );
}
