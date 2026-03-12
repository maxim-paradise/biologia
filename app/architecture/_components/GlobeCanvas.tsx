"use client";

import React, { useEffect } from "react";
import type { TimeRange } from "./types";

export default function GlobeCanvas(props: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  timeRange: TimeRange;
}) {
  const { canvasRef, timeRange } = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gx = canvas.getContext("2d");
    if (!gx) return;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };

    resize();
    window.addEventListener("resize", resize);

    const latLonToXYZ = (latDeg: number, lonDeg: number) => {
      const lat = (latDeg * Math.PI) / 180;
      const lon = (lonDeg * Math.PI) / 180;
      return {
        x: Math.cos(lat) * Math.cos(lon),
        y: Math.sin(lat),
        z: Math.cos(lat) * Math.sin(lon),
      };
    };

    const COUNTRIES: number[][][][] = [
      [[[-124, 49], [-95, 49], [-74, 45], [-67, 47], [-70, 43], [-74, 40], [-76, 35], [-80, 25], [-82, 24], [-87, 30], [-90, 29], [-97, 26], [-100, 28], [-104, 19], [-117, 32], [-124, 37], [-124, 49]]],
      [[[-141, 60], [-141, 70], [-156, 72], [-168, 66], [-166, 60], [-156, 55], [-149, 58], [-141, 60]]],
      [[[-60, 47], [-64, 44], [-66, 45], [-70, 47], [-76, 44], [-82, 42], [-83, 42], [-88, 42], [-90, 44], [-96, 49], [-110, 49], [-120, 49], [-130, 55], [-136, 60], [-140, 60], [-140, 70], [-120, 74], [-90, 73], [-65, 63], [-60, 47]]],
      [[[-44, 83], [-17, 77], [-18, 70], [-26, 65], [-45, 60], [-54, 65], [-58, 76], [-44, 83]]],
      [[[-117, 32], [-97, 26], [-91, 16], [-87, 16], [-83, 10], [-80, 8], [-77, 8], [-80, 14], [-85, 16], [-90, 16], [-92, 18], [-97, 20], [-104, 19], [-104, 22], [-117, 32]]],
      [[[-34, -5], [-35, -9], [-38, -14], [-40, -20], [-44, -23], [-50, -29], [-53, -33], [-58, -34], [-58, -20], [-60, -14], [-60, -4], [-52, 4], [-48, 0], [-44, -1], [-34, -5]]],
      [[[-58, -34], [-57, -38], [-62, -42], [-65, -46], [-66, -55], [-68, -55], [-72, -50], [-70, -44], [-70, -38], [-66, -34], [-62, -30], [-58, -28], [-60, -22], [-58, -20], [-58, -34]]],
      [[[-5, 50], [-3, 51], [-1, 51], [0, 51], [2, 51], [1, 53], [-2, 54], [-5, 54], [-5, 57], [-4, 58], [-3, 59], [-1, 60], [-2, 58], [-3, 56], [-4, 56], [-5, 54], [-3, 52], [-5, 50]]],
      [[[-24, 64], [-14, 63], [-13, 65], [-16, 66], [-24, 66], [-24, 64]]],
      [[[5, 58], [8, 58], [8, 57], [10, 55], [12, 56], [14, 55], [14, 54], [18, 54], [20, 56], [24, 57], [26, 60], [28, 62], [29, 70], [26, 70], [24, 68], [18, 70], [15, 68], [10, 63], [5, 58]]],
      [[[-5, 44], [-1, 44], [3, 44], [7, 44], [8, 47], [6, 49], [2, 51], [0, 51], [-2, 49], [-2, 48], [-4, 47], [-5, 44]]],
      [[[-9, 37], [-9, 44], [-7, 44], [-4, 44], [-2, 44], [0, 43], [3, 44], [3, 42], [1, 41], [-1, 37], [-5, 36], [-7, 36], [-9, 37]]],
      [[[6, 51], [8, 47], [14, 47], [14, 52], [12, 54], [8, 55], [6, 53], [6, 51]]],
      [[[7, 44], [14, 44], [16, 41], [16, 38], [18, 40], [15, 37], [12, 37], [10, 38], [8, 40], [7, 44]]],
      [[[14, 54], [24, 54], [26, 57], [24, 58], [22, 60], [18, 60], [14, 58], [14, 54]]],
      [[[22, 48], [30, 48], [34, 46], [36, 47], [38, 47], [36, 50], [30, 52], [26, 52], [22, 52], [22, 48]]],
      [[[26, 42], [36, 42], [42, 38], [44, 38], [44, 36], [36, 36], [28, 36], [26, 38], [26, 42]]],
      [[[22, 54], [30, 60], [32, 60], [36, 60], [40, 60], [40, 55], [44, 44], [38, 44], [34, 46], [30, 48], [26, 52], [22, 54]]],
      [[[40, 70], [60, 68], [80, 70], [100, 70], [120, 70], [140, 70], [160, 68], [170, 64], [170, 56], [160, 52], [150, 48], [140, 48], [130, 44], [130, 40], [120, 44], [110, 54], [100, 52], [90, 54], [80, 56], [70, 56], [60, 58], [54, 54], [50, 58], [46, 52], [40, 56], [40, 70]]],
      [[[52, 42], [60, 44], [70, 44], [80, 42], [84, 50], [80, 54], [70, 56], [60, 54], [50, 46], [52, 42]]],
      [[[80, 32], [88, 26], [96, 24], [100, 22], [104, 22], [108, 22], [112, 24], [116, 22], [120, 26], [122, 30], [122, 34], [120, 38], [118, 40], [114, 42], [110, 44], [106, 44], [102, 44], [98, 44], [94, 44], [90, 42], [84, 40], [80, 38], [78, 34], [80, 32]]],
      [[[88, 50], [96, 50], [106, 50], [118, 50], [120, 48], [118, 44], [110, 44], [106, 44], [98, 44], [88, 48], [88, 50]]],
      [[[68, 24], [72, 22], [74, 18], [80, 10], [80, 8], [78, 8], [80, 14], [80, 18], [77, 22], [80, 26], [88, 26], [88, 24], [84, 22], [78, 20], [72, 20], [68, 22], [68, 24]]],
      [[[96, 20], [100, 14], [104, 10], [104, 2], [102, 2], [100, 4], [98, 8], [96, 16], [96, 20]]],
      [[[100, 2], [104, 2], [104, -2], [108, -2], [110, -2], [114, -4], [114, -8], [108, -8], [104, -6], [100, -2], [98, 2], [100, 2]]],
      [[[95, 4], [100, 0], [106, -6], [108, -8], [106, -8], [102, -4], [98, 0], [95, 4]]],
      [[[118, 8], [120, 12], [122, 16], [124, 14], [124, 8], [120, 6], [118, 8]]],
      [[[130, 32], [130, 34], [132, 34], [134, 34], [136, 36], [138, 38], [140, 40], [142, 42], [140, 44], [138, 44], [136, 36], [134, 34], [132, 32], [130, 32]]],
      [[[126, 34], [128, 38], [130, 38], [130, 36], [128, 34], [126, 34]]],
      [[[36, 28], [38, 24], [42, 14], [44, 12], [50, 14], [56, 12], [58, 20], [54, 24], [50, 30], [44, 28], [40, 30], [36, 28]]],
      [[[44, 38], [48, 38], [54, 40], [60, 36], [62, 26], [58, 22], [50, 26], [44, 28], [44, 38]]],
      [[[38, 36], [44, 38], [48, 32], [46, 28], [38, 28], [36, 32], [38, 36]]],
      [[[25, 22], [34, 22], [34, 28], [36, 29], [34, 30], [30, 30], [25, 30], [25, 22]]],
      [[[-10, 30], [0, 30], [10, 30], [14, 24], [14, 20], [10, 18], [0, 18], [-10, 18], [-10, 30]]],
      [[[-18, 16], [-16, 10], [-10, 4], [-4, 4], [2, 4], [6, 4], [8, 2], [10, 4], [14, 4], [10, 8], [4, 10], [0, 14], [-4, 14], [-8, 12], [-14, 10], [-18, 14], [-18, 16]]],
      [[[36, 20], [42, 12], [44, 10], [42, 12], [44, 8], [42, 2], [40, -4], [36, -4], [34, -4], [34, 4], [38, 10], [36, 20]]],
      [[[18, -28], [26, -30], [32, -28], [34, -24], [36, -18], [34, -14], [32, -10], [28, -8], [22, -18], [18, -28]]],
      [[[2, 4], [6, 4], [8, 6], [10, 8], [14, 8], [14, 4], [10, 4], [8, 2], [6, 4], [2, 4]]],
      [[[36, 14], [42, 12], [50, 12], [52, 8], [42, 2], [36, 4], [34, 8], [36, 14]]],
      [[[114, -22], [114, -34], [118, -38], [124, -34], [130, -32], [136, -34], [140, -38], [146, -38], [150, -36], [154, -28], [154, -20], [148, -18], [142, -10], [136, -12], [130, -14], [124, -18], [120, -20], [114, -22]]],
      [[[168, -46], [172, -42], [174, -40], [172, -36], [168, -38], [168, -46]]],
    ];

    const pointInPolygon = (lon: number, lat: number, ring: number[][]) => {
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0];
        const yi = ring[i][1];
        const xj = ring[j][0];
        const yj = ring[j][1];
        if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    };

    const DOT_STEP = 2.2;
    const globePts: {
      x: number;
      y: number;
      z: number;
      size: number;
      brightness: number;
      isShenzhen: boolean;
      phase: number;
    }[] = [];

    for (let lat = -85; lat <= 85; lat += DOT_STEP) {
      for (let lon = -180; lon <= 180; lon += DOT_STEP) {
        let onLand = false;
        for (const country of COUNTRIES) {
          for (const ring of country) {
            if (pointInPolygon(lon, lat, ring)) {
              onLand = true;
              break;
            }
          }
          if (onLand) break;
        }
        if (!onLand) continue;
        const p3 = latLonToXYZ(lat, lon);
        const isSZ = Math.abs(lat - 22.54) < 1.5 && Math.abs(lon - 114.06) < 1.5;
        globePts.push({
          x: p3.x,
          y: p3.y,
          z: p3.z,
          size: isSZ ? 1.8 : 0.9 + Math.random() * 0.5,
          brightness: isSZ ? 1.0 : 0.4 + Math.random() * 0.4,
          isShenzhen: isSZ,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const RING_LATS = [-60, -30, 0, 30, 60];
    const LON_STEPS = 120;

    let globeAngle = -((114.06 * Math.PI) / 180 - Math.PI * 0.18);
    let globeTick = 0;

    const rotY = (p: { x: number; y: number; z: number }, a: number) => {
      return {
        x: p.x * Math.cos(a) + p.z * Math.sin(a),
        y: p.y,
        z: -p.x * Math.sin(a) + p.z * Math.cos(a),
      };
    };

    let raf = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      gx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gx.clearRect(0, 0, W, H);

      globeAngle += 0.0015;
      globeTick += 0.016;

      const cx = W * 0.54;
      const cy = H * 0.5;
      const R = Math.min(W, H) * 0.38;

      const accentHex = getComputedStyle(document.body)
        .getPropertyValue("--accent-green")
        .trim() || "#00FF66";
      const accentRgb = (() => {
        const clean = accentHex.replace("#", "");
        const norm = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
        const n = parseInt(norm, 16);
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
      })();

      const rangeBoost = timeRange === "24h" ? 1.25 : timeRange === "7d" ? 1 : 0.85;

      const atm = gx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.3);
      atm.addColorStop(0, `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${0.07 * rangeBoost})`);
      atm.addColorStop(1, "rgba(0,0,0,0)");
      gx.beginPath();
      gx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      gx.fillStyle = atm;
      gx.fill();

      const sphereGrad = gx.createRadialGradient(cx - R * 0.3, cy - R * 0.2, 0, cx, cy, R);
      sphereGrad.addColorStop(0, "rgba(0,20,8,0.4)");
      sphereGrad.addColorStop(1, "rgba(0,0,0,0.85)");
      gx.beginPath();
      gx.arc(cx, cy, R, 0, Math.PI * 2);
      gx.fillStyle = sphereGrad;
      gx.fill();

      for (const latDeg of RING_LATS) {
        gx.beginPath();
        let first = true;
        for (let s = 0; s <= LON_STEPS; s++) {
          const lonDeg = (s / LON_STEPS) * 360 - 180;
          const p3 = latLonToXYZ(latDeg, lonDeg);
          const rp = rotY(p3, globeAngle);
          if (rp.z < 0) {
            first = true;
            continue;
          }
          const sx = cx + rp.x * R;
          const sy = cy - rp.y * R;
          if (first) gx.moveTo(sx, sy);
          else gx.lineTo(sx, sy);
          first = false;
        }
        gx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${0.06 * rangeBoost})`;
        gx.lineWidth = 0.4;
        gx.stroke();
      }

      for (let m = 0; m < 18; m++) {
        const lonDeg = (m / 18) * 360 - 180;
        gx.beginPath();
        let first = true;
        for (let s = 0; s <= 60; s++) {
          const latDeg = (s / 60) * 180 - 90;
          const p3 = latLonToXYZ(latDeg, lonDeg);
          const rp = rotY(p3, globeAngle);
          if (rp.z < 0) {
            first = true;
            continue;
          }
          const sx = cx + rp.x * R;
          const sy = cy - rp.y * R;
          if (first) gx.moveTo(sx, sy);
          else gx.lineTo(sx, sy);
          first = false;
        }
        gx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${0.04 * rangeBoost})`;
        gx.lineWidth = 0.4;
        gx.stroke();
      }

      gx.save();
      gx.beginPath();
      gx.arc(cx, cy, R, 0, Math.PI * 2);
      gx.clip();

      const projected = globePts
        .map((pt) => {
          const rp = rotY(pt, globeAngle);
          return { ...pt, rx: rp.x, ry: rp.y, rz: rp.z };
        })
        .sort((a, b) => a.rz - b.rz);

      for (const pt of projected) {
        const sx = cx + pt.rx * R;
        const sy = cy - pt.ry * R;
        const depth = (pt.rz + 1) / 2;

        if (pt.isShenzhen) {
          const pulse = 0.65 + 0.35 * Math.sin(globeTick * 3 + pt.phase);
          if (pt.rz >= 0) {
            const edgeFade = Math.pow(depth, 0.5);
            gx.beginPath();
            gx.arc(sx, sy, pt.size * 1.6 * edgeFade, 0, Math.PI * 2);
            gx.fillStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${0.95 * edgeFade * pulse * rangeBoost})`;
            gx.fill();
            const h2 = gx.createRadialGradient(sx, sy, 0, sx, sy, pt.size * 7);
            h2.addColorStop(0, `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${0.4 * pulse * rangeBoost})`);
            h2.addColorStop(1, `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0)`);
            gx.beginPath();
            gx.arc(sx, sy, pt.size * 7, 0, Math.PI * 2);
            gx.fillStyle = h2;
            gx.fill();
          } else {
            const backDepth = Math.max(0, 1 + pt.rz);
            const ghostAlpha = backDepth * backDepth * 0.22 * pulse;
            gx.beginPath();
            gx.arc(sx, sy, pt.size * 2.5, 0, Math.PI * 2);
            gx.fillStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${ghostAlpha * rangeBoost})`;
            gx.fill();
          }
        } else {
          if (pt.rz < 0) {
            const backDepth = Math.max(0, 1 + pt.rz);
            const alpha = pt.brightness * backDepth * backDepth * 0.08;
            gx.beginPath();
            gx.arc(sx, sy, pt.size * 0.6, 0, Math.PI * 2);
            gx.fillStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${alpha * rangeBoost})`;
            gx.fill();
          } else {
            const edgeFade = Math.pow(depth, 0.5);
            const twinkle = 0.7 + 0.3 * Math.sin(globeTick * 1.2 + pt.phase);
            const alpha = pt.brightness * edgeFade * twinkle * 0.75;
            gx.beginPath();
            gx.arc(sx, sy, pt.size * edgeFade, 0, Math.PI * 2);
            gx.fillStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${alpha * rangeBoost})`;
            gx.fill();
          }
        }
      }

      gx.restore();

      gx.beginPath();
      gx.arc(cx, cy, R, 0, Math.PI * 2);
      gx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${0.15 * rangeBoost})`;
      gx.lineWidth = 1;
      gx.stroke();

      const szP = latLonToXYZ(22.54, 114.06);
      const szR2 = rotY(szP, globeAngle);

      if (szR2.z > 0) {
        const sx = cx + szR2.x * R;
        const sy = cy - szR2.y * R;
        for (const k of [1, 2, 3]) {
          const prog = (globeTick * 0.7 + k * 0.33) % 1;
          gx.beginPath();
          gx.arc(sx, sy, prog * 24, 0, Math.PI * 2);
          gx.strokeStyle = `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${(1 - prog) * 0.7 * rangeBoost})`;
          gx.lineWidth = 1.2;
          gx.stroke();
        }
        gx.beginPath();
        gx.arc(sx, sy, 4, 0, Math.PI * 2);
        gx.fillStyle = accentHex;
        gx.shadowColor = accentHex;
        gx.shadowBlur = 14;
        gx.fill();
        gx.shadowBlur = 0;
      } else {
        const backDepth = Math.max(0, 1 + szR2.z);
        const sx = cx + szR2.x * R;
        const sy = cy - szR2.y * R;
        const pulse = 0.5 + 0.5 * Math.sin(globeTick * 2.5);
        const ghostR = 10 + pulse * 6;
        const ghostA = backDepth * backDepth * 0.18 * pulse;
        const gh = gx.createRadialGradient(sx, sy, 0, sx, sy, ghostR);
        gh.addColorStop(0, `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},${ghostA * rangeBoost})`);
        gh.addColorStop(1, `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0)`);
        gx.beginPath();
        gx.arc(sx, sy, ghostR, 0, Math.PI * 2);
        gx.fillStyle = gh;
        gx.fill();
      }

      raf = window.requestAnimationFrame(draw);
    };

    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, timeRange]);

  return <canvas ref={canvasRef as any} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />;
}
