"use client";

import React, { useEffect, useRef } from "react";

// ─── Palette & Constants ────────────────────────────────────────────────────
const COMPOSITE_FILTER = "url(#wc-watercolor) blur(0.5px)";
const STAMEN_COLOR = { h: 45, s: 80, l: 55 };
const FLOWER_TYPE_COUNT = 6;
const VASE_HEIGHT = 210;
const VASE_WIDTH = 86;
const VASE_MOUTH_RATIO = 0.32;

const PALETTE = {
  stems: [
    { h: 140, s: 30, l: 35 },
    { h: 130, s: 25, l: 40 },
    { h: 145, s: 20, l: 30 },
  ],
  flowers: [
    { h: 348, s: 72, l: 58 },
    { h: 332, s: 64, l: 64 },
    { h: 12, s: 72, l: 62 },
    { h: 286, s: 40, l: 58 },
    { h: 218, s: 48, l: 61 },
    { h: 198, s: 62, l: 58 },
    { h: 44, s: 62, l: 74 },
    { h: 312, s: 44, l: 62 },
  ],
  calyx: { h: 132, s: 34, l: 30 },
  vase: { h: 0, s: 20, l: 92 },
  hearts: { h: 350, s: 100, l: 65 },
};

class Brush {
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
  stroke(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    c: any,
    w: number,
    o: number,
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = `hsla(${c.h + (Math.random() * 10 - 5)},${c.s}%,${c.l + (Math.random() * 10 - 5)}%,${o})`;
    this.ctx.lineWidth = w * (0.8 + Math.random() * 0.4);
    this.ctx.stroke();
  }
  wash(x: number, y: number, r: number, c: any, o: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    this.ctx.fillStyle = `hsla(${c.h},${c.s}%,${c.l}%,${o})`;
    this.ctx.fill();
  }
  blob(
    x: number,
    y: number,
    radius: number,
    c: any,
    o: number,
    angle?: number,
    stretch?: number,
  ) {
    const a0 = angle == null ? Math.random() * Math.PI : angle;
    const st = stretch == null ? 1.1 + Math.random() * 0.35 : stretch;
    for (let i = 0; i < 2; i++) {
      const jx = (Math.random() - 0.5) * radius * 0.34,
        jy = (Math.random() - 0.5) * radius * 0.34;
      const r = Math.max(0.8, radius * (0.76 + Math.random() * 0.42));
      const h = c.h + (Math.random() * 8 - 4),
        l = c.l + (Math.random() * 10 - 5);
      const a = a0 + (Math.random() - 0.5) * 0.28;
      this.ctx.beginPath();
      this.ctx.ellipse(
        x + jx,
        y + jy,
        r * st,
        r * (0.65 + Math.random() * 0.35),
        a,
        0,
        Math.PI * 2,
      );
      this.ctx.fillStyle = `hsla(${h},${c.s}%,${l}%,${o})`;
      this.ctx.fill();
    }
  }
}

