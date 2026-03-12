"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ThemeMode = "dark" | "light";

type VoiceState = "idle" | "listening" | "processing";

type DataLayer = "atmosphere" | "ocean" | "ice" | "biosphere";

type TimeRange = "24h" | "7d" | "30d";

type EonetEvent = {
  id: string;
  title: string;
  link?: string;
  categories: string[];
  status?: string;
  updatedAt?: string;
  geometryDate?: string;
};

type Product = {
  name: string;
  version: string;
  desc: string;
  tags: string[];
  accent: "green" | "blue" | "orange" | "cyan";
  icon: "bezier" | "nexus" | "pulsar" | "gridos";
};

function clamp01(x: number) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function ArchitecturePage() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [vmIndex, setVmIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");

  const [activeLayer, setActiveLayer] = useState<DataLayer>("atmosphere");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [eonetEvents, setEonetEvents] = useState<EonetEvent[]>([]);
  const [eonetStatus, setEonetStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [exportHint, setExportHint] = useState<string>("");

  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const globeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const vmTimerRef = useRef<number | null>(null);
  const productTimerRef = useRef<number | null>(null);
  const voiceListeningTimerRef = useRef<number | null>(null);
  const voiceProcessingTimerRef = useRef<number | null>(null);

  const exportHintTimerRef = useRef<number | null>(null);

  const products = useMemo<Product[]>(
    () => [
      {
        name: "MODIS",
        version: "Terra/Aqua",
        desc: "Спостереження хмарності, аерозолів, температури та кольору океану в глобальному масштабі.",
        tags: ["Earth Obs", "AOD", "SST"],
        accent: "cyan",
        icon: "bezier",
      },
      {
        name: "VIIRS",
        version: "Suomi NPP",
        desc: "Нічні вогні, пожежі, льодовий покрив і стан атмосфери — щоденний зріз планети.",
        tags: ["Nightlights", "Fire", "Ice"],
        accent: "blue",
        icon: "nexus",
      },
      {
        name: "GEDI",
        version: "ISS",
        desc: "Лідарна оцінка структури лісів: висота крон, біомаса та вуглець у рослинності.",
        tags: ["Lidar", "Biomass", "Carbon"],
        accent: "green",
        icon: "pulsar",
      },
      {
        name: "GRACE-FO",
        version: "L1",
        desc: "Зміни гравітації → вода, льодовики та маса океану: метрики, які видно лише з орбіти.",
        tags: ["Gravity", "Water", "Ice"],
        accent: "orange",
        icon: "gridos",
      },
    ],
    [],
  );

  const voiceUi = useMemo(() => {
    const cfg =
      voiceState === "idle"
        ? { label: "НАТИСНИ, ЩОБ ГОВОРИТИ", hint: "Голосовий канал активний", micVis: true }
        : voiceState === "listening"
          ? { label: "СЛУХАЮ...", hint: "Натисни ще раз, щоб зупинити", micVis: false }
          : { label: "ОБРОБКА...", hint: "Аналізую сигнал", micVis: true };
    return cfg;
  }, [voiceState]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.setAttribute("data-theme", theme);
    return () => {
      if (document.body.getAttribute("data-theme") === theme) {
        document.body.removeAttribute("data-theme");
      }
    };
  }, [theme]);

  const layerAccent = useMemo(() => {
    if (activeLayer === "atmosphere") return { hex: "#00ff66", dim: "rgba(0, 255, 102, 0.1)" };
    if (activeLayer === "ocean") return { hex: "#4ea1ff", dim: "rgba(78, 161, 255, 0.12)" };
    if (activeLayer === "ice") return { hex: "#b8d7ff", dim: "rgba(184, 215, 255, 0.12)" };
    return { hex: "#ffcc66", dim: "rgba(255, 204, 102, 0.12)" };
  }, [activeLayer]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.setProperty("--accent-green", layerAccent.hex);
    document.body.style.setProperty("--accent-green-dim", layerAccent.dim);
  }, [layerAccent.dim, layerAccent.hex]);

  const timeRangeMs = useMemo(() => {
    if (timeRange === "24h") return 24 * 60 * 60 * 1000;
    if (timeRange === "7d") return 7 * 24 * 60 * 60 * 1000;
    return 30 * 24 * 60 * 60 * 1000;
  }, [timeRange]);

  const fallbackEvents = useMemo<EonetEvent[]>(
    () => [
      {
        id: "SIM-FIRE-1",
        title: "Пожежі: сезонний кластер (демо)",
        categories: ["Wildfires"],
        status: "open",
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        geometryDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "SIM-STORM-1",
        title: "Циклон: посилення в Атлантиці (демо)",
        categories: ["Severe Storms"],
        status: "open",
        updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        geometryDate: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "SIM-ICE-1",
        title: "Лід: аномалія площі покриву (демо)",
        categories: ["Sea and Lake Ice"],
        status: "open",
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        geometryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setEonetStatus("loading");
      try {
        const res = await fetch(
          "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=12",
          {
            cache: "no-store",
          },
        );
        if (!res.ok) throw new Error("bad_status");
        const json = (await res.json()) as any;
        const eventsRaw: any[] = Array.isArray(json?.events) ? json.events : [];
        const mapped: EonetEvent[] = eventsRaw.map((e) => {
          const geometries: any[] = Array.isArray(e?.geometry) ? e.geometry : [];
          const lastGeo = geometries.length ? geometries[geometries.length - 1] : null;
          const cats: any[] = Array.isArray(e?.categories) ? e.categories : [];
          return {
            id: String(e?.id ?? ""),
            title: String(e?.title ?? ""),
            link: typeof e?.link === "string" ? e.link : undefined,
            categories: cats.map((c) => String(c?.title ?? "")).filter(Boolean),
            status: typeof e?.status === "string" ? e.status : undefined,
            updatedAt: typeof e?.updated === "string" ? e.updated : undefined,
            geometryDate: typeof lastGeo?.date === "string" ? lastGeo.date : undefined,
          };
        });

        if (cancelled) return;
        setEonetEvents(mapped);
        setEonetStatus(mapped.length ? "ok" : "error");
      } catch {
        if (cancelled) return;
        setEonetEvents(fallbackEvents);
        setEonetStatus("error");
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [fallbackEvents]);

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    const min = now - timeRangeMs;
    const base = eonetEvents.length ? eonetEvents : fallbackEvents;
    const out = base.filter((ev) => {
      const d = ev.geometryDate ?? ev.updatedAt;
      if (!d) return true;
      const ts = Date.parse(d);
      if (!Number.isFinite(ts)) return true;
      return ts >= min;
    });
    return out.slice(0, 8);
  }, [eonetEvents, fallbackEvents, timeRangeMs]);

  const vmGoTo = useCallback((idx: number) => {
    setVmIndex((prev) => {
      const next = ((idx % 2) + 2) % 2;
      if (prev === next) return prev;
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (exportHintTimerRef.current) window.clearTimeout(exportHintTimerRef.current);
      exportHintTimerRef.current = null;
    };
  }, []);

  const exportGlobePng = useCallback(() => {
    const c = globeCanvasRef.current;
    if (!c) return;
    try {
      const url = c.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `earth-panel-${activeLayer}-${timeRange}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setExportHint("Експортовано PNG (глобус)");
      if (exportHintTimerRef.current) window.clearTimeout(exportHintTimerRef.current);
      exportHintTimerRef.current = window.setTimeout(() => setExportHint(""), 1600);
    } catch {
      setExportHint("Не вдалося експортувати");
      if (exportHintTimerRef.current) window.clearTimeout(exportHintTimerRef.current);
      exportHintTimerRef.current = window.setTimeout(() => setExportHint(""), 1600);
    }
  }, [activeLayer, timeRange]);

  const resetVmTimer = useCallback(() => {
    if (vmTimerRef.current) window.clearInterval(vmTimerRef.current);
    vmTimerRef.current = window.setInterval(() => {
      setVmIndex((i) => (i + 1) % 2);
    }, 7000);
  }, []);

  useEffect(() => {
    resetVmTimer();
    return () => {
      if (vmTimerRef.current) window.clearInterval(vmTimerRef.current);
      vmTimerRef.current = null;
    };
  }, [resetVmTimer]);

  const goToProduct = useCallback(
    (idx: number) => {
      setProductIndex(((idx % products.length) + products.length) % products.length);
    },
    [products.length],
  );

  const resetProductTimer = useCallback(() => {
    if (productTimerRef.current) window.clearInterval(productTimerRef.current);
    productTimerRef.current = window.setInterval(() => {
      setProductIndex((i) => (i + 1) % products.length);
    }, 3500);
  }, [products.length]);

  useEffect(() => {
    resetProductTimer();
    return () => {
      if (productTimerRef.current) window.clearInterval(productTimerRef.current);
      productTimerRef.current = null;
    };
  }, [resetProductTimer]);

  const startListening = useCallback(() => {
    setVoiceState("listening");
    if (voiceListeningTimerRef.current) window.clearTimeout(voiceListeningTimerRef.current);
    if (voiceProcessingTimerRef.current) window.clearTimeout(voiceProcessingTimerRef.current);

    voiceListeningTimerRef.current = window.setTimeout(() => {
      setVoiceState("processing");
      voiceProcessingTimerRef.current = window.setTimeout(() => {
        setVoiceState("idle");
      }, 2000);
    }, 6000);
  }, []);

  const stopListeningToProcessing = useCallback(() => {
    setVoiceState("processing");
    if (voiceListeningTimerRef.current) window.clearTimeout(voiceListeningTimerRef.current);
    voiceListeningTimerRef.current = null;

    if (voiceProcessingTimerRef.current) window.clearTimeout(voiceProcessingTimerRef.current);
    voiceProcessingTimerRef.current = window.setTimeout(() => {
      setVoiceState("idle");
    }, 2000);
  }, []);

  const toggleVoice = useCallback(() => {
    if (voiceState === "idle") return startListening();
    if (voiceState === "listening") return stopListeningToProcessing();
    setVoiceState("idle");
    if (voiceListeningTimerRef.current) window.clearTimeout(voiceListeningTimerRef.current);
    if (voiceProcessingTimerRef.current) window.clearTimeout(voiceProcessingTimerRef.current);
    voiceListeningTimerRef.current = null;
    voiceProcessingTimerRef.current = null;
  }, [startListening, stopListeningToProcessing, voiceState]);

  useEffect(() => {
    return () => {
      if (voiceListeningTimerRef.current) window.clearTimeout(voiceListeningTimerRef.current);
      if (voiceProcessingTimerRef.current) window.clearTimeout(voiceProcessingTimerRef.current);
      voiceListeningTimerRef.current = null;
      voiceProcessingTimerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };

    resize();
    window.addEventListener("resize", resize);

    const NUM = 60;
    const particles = Array.from({ length: NUM }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    const hexToRgb = (hex: string) => {
      const clean = hex.replace("#", "");
      const norm = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
      const n = parseInt(norm, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    };

    let raf = 0;
    let tick = 0;

    const draw = () => {
      tick += 0.016;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const accentHex = getComputedStyle(document.body)
        .getPropertyValue("--accent-green")
        .trim() || "#00FF66";
      const rgb = hexToRgb(accentHex);

      const inputActive = voiceState === "listening";
      const energy = inputActive ? 1.2 : 1.0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = 0.5;
        const cy = 0.5;
        if (inputActive) {
          p.vx += (cx - p.x) * 0.0003;
          p.vy += (cy - p.y) * 0.0003;
        }
        p.x += p.vx * energy;
        p.y += p.vy * energy;

        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        p.x = clamp01(p.x);
        p.y = clamp01(p.y);

        const pulse = 0.5 + 0.5 * Math.sin(tick * p.pulseSpeed * 60 + p.pulseOffset);
        const alpha = (p.opacity * 0.4 + pulse * 0.6) * (inputActive ? 1 : 0.6);
        const size = p.size * (inputActive ? 1 + pulse * 0.8 : 0.8 + pulse * 0.3);

        const px = p.x * W;
        const py = p.y * H;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = (p.x - q.x) * W;
          const dy = (p.y - q.y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = (inputActive ? 80 : 55) * dpr;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.25 * (inputActive ? 1.6 : 1);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${lineAlpha})`;
            ctx.lineWidth = 0.5 * dpr;
            ctx.moveTo(px, py);
            ctx.lineTo(q.x * W, q.y * H);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(px, py, size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
        ctx.fill();
      }

      raf = window.requestAnimationFrame(draw);
    };

    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [voiceState]);

  useEffect(() => {
    const canvas = globeCanvasRef.current;
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
  }, []);

  const copyContact = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
  }, []);

  const layerLabel = useMemo(() => {
    if (activeLayer === "atmosphere") return "Атмосфера";
    if (activeLayer === "ocean") return "Океан";
    if (activeLayer === "ice") return "Лід";
    return "Біосфера";
  }, [activeLayer]);

  const product = products[productIndex];

  return (
    <>
      <style jsx global>{`
        :root {
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
          --accent-orange: #ff4400;
          --radius-sm: 2px;
          --radius-md: 4px;
          --radius-lg: 8px;
          --gap: 16px;
          --font-stack: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        }

        [data-theme="light"] {
          --bg-body: #f0f0f0;
          --bg-card: #ffffff;
          --bg-card-hover: #f8f8f8;
          --border-color: #e0e0e0;
          --border-active: #bbbbbb;
          --text-primary: #050505;
          --text-secondary: #666666;
          --text-tertiary: #cccccc;
          --accent-green: #00aa44;
          --accent-green-dim: rgba(0, 170, 68, 0.05);
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
          background: linear-gradient(
            180deg,
            var(--text-primary) 0%,
            var(--text-secondary) 100%
          );
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
          background: #000;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          position: relative;
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
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s;
        }

        .vm-dot-active {
          background: rgba(255, 255, 255, 0.9);
          width: 16px;
          border-radius: 2px;
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

        .ai-module {
          grid-column: span 2;
          display: flex;
          flex-direction: column;
          min-height: 250px;
        }

        .voice-viz {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-bottom: 16px;
          position: relative;
        }

        .particle-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .voice-btn-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding-bottom: 4px;
        }

        .voice-status-label {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          font-family: 'SF Mono', 'Fira Code', monospace;
          transition: color 0.3s ease;
        }

        .voice-status-label.listening {
          color: var(--accent-green);
        }

        .voice-status-label.processing {
          color: var(--text-secondary);
        }

        .voice-btn {
          position: relative;
          width: 56px;
          height: 56px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-btn-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          transition: all 0.4s ease;
          opacity: 0;
        }

        .voice-ring-1 {
          width: 56px;
          height: 56px;
        }

        .voice-ring-2 {
          width: 76px;
          height: 76px;
        }

        .voice-ring-3 {
          width: 96px;
          height: 96px;
        }

        .voice-btn:not(.listening):not(.processing) .voice-ring-1 {
          opacity: 0.3;
          border-color: var(--border-active);
        }

        .voice-btn.listening .voice-ring-1 {
          opacity: 0.5;
          border-color: var(--accent-green);
          animation: voiceRing 2.4s ease-out infinite;
        }

        .voice-btn.listening .voice-ring-2 {
          opacity: 0.3;
          border-color: var(--accent-green);
          animation: voiceRing 2.4s ease-out 0.6s infinite;
        }

        .voice-btn.listening .voice-ring-3 {
          opacity: 0.15;
          border-color: var(--accent-green);
          animation: voiceRing 2.4s ease-out 1.2s infinite;
        }

        .voice-btn.processing .voice-ring-1 {
          opacity: 0.6;
          border-color: var(--text-secondary);
          border-top-color: transparent;
          animation: voiceSpin 1s linear infinite;
        }

        @keyframes voiceRing {
          0% {
            transform: scale(0.9);
            opacity: 0.9;
          }
          70% {
            transform: scale(1.15);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }

        @keyframes voiceSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .voice-btn-core {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--bg-card-hover);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .voice-btn.listening .voice-btn-core {
          background: var(--accent-green-dim);
          border-color: var(--accent-green);
          color: var(--accent-green);
        }

        .voice-btn.processing .voice-btn-core {
          background: var(--bg-card-hover);
          border-color: var(--border-active);
          color: var(--text-secondary);
        }

        .voice-btn-core:hover {
          border-color: var(--border-active);
          color: var(--text-primary);
        }

        .voice-hint {
          font-size: 9px;
          color: var(--text-tertiary);
          font-family: 'SF Mono', 'Fira Code', monospace;
          letter-spacing: 0.05em;
          min-height: 12px;
          transition: color 0.3s ease;
        }

        .voice-hint.active {
          color: var(--accent-green);
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
          .ai-module {
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

      <div className="arch-page">
        <div className="grid-container">
          <article className="card bio-module">
            <div>
              <span className="label">Місія</span>
              <h1 className="display-text">
                Панель даних<br />про Землю
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  marginTop: 16,
                  maxWidth: 400,
                }}
              >
                Візуальний прототип для інтерпретації супутникових спостережень: атмосфера, океан, лід і біосфера —
                в одному інтерфейсі.
              </p>

              <div className="pill-row">
                <button
                  type="button"
                  className={`mc-pill${activeLayer === "atmosphere" ? " active" : ""}`}
                  onClick={() => setActiveLayer("atmosphere")}
                >
                  Атмосфера
                </button>
                <button
                  type="button"
                  className={`mc-pill${activeLayer === "ocean" ? " active" : ""}`}
                  onClick={() => setActiveLayer("ocean")}
                >
                  Океан
                </button>
                <button
                  type="button"
                  className={`mc-pill${activeLayer === "ice" ? " active" : ""}`}
                  onClick={() => setActiveLayer("ice")}
                >
                  Лід
                </button>
                <button
                  type="button"
                  className={`mc-pill${activeLayer === "biosphere" ? " active" : ""}`}
                  onClick={() => setActiveLayer("biosphere")}
                >
                  Біосфера
                </button>

                <select
                  className="mini-select"
                  value={timeRange}
                  onChange={(e) => {
                    const v = e.target.value as TimeRange;
                    if (v === "24h" || v === "7d" || v === "30d") setTimeRange(v);
                  }}
                >
                  <option value="24h">Останні 24h</option>
                  <option value="7d">Останні 7d</option>
                  <option value="30d">Останні 30d</option>
                </select>
              </div>
            </div>

            <div className="bio-stats" style={{ marginTop: 32 }}>
              <div className="stat-item">
                <strong>LEO</strong>
                <span>Орбіта</span>
              </div>
              <div className="stat-item">
                <strong>{layerLabel}</strong>
                <span>Шар</span>
              </div>
              <div className="stat-item">
                <strong>{timeRange.toUpperCase()}</strong>
                <span>Вікно</span>
              </div>
            </div>
          </article>

          <article
            className="card visual-module"
            onMouseEnter={() => {
              if (vmTimerRef.current) window.clearInterval(vmTimerRef.current);
              vmTimerRef.current = null;
            }}
            onMouseLeave={() => {
              resetVmTimer();
            }}
          >
            <div
              className={`vm-slide${vmIndex === 0 ? " vm-slide-active" : ""}`}
              style={{ background: "#000", position: "relative", overflow: "hidden" }}
            >
              <canvas
                ref={globeCanvasRef}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
              <div style={{ position: "absolute", top: 20, left: 24, zIndex: 4 }}>
                <span className="label" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Сектор
                </span>
              </div>
              <div style={{ position: "absolute", bottom: 20, left: 24, zIndex: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#00FF66",
                      boxShadow: "0 0 8px #00FF66",
                      animation: "locPulse 2s infinite",
                    }}
                  />
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Геопанорама: {layerLabel}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    borderTop: "1px solid rgba(255,255,255,0.15)",
                    paddingTop: 10,
                  }}
                >
                  <span className="mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
                    SIG: {activeLayer.toUpperCase()}
                  </span>
                  <span className="mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
                    RANGE: {timeRange.toUpperCase()}
                  </span>
                  <span className="mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>
                    UTC
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`vm-slide${vmIndex === 1 ? " vm-slide-active" : ""}`}
              style={{ background: "var(--bg-card)" }}
            >
              <div
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <span className="label" style={{ color: "var(--text-secondary)", zIndex: 3 }}>
                  Канали даних
                </span>
                <div className="hobby-grid">
                  <div className="hobby-chip">
                    <div className="hobby-chip-label">Атмосфера</div>
                    <div className="hobby-chip-sub">AOD / CO₂ / Хмари</div>
                  </div>
                  <div className="hobby-chip">
                    <div className="hobby-chip-label">Океан</div>
                    <div className="hobby-chip-sub">SST / Колір / Рівень</div>
                  </div>
                  <div className="hobby-chip">
                    <div className="hobby-chip-label">Лід</div>
                    <div className="hobby-chip-sub">Площа / Товщина</div>
                  </div>
                  <div className="hobby-chip">
                    <div className="hobby-chip-label">Біосфера</div>
                    <div className="hobby-chip-sub">NDVI / Біомаса</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="vm-nav">
              <div
                className={`vm-dot${vmIndex === 0 ? " vm-dot-active" : ""}`}
                onClick={() => vmGoTo(0)}
              />
              <div
                className={`vm-dot${vmIndex === 1 ? " vm-dot-active" : ""}`}
                onClick={() => vmGoTo(1)}
              />
            </div>
          </article>

          <article className="card ai-module">
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <span className="label">Аналітик місії</span>
              <span className="mono" style={{ color: "var(--accent-green)" }}>
                ● ЗВ’ЯЗОК
              </span>
            </div>

            <div className="voice-viz">
              <canvas ref={particleCanvasRef} className="particle-canvas" />
            </div>

            <p
              className="mono"
              style={{ textAlign: "center", marginBottom: 24, color: "var(--text-secondary)" }}
            >
              "Готовий інтерпретувати телеметрію та супутникові зрізи."
            </p>

            <div className="voice-btn-area">
              <div className={`voice-status-label${voiceState !== "idle" ? ` ${voiceState}` : ""}`}>
                {voiceUi.label}
              </div>
              <button
                className={`voice-btn${voiceState !== "idle" ? ` ${voiceState}` : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleVoice();
                }}
              >
                <div className="voice-btn-ring voice-ring-1" />
                <div className="voice-btn-ring voice-ring-2" />
                <div className="voice-btn-ring voice-ring-3" />
                <div className="voice-btn-core">
                  {voiceState === "listening" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  )}
                </div>
              </button>
              <div className={`voice-hint${voiceState === "listening" ? " active" : ""}`}>{voiceUi.hint}</div>
            </div>
          </article>

          <article className="card" style={{ gridColumn: "span 1" }}>
            <span className="label">Метрики</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 600 }}>Стан каналу</div>
                <div className="mono" style={{ color: "var(--accent-green)" }}>
                  STABLE
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 600 }}>Частота зрізу</div>
                <div className="mono">{timeRange === "24h" ? "15m" : timeRange === "7d" ? "3h" : "1d"}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 600 }}>Джерело</div>
                <div className="mono">NASA / EONET</div>
              </div>
              <div className="hint">Порада: обери шар і діапазон — інтенсивність на глобусі зміниться.</div>

              <button
                type="button"
                className="mc-pill"
                onClick={exportGlobePng}
                style={{ alignSelf: "flex-start" }}
              >
                Експорт PNG (глобус)
              </button>
              <div className="hint">{exportHint}</div>
            </div>
          </article>

          <article className="card" style={{ gridColumn: "span 1" }}>
            <span className="label">Події (NASA EONET)</span>
            <div className="mono" style={{ marginTop: -4 }}>
              Статус: {eonetStatus === "loading" ? "завантаження" : eonetStatus === "ok" ? "онлайн" : "fallback"}
            </div>
            <div className="event-list">
              {filteredEvents.map((ev) => {
                const href = ev.link ?? "https://eonet.gsfc.nasa.gov/";
                const dt = ev.geometryDate ?? ev.updatedAt;
                return (
                  <a key={ev.id} className="event-item" href={href} target="_blank" rel="noreferrer">
                    <div style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>{ev.title}</div>
                    <div className="event-meta">
                      {ev.categories.slice(0, 2).map((c) => (
                        <span key={c} className="chip">
                          {c}
                        </span>
                      ))}
                      {dt && (
                        <span className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
                          {new Date(dt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </article>

          <article
            className="card product-module"
            onMouseEnter={() => {
              if (productTimerRef.current) window.clearInterval(productTimerRef.current);
              productTimerRef.current = null;
            }}
            onMouseLeave={() => {
              resetProductTimer();
            }}
          >
            <div className="product-slider">
              <div
                className="product-image"
                style={{
                  background:
                    product.accent === "green"
                      ? "linear-gradient(135deg, #0d1a0d 0%, #111 100%)"
                      : product.accent === "blue"
                        ? "linear-gradient(135deg, #0d0d1a 0%, #111 100%)"
                        : product.accent === "orange"
                          ? "linear-gradient(135deg, #1a0d0d 0%, #111 100%)"
                          : "linear-gradient(135deg, #0d1515 0%, #111 100%)",
                }}
              >
                {product.icon === "bezier" ? (
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(0,255,102,0.6)" strokeWidth="1">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ) : product.icon === "nexus" ? (
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(100,100,255,0.6)" strokeWidth="1">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                ) : product.icon === "pulsar" ? (
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(255,100,60,0.6)" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ) : (
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(0,200,200,0.6)" strokeWidth="1">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                )}
              </div>

              <div className="product-details">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3>{product.name}</h3>
                  <span className="mono">{product.version}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{product.desc}</p>
                <div className="tag-group">
                  {product.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="product-nav">
                <div className="product-dots">
                  {products.map((_, i) => (
                    <div
                      key={i}
                      className={`product-dot${i === productIndex ? " active" : ""}`}
                      onClick={() => {
                        goToProduct(i);
                        resetProductTimer();
                      }}
                    />
                  ))}
                </div>
                <span className="product-counter">
                  {pad2(productIndex + 1)} / {pad2(products.length)}
                </span>
                <div className="product-arrows">
                  <button
                    className="product-arrow"
                    onClick={() => {
                      goToProduct(productIndex - 1);
                      resetProductTimer();
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    className="product-arrow"
                    onClick={() => {
                      goToProduct(productIndex + 1);
                      resetProductTimer();
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>

          <div className="social-module">
            <a className="social-btn" href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noreferrer">
              <span>EONET</span>
            </a>
            <a className="social-btn" href="https://earthdata.nasa.gov/" target="_blank" rel="noreferrer">
              <span>Earthdata</span>
            </a>
            <a className="social-btn" href="https://worldview.earthdata.nasa.gov/" target="_blank" rel="noreferrer">
              <span>Worldview</span>
            </a>
            <a className="social-btn" href="https://gibs.earthdata.nasa.gov/" target="_blank" rel="noreferrer">
              <span>GIBS</span>
            </a>
          </div>

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
                onClick={() => copyContact("19129516960")}
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
                onClick={() => copyContact("yeung-wat")}
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
                onClick={() => copyContact("qu1091962215@gmail.com")}
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

          <div className="settings-module">
            <span className="mono">© 2026 Орбітальна панель. Демонстраційний прототип.</span>
            <div
              className="toggle-switch"
              onClick={() => {
                setTheme((p) => (p === "dark" ? "light" : "dark"));
              }}
            >
              <div className={`toggle-option${theme === "dark" ? " active" : ""}`}>НІЧ</div>
              <div className={`toggle-option${theme === "light" ? " active" : ""}`}>ДЕНЬ</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
