"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import "./BiologyModel.css";

// Static sizes/quantities that don't need translation
const DATA_STATIC: Record<string, any> = {
  nucleus: {
    nameKey: "bm_organelle_nucleus_name",
    subKey: "bm_organelle_nucleus_sub",
    funcKey: "bm_organelle_nucleus_func",
    classKey: "bm_organelle_nucleus_class",
    descKey: "bm_organelle_nucleus_desc",
    size: "~0.5–2 µm",
    qty: "bm_one_per_cell",
    barColor: "#FF00AA",
    barWidth: "90%",
    sizeRange: "bm_variable",
    membrane: "bm_none",
    copies: "1",
  },
  mito: {
    nameKey: "bm_organelle_mito_name",
    subKey: "bm_organelle_mito_sub",
    funcKey: "bm_organelle_mito_func",
    classKey: "bm_organelle_mito_class",
    membraneKey: "bm_organelle_mito_membrane",
    descKey: "bm_organelle_mito_desc",
    size: "0.5–3 µm",
    qty: "1,000–2,000",
    barColor: "#00FFFF",
    barWidth: "80%",
    sizeRange: "0.5–3 µm",
    copies: "1,000–2,000",
  },
  mito2: {
    nameKey: "bm_organelle_mito_name",
    subKey: "bm_organelle_mito_sub",
    funcKey: "bm_organelle_mito_func",
    classKey: "bm_organelle_mito_class",
    membraneKey: "bm_organelle_mito_membrane",
    descKey: "bm_organelle_mito_desc",
    size: "0.5–3 µm",
    qty: "1,000–2,000",
    barColor: "#00FFFF",
    barWidth: "80%",
    sizeRange: "0.5–3 µm",
    copies: "1,000–2,000",
  },
  lysosome: {
    nameKey: "bm_organelle_lysosome_name",
    subKey: "bm_organelle_lysosome_sub",
    funcKey: "bm_organelle_lysosome_func",
    classKey: "bm_organelle_lysosome_class",
    membraneKey: "bm_organelle_lysosome_membrane",
    descKey: "bm_organelle_lysosome_desc",
    size: "0.1–1.2 µm",
    qty: "300+",
    barColor: "#00FF55",
    barWidth: "55%",
    sizeRange: "0.1–1.2 µm",
    copies: "300–400",
  },
  membrane: {
    nameKey: "bm_organelle_membrane_name",
    subKey: "bm_organelle_membrane_sub",
    funcKey: "bm_organelle_membrane_func",
    classKey: "bm_organelle_membrane_class",
    membraneKey: "bm_organelle_membrane_membrane",
    descKey: "bm_organelle_membrane_desc",
    size: "7–10 nm",
    qty: "bm_continuous",
    barColor: "#7000FF",
    barWidth: "70%",
    sizeRange: "7–10 nm",
    copies: "bm_continuous",
  },
  nucleolus: {
    nameKey: "bm_organelle_nucleolus_name",
    subKey: "bm_organelle_nucleolus_sub",
    funcKey: "bm_organelle_nucleolus_func",
    classKey: "bm_organelle_nucleolus_class",
    membraneKey: "bm_organelle_nucleolus_membrane",
    descKey: "bm_organelle_nucleolus_desc",
    size: "1–3 µm",
    qty: "1–4",
    barColor: "#ffffff",
    barWidth: "60%",
    sizeRange: "1–3 µm",
    copies: "1–4",
  },
};

const LEGEND_IDS = [
  { id: "nucleus", color: "#FF00AA", nameKey: "bm_organelle_nucleus_name" },
  { id: "mito", color: "#00FFFF", nameKey: "bm_organelle_mito_name" },
  { id: "lysosome", color: "#00FF55", nameKey: "bm_organelle_lysosome_name" },
  { id: "nucleolus", color: "#ffffff", nameKey: "bm_organelle_nucleolus_name" },
  { id: "membrane", color: "#7000FF", nameKey: "bm_organelle_membrane_name" },
];

const ZOOM_MAGS: Record<number, string> = {
  0: "1,000×",
  20: "2,500×",
  40: "5,000×",
  60: "10,000×",
  80: "25,000×",
  100: "50,000×",
};