class Stem {
  x: number;
  y: number;
  targetHeight: number;
  angle: number;
  currentHeight = 0;
  segments: any[] = [];
  growSpeed: number;
  done = false;
  leavesBySegment: any[] = [];
  leafDensity: number;
  tip: { x: number; y: number };
  hasFlower = false;
  flowerTypeHint = 0;
  constructor(x: number, y: number, height: number, angle: number) {
    this.x = x;
    this.y = y;
    this.targetHeight = height;
    this.angle = angle;
    this.growSpeed = 2 + Math.random() * 2;
    this.leafDensity = 0.14 + Math.random() * 0.08;
    let cx = x,
      cy = y,
      ca = angle;
    const stepSize = 5,
      totalSteps = Math.floor(height / stepSize);
    for (let i = 0; i < totalSteps; i++) {
      ca += (-Math.PI / 2 - ca) * 0.02 + (Math.random() - 0.5) * 0.05;
      const nx = cx + Math.cos(ca) * stepSize,
        ny = cy + Math.sin(ca) * stepSize;
      this.segments.push({
        x: nx,
        y: ny,
        angle: ca,
        cos: Math.cos(ca),
        sin: Math.sin(ca),
      });
      if (
        i > totalSteps * 0.18 &&
        i < totalSteps * 0.92 &&
        Math.random() < this.leafDensity
      ) {
        const side = Math.random() < 0.5 ? -1 : 1;
        const la = ca + side * (0.65 + Math.random() * 0.55);
        if (!this.leavesBySegment[i]) this.leavesBySegment[i] = [];
        this.leavesBySegment[i].push({
          angle: la,
          cos: Math.cos(la),
          sin: Math.sin(la),
          length: 18 + Math.random() * 22,
          radius: 4.4 + Math.random() * 4.4,
          drawn: false,
        });
      }
      cx = nx;
      cy = ny;
    }
    this.tip = { x: cx, y: cy };
  }
  update() {
    if (this.currentHeight < this.segments.length) {
      this.currentHeight += this.growSpeed;
      if (this.currentHeight >= this.segments.length) {
        this.currentHeight = this.segments.length;
        this.done = true;
      }
    }
    return this.done;
  }
  draw(brush: Brush) {
    const maxIndex = Math.floor(this.currentHeight);
    if (maxIndex < 1) return;
    const drawEnd = this.hasFlower ? Math.max(1, maxIndex - 1) : maxIndex;
    const startIdx = Math.max(
      1,
      drawEnd - ((this.growSpeed + 0.999999) | 0) - 1,
    );
    const sc = this.segments.length;
    for (let i = startIdx; i < drawEnd; i++) {
      const prev = this.segments[i - 1],
        curr = this.segments[i];
      const w = 3.2 * (1 - i / sc) + 0.85;
      brush.stroke(prev.x, prev.y, curr.x, curr.y, PALETTE.stems[1], w, 0.15);
      brush.stroke(
        prev.x,
        prev.y,
        curr.x,
        curr.y,
        PALETTE.stems[2],
        w * 0.55,
        0.18,
      );
      const leaves = this.leavesBySegment[i];
      if (leaves)
        for (const leaf of leaves) {
          if (!leaf.drawn) {
            this.drawLeaf(brush, curr.x, curr.y, leaf, w);
            leaf.drawn = true;
          }
        }
    }
  }
  drawLeaf(brush: Brush, x: number, y: number, leaf: any, sw: number) {
    const tipX = x + leaf.cos * leaf.length,
      tipY = y + leaf.sin * leaf.length;
    const midX = x + leaf.cos * leaf.length * 0.55,
      midY = y + leaf.sin * leaf.length * 0.55;
    const lo = leaf.radius * 0.55;
    brush.blob(
      midX,
      midY,
      leaf.radius * 1.15,
      PALETTE.stems[0],
      0.11,
      leaf.angle,
      2.15,
    );
    brush.blob(
      midX + -leaf.sin * lo,
      midY + leaf.cos * lo,
      leaf.radius * 0.82,
      PALETTE.stems[1],
      0.085,
      leaf.angle + 0.14,
      1.9,
    );
    brush.blob(
      midX - -leaf.sin * lo,
      midY - leaf.cos * lo,
      leaf.radius * 0.78,
      PALETTE.stems[2],
      0.07,
      leaf.angle - 0.12,
      1.8,
    );
    brush.stroke(
      x - leaf.cos * (leaf.radius * 0.35),
      y - leaf.sin * (leaf.radius * 0.35),
      tipX,
      tipY,
      PALETTE.stems[2],
      Math.max(0.45, sw * 0.26),
      0.15,
    );
  }
}

