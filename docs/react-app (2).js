import React, { useState, useEffect, useRef, useCallback } from 'react';

const DATA = {
  nucleus: {
    name: 'Nucleus', sub: 'SEQ. 01 // CONTROL CENTER',
    func: 'DNA STORAGE', size: '5–10 µm', qty: '1 per cell', barColor: '#FF00AA', barWidth: '95%',
    classification: 'Membrane-bound organelle', sizeRange: '5–10 µm diameter',
    membrane: 'Double (nuclear envelope)', copies: '1',
    description: 'The command center of the cell. Houses the genome and controls gene expression, protein synthesis, and cell division via mRNA transcription.'
  },
  mito: {
    name: 'Mitochondrion', sub: 'SEQ. 04 // POWERHOUSE',
    func: 'ATP SYNTHESIS', size: '0.5–3 µm', qty: '1,000–2,000', barColor: '#00FFFF', barWidth: '80%',
    classification: 'Semi-autonomous organelle', sizeRange: '0.5–3 µm',
    membrane: 'Double (cristae inner)', copies: '1,000–2,000',
    description: 'Generates 36–38 ATP molecules per glucose via oxidative phosphorylation. Contains its own mtDNA, evidence of ancient endosymbiosis.'
  },
  mito2: {
    name: 'Mitochondrion', sub: 'SEQ. 04 // POWERHOUSE',
    func: 'ATP SYNTHESIS', size: '0.5–3 µm', qty: '1,000–2,000', barColor: '#00FFFF', barWidth: '80%',
    classification: 'Semi-autonomous organelle', sizeRange: '0.5–3 µm',
    membrane: 'Double (cristae inner)', copies: '1,000–2,000',
    description: 'Generates 36–38 ATP molecules per glucose via oxidative phosphorylation. Contains its own mtDNA, evidence of ancient endosymbiosis.'
  },
  lysosome: {
    name: 'Lysosome', sub: 'SEQ. 07 // DIGESTION UNIT',
    func: 'HYDROLYTIC ENZYMES', size: '0.1–1.2 µm', qty: '300+', barColor: '#00FF55', barWidth: '55%',
    classification: 'Single-membrane vesicle', sizeRange: '0.1–1.2 µm',
    membrane: 'Single phospholipid', copies: '300–400',
    description: 'Contains 60+ acid hydrolases at pH 4.5–5. Responsible for autophagy, cellular debris clearance, and apoptosis signaling.'
  },
  membrane: {
    name: 'Plasma Membrane', sub: 'LIPID // BOUNDARY LAYER',
    func: 'SELECTIVE BARRIER', size: '7–10 nm thick', qty: 'Continuous', barColor: '#7000FF', barWidth: '70%',
    classification: 'Fluid mosaic bilayer', sizeRange: '7–10 nm thickness',
    membrane: 'Phospholipid bilayer', copies: 'Continuous',
    description: 'Fluid mosaic model: phospholipid bilayer with embedded proteins. Controls ion flux, receptor signaling, and cell-to-cell recognition.'
  },
  nucleolus: {
    name: 'Nucleolus', sub: 'SEQ. 02 // rRNA FACTORY',
    func: 'RIBOSOME BIOGENESIS', size: '1–3 µm', qty: '1–4 per nucleus', barColor: '#ffffff', barWidth: '60%',
    classification: 'Non-membrane organelle', sizeRange: '1–3 µm',
    membrane: 'None (phase-separated)', copies: '1–4 per nucleus',
    description: 'Dense nucleoplasmic body producing ribosomal RNA. A cell under high metabolic demand may have enlarged nucleoli visible under light microscopy.'
  }
};

const LEGEND = [
  { id: 'nucleus', color: '#FF00AA', name: 'Nucleus' },
  { id: 'mito', color: '#00FFFF', name: 'Mitochondrion' },
  { id: 'lysosome', color: '#00FF55', name: 'Lysosome' },
  { id: 'nucleolus', color: '#ffffff', name: 'Nucleolus' },
  { id: 'membrane', color: '#7000FF', name: 'Plasma Membrane' },
];

const ZOOM_MAGS = { 0: '1,000×', 20: '2,500×', 40: '5,000×', 60: '10,000×', 80: '25,000×', 100: '50,000×' };