const BiologyModel: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  // Helper to build translated DATA object
  const getTranslatedData = useCallback(
    (id: string) => {
      const s = DATA_STATIC[id];
      if (!s) return null;
      return {
        ...s,
        name: t(s.nameKey),
        sub: t(s.subKey),
        func: t(s.funcKey),
        classification: t(s.classKey),
        membrane: s.membraneKey ? t(s.membraneKey) : t("bm_none"),
        qty: s.qty && s.qty.startsWith("bm_") ? t(s.qty) : s.qty,
        sizeRange:
          s.sizeRange && s.sizeRange.startsWith("bm_")
            ? t(s.sizeRange)
            : s.sizeRange,
        copies: s.copies && s.copies.startsWith("bm_") ? t(s.copies) : s.copies,
        description: t(s.descKey),
      };
    },
    [t],
  );

  const [zoomLevel, setZoomLevel] = useState(60);
  const [renderMode, setRenderMode] = useState("ADDITIVE");
  const [focusVal, setFocusVal] = useState(70);
  const [focusDisplay, setFocusDisplay] = useState("f/1.2");
  const [coordX, setCoordX] = useState(45.9221);
  const [coordY, setCoordY] = useState(-12.449);
  const [atpVal, setAtpVal] = useState(38);
  const [footerStatus, setFooterStatus] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLegend, setActiveLegend] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [tooltip, setTooltip] = useState<any>({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });
  const [organelleBlur, setOrganelleBlur] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const cellContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setFooterStatus(t("bm_data_source"));
  }, [t]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoordX((prev) =>
        parseFloat((prev + (Math.random() - 0.5) * 0.002).toFixed(4)),
      );
      setCoordY((prev) =>
        parseFloat((prev + (Math.random() - 0.5) * 0.002).toFixed(4)),
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAtpVal(36 + Math.floor(Math.random() * 4));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getNearestZoomMag = (level: number) => {
    const keys = Object.keys(ZOOM_MAGS).map(Number);
    const nearest = keys.reduce((a, b) =>
      Math.abs(b - level) < Math.abs(a - level) ? b : a,
    );
    return ZOOM_MAGS[nearest];
  };

  const cellScale = 0.6 + (zoomLevel / 100) * 0.8;

  const getCellFilter = () => {
    if (renderMode === "THERMAL") return "hue-rotate(120deg) saturate(1.5)";
    if (renderMode === "WIREFRAME") return "grayscale(1) brightness(1.5)";
    return "none";
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(100, prev + 20));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0, prev - 20));

  const handleRenderMode = (mode: string) => {
    setRenderMode(mode);
    setFooterStatus(t("bm_render_mode_active", { mode }));
    setTimeout(() => setFooterStatus(t("bm_data_source")), 3000);
  };

  const handleFocusChange = (val: string) => {
    const v = Number(val);
    setFocusVal(v);
    const f = (0.8 + (v / 100) * 3.2).toFixed(1);
    setFocusDisplay(`f/${f}`);
    setOrganelleBlur((1 - v / 100) * 6);
  };

  const handleExport = () => {
    setFooterStatus(t("bm_export_initiated"));
    setTimeout(() => setFooterStatus(t("bm_data_source")), 3000);
  };

  const handleReset = () => {
    setZoomLevel(60);
    setRenderMode("ADDITIVE");
    setFocusVal(70);
    setFocusDisplay("f/1.2");
    setOrganelleBlur(0);
    setFooterStatus(t("bm_view_reset"));
    setTimeout(() => setFooterStatus(t("bm_data_source")), 3000);
  };

  const openDetail = useCallback(
    (id: string) => {
      const key = id.replace("2", "");
      const d = getTranslatedData(key);
      if (!d) return;
      setDetailData({ ...d, id });
      setDetailVisible(true);
      setActiveId(id);
    },
    [getTranslatedData],
  );

  const closeDetail = () => {
    setDetailVisible(false);
    setActiveId(null);
    setActiveLegend(null);
  };

  const handleLegendClick = (id: string) => {
    if (activeLegend === id) {
      setActiveLegend(null);
      setDetailVisible(false);
      setActiveId(null);
    } else {
      setActiveLegend(id);
      openDetail(id);
    }
  };

  const handleOrganelleHover = (e: React.MouseEvent, id: string) => {
    const key = id.replace("2", "");
    const d = getTranslatedData(key);
    if (!d) return;
    setTooltip({
      visible: true,
      x: e.clientX + 16,
      y: e.clientY - 10,
      data: d,
    });
  };

  const handleOrganelleMove = (e: React.MouseEvent) => {
    setTooltip((prev: any) => ({
      ...prev,
      x: Math.min(e.clientX + 16, window.innerWidth - 260),
      y: Math.min(e.clientY - 10, window.innerHeight - 160),
    }));
  };

  const handleOrganelleLeave = () => {
    setTooltip((prev: any) => ({ ...prev, visible: false }));
  };

  const handleOrganelleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    openDetail(id);
  };

  const handleStageClick = () => {
    setDetailVisible(false);
    setActiveId(null);
    setActiveLegend(null);
  };

  const getOrganelleClass = (id: string) => {
    if (!activeId) return "organelle-wrapper-el";
    if (
      id === activeId ||
      (activeId === "mito" && id === "mito2") ||
      (activeId === "mito2" && id === "mito")
    ) {
      return "organelle-wrapper-el ow-active";
    }
    return "organelle-wrapper-el ow-dimmed";
  };

  const organelleStyle = {
    filter: organelleBlur > 0 ? `blur(${organelleBlur}px)` : undefined,
  };

  return (
    <div className="biology-model-container">
      {isMobile && (
        <div className="mobile-blocker">
          <div className="mobile-blocker-content">
            <div className="blocker-icon">!</div>
            <h2>{t("bm_mobile_not_supported_title")}</h2>
            <p>{t("bm_mobile_not_supported_desc")}</p>
            <button
              className="blocker-back-btn"
              onClick={() => router.push("/")}
            >
              {t("nav_back_home")}
            </button>
          </div>
        </div>
      )}
      <button className="back-btn" onClick={() => router.push("/")}>
        ← {t("nav_back_home")}
      </button>

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="tooltip-container"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {tooltip.data.name}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              color: "#666666",
            }}
          >
            <span>{t("bm_func")}</span>
            <span style={{ color: "#ffffff", textAlign: "right" }}>
              {tooltip.data.func}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              color: "#666666",
            }}
          >
            <span>{t("bm_size")}</span>
            <span style={{ color: "#ffffff", textAlign: "right" }}>
              {tooltip.data.size}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              color: "#666666",
            }}
          >
            <span>{t("bm_quantity")}</span>
            <span style={{ color: "#ffffff", textAlign: "right" }}>
              {tooltip.data.qty}
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 2,
              marginTop: 10,
              position: "relative",
              background: "#333333",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                background: tooltip.data.barColor,
                width: tooltip.data.barWidth,
                transition: "width 0.5s",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      <div
        className="detail-panel"
        style={{
          transform: detailVisible ? "translateX(0)" : "translateX(-20px)",
          opacity: detailVisible ? 1 : 0,
          pointerEvents: detailVisible ? "all" : "none",
        }}
      >
        <div
          onClick={closeDetail}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            cursor: "pointer",
            color: "#666666",
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          ✕
        </div>
        {detailData && (
          <>
            <div
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {detailData.name}
            </div>
            <div
              style={{
                color: "#00FFFF",
                fontSize: 9,
                letterSpacing: 2,
                marginBottom: 16,
              }}
            >
              {detailData.sub}
            </div>
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255,255,255,0.15)",
                margin: "12px 0",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#666666" }}>{t("bm_classification")}</span>
              <span style={{ color: "#ffffff", textAlign: "right" }}>
                {detailData.classification}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#666666" }}>{t("bm_size_range")}</span>
              <span style={{ color: "#ffffff", textAlign: "right" }}>
                {detailData.sizeRange}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#666666" }}>{t("bm_membrane")}</span>
              <span style={{ color: "#ffffff", textAlign: "right" }}>
                {detailData.membrane}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#666666" }}>{t("bm_copies_cell")}</span>
              <span style={{ color: "#ffffff", textAlign: "right" }}>
                {detailData.copies}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: 1,
                background: "rgba(255,255,255,0.15)",
                margin: "12px 0",
              }}
            ></div>
            <div
              style={{
                marginTop: 12,
                color: "#666666",
                lineHeight: 1.6,
                fontSize: 10,
              }}
            >
              {detailData.description}
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <header className="model-header">
        <div>
          SYS.VISUALIZATION //{" "}
          <span style={{ color: "#ffffff", fontWeight: 700 }}>
            OVR-RIDE ACTIVE
          </span>
        </div>
        <div>SEQ: 8492.A4 // T: 14:02:44:99</div>
        <div>RENDER_MODE: ADDITIVE_SPECTRUM</div>
      </header>

      {/* Left Panel */}
      <aside
        className="side-panel"
        style={{
          gridColumn: 1,
          gridRow: 2,
          borderRight: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 200,
              lineHeight: 1.1,
              letterSpacing: -1,
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            Bac
            <br />
            ter
            <br />
            ium
            <br />
            <strong style={{ fontWeight: 900, display: "block" }}>Model</strong>
          </h1>

          <div style={{ marginBottom: 30 }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                color: "#666666",
                letterSpacing: 1,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              {t("bm_observation_paradigm")}
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: 0.5 }}>
              {t("bm_sub_cellular")}
            </div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                color: "#666666",
                letterSpacing: 1,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              {t("bm_spectrum_mapping")}
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 12,
                letterSpacing: 0.5,
              }}
            >
              <span style={{ color: "#FF00AA" }}>MAGENTA</span> :{" "}
              {t("bm_magenta_label")}
              <br />
              <span style={{ color: "#00FFFF" }}>CYAN</span> :{" "}
              {t("bm_cyan_label")}
              <br />
              <span style={{ color: "#FFFF00" }}>YELLOW</span> :{" "}
              {t("bm_yellow_label")}
              <br />
              <span style={{ color: "#7000FF" }}>VIOLET</span> :{" "}
              {t("bm_violet_label")}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              color: "#666666",
              letterSpacing: 1,
              marginBottom: 10,
              textTransform: "uppercase",
            }}
          >
            {t("bm_organelle_index")}
          </div>
          {LEGEND_IDS.map((item) => (
            <div
              key={item.id}
              className={`legend-item-el${activeLegend === item.id ? " legend-active" : ""}`}
              onClick={() => handleLegendClick(item.id)}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: item.color,
                  flexShrink: 0,
                }}
              ></div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {t(item.nameKey)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              color: "#666666",
              letterSpacing: 1,
              marginBottom: 4,
              textTransform: "uppercase",
            }}
          >
            {t("bm_magnification_scale")}
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 12,
            }}
          >
            {t("bm_zoom_factor_label")}
          </div>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(255,255,255,0.4)",
              marginTop: 10,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -3,
                left: 0,
                width: 1,
                height: 7,
                background: "rgba(255,255,255,0.4)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: -3,
                right: 0,
                width: 1,
                height: 7,
                background: "rgba(255,255,255,0.4)",
              }}
            ></div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 8,
              color: "#666666",
              marginTop: 4,
            }}
          >
            <span>0</span>
            <span>1 µm</span>
          </div>
        </div>
      </aside>

      {/* Main Stage */}
      <main
        style={{
          gridColumn: 2,
          gridRow: 2,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
        onClick={handleStageClick}
      >
        <div
          ref={cellContainerRef}
          style={{
            position: "relative",
            width: "min(560px, 92vw)",
            height: "min(560px, 92vw)",
            isolation: "isolate",
            transform: `scale(${cellScale})`,
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
            filter: getCellFilter(),
          }}
        >
          {/* Scan overlay */}
          <div
            className="scan-anim"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 2,
              background:
                "linear-gradient(to bottom, transparent, rgba(0,255,255,0.15), transparent)",
              pointerEvents: "none",
              zIndex: 300,
            }}
          ></div>

          {/* Membrane */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 520,
              height: 520,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.08)",
              boxShadow:
                "inset 0 0 80px rgba(0,255,255,0.07), 0 0 120px rgba(255,0,255,0.06), inset 0 0 20px rgba(255,255,255,0.03)",
              zIndex: 5,
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(20,0,40,0.6), transparent 70%)",
            }}
          ></div>

          {/* ER rings */}
          <div
            className="er-ring-spin"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 380,
              height: 380,
              borderRadius: "50%",
              border: "1.5px dashed rgba(0,255,255,0.2)",
              pointerEvents: "none",
            }}
          ></div>
          <div
            className="er-ring-rev"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 460,
              height: 460,
              borderRadius: "50%",
              border: "1px dashed rgba(255,0,170,0.12)",
              pointerEvents: "none",
            }}
          ></div>

          {/* Ribosomes */}
          {[
            { style: { top: "38%", left: "72%", background: "#FFFF00" } },
            { style: { top: "62%", left: "68%", background: "#00FFFF" } },
            { style: { top: "30%", left: "40%", background: "#FFFF00" } },
            { style: { top: "70%", left: "35%", background: "#FF00AA" } },
            { style: { top: "55%", left: "78%", background: "#00FF55" } },
          ].map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 6,
                height: 6,
                borderRadius: "50%",
                mixBlendMode: "screen",
                opacity: 0.8,
                pointerEvents: "none",
                ...r.style,
              }}
            ></div>
          ))}

          {/* Mitochondrion 1 */}
          <div
            className={getOrganelleClass("mito")}
            style={{ top: "6%", left: "55%", width: 110, height: 44 }}
            onMouseEnter={(e) => handleOrganelleHover(e, "mito")}
            onMouseMove={handleOrganelleMove}
            onMouseLeave={handleOrganelleLeave}
            onClick={(e) => handleOrganelleClick(e, "mito")}
          >
            <div
              className="mito-float-1"
              style={{
                width: 110,
                height: 44,
                borderRadius: 100,
                background: "linear-gradient(45deg, #00FFFF, #0055FF, #00FFFF)",
                boxShadow:
                  "0 0 18px #00FFFF, inset 0 0 10px rgba(0,255,255,0.4)",
                opacity: 0.95,
                position: "relative",
                mixBlendMode: "screen",
                ...organelleStyle,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  pointerEvents: "none",
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: "block",
                      width: 2,
                      height: 18,
                      background: "rgba(255,255,255,0.4)",
                      borderRadius: 2,
                    }}
                  ></span>
                ))}
              </div>
            </div>
          </div>

          {/* Nucleus */}
          <div
            className={getOrganelleClass("nucleus")}
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 240,
              height: 240,
              borderRadius: "50%",
              zIndex: 50,
            }}
            onMouseEnter={(e) => handleOrganelleHover(e, "nucleus")}
            onMouseMove={handleOrganelleMove}
            onMouseLeave={handleOrganelleLeave}
            onClick={(e) => handleOrganelleClick(e, "nucleus")}
          >
            <div
              className="nucleus-pulse"
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,0,170,0.22)",
                  boxShadow:
                    "0 0 30px rgba(255,0,170,0.12), inset 0 0 40px rgba(255,0,170,0.06)",
                  zIndex: 10,
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 170,
                  height: 170,
                  borderRadius: "45% 55% 60% 40% / 55% 45% 55% 45%",
                  mixBlendMode: "screen",
                  filter:
                    organelleBlur > 0
                      ? `blur(2px) blur(${organelleBlur}px)`
                      : "blur(2px)",
                  background:
                    "radial-gradient(circle at 40% 35%, rgba(255,0,170,0.95), rgba(255,0,170,0.25) 55%, transparent 72%)",
                  boxShadow:
                    "0 0 18px rgba(255,0,170,0.45), inset 0 0 22px rgba(255,255,255,0.06)",
                  zIndex: 20,
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%) rotate(18deg)",
                  width: 140,
                  height: 140,
                  borderRadius: "55% 45% 45% 55% / 45% 55% 45% 55%",
                  mixBlendMode: "screen",
                  filter:
                    organelleBlur > 0
                      ? `blur(2px) blur(${organelleBlur}px)`
                      : "blur(2px)",
                  background:
                    "radial-gradient(circle at 60% 55%, rgba(255,255,0,0.65), rgba(255,255,0,0.12) 60%, transparent 78%)",
                  opacity: 0.9,
                  zIndex: 19,
                }}
              ></div>

              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%,-50%) rotate(${i ? -22 : 14}deg)`,
                    width: i ? 150 : 190,
                    height: i ? 90 : 120,
                    borderRadius: "50%",
                    border: `1.5px dashed rgba(0,255,255,${i ? 0.22 : 0.16})`,
                    boxShadow: "0 0 12px rgba(0,255,255,0.08)",
                    pointerEvents: "none",
                    zIndex: 14,
                  }}
                />
              ))}

              {/* ——— PLASMID: circular extra-chromosomal DNA ——— */}
              <div
                className="plasmid-orbit"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 54,
                  height: 54,
                  pointerEvents: "none",
                  zIndex: 22,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,180,0,0.75)",
                    boxShadow:
                      "0 0 10px rgba(255,180,0,0.5), inset 0 0 8px rgba(255,180,0,0.15)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "rgba(255,220,60,0.95)",
                    boxShadow: "0 0 6px rgba(255,220,60,0.8)",
                  }}
                />
              </div>

              {/* ——— RIBOSOMES: paired subunit dots ——— */}
              {[
                { top: "28%", left: "32%", c: "#00FFFF" },
                { top: "33%", left: "58%", c: "#00FF99" },
                { top: "52%", left: "26%", c: "#00FFFF" },
                { top: "60%", left: "55%", c: "#00FF99" },
                { top: "44%", left: "68%", c: "#00FFFF" },
                { top: "68%", left: "36%", c: "#00FF99" },
                { top: "22%", left: "46%", c: "#00FFFF" },
                { top: "70%", left: "58%", c: "#00FF99" },
              ].map((r, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: r.top,
                    left: r.left,
                    display: "flex",
                    gap: 2,
                    pointerEvents: "none",
                    zIndex: 23,
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: r.c,
                      opacity: 0.85,
                      mixBlendMode: "screen",
                      boxShadow: `0 0 5px ${r.c}`,
                    }}
                  />
                  <div
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: r.c,
                      opacity: 0.6,
                      mixBlendMode: "screen",
                      marginTop: 1,
                    }}
                  />
                </div>
              ))}

              {/* DNA texture dots */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: `${32 + ((i * 7) % 36)}%`,
                    left: `${30 + ((i * 11) % 40)}%`,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    opacity: 0.45,
                    mixBlendMode: "screen",
                    background:
                      i % 3 === 0
                        ? "#FF00AA"
                        : i % 3 === 1
                          ? "#FFFF00"
                          : "#FF44CC",
                    pointerEvents: "none",
                    zIndex: 16,
                  }}
                />
              ))}
            </div>

            {/* Golgi stack inside nucleus wrapper */}
            <div
              style={{
                position: "absolute",
                bottom: "12%",
                right: "10%",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                transform: "rotate(-30deg)",
              }}
            >
              <div
                style={{
                  height: 10,
                  borderRadius: 20,
                  opacity: 0.85,
                  width: 90,
                  background: "linear-gradient(90deg,#7000FF,#0055FF)",
                }}
              ></div>
              <div
                style={{
                  height: 10,
                  borderRadius: 20,
                  opacity: 0.85,
                  width: 110,
                  background: "linear-gradient(90deg,#0055FF,#00FFFF)",
                }}
              ></div>
              <div
                style={{
                  height: 10,
                  borderRadius: 20,
                  opacity: 0.85,
                  width: 95,
                  background: "linear-gradient(90deg,#00FFFF,#00FF55)",
                }}
              ></div>
              <div
                style={{
                  height: 10,
                  borderRadius: 20,
                  opacity: 0.85,
                  width: 75,
                  background: "linear-gradient(90deg,#00FF55,#FFFF00)",
                }}
              ></div>
            </div>

            {/* Vacuole */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                right: "8%",
                width: 55,
                height: 55,
                borderRadius: "50%",
                border: "2px solid #FFFF00",
                mixBlendMode: "screen",
                boxShadow:
                  "inset 0 0 15px rgba(255,255,0,0.15), 0 0 10px rgba(255,255,0,0.2)",
              }}
            ></div>

            {/* Lysosome */}
            <div
              className={getOrganelleClass("lysosome")}
              style={{
                position: "absolute",
                bottom: "22%",
                right: "8%",
                width: 72,
                height: 72,
              }}
              onMouseEnter={(e) => handleOrganelleHover(e, "lysosome")}
              onMouseMove={handleOrganelleMove}
              onMouseLeave={handleOrganelleLeave}
              onClick={(e) => handleOrganelleClick(e, "lysosome")}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  mixBlendMode: "screen",
                  background:
                    "radial-gradient(circle at 35% 35%, #FFFF00, #00FF55 70%)",
                  boxShadow: "0 0 20px rgba(255,255,0,0.5)",
                  ...organelleStyle,
                }}
              ></div>
            </div>

            {/* Mitochondrion 2 */}
            <div
              className={getOrganelleClass("mito2")}
              style={{
                position: "absolute",
                bottom: "14%",
                left: "8%",
                width: 130,
                height: 50,
              }}
              onMouseEnter={(e) => handleOrganelleHover(e, "mito2")}
              onMouseMove={handleOrganelleMove}
              onMouseLeave={handleOrganelleLeave}
              onClick={(e) => handleOrganelleClick(e, "mito2")}
            >
              <div
                className="mito-float-2"
                style={{
                  width: 130,
                  height: 50,
                  borderRadius: 100,
                  background:
                    "linear-gradient(-45deg, #FF00AA, #7000FF, #FF0055)",
                  boxShadow:
                    "0 0 18px #FF00AA, inset 0 0 10px rgba(255,0,170,0.4)",
                  position: "relative",
                  mixBlendMode: "screen",
                  ...organelleStyle,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      style={{
                        display: "block",
                        width: 2,
                        height: 18,
                        background: "rgba(255,255,255,0.4)",
                        borderRadius: 2,
                      }}
                    ></span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ripple ring */}
            <div
              className="ripple-anim"
              style={{
                position: "absolute",
                width: 100,
                height: 100,
                border: "1px solid #00FFFF",
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                pointerEvents: "none",
              }}
            ></div>

            {/* Nucleolus */}
            <div
              className={getOrganelleClass("nucleolus")}
              style={{
                position: "absolute",
                top: "42%",
                right: "20%",
                width: 36,
                height: 36,
              }}
              onMouseEnter={(e) => handleOrganelleHover(e, "nucleolus")}
              onMouseMove={handleOrganelleMove}
              onMouseLeave={handleOrganelleLeave}
              onClick={(e) => handleOrganelleClick(e, "nucleolus")}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  mixBlendMode: "screen",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.9) 30%, #00FFFF 100%)",
                  boxShadow: "0 0 25px #00FFFF, 0 0 8px #fff",
                  ...organelleStyle,
                }}
              ></div>
            </div>
          </div>

          {/* Labels */}
          <div
            className="label-container-el"
            style={{
              position: "absolute",
              top: -30,
              right: -110,
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
            }}
            onClick={() => openDetail("nucleus")}
          >
            <div
              className="label-text-el"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#ffffff",
                transition: "color 0.2s",
              }}
            >
              {t("bm_label_nucleoid")}
            </div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 8,
                color: "#00FFFF",
                letterSpacing: 1,
                marginTop: 2,
                opacity: 0.7,
              }}
            >
              {t("bm_label_nucleoid_seq")}
            </div>
            <div
              style={{
                position: "absolute",
                width: 130,
                height: 1,
                top: "50%",
                right: "100%",
                backgroundColor: "rgba(255,255,255,0.4)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                width: 1,
                height: 180,
                top: "50%",
                right: "calc(100% + 130px)",
                backgroundColor: "rgba(255,255,255,0.4)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                width: 5,
                height: 5,
                background: "#00FFFF",
                borderRadius: "50%",
                boxShadow: "0 0 6px #00FFFF",
                top: 180,
                right: "calc(100% + 130px - 2.5px)",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          </div>
        </div>
      </main>

      {/* Right Panel */}
      <aside
        className="side-panel"
        style={{
          gridColumn: 3,
          gridRow: 2,
          borderLeft: "1px solid rgba(255,255,255,0.15)",
          textAlign: "right",
        }}
      >
        {/* Zoom Control */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              color: "#666666",
              letterSpacing: 1,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {t("bm_zoom_factor")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="zoom-btn" onClick={handleZoomOut}>
              −
            </button>
            <div
              style={{
                flex: 1,
                height: 2,
                background: "#333333",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  background: "#00FFFF",
                  width: `${zoomLevel}%`,
                  transition: "width 0.3s",
                }}
              ></div>
            </div>
            <button
              className="zoom-btn"
              onClick={handleZoomIn}
              style={{ fontSize: 14 }}
            >
              +
            </button>
          </div>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              color: "#00FFFF",
              marginTop: 6,
            }}
          >
            {getNearestZoomMag(zoomLevel)} {t("bm_magnification")}
          </div>
        </div>

        {/* Render Mode */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              color: "#666666",
              letterSpacing: 1,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {t("bm_render_mode")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {["ADDITIVE", "THERMAL", "WIREFRAME"].map((mode) => (
              <button
                key={mode}
                className={`rmode-btn${renderMode === mode ? " rmode-active" : ""}`}
                onClick={() => handleRenderMode(mode)}
                style={{ textAlign: "left" }}
              >
                {renderMode === mode ? "▶ " : "◌ "}
                {mode === "ADDITIVE"
                  ? t("bm_mode_additive")
                  : mode === "THERMAL"
                    ? t("bm_mode_thermal")
                    : t("bm_mode_wireframe")}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Depth */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              color: "#666666",
              letterSpacing: 1,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {t("bm_focus_depth")}
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={focusVal}
            onChange={(e) => handleFocusChange(e.target.value)}
            style={{
              width: "100%",
              accentColor: "#FF00AA",
              background: "none",
              cursor: "pointer",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 8,
              color: "#666666",
              marginTop: 4,
            }}
          >
            <span>f/0.8</span>
            <span style={{ color: "#FF00AA" }}>{focusDisplay}</span>
            <span>f/4.0</span>
          </div>
        </div>

        {/* Cell Vitals */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              color: "#666666",
              letterSpacing: 1,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {t("bm_cell_vitals")}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666666" }}>{t("bm_atp_output")}</span>
              <span style={{ color: "#00FFFF" }}>{atpVal} mol/s</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666666" }}>{t("bm_ph_level")}</span>
              <span style={{ color: "#00FF55" }}>7.35</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              justifyContent: "flex-end",
            }}
          >
            <div
              className="blink-anim"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00FF55",
                boxShadow: "0 0 8px #00FF55",
              }}
            ></div>
            <div
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 9,
                color: "#00FF55",
                letterSpacing: 1,
              }}
            >
              {t("bm_rendering_complete")}
            </div>
          </div>
        </div>
      </aside>

      {/* Footer */}
      <footer
        style={{
          gridColumn: "1 / -1",
          gridRow: 3,
          borderTop: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              color: "#666666",
              letterSpacing: 1,
            }}
          >
            {t("bm_coordinates")}
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 10,
            }}
          >
            <span>
              X: <span style={{ color: "#00FFFF" }}>{coordX.toFixed(4)}</span>
            </span>
            <span>
              Y: <span style={{ color: "#FF00AA" }}>{coordY.toFixed(4)}</span>
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#00FF55",
              boxShadow: "0 0 6px #00FF55",
            }}
          ></div>
          <span
            style={{
              color: "#333333",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              fontSize: 9,
              letterSpacing: 1,
            }}
          >
            {footerStatus}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="footer-btn" onClick={handleExport}>
            {t("bm_export_svg")}
          </button>
          <button className="footer-btn footer-btn-reset" onClick={handleReset}>
            {t("bm_reset_view")}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default BiologyModel;