class Flower {
  x: number;
  y: number;
  scale: number;
  type: number;
  age = 0;
  maxAge: number;
  petals: any[] = [];
  centerDots: any[] = [];
  baseColor: any;
  altColor: any;
  darkColor: any;
  lightColor: any;
  petalDrawChance = 0.64;
  speckChance = 0.28;
  coreSize = 0;
  calyxSize = 0;
  capWidth = 0;
  capHeight = 0;
  capLobes = 8;
  headTilt: number;
  headLift = 0;
  capMode = "fan";
  constructor(x: number, y: number, type: number, scale: number) {
    this.x = x;
    this.y = y;
    this.scale = scale || 1;
    this.type = type;
    this.maxAge = 96 + Math.random() * 46;
    const cb = Math.floor(Math.random() * PALETTE.flowers.length);
    this.baseColor = PALETTE.flowers[cb];
    this.altColor =
      PALETTE.flowers[
        (cb + 1 + Math.floor(Math.random() * 2)) % PALETTE.flowers.length
      ];
    this.darkColor = {
      h: this.baseColor.h,
      s: Math.min(100, this.baseColor.s + 10),
      l: Math.max(16, this.baseColor.l - 24),
    };
    this.lightColor = {
      h: this.baseColor.h,
      s: Math.max(20, this.baseColor.s - 8),
      l: Math.min(84, this.baseColor.l + 14),
    };
    this.headTilt = (Math.random() - 0.5) * 0.65;
    this.initShape();
  }
  addPetal(
    angle: number,
    dist: number,
    radius: number,
    layer: number,
    stretch?: number,
  ) {
    this.petals.push({
      angle,
      cos: Math.cos(angle),
      sin: Math.sin(angle),
      distance: dist * this.scale,
      radius: radius * this.scale,
      layer: layer || 0,
      stretch: (stretch ?? 1.45) + (Math.random() - 0.5) * 0.24,
      jitter: (Math.random() - 0.5) * 0.35,
    });
  }
  addCenterDots(
    count: number,
    minD: number,
    maxD: number,
    minS: number,
    maxS: number,
    color?: any,
  ) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      this.centerDots.push({
        cos: Math.cos(a),
        sin: Math.sin(a),
        distance: (minD + Math.random() * (maxD - minD)) * this.scale,
        size: (minS + Math.random() * (maxS - minS)) * this.scale,
        color: color || STAMEN_COLOR,
      });
    }
  }
  initShape() {
    const s = this.scale;
    if (this.type === 0) {
      this.maxAge = 112 + Math.random() * 40;
      this.petalDrawChance = 0.6;
      this.coreSize = 8.6 * s;
      this.calyxSize = 9 * s;
      this.capWidth = 30 * s;
      this.capHeight = 24 * s;
      this.capLobes = 9;
      this.capMode = "cluster";
      this.headLift = 9 * s;
      for (let l = 0; l < 4; l++) {
        const c = 5 + l * 2,
          arc = 2.1 + l * 0.12;
        for (let i = 0; i < c; i++) {
          const t = c > 1 ? i / (c - 1) : 0;
          this.addPetal(
            -Math.PI / 2 + (t - 0.5) * arc + (Math.random() - 0.5) * 0.22,
            6 + l * 5 + Math.random() * 3,
            7.5 + l * 2.8 + Math.random() * 2.3,
            l,
            1.34 + l * 0.08,
          );
        }
      }
      for (let i = 0; i < 5; i++)
        this.addPetal(
          -Math.PI / 2 + (Math.random() - 0.5) * 1.0,
          3 + Math.random() * 3,
          4 + Math.random() * 2,
          0,
          1.15,
        );
      this.addCenterDots(6, 0.8, 4.2, 1.2, 2.2, this.darkColor);
    } else if (this.type === 1) {
      this.petalDrawChance = 0.56;
      this.coreSize = 6.8 * s;
      this.calyxSize = 8 * s;
      this.capWidth = 32 * s;
      this.capHeight = 22 * s;
      this.capLobes = 7;
      this.capMode = "wing";
      this.headLift = 12 * s;
      const b = -Math.PI / 2 + (Math.random() - 0.5) * 0.24;
      this.addPetal(b - 0.95, 15, 10.5, 1, 1.5);
      this.addPetal(b - 0.35, 19, 13, 1, 1.35);
      this.addPetal(b + 0.35, 19, 13, 1, 1.35);
      this.addPetal(b + 0.95, 15, 10.5, 1, 1.5);
      this.addPetal(b + Math.PI, 11, 14.5, 0, 1.08);
      this.addPetal(b + Math.PI + 0.15, 8, 9.5, 0, 1.02);
      this.addCenterDots(5, 1, 4.8, 1.2, 2.4, PALETTE.hearts);
    } else if (this.type === 2) {
      this.petalDrawChance = 0.58;
      this.coreSize = 6.2 * s;
      this.calyxSize = 9.4 * s;
      this.capWidth = 25 * s;
      this.capHeight = 22 * s;
      this.capLobes = 6;
      this.capMode = "cup";
      this.headLift = 14 * s;
      const b = -Math.PI / 2 + (Math.random() - 0.5) * 0.2;
      this.addPetal(b - 0.33, 15, 14, 1, 1.3);
      this.addPetal(b, 18, 16, 2, 1.22);
      this.addPetal(b + 0.33, 15, 14, 1, 1.3);
      this.addPetal(b - 0.7, 11, 8.2, 0, 1.14);
      this.addPetal(b + 0.7, 11, 8.2, 0, 1.14);
      this.addCenterDots(4, 1, 3.8, 1.1, 1.8, STAMEN_COLOR);
    } else if (this.type === 3) {
      this.maxAge = 106 + Math.random() * 36;
      this.petalDrawChance = 0.55;
      this.coreSize = 8.4 * s;
      this.calyxSize = 8.6 * s;
      this.capWidth = 40 * s;
      this.capHeight = 18 * s;
      this.capLobes = 10;
      this.capMode = "fan";
      this.headLift = 12 * s;
      const c = 7 + Math.floor(Math.random() * 3);
      for (let i = 0; i < c; i++)
        this.addPetal(
          -Math.PI +
            (c > 1 ? i / (c - 1) : 0) * Math.PI +
            (Math.random() - 0.5) * 0.2,
          15 + Math.random() * 12,
          11 + Math.random() * 4.5,
          1,
          1.58,
        );
      for (let i = 0; i < 3; i++)
        this.addPetal(
          -Math.PI / 2 + (Math.random() - 0.5) * 1.2,
          9 + Math.random() * 5,
          7.5 + Math.random() * 3,
          0,
          1.3,
        );
      this.addCenterDots(8, 1.2, 5.4, 1, 2, this.darkColor);
    } else if (this.type === 4) {
      this.maxAge = 112 + Math.random() * 42;
      this.petalDrawChance = 0.58;
      this.coreSize = 8 * s;
      this.calyxSize = 9 * s;
      this.capWidth = 34 * s;
      this.capHeight = 24 * s;
      this.capLobes = 11;
      this.capMode = "cluster";
      this.headLift = 10 * s;
      for (let l = 0; l < 4; l++) {
        const c = 6 + l * 3,
          arc = 2.35 + l * 0.12;
        for (let i = 0; i < c; i++) {
          const t = c > 1 ? i / (c - 1) : 0;
          this.addPetal(
            -Math.PI / 2 + (t - 0.5) * arc + (Math.random() - 0.5) * 0.32,
            5 + l * 4.8 + Math.random() * 2.8,
            6.4 + l * 2.4 + Math.random() * 2.2,
            l,
            1.24 + l * 0.08,
          );
        }
      }
      this.addCenterDots(7, 1, 4.8, 1.4, 2.5, this.darkColor);
    } else {
      this.petalDrawChance = 0.54;
      this.coreSize = 6.8 * s;
      this.calyxSize = 8.2 * s;
      this.capWidth = 35 * s;
      this.capHeight = 19 * s;
      this.capLobes = 7;
      this.capMode = "star";
      this.headLift = 13 * s;
      const off = -Math.PI / 2 + (Math.random() - 0.5) * 0.18;
      for (let i = 0; i < 6; i++)
        this.addPetal(
          off + ((Math.PI * 2) / 6) * i + (Math.random() - 0.5) * 0.2,
          17 + Math.random() * 8,
          8.5 + Math.random() * 3,
          i % 2,
          1.5,
        );
      this.addCenterDots(6, 1.1, 4.8, 1.1, 2, STAMEN_COLOR);
    }
  }
  draw(brush: Brush) {
    if (this.age > this.maxAge) return;
    this.age += 1;
    const growth = this.age < 68 ? this.age / 68 : 1,
      bloom = 0.2 + growth * 0.8;
    const hX = this.x + this.headTilt * this.headLift * 0.18 * bloom;
    const hY = this.y - this.headLift * bloom;
    const fbX = hX + this.headTilt * 4 * this.scale * bloom;
    const fbY = hY + this.capHeight * (this.capMode === "cup" ? 0.6 : 0.52);
    if (this.age > 3) {
      const cg = Math.min(1, (this.age - 3) / 34),
        cw = this.capWidth * cg,
        ch = this.capHeight * cg;
      if (this.capMode === "cluster") {
        for (let i = 0; i < this.capLobes; i++) {
          if (Math.random() > 0.8) continue;
          const a = ((Math.PI * 2) / this.capLobes) * i + this.headTilt * 0.3;
          const ring = ch * (0.2 + Math.random() * 0.55);
          brush.blob(
            hX + Math.cos(a) * ring * (0.95 + Math.random() * 0.3),
            hY + Math.sin(a) * ring * 0.72,
            ch * (0.34 + Math.random() * 0.2),
            Math.random() > 0.6 ? this.lightColor : this.baseColor,
            0.032,
            a,
            1.45,
          );
        }
      } else if (this.capMode === "star") {
        for (let i = 0; i < this.capLobes; i++) {
          const a = ((Math.PI * 2) / this.capLobes) * i + this.headTilt * 0.25;
          const r = ch * (0.46 + Math.random() * 0.3);
          brush.blob(
            hX + Math.cos(a) * r,
            hY + Math.sin(a) * r * 0.82,
            ch * 0.28,
            this.baseColor,
            0.032,
            a,
            2.15,
          );
        }
      } else if (this.capMode === "wing") {
        brush.blob(
          hX - cw * 0.26,
          hY - ch * 0.18,
          ch * 0.5,
          this.lightColor,
          0.03,
          -0.35,
          1.9,
        );
        brush.blob(
          hX + cw * 0.26,
          hY - ch * 0.18,
          ch * 0.5,
          this.lightColor,
          0.03,
          0.35,
          1.9,
        );
        brush.blob(
          hX,
          hY - ch * 0.26,
          ch * 0.48,
          this.baseColor,
          0.034,
          0,
          1.7,
        );
        brush.blob(
          hX,
          hY + ch * 0.15,
          ch * 0.42,
          this.baseColor,
          0.034,
          0,
          1.35,
        );
      } else {
        const sp = this.capMode === "cup" ? 0.9 : 1.0;
        for (let i = 0; i < this.capLobes; i++) {
          if (Math.random() > 0.76) continue;
          const t = this.capLobes > 1 ? i / (this.capLobes - 1) : 0.5;
          const ts = this.headTilt * (0.5 - Math.abs(t - 0.5)) * ch * 1.25;
          brush.blob(
            hX + (t - 0.5) * cw * sp + ts + (Math.random() - 0.5) * cw * 0.08,
            hY -
              Math.sin(t * Math.PI) * ch +
              this.headTilt * (t - 0.5) * ch * 0.2 +
              (Math.random() - 0.5) * ch * 0.12,
            ch * (0.42 + Math.random() * 0.26),
            Math.random() > 0.6 ? this.lightColor : this.baseColor,
            0.034,
            this.headTilt * 0.35,
            1.92,
          );
        }
      }
    }
    for (const p of this.petals) {
      if (Math.random() > this.petalDrawChance) continue;
      const d = p.distance * bloom,
        r = p.radius * bloom * (1.02 + p.layer * 0.02);
      const px = hX + p.cos * d,
        py = hY + p.sin * d,
        mx = hX + p.cos * d * 0.58,
        my = hY + p.sin * d * 0.58,
        bx = hX + p.cos * d * 0.24,
        by = hY + p.sin * d * 0.24;
      let tone = this.baseColor;
      if (p.layer === 0) tone = this.darkColor;
      else if (p.layer >= 3) tone = this.lightColor;
      else if (Math.random() > 0.68) tone = this.altColor;
      const axis =
        this.type === 1 || this.type === 5
          ? p.angle + p.jitter
          : this.headTilt * 0.35 + (Math.random() - 0.5) * 0.12;
      brush.blob(mx, my, r * 0.95, tone, 0.05, axis, p.stretch);
      brush.blob(
        px,
        py,
        r * 0.72,
        this.lightColor,
        0.034,
        axis + 0.08,
        p.stretch * 0.9,
      );
      brush.blob(
        bx,
        by,
        r * 0.46,
        this.darkColor,
        0.045,
        axis - 0.06,
        p.stretch * 0.84,
      );
      if (Math.random() > 0.64)
        brush.blob(
          mx + -p.sin * r * 0.18,
          my + p.cos * r * 0.18,
          r * 0.65,
          this.lightColor,
          0.03,
          p.angle + 0.3,
          p.stretch * 0.92,
        );
      if (Math.random() > 0.76)
        brush.stroke(fbX, fbY, px, py, this.darkColor, 0.3 * this.scale, 0.04);
    }
    if (this.age > 4) {
      const cg = Math.min(1, (this.age - 4) / 22);
      for (let i = 0; i < 3; i++)
        brush.blob(
          hX + (Math.random() - 0.5) * 3.5 * this.scale,
          hY + 0.9 * this.scale + (Math.random() - 0.5) * 2 * this.scale,
          this.coreSize * cg * (0.65 + Math.random() * 0.45),
          this.darkColor,
          0.055,
          0,
          1.25,
        );
    }
    if (this.age > 6) {
      const cg = Math.min(1, (this.age - 6) / 24);
      brush.blob(fbX, fbY, this.calyxSize * cg, PALETTE.calyx, 0.052, 0, 1.35);
      if (Math.random() > 0.52) {
        const sx = fbX + (Math.random() - 0.5) * 4 * this.scale,
          sy = fbY + (Math.random() - 0.5) * 2 * this.scale;
        brush.stroke(
          sx,
          sy,
          sx + (Math.random() - 0.5) * 10 * this.scale,
          sy - (3 + Math.random() * 5) * this.scale,
          PALETTE.calyx,
          0.45 * this.scale,
          0.06,
        );
      }
    }
    if (this.age > 10 && this.centerDots.length > 0) {
      const dg = Math.min(1, (this.age - 10) / 26);
      for (const d of this.centerDots) {
        if (Math.random() > this.speckChance) continue;
        brush.wash(
          hX +
            d.cos * d.distance * dg +
            (Math.random() - 0.5) * 1.5 * this.scale,
          hY +
            d.sin * d.distance * dg +
            (Math.random() - 0.5) * 1.5 * this.scale,
          d.size * dg,
          d.color,
          0.075,
        );
      }
    }
  }
}