const App = () => {
  const [zoomLevel, setZoomLevel] = useState(60);
  const [renderMode, setRenderMode] = useState('ADDITIVE');
  const [focusVal, setFocusVal] = useState(70);
  const [focusDisplay, setFocusDisplay] = useState('f/1.2');
  const [coordX, setCoordX] = useState(45.9221);
  const [coordY, setCoordY] = useState(-12.4490);
  const [atpVal, setAtpVal] = useState(38);
  const [footerStatus, setFooterStatus] = useState('DATA SOURCE: SYNTHETIC GENERATION ALGORITHM');
  const [activeId, setActiveId] = useState(null);
  const [activeLegend, setActiveLegend] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
  const [organelleBlur, setOrganelleBlur] = useState(0);
  const cellContainerRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;400;700&family=Outfit:wght@200;400;700;900&display=swap');
      @keyframes pulse-nucleus {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.04); }
      }
      @keyframes pulse-nucleus-local {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
      }
      @keyframes float-mito {
        0%, 100% { transform: rotate(35deg) translateY(0px); }
        50% { transform: rotate(35deg) translateY(-8px); }
      }
      @keyframes float-mito2 {
        0%, 100% { transform: rotate(-20deg) translateY(0px); }
        50% { transform: rotate(-20deg) translateY(6px); }
      }
      @keyframes spin-er {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      @keyframes spin-er-rev {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(-360deg); }
      }
      @keyframes blink-label {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes scan-line {
        0% { top: 0%; opacity: 0.6; }
        100% { top: 100%; opacity: 0; }
      }
      @keyframes ripple {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
        100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
      }
      .nucleus-pulse { animation: pulse-nucleus-local 4s ease-in-out infinite; }
      .mito-float-1 { animation: float-mito 5s ease-in-out infinite; }
      .mito-float-2 { animation: float-mito2 6s ease-in-out infinite; }
      .er-ring-spin { animation: spin-er 30s linear infinite; }
      .er-ring-rev { animation: spin-er-rev 50s linear infinite; }
      .scan-anim { animation: scan-line 4s linear infinite; }
      .blink-anim { animation: blink-label 2s infinite; }
      .ripple-anim { animation: ripple 3s ease-out infinite; }
      .organelle-wrapper-el {
        position: absolute;
        cursor: pointer;
        transition: filter 0.3s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1);
      }
      .organelle-wrapper-el:hover { filter: brightness(1.5) saturate(1.3); transform: scale(1.07); }
      .organelle-wrapper-el.ow-active { filter: brightness(2) saturate(1.5) !important; transform: scale(1.1) !important; }
      .organelle-wrapper-el.ow-dimmed { filter: brightness(0.3) saturate(0.3) !important; }
      .label-container-el { cursor: pointer; }
      .label-container-el:hover .label-text-el { color: #00FFFF; }
      .legend-item-el {
        display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
        cursor: pointer; padding: 6px 8px; transition: background 0.2s;
        border: 1px solid transparent;
      }
      .legend-item-el:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); }
      .legend-item-el.legend-active { border-color: #00FFFF; }
      .rmode-btn {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px; padding: 5px 8px;
        border: 1px solid rgba(255,255,255,0.15);
        color: #666666; cursor: pointer;
        letter-spacing: 1px; transition: all 0.2s;
        background: none;
      }
      .rmode-btn.rmode-active { border-color: #00FFFF; color: #00FFFF; }
      .zoom-btn {
        width: 24px; height: 24px; background: none;
        border: 1px solid rgba(255,255,255,0.15);
        color: #666666; font-size: 16px;
        cursor: pointer; line-height: 1;
        transition: all 0.2s; display: flex;
        align-items: center; justify-content: center;
      }
      .zoom-btn:hover { border-color: #00FFFF; color: #00FFFF; }
      .footer-btn {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px; padding: 4px 10px;
        background: none; border: 1px solid rgba(255,255,255,0.15);
        color: #666666; cursor: pointer;
        letter-spacing: 1px; transition: all 0.2s;
      }
      .footer-btn:hover { border-color: #00FFFF; color: #00FFFF; }
      .footer-btn-reset:hover { border-color: #FF00AA !important; color: #FF00AA !important; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoordX(prev => parseFloat((prev + (Math.random() - 0.5) * 0.002).toFixed(4)));
      setCoordY(prev => parseFloat((prev + (Math.random() - 0.5) * 0.002).toFixed(4)));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAtpVal(36 + Math.floor(Math.random() * 4));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getNearestZoomMag = (level) => {
    const keys = Object.keys(ZOOM_MAGS).map(Number);
    const nearest = keys.reduce((a, b) => Math.abs(b - level) < Math.abs(a - level) ? b : a);
    return ZOOM_MAGS[nearest];
  };

  const cellScale = 0.6 + (zoomLevel / 100) * 0.8;

  const getCellFilter = () => {
    if (renderMode === 'THERMAL') return 'hue-rotate(120deg) saturate(1.5)';
    if (renderMode === 'WIREFRAME') return 'grayscale(1) brightness(1.5)';
    return 'none';
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(100, prev + 20));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0, prev - 20));

  const handleRenderMode = (mode) => {
    setRenderMode(mode);
    setFooterStatus(`RENDER MODE: ${mode} // ACTIVE`);
    setTimeout(() => setFooterStatus('DATA SOURCE: SYNTHETIC GENERATION ALGORITHM'), 3000);
  };

  const handleFocusChange = (val) => {
    const v = Number(val);
    setFocusVal(v);
    const f = (0.8 + (v / 100) * 3.2).toFixed(1);
    setFocusDisplay(`f/${f}`);
    setOrganelleBlur((1 - v / 100) * 6);
  };

  const handleExport = () => {
    setFooterStatus('EXPORT INITIATED // SVG PACKAGE GENERATED');
    setTimeout(() => setFooterStatus('DATA SOURCE: SYNTHETIC GENERATION ALGORITHM'), 3000);
  };

  const handleReset = () => {
    setZoomLevel(60);
    setRenderMode('ADDITIVE');
    setFocusVal(70);
    setFocusDisplay('f/1.2');
    setOrganelleBlur(0);
    setFooterStatus('VIEW RESET // NOMINAL PARAMETERS RESTORED');
    setTimeout(() => setFooterStatus('DATA SOURCE: SYNTHETIC GENERATION ALGORITHM'), 3000);
  };

  const openDetail = useCallback((id) => {
    const d = DATA[id] || DATA[id.replace('2', '')];
    if (!d) return;
    setDetailData({ ...d, id });
    setDetailVisible(true);
    setActiveId(id);
  }, []);

  const closeDetail = () => {
    setDetailVisible(false);
    setActiveId(null);
    setActiveLegend(null);
  };

  const handleLegendClick = (id) => {
    if (activeLegend === id) {
      setActiveLegend(null);
      setDetailVisible(false);
      setActiveId(null);
    } else {
      setActiveLegend(id);
      openDetail(id);
    }
  };

  const handleOrganelleHover = (e, id) => {
    const d = DATA[id];
    if (!d) return;
    setTooltip({ visible: true, x: e.clientX + 16, y: e.clientY - 10, data: d });
  };

  const handleOrganelleMove = (e) => {
    setTooltip(prev => ({ ...prev, x: Math.min(e.clientX + 16, window.innerWidth - 260), y: Math.min(e.clientY - 10, window.innerHeight - 160) }));
  };

  const handleOrganelleLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleOrganelleClick = (e, id) => {
    e.stopPropagation();
    openDetail(id);
  };

  const handleStageClick = () => {
    setDetailVisible(false);
    setActiveId(null);
    setActiveLegend(null);
  };

  const getOrganelleClass = (id) => {
    if (!activeId) return 'organelle-wrapper-el';
    if (id === activeId || (activeId === 'mito' && id === 'mito2') || (activeId === 'mito2' && id === 'mito')) {
      return 'organelle-wrapper-el ow-active';
    }
    return 'organelle-wrapper-el ow-dimmed';
  };

  const organelleStyle = { filter: organelleBlur > 0 ? `blur(${organelleBlur}px)` : undefined };

  return (
    <div style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      fontFamily: "'Outfit', sans-serif",
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '250px 1fr 250px',
      gridTemplateRows: '60px 1fr 60px',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      backgroundPosition: 'center center',
      position: 'relative',
    }}>

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div style={{
          position: 'fixed',
          zIndex: 9999,
          left: tooltip.x,
          top: tooltip.y,
          background: 'rgba(0,0,0,0.92)',
          border: '1px solid #00FFFF',
          padding: '14px 18px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          pointerEvents: 'none',
          maxWidth: 240,
          lineHeight: 1.7,
        }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{tooltip.data.name}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, color: '#666666' }}>
            <span>FUNCTION</span><span style={{ color: '#ffffff', textAlign: 'right' }}>{tooltip.data.func}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, color: '#666666' }}>
            <span>SIZE</span><span style={{ color: '#ffffff', textAlign: 'right' }}>{tooltip.data.size}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, color: '#666666' }}>
            <span>QUANTITY</span><span style={{ color: '#ffffff', textAlign: 'right' }}>{tooltip.data.qty}</span>
          </div>
          <div style={{ width: '100%', height: 2, marginTop: 10, position: 'relative', background: '#333333' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: tooltip.data.barColor, width: tooltip.data.barWidth, transition: 'width 0.5s' }}></div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      <div style={{
        position: 'fixed',
        left: 270,
        top: 70,
        width: 260,
        background: 'rgba(0,0,0,0.95)',
        border: '1px solid rgba(255,255,255,0.15)',
        zIndex: 500,
        padding: 20,
        transform: detailVisible ? 'translateX(0)' : 'translateX(-20px)',
        opacity: detailVisible ? 1 : 0,
        pointerEvents: detailVisible ? 'all' : 'none',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      }}>
        <div onClick={closeDetail} style={{ position: 'absolute', top: 12, right: 12, cursor: 'pointer', color: '#666666', fontSize: 16, lineHeight: 1 }}>✕</div>
        {detailData && (
          <>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{detailData.name}</div>
            <div style={{ color: '#00FFFF', fontSize: 9, letterSpacing: 2, marginBottom: 16 }}>{detailData.sub}</div>
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.15)', margin: '12px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#666666' }}>CLASSIFICATION</span>
              <span style={{ color: '#ffffff', textAlign: 'right' }}>{detailData.classification}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#666666' }}>SIZE RANGE</span>
              <span style={{ color: '#ffffff', textAlign: 'right' }}>{detailData.sizeRange}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#666666' }}>MEMBRANE</span>
              <span style={{ color: '#ffffff', textAlign: 'right' }}>{detailData.membrane}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#666666' }}>COPIES / CELL</span>
              <span style={{ color: '#ffffff', textAlign: 'right' }}>{detailData.copies}</span>
            </div>
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.15)', margin: '12px 0' }}></div>
            <div style={{ marginTop: 12, color: '#666666', lineHeight: 1.6, fontSize: 10 }}>{detailData.description}</div>
          </>
        )}
      </div>

      {/* Header */}
      <header style={{
        gridColumn: '1 / -1',
        gridRow: 1,
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 30px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: 2,
        color: '#666666',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        zIndex: 100,
      }}>
        <div>SYS.VISUALIZATION // <span style={{ color: '#ffffff', fontWeight: 700 }}>OVR-RIDE ACTIVE</span></div>
        <div>SEQ: 8492.A4 // T: 14:02:44:99</div>
        <div>RENDER_MODE: ADDITIVE_SPECTRUM</div>
      </header>

      {/* Left Panel */}
      <aside style={{
        gridColumn: 1,
        gridRow: 2,
        borderRight: '1px solid rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderTop: 'none',
        borderBottom: 'none',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 100,
        backdropFilter: 'blur(4px)',
        overflowY: 'auto',
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 200, lineHeight: 1.1, letterSpacing: -1, marginBottom: 20, textTransform: 'uppercase' }}>
            Eu<br />kary<br />ote<br /><strong style={{ fontWeight: 900, display: 'block' }}>Model</strong>
          </h1>

          <div style={{ marginBottom: 30 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' }}>Observation Paradigm</div>
            <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: 0.5 }}>Sub-cellular Geometric Extraction</div>
          </div>

          <div style={{ marginBottom: 30 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' }}>Spectrum Mapping</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: 0.5 }}>
              <span style={{ color: '#FF00AA' }}>MAGENTA</span> : NUCLEIC ACID<br />
              <span style={{ color: '#00FFFF' }}>CYAN</span>    : ATP SYNTHESIS<br />
              <span style={{ color: '#FFFF00' }}>YELLOW</span>  : ENZYMATIC FLUID<br />
              <span style={{ color: '#7000FF' }}>VIOLET</span>  : LIPID BILAYER
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>ORGANELLE INDEX</div>
          {LEGEND.map(item => (
            <div
              key={item.id}
              className={`legend-item-el${activeLegend === item.id ? ' legend-active' : ''}`}
              onClick={() => handleLegendClick(item.id)}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }}></div>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{item.name}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' }}>Magnification Scale</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>10,000x ZOOM FACTOR</div>
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.4)', marginTop: 10, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -3, left: 0, width: 1, height: 7, background: 'rgba(255,255,255,0.4)' }}></div>
            <div style={{ position: 'absolute', top: -3, right: 0, width: 1, height: 7, background: 'rgba(255,255,255,0.4)' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#666666', marginTop: 4 }}>
            <span>0</span><span>1 µm</span>
          </div>
        </div>
      </aside>

      {/* Main Stage */}
      <main
        style={{
          gridColumn: 2,
          gridRow: 2,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }}
        onClick={handleStageClick}
      >
        <div
          ref={cellContainerRef}
          style={{
            position: 'relative',
            width: 560,
            height: 560,
            isolation: 'isolate',
            transform: `scale(${cellScale})`,
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            filter: getCellFilter(),
          }}
        >
          {/* Scan overlay */}
          <div className="scan-anim" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: 'linear-gradient(to bottom, transparent, rgba(0,255,255,0.15), transparent)', pointerEvents: 'none', zIndex: 300 }}></div>

          {/* Membrane */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 520, height: 520,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 80px rgba(0,255,255,0.07), 0 0 120px rgba(255,0,255,0.06), inset 0 0 20px rgba(255,255,255,0.03)',
            zIndex: 5,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(20,0,40,0.6), transparent 70%)',
          }}></div>

          {/* ER rings */}
          <div className="er-ring-spin" style={{ position: 'absolute', top: '50%', left: '50%', width: 380, height: 380, borderRadius: '50%', border: '1.5px dashed rgba(0,255,255,0.2)', pointerEvents: 'none' }}></div>
          <div className="er-ring-rev" style={{ position: 'absolute', top: '50%', left: '50%', width: 460, height: 460, borderRadius: '50%', border: '1px dashed rgba(255,0,170,0.12)', pointerEvents: 'none' }}></div>

          {/* Ribosomes */}
          {[
            { style: { top: '38%', left: '72%', background: '#FFFF00' } },
            { style: { top: '62%', left: '68%', background: '#00FFFF' } },
            { style: { top: '30%', left: '40%', background: '#FFFF00' } },
            { style: { top: '70%', left: '35%', background: '#FF00AA' } },
            { style: { top: '55%', left: '78%', background: '#00FF55' } },
          ].map((r, i) => (
            <div key={i} style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', mixBlendMode: 'screen', opacity: 0.8, pointerEvents: 'none', ...r.style }}></div>
          ))}

          {/* Vesicle background */}
          <div
            className={getOrganelleClass('vesicle-bg')}
            style={{ top: '6%', left: '2%', width: 100, height: 100 }}
            onMouseEnter={(e) => handleOrganelleHover(e, 'vesicle-bg')}
            onMouseMove={handleOrganelleMove}
            onMouseLeave={handleOrganelleLeave}
            onClick={(e) => { e.stopPropagation(); }}
          >
            <div style={{ width: 100, height: 100, borderRadius: '50%', mixBlendMode: 'screen', background: 'radial-gradient(circle at 70% 70%, #FF00AA, #00FFFF)', filter: 'blur(10px)', opacity: 0.5, ...organelleStyle }}></div>
          </div>

          {/* Mitochondrion 1 */}
          <div
            className={getOrganelleClass('mito')}
            style={{ top: '6%', left: '55%', width: 110, height: 44 }}
            onMouseEnter={(e) => handleOrganelleHover(e, 'mito')}
            onMouseMove={handleOrganelleMove}
            onMouseLeave={handleOrganelleLeave}
            onClick={(e) => handleOrganelleClick(e, 'mito')}
          >
            <div className="mito-float-1" style={{ width: 110, height: 44, borderRadius: 100, background: 'linear-gradient(45deg, #00FFFF, #0055FF, #00FFFF)', boxShadow: '0 0 18px #00FFFF, inset 0 0 10px rgba(0,255,255,0.4)', opacity: 0.95, position: 'relative', mixBlendMode: 'screen', ...organelleStyle }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', gap: 6, alignItems: 'center', pointerEvents: 'none' }}>
                {[0,1,2,3].map(i => <span key={i} style={{ display: 'block', width: 2, height: 18, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }}></span>)}
              </div>
            </div>
          </div>

          {/* Nucleus */}
          <div
            className={getOrganelleClass('nucleus')}
            style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 240, height: 240, borderRadius: '50%', zIndex: 50 }}
            onMouseEnter={(e) => handleOrganelleHover(e, 'nucleus')}
            onMouseMove={handleOrganelleMove}
            onMouseLeave={handleOrganelleLeave}
            onClick={(e) => handleOrganelleClick(e, 'nucleus')}
          >
            <div className="nucleus-pulse" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', mixBlendMode: 'screen', filter: 'blur(3px)', background: 'radial-gradient(circle at 40% 40%, #FF00AA, transparent 70%)', transform: 'translate(-40px, -20px)', ...organelleStyle }}></div>
              <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', mixBlendMode: 'screen', filter: 'blur(3px)', background: 'radial-gradient(circle at 60% 40%, #FFFF00, transparent 70%)', transform: 'translate(20px, -30px)', ...organelleStyle }}></div>
              <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', mixBlendMode: 'screen', filter: 'blur(3px)', background: 'radial-gradient(circle at 50% 60%, #00FFFF, transparent 70%)', transform: 'translate(35px, 20px)', ...organelleStyle }}></div>
              <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', mixBlendMode: 'screen', filter: 'blur(3px)', background: 'radial-gradient(circle at 40% 60%, #7000FF, transparent 70%)', transform: 'translate(-30px, 25px)', ...organelleStyle }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 0 30px rgba(255,255,255,0.08), inset 0 0 30px rgba(255,255,255,0.05)', zIndex: 10 }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,100,200,0.6))', boxShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 60px rgba(255,0,170,0.5)', zIndex: 20, mixBlendMode: 'screen' }}></div>
            </div>

            {/* Golgi stack inside nucleus wrapper */}
            <div style={{ position: 'absolute', bottom: '12%', right: '10%', display: 'flex', flexDirection: 'column', gap: 4, transform: 'rotate(-30deg)' }}>
              <div style={{ height: 10, borderRadius: 20, opacity: 0.85, width: 90, background: 'linear-gradient(90deg,#7000FF,#0055FF)' }}></div>
              <div style={{ height: 10, borderRadius: 20, opacity: 0.85, width: 110, background: 'linear-gradient(90deg,#0055FF,#00FFFF)' }}></div>
              <div style={{ height: 10, borderRadius: 20, opacity: 0.85, width: 95, background: 'linear-gradient(90deg,#00FFFF,#00FF55)' }}></div>
              <div style={{ height: 10, borderRadius: 20, opacity: 0.85, width: 75, background: 'linear-gradient(90deg,#00FF55,#FFFF00)' }}></div>
            </div>

            {/* Vacuole */}
            <div style={{ position: 'absolute', top: '15%', right: '8%', width: 55, height: 55, borderRadius: '50%', border: '2px solid #FFFF00', mixBlendMode: 'screen', boxShadow: 'inset 0 0 15px rgba(255,255,0,0.15), 0 0 10px rgba(255,255,0,0.2)' }}></div>

            {/* Lysosome */}
            <div
              className={getOrganelleClass('lysosome')}
              style={{ position: 'absolute', bottom: '22%', right: '8%', width: 72, height: 72 }}
              onMouseEnter={(e) => handleOrganelleHover(e, 'lysosome')}
              onMouseMove={handleOrganelleMove}
              onMouseLeave={handleOrganelleLeave}
              onClick={(e) => handleOrganelleClick(e, 'lysosome')}
            >
              <div style={{ width: 72, height: 72, borderRadius: '50%', mixBlendMode: 'screen', background: 'radial-gradient(circle at 35% 35%, #FFFF00, #00FF55 70%)', boxShadow: '0 0 20px rgba(255,255,0,0.5)', ...organelleStyle }}></div>
            </div>

            {/* Mitochondrion 2 */}
            <div
              className={getOrganelleClass('mito2')}
              style={{ position: 'absolute', bottom: '14%', left: '8%', width: 130, height: 50 }}
              onMouseEnter={(e) => handleOrganelleHover(e, 'mito2')}
              onMouseMove={handleOrganelleMove}
              onMouseLeave={handleOrganelleLeave}
              onClick={(e) => handleOrganelleClick(e, 'mito2')}
            >
              <div className="mito-float-2" style={{ width: 130, height: 50, borderRadius: 100, background: 'linear-gradient(-45deg, #FF00AA, #7000FF, #FF0055)', boxShadow: '0 0 18px #FF00AA, inset 0 0 10px rgba(255,0,170,0.4)', position: 'relative', mixBlendMode: 'screen', ...organelleStyle }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', gap: 6, alignItems: 'center', pointerEvents: 'none' }}>
                  {[0,1,2,3,4].map(i => <span key={i} style={{ display: 'block', width: 2, height: 18, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }}></span>)}
                </div>
              </div>
            </div>

            {/* Ripple ring */}
            <div className="ripple-anim" style={{ position: 'absolute', width: 100, height: 100, border: '1px solid #00FFFF', borderRadius: '50%', top: '50%', left: '50%', pointerEvents: 'none' }}></div>

            {/* Nucleolus */}
            <div
              className={getOrganelleClass('nucleolus')}
              style={{ position: 'absolute', top: '42%', right: '20%', width: 36, height: 36 }}
              onMouseEnter={(e) => handleOrganelleHover(e, 'nucleolus')}
              onMouseMove={handleOrganelleMove}
              onMouseLeave={handleOrganelleLeave}
              onClick={(e) => handleOrganelleClick(e, 'nucleolus')}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', mixBlendMode: 'screen', background: 'radial-gradient(circle, rgba(255,255,255,0.9) 30%, #00FFFF 100%)', boxShadow: '0 0 25px #00FFFF, 0 0 8px #fff', ...organelleStyle }}></div>
            </div>
          </div>

          {/* Labels */}
          {/* Nucleus Label */}
          <div
            className="label-container-el"
            style={{ position: 'absolute', top: -30, right: -110, zIndex: 200, display: 'flex', flexDirection: 'column' }}
            onClick={() => openDetail('nucleus')}
          >
            <div className="label-text-el" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>Nucleolus Core</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#00FFFF', letterSpacing: 1, marginTop: 2, opacity: 0.7 }}>SEQ. 01 // DENSE CHROMATIN</div>
            <div style={{ position: 'absolute', width: 130, height: 1, top: '50%', right: '100%', backgroundColor: 'rgba(255,255,255,0.4)' }}></div>
            <div style={{ position: 'absolute', width: 1, height: 180, top: '50%', right: 'calc(100% + 130px)', backgroundColor: 'rgba(255,255,255,0.4)' }}></div>
            <div style={{ position: 'absolute', width: 5, height: 5, background: '#00FFFF', borderRadius: '50%', boxShadow: '0 0 6px #00FFFF', top: 180, right: 'calc(100% + 130px - 2.5px)', transform: 'translate(-50%, -50%)' }}></div>
          </div>

          {/* Mito Label */}
          <div
            className="label-container-el"
            style={{ position: 'absolute', bottom: 55, left: -130, zIndex: 200, display: 'flex', flexDirection: 'column', textAlign: 'right' }}
            onClick={() => openDetail('mito')}
          >
            <div className="label-text-el" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>Mitochondrion</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#00FFFF', letterSpacing: 1, marginTop: 2, opacity: 0.7 }}>SEQ. 04 // ATP GENERATOR</div>
            <div style={{ position: 'absolute', width: 90, height: 1, top: '50%', left: '100%', backgroundColor: 'rgba(255,255,255,0.4)' }}></div>
            <div style={{ position: 'absolute', width: 1, height: 90, bottom: '50%', left: 'calc(100% + 90px)', backgroundColor: 'rgba(255,255,255,0.4)' }}></div>
            <div style={{ position: 'absolute', width: 5, height: 5, background: '#00FFFF', borderRadius: '50%', boxShadow: '0 0 6px #00FFFF', bottom: 90, left: 'calc(100% + 90px)', transform: 'translate(-50%, -50%)' }}></div>
          </div>

          {/* Vesicle/Lysosome Label */}
          <div
            className="label-container-el"
            style={{ position: 'absolute', bottom: 140, right: -90, zIndex: 200, display: 'flex', flexDirection: 'column' }}
            onClick={() => openDetail('lysosome')}
          >
            <div className="label-text-el" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>Lysosome</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#00FFFF', letterSpacing: 1, marginTop: 2, opacity: 0.7 }}>SEQ. 07 // HYDROLASES</div>
            <div style={{ position: 'absolute', width: 110, height: 1, top: '50%', right: '100%', backgroundColor: 'rgba(255,255,255,0.4)' }}></div>
            <div style={{ position: 'absolute', width: 5, height: 5, background: '#00FFFF', borderRadius: '50%', boxShadow: '0 0 6px #00FFFF', top: '50%', right: 'calc(100% + 110px)', transform: 'translate(-50%, -50%)' }}></div>
          </div>

          {/* Membrane Label */}
          <div
            className="label-container-el"
            style={{ position: 'absolute', top: 45, left: -90, zIndex: 200, display: 'flex', flexDirection: 'column', textAlign: 'right' }}
            onClick={() => openDetail('membrane')}
          >
            <div className="label-text-el" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'color 0.2s' }}>Plasma Boundary</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#00FFFF', letterSpacing: 1, marginTop: 2, opacity: 0.7 }}>LIPID // SEMI-PERMEABLE</div>
            <div style={{ position: 'absolute', width: 70, height: 1, top: '50%', left: '100%', backgroundColor: 'rgba(255,255,255,0.4)' }}></div>
            <div style={{ position: 'absolute', width: 5, height: 5, background: '#00FFFF', borderRadius: '50%', boxShadow: '0 0 6px #00FFFF', top: '50%', left: 'calc(100% + 70px)', transform: 'translate(-50%, -50%)' }}></div>
          </div>
        </div>
      </main>

      {/* Right Panel */}
      <aside style={{
        gridColumn: 3,
        gridRow: 2,
        borderLeft: '1px solid rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderTop: 'none',
        borderBottom: 'none',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        backdropFilter: 'blur(4px)',
        overflowY: 'auto',
        textAlign: 'right',
      }}>
        {/* Zoom Control */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>ZOOM FACTOR</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="zoom-btn" onClick={handleZoomOut}>−</button>
            <div style={{ flex: 1, height: 2, background: '#333333', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#00FFFF', width: `${zoomLevel}%`, transition: 'width 0.3s' }}></div>
            </div>
            <button className="zoom-btn" onClick={handleZoomIn} style={{ fontSize: 14 }}>+</button>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#00FFFF', marginTop: 6 }}>{getNearestZoomMag(zoomLevel)} MAGNIFICATION</div>
        </div>

        {/* Render Mode */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>RENDER MODE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['ADDITIVE', 'THERMAL', 'WIREFRAME'].map(mode => (
              <button
                key={mode}
                className={`rmode-btn${renderMode === mode ? ' rmode-active' : ''}`}
                onClick={() => handleRenderMode(mode)}
                style={{ textAlign: 'left' }}
              >
                {renderMode === mode ? '▶ ' : '◌ '}{mode === 'ADDITIVE' ? 'ADDITIVE SPECTRUM' : mode === 'THERMAL' ? 'THERMAL MAP' : 'WIREFRAME'}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Depth */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>FOCUS DEPTH</div>
          <input
            type="range"
            min="0"
            max="100"
            value={focusVal}
            onChange={(e) => handleFocusChange(e.target.value)}
            style={{ width: '100%', accentColor: '#FF00AA', background: 'none', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#666666', marginTop: 4 }}>
            <span>f/0.8</span><span style={{ color: '#FF00AA' }}>{focusDisplay}</span><span>f/4.0</span>
          </div>
        </div>

        {/* Luminance */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>LUMINANCE PROFILE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666' }}>
              <span>PEAK</span><div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#fff)', borderRadius: 2, width: 80 }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666' }}>
              <span>MID</span><div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#00FFFF)', borderRadius: 2, width: 60 }}></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666' }}>
              <span>BASE</span><div style={{ height: 3, background: 'linear-gradient(90deg,transparent,#FF00AA)', borderRadius: 2, width: 100 }}></div>
            </div>
          </div>
        </div>

        {/* Cell Vitals */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>CELL VITALS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666666' }}>ATP OUTPUT</span><span style={{ color: '#00FFFF' }}>{atpVal} mol/s</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666666' }}>pH LEVEL</span><span style={{ color: '#00FF55' }}>7.35</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666666' }}>TEMP</span><span style={{ color: '#FFFF00' }}>37.0°C</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666666' }}>DIVISION</span><span style={{ color: '#FF00AA' }}>INTERPHASE</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
            <div className="blink-anim" style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FF55', boxShadow: '0 0 8px #00FF55' }}></div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#00FF55', letterSpacing: 1 }}>RENDERING COMPLETE</div>
          </div>
        </div>
      </aside>

      {/* Footer */}
      <footer style={{
        gridColumn: '1 / -1',
        gridRow: 3,
        borderTop: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#666666', letterSpacing: 1 }}>COORDINATES</div>
          <div style={{ display: 'flex', gap: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
            <span>X: <span style={{ color: '#00FFFF' }}>{coordX.toFixed(4)}</span></span>
            <span>Y: <span style={{ color: '#FF00AA' }}>{coordY.toFixed(4)}</span></span>
            <span>Z: <span style={{ color: '#FFFF00' }}>0.0001</span></span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00FF55', boxShadow: '0 0 6px #00FF55' }}></div>
          <span style={{ color: '#333333', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 1 }}>{footerStatus}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="footer-btn" onClick={handleExport}>EXPORT SVG</button>
          <button className="footer-btn footer-btn-reset" onClick={handleReset}>RESET VIEW</button>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#333333' }}>V 2.0.4 // SECURE</span>
        </div>
      </footer>
    </div>
  );
};

export default App;