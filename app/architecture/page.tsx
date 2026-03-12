"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import ArchitectureStyles from "./_components/ArchitectureStyles";
import MissionCard from "./_components/MissionCard";
import VisualModule from "./_components/VisualModule";
import MetricsCard from "./_components/MetricsCard";
import EventsCard from "./_components/EventsCard";
import ProductModule from "./_components/ProductModule";
import ResourceLinks from "./_components/ResourceLinks";
import ContactBar from "./_components/ContactBar";
import FooterBar from "./_components/FooterBar";
import ApodCard, { type ApodData } from "./_components/ApodCard";
import TelemetryCard from "./_components/TelemetryCard";
import type { EonetEvent, Product, ThemeMode, DataLayer, TimeRange } from "./_components/types";
import { getLayerAccent, getTimeRangeMs } from "./_components/utils";

export default function ArchitecturePage() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  const [activeLayer, setActiveLayer] = useState<DataLayer>("atmosphere");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [eonetEvents, setEonetEvents] = useState<EonetEvent[]>([]);
  const [eonetStatus, setEonetStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [exportHint, setExportHint] = useState<string>("");
  const [apodStatus, setApodStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [apodData, setApodData] = useState<ApodData | null>(null);

  const globeCanvasRef = useRef<HTMLCanvasElement | null>(null);

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

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.setAttribute("data-theme", theme);
    return () => {
      if (document.body.getAttribute("data-theme") === theme) {
        document.body.removeAttribute("data-theme");
      }
    };
  }, [theme]);

  const layerAccent = useMemo(() => getLayerAccent(activeLayer), [activeLayer]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.setProperty("--accent-green", layerAccent.hex);
    document.body.style.setProperty("--accent-green-dim", layerAccent.dim);
  }, [layerAccent.dim, layerAccent.hex]);

  const timeRangeMs = useMemo(() => getTimeRangeMs(timeRange), [timeRange]);

  const loadApod = useCallback(async () => {
    setApodStatus("loading");
    try {
      const res = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("APOD fetch failed");
      const data = (await res.json()) as ApodData;
      setApodData(data);
      setApodStatus("ok");
    } catch {
      const demo: ApodData = {
        title: "Earthrise (демо)",
        date: new Date().toISOString().slice(0, 10),
        explanation:
          "Демо-запис для NASA APOD. Якщо мережа/ліміт API недоступні, панель все одно показує приклад контенту.",
        url: "https://www.nasa.gov/wp-content/uploads/2023/03/as11-40-5874orig.jpg",
        media_type: "image",
        copyright: "NASA",
      };
      setApodData(demo);
      setApodStatus("ok");
    }
  }, []);

  useEffect(() => {
    loadApod();
  }, [loadApod]);

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

  useEffect(() => {
    return () => {
      if (exportHintTimerRef.current) window.clearTimeout(exportHintTimerRef.current);
      exportHintTimerRef.current = null;
    };
  }, []);

  return (
    <>
      <ArchitectureStyles />

      <div className="arch-topbar">
        <Link href="/" className="arch-back">
          ← Назад на головну
        </Link>
      </div>

      <div className="arch-page">
        <div className="grid-container">
          <MissionCard
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />

          <VisualModule activeLayer={activeLayer} timeRange={timeRange} canvasRef={globeCanvasRef} />

          <MetricsCard
            timeRange={timeRange}
            exportHint={exportHint}
            onExport={exportGlobePng}
            layer={activeLayer}
          />

          <EventsCard status={eonetStatus} events={filteredEvents} />

          <ApodCard status={apodStatus} data={apodData} onRefresh={loadApod} />

          <TelemetryCard layer={activeLayer} timeRange={timeRange} />

          <ProductModule products={products} />

          <ResourceLinks />

          <ContactBar />

          <FooterBar theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </>
  );
}