class Vase {
  x: number;
  y: number;
  drawn = false;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (this.drawn) return;
    const c = PALETTE.vase;
    for (let i = 0; i < 80; i++) {
      const t = i / 79,
        yPos = this.y + (1 - t) * VASE_HEIGHT,
        w = VASE_WIDTH * (VASE_MOUTH_RATIO + Math.sin(t * Math.PI) * 0.68);
      ctx.beginPath();
      ctx.moveTo(this.x - w, yPos);
      ctx.lineTo(this.x + w, yPos);
      ctx.lineWidth = 2.6 + Math.random() * 1.8;
      ctx.strokeStyle = `hsla(${c.h},${c.s}%,${c.l - Math.random() * 10}%,0.1)`;
      ctx.stroke();
      if (Math.random() > 0.35) {
        ctx.beginPath();
        ctx.moveTo(this.x + w - 10, yPos);
        ctx.lineTo(this.x + w, yPos);
        ctx.lineWidth = 3.2;
        ctx.strokeStyle = `hsla(${c.h},${c.s}%,${c.l - 30}%,0.09)`;
        ctx.stroke();
      }
    }
    this.drawn = true;
  }
  stop() {
    this.drawn = true;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
interface GenerativeFlowerProps {
  onFinished: () => void;
  visible: boolean; // controls opacity (fade out)
}

const GenerativeFlower: React.FC<GenerativeFlowerProps> = ({
  onFinished,
  visible,
}) => {
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const displayCanvas = displayCanvasRef.current;
    if (!displayCanvas) return;
    const displayCtx = displayCanvas.getContext("2d", { alpha: true });
    if (!displayCtx) return;
    const paintCanvas = document.createElement("canvas");
    const paintCtx = paintCanvas.getContext("2d", { alpha: true });
    if (!paintCtx) return;

    let width = 0,
      height = 0;
    let animId: number | null = null;
    let stems: Stem[] = [],
      flowers: Flower[] = [];
    let brush: Brush, vase: Vase;
    let poemShown = false;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      displayCanvas.width = width;
      displayCanvas.height = height;
      paintCanvas.width = width;
      paintCanvas.height = height;
      paintCtx.lineCap = "round";
      paintCtx.lineJoin = "round";
    };

    const renderFrame = () => {
      displayCtx.clearRect(0, 0, width, height);
      displayCtx.filter = COMPOSITE_FILTER;
      displayCtx.drawImage(paintCanvas, 0, 0);
      displayCtx.filter = "none";
    };

    const loop = () => {
      let stemsDone = true,
        flowersDone = true;
      for (const stem of stems) {
        const done = stem.update();
        stem.draw(brush);
        if (!done) {
          stemsDone = false;
          continue;
        }
        if (!stem.hasFlower) {
          const ai = Math.max(1, stem.segments.length - 2);
          const anchor = stem.segments[ai];
          flowers.push(
            new Flower(
              anchor.x,
              anchor.y,
              stem.flowerTypeHint,
              0.64 + Math.random() * 0.17,
            ),
          );
          if (stem.segments.length > 16 && Math.random() > 0.62) {
            const si = Math.max(
              4,
              stem.segments.length - (8 + Math.floor(Math.random() * 8)),
            );
            const node = stem.segments[si],
              side = Math.random() < 0.5 ? -1 : 1;
            flowers.push(
              new Flower(
                node.x + -node.sin * side * (8 + Math.random() * 8),
                node.y +
                  node.cos * side * (2 + Math.random() * 4) -
                  (2 + Math.random() * 3),
                (stem.flowerTypeHint + 2 + Math.floor(Math.random() * 2)) %
                  FLOWER_TYPE_COUNT,
                0.42 + Math.random() * 0.14,
              ),
            );
          }
          stem.hasFlower = true;
        }
      }
      for (const f of flowers) {
        f.draw(brush);
        if (f.age < f.maxAge) flowersDone = false;
      }
      renderFrame();
      if (!stemsDone || !flowersDone) {
        animId = requestAnimationFrame(loop);
      } else {
        animId = null;
        if (!poemShown) {
          poemShown = true;
          onFinished();
        }
      }
    };

    const init = () => {
      resize();
      paintCtx.clearRect(0, 0, width, height);
      renderFrame();
      brush = new Brush(paintCtx);
      stems = [];
      flowers = [];
      poemShown = false;
      const startX = width / 2,
        startY = height * 0.6;
      vase = new Vase(startX, startY);
      vase.draw(paintCtx);
      const count = width < 600 ? 8 : width < 1000 ? 11 : 12;
      const mouthHalf =
        VASE_WIDTH * VASE_MOUTH_RATIO * (width < 600 ? 0.95 : 1.05);
      const typeOrder = [0, 1, 2, 3, 4, 5];
      for (let i = typeOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [typeOrder[i], typeOrder[j]] = [typeOrder[j], typeOrder[i]];
      }
      for (let i = 0; i < count; i++) {
        const fan = count > 1 ? i / (count - 1) - 0.5 : 0;
        const stem = new Stem(
          startX +
            fan * mouthHalf * 1.18 +
            (Math.random() - 0.5) * mouthHalf * 0.28,
          startY,
          height * 0.16 + Math.random() * height * 0.12,
          -Math.PI / 2 + fan * 0.14 + (Math.random() - 0.5) * 0.09,
        );
        stem.flowerTypeHint =
          Math.random() > 0.82
            ? Math.floor(Math.random() * FLOWER_TYPE_COUNT)
            : typeOrder[i % FLOWER_TYPE_COUNT];
        stems.push(stem);
      }
      loop();
    };

    const resizeHandler = () => {
      if (vase) vase.stop();
      init();
    };
    window.addEventListener("resize", resizeHandler);
    const t = setTimeout(init, 500);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", resizeHandler);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [onFinished]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 2s ease",
      }}
    >
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="wc-watercolor">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="5"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </svg>
      <canvas
        ref={displayCanvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default GenerativeFlower;
