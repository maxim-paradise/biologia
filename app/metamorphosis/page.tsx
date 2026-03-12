"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

type StageId = 1 | 2 | 3 | 4;

type QuizItemId = 1 | 2 | 3 | 4;

const stageTooltipKeys: Record<string, string> = {
  "stage-egg": "meta_tt_egg",
  "stage-larva": "meta_tt_larva",
  "stage-pupa": "meta_tt_pupa",
  "stage-adult": "meta_tt_adult",
};

const funFacts: Record<
  string,
  { stage: StageId; textKey: string; color: string; labelKey: string }
> = {
  egg1: {
    stage: 1,
    textKey: "meta_fact_egg_1_text",
    color: "#c9a400",
    labelKey: "meta_fact_egg_1_label",
  },
  egg2: {
    stage: 1,
    textKey: "meta_fact_egg_2_text",
    color: "#c9a400",
    labelKey: "meta_fact_egg_2_label",
  },
  egg3: {
    stage: 1,
    textKey: "meta_fact_egg_3_text",
    color: "#c9a400",
    labelKey: "meta_fact_egg_3_label",
  },
  larva1: {
    stage: 2,
    textKey: "meta_fact_larva_1_text",
    color: "#E53B82",
    labelKey: "meta_fact_larva_1_label",
  },
  larva2: {
    stage: 2,
    textKey: "meta_fact_larva_2_text",
    color: "#E53B82",
    labelKey: "meta_fact_larva_2_label",
  },
  larva3: {
    stage: 2,
    textKey: "meta_fact_larva_3_text",
    color: "#E53B82",
    labelKey: "meta_fact_larva_3_label",
  },
  pupa1: {
    stage: 3,
    textKey: "meta_fact_pupa_1_text",
    color: "#83D5A1",
    labelKey: "meta_fact_pupa_1_label",
  },
  pupa2: {
    stage: 3,
    textKey: "meta_fact_pupa_2_text",
    color: "#83D5A1",
    labelKey: "meta_fact_pupa_2_label",
  },
  pupa3: {
    stage: 3,
    textKey: "meta_fact_pupa_3_text",
    color: "#83D5A1",
    labelKey: "meta_fact_pupa_3_label",
  },
  adult1: {
    stage: 4,
    textKey: "meta_fact_adult_1_text",
    color: "#BA2433",
    labelKey: "meta_fact_adult_1_label",
  },
  adult2: {
    stage: 4,
    textKey: "meta_fact_adult_2_text",
    color: "#BA2433",
    labelKey: "meta_fact_adult_2_label",
  },
  adult3: {
    stage: 4,
    textKey: "meta_fact_adult_3_text",
    color: "#BA2433",
    labelKey: "meta_fact_adult_3_label",
  },
};

export default function MetamorphosisPage() {
  const { t } = useTranslation();
  const cursorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const [splashVisible, setSplashVisible] = useState(true);
  const [activeStage, setActiveStage] = useState<StageId | null>(null);
  const [explored, setExplored] = useState<Record<StageId, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [soundOn, setSoundOn] = useState(true);

  const exploredCount = useMemo(() => {
    return (Object.values(explored).filter(Boolean).length || 0) as number;
  }, [explored]);

  const [openFactKey, setOpenFactKey] = useState<string | null>(null);

  const [quizOpen, setQuizOpen] = useState(false);
  const [quizPlacements, setQuizPlacements] = useState<
    Partial<Record<StageId, QuizItemId>>
  >({});
  const [quizResultText, setQuizResultText] = useState<string | null>(null);
  const [quizResultColor, setQuizResultColor] = useState<string>("#E53B82");

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const AnyWindow = window as any;
      audioCtxRef.current = new (
        window.AudioContext || AnyWindow.webkitAudioContext
      )();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (freq: number, type: OscillatorType = "sine", dur = 0.12, gain = 0.15) => {
      if (!soundOn) return;
      try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gn = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gn.gain.setValueAtTime(gain, ctx.currentTime);
        gn.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.connect(gn);
        gn.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch {
        return;
      }
    },
    [getAudioCtx, soundOn],
  );

  const playExpand = useCallback(() => {
    playTone(440, "triangle", 0.2, 0.18);
    window.setTimeout(() => playTone(660, "triangle", 0.15, 0.12), 80);
  }, [playTone]);

  const playCollapse = useCallback(() => {
    playTone(330, "sine", 0.12, 0.1);
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(880, "square", 0.06, 0.08);
  }, [playTone]);

  const playDrop = useCallback(
    (correct: boolean) => {
      playTone(correct ? 880 : 220, correct ? "sine" : "sawtooth", 0.2, 0.15);
    },
    [playTone],
  );

  const playSuccess = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) => {
      window.setTimeout(() => playTone(f, "triangle", 0.3, 0.2), i * 120);
    });
  }, [playTone]);

  const enterStudy = useCallback(() => {
    setSplashVisible(false);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const tooltip = tooltipRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      if (tooltip && tooltip.classList.contains("show")) {
        tooltip.style.left = `${e.clientX + 16}px`;
        tooltip.style.top = `${e.clientY - 10}px`;
      }
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const selector = "article, button, .fun-fact-pill, .art-piece";
    const els = Array.from(document.querySelectorAll(selector));

    const onEnter = () => cursor.classList.add("hover");
    const onLeave = () => cursor.classList.remove("hover");

    els.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [splashVisible, quizOpen, activeStage, openFactKey]);

  useEffect(() => {
    if (splashVisible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasEl = canvas;
    const ctx2d = ctx;

    const resize = () => {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["#F3C522", "#E53B82", "#83D5A1", "#BA2433", "#1F4C59"];

    type Shape = "circle" | "rect";

    class Particle {
      x: number;
      y: number;
      r: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      shape: Shape;
      fromClick: boolean;

      constructor(x?: number, y?: number, fromClick = false) {
        this.fromClick = fromClick;
        this.x = x ?? Math.random() * canvasEl.width;
        this.y = y ?? Math.random() * canvasEl.height;
        this.r = fromClick ? Math.random() * 6 + 2 : Math.random() * 2 + 0.5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.vx = (Math.random() - 0.5) * (fromClick ? 5 : 0.3);
        this.vy =
          (Math.random() - 0.5) * (fromClick ? 5 : 0.3) - (fromClick ? 1 : 0);
        this.alpha = fromClick ? 1 : Math.random() * 0.4 + 0.1;
        this.decay = fromClick ? 0.018 : 0.002;
        this.shape = Math.random() > 0.5 ? "circle" : "rect";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        ctx2d.globalAlpha = Math.max(0, this.alpha);
        ctx2d.fillStyle = this.color;
        if (this.shape === "circle") {
          ctx2d.beginPath();
          ctx2d.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx2d.fill();
        } else {
          ctx2d.fillRect(
            this.x - this.r,
            this.y - this.r,
            this.r * 2,
            this.r * 2,
          );
        }
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 60; i++) particles.push(new Particle());

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 18; i++)
        particles.push(new Particle(e.clientX, e.clientY, true));
    };

    document.addEventListener("click", onClick);

    let raf = 0;
    const loop = () => {
      ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) {
          if (!p.fromClick) particles[i] = new Particle();
          else particles.splice(i, 1);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onClick);
    };
  }, [splashVisible]);

  const showTooltip = useCallback((text: string) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    tooltip.textContent = text;
    tooltip.classList.add("show");
  }, []);

  const hideTooltip = useCallback(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    tooltip.classList.remove("show");
  }, []);

  const onStageClick = useCallback(
    (stageId: StageId) => {
      if (activeStage === stageId) return;
      playExpand();
      setActiveStage(stageId);
      setExplored((prev) => ({ ...prev, [stageId]: true }));
      hideTooltip();
    },
    [activeStage, hideTooltip, playExpand],
  );

  const collapseStage = useCallback(() => {
    playCollapse();
    setActiveStage(null);
  }, [playCollapse]);

  const toggleFact = useCallback(
    (key: string) => {
      playClick();
      setOpenFactKey((prev) => (prev === key ? null : key));
    },
    [playClick],
  );

  const quizItems = useMemo(
    () =>
      [
        { id: 3 as const, label: t("meta_item_chrysalis"), colorClass: "id-3" },
        { id: 1 as const, label: t("meta_item_egg"), colorClass: "id-1" },
        { id: 4 as const, label: t("meta_item_butterfly"), colorClass: "id-4" },
        {
          id: 2 as const,
          label: t("meta_item_caterpillar"),
          colorClass: "id-2",
        },
      ] as const,
    [t],
  );

  const bankItems = useMemo(() => {
    const placed = new Set(
      Object.values(quizPlacements).filter(Boolean) as QuizItemId[],
    );
    return quizItems.filter((it) => !placed.has(it.id));
  }, [quizItems, quizPlacements]);

  const resetQuiz = useCallback(() => {
    setQuizPlacements({});
    setQuizResultText(null);
    setQuizResultColor("#E53B82");
  }, []);

  const checkQuiz = useCallback(
    (placements: Partial<Record<StageId, QuizItemId>>) => {
      const filled = (Object.keys(placements).length || 0) as number;
      let correct = 0;
      (Object.keys(placements) as unknown as StageId[]).forEach((k) => {
        const expected = k;
        if (placements[k] === expected) correct++;
      });

      if (filled !== 4) {
        setQuizResultText(null);
        return;
      }

      if (correct === 4) {
        playSuccess();
        setQuizResultText(t("meta_sequence_verified"));
        setQuizResultColor("#83D5A1");
      } else {
        setQuizResultText(t("meta_correct_try_again", { correct }));
        setQuizResultColor("#E53B82");
      }
    },
    [playSuccess, t],
  );

  const onQuizDrop = useCallback(
    (zone: StageId, itemId: QuizItemId) => {
      const correct = itemId === zone;
      playDrop(correct);
      setQuizPlacements((prev) => {
        const next = { ...prev };
        next[zone] = itemId;
        checkQuiz(next);
        return next;
      });
    },
    [checkQuiz, playDrop],
  );

  const openQuiz = useCallback(() => {
    playClick();
    setActiveStage(null);
    setOpenFactKey(null);
    setQuizOpen(true);
  }, [playClick]);

  const closeQuiz = useCallback(() => {
    playCollapse();
    setQuizOpen(false);
    resetQuiz();
  }, [playCollapse, resetQuiz]);

  const soundLabel = soundOn ? t("meta_sfx_on") : t("meta_sfx_off");

  return (
    <div className="meta-root">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Anton&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap");

        :root {
          --teal: #1f4c59;
          --yellow: #f3c522;
          --pink: #e53b82;
          --mint: #83d5a1;
          --red: #ba2433;
          --white: #f8f8f8;
          --black: #0a0a0a;
          --paper-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          --font-display: "Anton", sans-serif;
          --font-serif: "Playfair Display", serif;
          --font-mono: "Courier Prime", monospace;
        }

        .meta-root {
          background-color: var(--black);
          color: var(--black);
          font-family: var(--font-mono);
          overflow: hidden;
          height: 100vh;
          width: 100vw;
          position: relative;
          user-select: none;
        }

        .svg-filters {
          position: absolute;
          width: 0;
          height: 0;
        }

        #collage-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          position: relative;
          z-index: 1;
        }

        .main-title-banner {
          position: absolute;
          top: 50%;
          left: -5%;
          width: 110%;
          background-color: var(--teal);
          transform: translateY(-50%) rotate(-2deg);
          z-index: 10;
          padding: 10px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: var(--paper-shadow);
          pointer-events: none;
          transition:
            opacity 0.4s ease,
            transform 0.6s cubic-bezier(0.8, 0, 0.2, 1);
          mask-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,5 Q10,0 20,6 T40,4 T60,8 T80,3 T100,7 T120,2 L120,95 Q110,100 100,94 T80,96 T60,92 T40,97 T20,93 T0,98 Z'/%3E%3C/svg%3E");
          mask-size: 100% 100%;
        }

        .main-title-banner.hidden {
          opacity: 0;
          transform: translateY(-50%) rotate(-2deg) scale(1.1);
        }

        #collage-container.has-quiz .main-title-banner {
          opacity: 0;
          transform: translateY(-50%) rotate(-2deg) scale(1.06);
        }

        .director-text {
          font-family: var(--font-serif);
          color: var(--white);
          font-size: clamp(0.8rem, 1.5vw, 1.2rem);
          letter-spacing: 0.5em;
          text-transform: uppercase;
          margin-bottom: -15px;
          z-index: 2;
        }

        .banner-text {
          font-family: var(--font-display);
          color: var(--yellow);
          font-size: clamp(4rem, 12vw, 12rem);
          line-height: 1;
          letter-spacing: 0.02em;
          text-shadow:
            3px 3px 0 var(--black),
            -2px -2px 0 rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .stage-band {
          flex: 1;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          transition:
            flex 0.7s cubic-bezier(0.7, 0, 0.1, 1),
            filter 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #collage-container.has-quiz .stage-band {
          flex: 0.3;
          filter: grayscale(0.5) brightness(0.7);
          cursor: default;
        }

        #collage-container:not(.has-active) .stage-band:hover {
          filter: brightness(1.1) contrast(1.1);
        }

        .painterly-bg {
          position: absolute;
          inset: -10px;
          background-size: cover;
          background-position: center;
          mix-blend-mode: multiply;
          opacity: 0.6;
          pointer-events: none;
          background-image:
            radial-gradient(
              ellipse 80% 50% at 20% 40%,
              rgba(0, 0, 0, 0.15),
              transparent
            ),
            radial-gradient(
              ellipse 90% 40% at 80% 60%,
              rgba(255, 255, 255, 0.2),
              transparent
            ),
            radial-gradient(
              circle at 50% 50%,
              transparent 40%,
              rgba(0, 0, 0, 0.1) 100%
            );
        }

        .tear-top {
          position: absolute;
          top: -5px;
          left: 0;
          width: 100%;
          height: 25px;
          background: var(--white);
          z-index: 5;
          mask-image: url("data:image/svg+xml,%3Csvg width='1000' height='25' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,25 L0,15 Q10,5 20,12 T40,8 T60,18 T80,5 T100,15 T120,6 T140,19 T160,8 T180,14 T200,4 T220,16 T240,7 T260,18 T280,9 T300,15 T320,5 T340,17 T360,8 T380,14 T400,6 T420,19 T440,7 T460,16 T480,4 T500,15 T520,8 T540,18 T560,9 T580,14 T600,5 T620,17 T640,6 T660,19 T680,7 T700,16 T720,4 T740,15 T760,8 T780,18 T800,9 T820,14 T840,5 T860,17 T880,6 T900,19 T920,7 T940,16 T960,4 T980,15 L1000,10 L1000,25 Z'/%3E%3C/svg%3E");
          mask-size: 100% 100%;
          pointer-events: none;
        }

        .stage-egg {
          background-color: var(--yellow);
        }

        .stage-larva {
          background-color: var(--pink);
        }

        .stage-pupa {
          background-color: var(--mint);
        }

        .stage-adult {
          background-color: var(--red);
        }

        .default-content {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 5vw;
          transition:
            opacity 0.3s ease,
            transform 0.5s ease;
        }

        .stage-num {
          font-family: var(--font-display);
          font-size: clamp(3rem, 10vw, 8rem);
          color: var(--black);
          opacity: 0.15;
          line-height: 0.8;
          mix-blend-mode: color-burn;
        }

        .stage-name-default {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 5vw, 4rem);
          font-style: italic;
          font-weight: 900;
          color: var(--black);
          mix-blend-mode: overlay;
        }

        .expanded-content {
          opacity: 0;
          position: absolute;
          inset: 0;
          padding: 6vw;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4vw;
          pointer-events: none;
          transition: opacity 0.5s ease 0.3s;
          align-items: center;
        }

        .stage-band.active {
          flex: 8;
          cursor: default;
        }

        .stage-band.active .default-content {
          opacity: 0;
          transform: scale(1.1);
        }

        .stage-band.active .expanded-content {
          opacity: 1;
          pointer-events: auto;
        }

        .stage-band.inactive {
          flex: 0.3;
          filter: grayscale(0.5) brightness(0.7);
        }

        .detail-header {
          font-family: var(--font-display);
          font-size: clamp(4rem, 8vw, 10rem);
          line-height: 0.85;
          text-transform: uppercase;
          -webkit-text-stroke: 2px var(--black);
          color: transparent;
          position: relative;
        }

        .detail-header::after {
          content: attr(data-text);
          position: absolute;
          left: 4px;
          top: 4px;
          color: var(--black);
          -webkit-text-stroke: 0;
          z-index: -1;
          mix-blend-mode: multiply;
          opacity: 0.7;
        }

        .detail-meta {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.2rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid var(--black);
          display: inline-block;
          padding-bottom: 5px;
        }

        .detail-body {
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 500px;
          background: rgba(255, 255, 255, 0.8);
          padding: 20px;
          border: 2px solid var(--black);
          transform: rotate(-1deg);
          box-shadow: 5px 5px 0 var(--black);
          max-height: min(52vh, 560px);
          overflow: auto;
        }

        .illustration-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          position: relative;
        }

        .art-piece {
          width: 80%;
          height: auto;
          max-height: 60vh;
          filter: url(#rough-edge) drop-shadow(15px 15px 0px rgba(0, 0, 0, 0.5));
          transition: transform 0.4s cubic-bezier(0.2, 1, 0.3, 1);
          cursor: zoom-in;
        }

        .art-piece:hover {
          transform: scale(1.12) rotate(-2deg);
        }

        .system-code {
          position: absolute;
          bottom: 2vw;
          right: 2vw;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          opacity: 0.5;
          transform: rotate(-90deg);
          transform-origin: bottom right;
        }

        .close-btn {
          position: absolute;
          top: 2vw;
          right: 2vw;
          font-family: var(--font-display);
          font-size: 2rem;
          background: var(--black);
          color: var(--white);
          border: none;
          padding: 5px 15px;
          cursor: pointer;
          text-transform: uppercase;
          transform: rotate(3deg);
          transition:
            transform 0.2s,
            background 0.2s;
          z-index: 100;
        }

        .close-btn:hover {
          transform: rotate(0deg) scale(1.1);
          background: var(--teal);
          color: var(--yellow);
        }

        #quiz-overlay {
          position: fixed;
          inset: 0;
          background: var(--teal);
          z-index: 200;
          display: flex;
          flex-direction: column;
          padding: 4vw;
          transform: translateY(100%);
          transition: transform 0.6s cubic-bezier(0.8, 0, 0.2, 1);
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        #quiz-overlay.active {
          transform: translateY(0);
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 4px solid var(--yellow);
          padding-bottom: 20px;
          margin-bottom: 40px;
        }

        .quiz-title {
          font-family: var(--font-display);
          color: var(--yellow);
          font-size: 4rem;
          text-shadow: 2px 2px 0 var(--black);
        }

        .quiz-close {
          background: transparent;
          border: 2px solid var(--yellow);
          color: var(--yellow);
          font-family: var(--font-mono);
          padding: 10px 20px;
          cursor: pointer;
          font-size: 1.2rem;
          text-transform: uppercase;
        }

        .quiz-close:hover {
          background: var(--yellow);
          color: var(--teal);
        }

        .quiz-workspace {
          display: flex;
          gap: 4vw;
          flex: 1;
        }

        .drop-zones {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }

        .drop-zone {
          border: 3px dashed var(--mint);
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 2rem;
          color: rgba(131, 213, 161, 0.4);
          transition: background 0.3s;
          position: relative;
        }

        .drop-zone.hovered {
          background: rgba(131, 213, 161, 0.1);
        }

        .drop-zone::before {
          content: attr(data-order) ".";
          position: absolute;
          left: 20px;
          font-family: var(--font-display);
          font-size: 3rem;
          color: var(--mint);
        }

        .draggable-items {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
          justify-content: center;
        }

        .drag-item {
          background: var(--white);
          padding: 20px;
          font-family: var(--font-display);
          font-size: 3rem;
          color: var(--black);
          cursor: grab;
          box-shadow: 8px 8px 0 var(--black);
          text-align: center;
          transform: rotate(-2deg);
          transition: transform 0.1s;
        }

        .drag-item:active {
          cursor: grabbing;
          transform: scale(1.05) rotate(0deg);
        }

        .drag-item.id-1 {
          background: var(--yellow);
        }

        .drag-item.id-2 {
          background: var(--pink);
        }

        .drag-item.id-3 {
          background: var(--mint);
        }

        .drag-item.id-4 {
          background: var(--red);
          color: var(--white);
        }

        .quiz-trigger {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 15;
          background: var(--black);
          color: var(--white);
          border: none;
          padding: 10px 30px;
          font-family: var(--font-display);
          font-size: 1.5rem;
          letter-spacing: 2px;
          cursor: pointer;
          box-shadow: 4px 4px 0 var(--white);
          transition:
            transform 0.2s,
            box-shadow 0.2s,
            opacity 0.2s;
        }

        .quiz-trigger:hover {
          transform: translateX(-50%) translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--white);
        }

        .progress-indicator {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 15;
          display: flex;
          flex-direction: column;
          gap: 15px;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.3s;
        }

        #collage-container.has-active .progress-indicator {
          opacity: 0;
        }

        #collage-container.has-quiz .progress-indicator {
          opacity: 0;
        }

        .dot {
          width: 12px;
          height: 12px;
          background: var(--white);
          border-radius: 50%;
          border: 2px solid var(--black);
          border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
        }

        .custom-cursor {
          position: fixed;
          width: 20px;
          height: 20px;
          border: 2px solid var(--yellow);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition:
            transform 0.08s ease,
            width 0.2s,
            height 0.2s,
            background 0.2s;
          mix-blend-mode: difference;
        }

        .custom-cursor.hover {
          width: 40px;
          height: 40px;
          background: rgba(243, 197, 34, 0.15);
        }

        #particle-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .sound-btn {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 500;
          background: var(--black);
          color: var(--white);
          border: 2px solid var(--white);
          padding: 6px 14px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          cursor: pointer;
          letter-spacing: 0.1em;
          transition: all 0.2s;
        }

        .sound-btn:hover {
          background: var(--yellow);
          color: var(--black);
          border-color: var(--yellow);
        }

        .meta-back-home {
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 900;
          background: var(--black);
          color: var(--white);
          border: 2px solid rgba(255, 255, 255, 0.2);
          padding: 6px 14px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .meta-back-home:hover {
          background: var(--yellow);
          color: var(--black);
          border-color: var(--yellow);
        }

        .counter-badge {
          position: fixed;
          top: 52px;
          left: 16px;
          z-index: 500;
          background: var(--black);
          color: var(--white);
          border: 2px solid rgba(255, 255, 255, 0.2);
          padding: 6px 14px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          display: flex;
          gap: 12px;
        }

        .counter-badge span {
          color: var(--yellow);
        }

        .tooltip {
          position: fixed;
          background: var(--black);
          color: var(--white);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          padding: 6px 12px;
          pointer-events: none;
          z-index: 9998;
          opacity: 0;
          transition: opacity 0.2s;
          border-left: 3px solid var(--yellow);
          white-space: nowrap;
          letter-spacing: 0.08em;
        }

        .tooltip.show {
          opacity: 1;
        }

        .fact-ticker {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 32px;
          background: var(--black);
          color: var(--yellow);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          overflow: hidden;
          z-index: 400;
          border-top: 2px solid rgba(243, 197, 34, 0.3);
        }

        .ticker-label {
          background: var(--yellow);
          color: var(--black);
          padding: 0 12px;
          height: 100%;
          display: flex;
          align-items: center;
          font-weight: 700;
          flex-shrink: 0;
          letter-spacing: 0.08em;
        }

        .ticker-track {
          flex: 1;
          overflow: hidden;
          position: relative;
          height: 100%;
        }

        .ticker-inner {
          display: flex;
          align-items: center;
          height: 100%;
          white-space: nowrap;
          animation: ticker-scroll 28s linear infinite;
        }

        @keyframes ticker-scroll {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .ticker-sep {
          margin: 0 30px;
          opacity: 0.4;
        }

        .fun-fact-pill {
          display: inline-block;
          background: var(--black);
          color: var(--white);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          padding: 4px 10px;
          margin: 4px 4px 0 0;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.15s;
        }

        .fun-fact-pill:hover {
          background: var(--yellow);
          color: var(--black);
        }

        .fun-fact-reveal {
          margin-top: 10px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          line-height: 1.5;
          background: rgba(255, 255, 255, 0.9);
          border-left: 4px solid;
          padding: 8px 12px;
          min-height: 0;
          max-height: 0;
          overflow: hidden;
          transition:
            max-height 0.4s ease,
            padding 0.3s;
        }

        .fun-fact-reveal.open {
          max-height: 520px;
          overflow: auto;
        }

        @keyframes pulse-ring {
          0% {
            r: 80;
            opacity: 0.6;
          }
          100% {
            r: 110;
            opacity: 0;
          }
        }

        .pulse-circle {
          animation: pulse-ring 1.8s ease-out infinite;
        }

        .stage-progress {
          position: fixed;
          left: 0;
          top: 0;
          width: 4px;
          height: 100vh;
          z-index: 400;
          display: flex;
          flex-direction: column;
        }

        .sp-seg {
          flex: 1;
          transition: opacity 0.4s;
          opacity: 0.3;
        }

        .sp-seg.active {
          opacity: 1;
        }

        .sp-seg-1 {
          background: var(--yellow);
        }

        .sp-seg-2 {
          background: var(--pink);
        }

        .sp-seg-3 {
          background: var(--mint);
        }

        .sp-seg-4 {
          background: var(--red);
        }

        .quiz-result-msg {
          text-align: center;
          padding: 20px;
          font-family: var(--font-display);
          font-size: 2rem;
          color: var(--yellow);
          text-shadow: 2px 2px 0 var(--black);
          display: block;
        }

        .quiz-reset-btn {
          background: var(--pink);
          color: var(--white);
          border: none;
          padding: 10px 28px;
          font-family: var(--font-display);
          font-size: 1.3rem;
          cursor: pointer;
          margin-top: 12px;
          letter-spacing: 0.05em;
          display: inline-block;
          box-shadow: 4px 4px 0 var(--black);
        }

        .quiz-reset-btn:hover {
          background: var(--red);
        }

        #intro-splash {
          position: fixed;
          inset: 0;
          background: var(--black);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          transition: opacity 0.7s ease;
        }

        #intro-splash.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .splash-title {
          font-family: var(--font-display);
          font-size: clamp(4rem, 12vw, 10rem);
          color: var(--yellow);
          text-shadow:
            5px 5px 0 var(--pink),
            10px 10px 0 var(--teal);
          letter-spacing: -0.02em;
          text-align: center;
          line-height: 0.9;
        }

        .splash-sub {
          font-family: var(--font-mono);
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .splash-btn {
          margin-top: 10px;
          background: transparent;
          border: 2px solid var(--yellow);
          color: var(--yellow);
          font-family: var(--font-display);
          font-size: 1.5rem;
          padding: 12px 50px;
          cursor: pointer;
          letter-spacing: 0.08em;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .splash-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--yellow);
          transform: translateX(-101%);
          transition: transform 0.3s ease;
          z-index: -1;
        }

        .splash-btn:hover::after {
          transform: translateX(0);
        }

        .splash-btn:hover {
          color: var(--black);
        }

        .splash-dots {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        .splash-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: dot-pulse 1.2s ease-in-out infinite;
        }

        .splash-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .splash-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .splash-dot:nth-child(4) {
          animation-delay: 0.6s;
        }

        @keyframes dot-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .expanded-content {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            padding: 15vw 6vw;
          }
          .banner-text {
            font-size: 4rem;
          }
          .detail-header {
            font-size: 3.5rem;
          }
          .quiz-workspace {
            flex-direction: column;
          }
          .detail-body {
            max-height: 48vh;
          }

          #quiz-overlay {
            padding: 18px;
            overflow: auto;
          }

          .quiz-title {
            font-size: 2.1rem;
          }

          .drop-zone {
            font-size: 1.4rem;
          }

          .drag-item {
            font-size: 2.1rem;
            padding: 16px;
          }

          .meta-back-home {
            top: 14px;
            left: 14px;
            font-size: 0.65rem;
            padding: 6px 12px;
          }
        }
      `}</style>

      <a href="/" className="meta-back-home">
        {t("nav_back_home")}
      </a>

      {splashVisible && (
        <div id="intro-splash">
          <div className="splash-title">
            META-
            <br />
            MORPHOSIS
          </div>
          <div className="splash-sub">{t("meta_splash_sub")}</div>
          <div className="splash-dots">
            <div
              className="splash-dot"
              style={{ background: "var(--yellow)" }}
            />
            <div className="splash-dot" style={{ background: "var(--pink)" }} />
            <div className="splash-dot" style={{ background: "var(--mint)" }} />
            <div className="splash-dot" style={{ background: "var(--red)" }} />
          </div>
          <button
            className="splash-btn"
            onClick={() => {
              enterStudy();
              playClick();
            }}
          >
            {t("meta_begin")}
          </button>
        </div>
      )}

      <div className="custom-cursor" ref={cursorRef} />
      <div className="tooltip" ref={tooltipRef} />
      <canvas id="particle-canvas" ref={canvasRef} />

      <div className="stage-progress">
        <div
          className={`sp-seg sp-seg-1 ${activeStage === 1 ? "active" : ""}`}
        />
        <div
          className={`sp-seg sp-seg-2 ${activeStage === 2 ? "active" : ""}`}
        />
        <div
          className={`sp-seg sp-seg-3 ${activeStage === 3 ? "active" : ""}`}
        />
        <div
          className={`sp-seg sp-seg-4 ${activeStage === 4 ? "active" : ""}`}
        />
      </div>

      <div className="counter-badge">
        {t("meta_stages_explored")}: <span>{exploredCount}</span>/4
      </div>

      <button className="sound-btn" onClick={() => setSoundOn((p) => !p)}>
        {soundLabel}
      </button>

      <div className="fact-ticker">
        <div className="ticker-label">{t("meta_did_you_know")}</div>
        <div className="ticker-track">
          <div className="ticker-inner">
            {t("meta_ticker_1")}
            <span className="ticker-sep">✦</span>
            {t("meta_ticker_2")}
            <span className="ticker-sep">✦</span>
            {t("meta_ticker_3")}
            <span className="ticker-sep">✦</span>
            {t("meta_ticker_4")}
            <span className="ticker-sep">✦</span>
            {t("meta_ticker_5")}
            <span className="ticker-sep">✦</span>
            {t("meta_ticker_6")}
            <span className="ticker-sep">✦</span>
            {t("meta_ticker_7")}
            <span className="ticker-sep">✦</span>
          </div>
        </div>
      </div>

      <svg className="svg-filters">
        <defs>
          <filter id="rough-edge" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves={3}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={10}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <main
        id="collage-container"
        className={`${activeStage !== null ? "has-active" : ""} ${
          quizOpen ? "has-quiz" : ""
        }`}
      >
        <div
          className={`main-title-banner ${activeStage !== null ? "hidden" : ""}`}
        >
          <div className="director-text">{t("meta_study_of_nature")}</div>
          <h1 className="banner-text">METAMORPHOSIS</h1>
        </div>

        <div className="progress-indicator">
          <div className="dot" style={{ background: "var(--yellow)" }} />
          <div className="dot" style={{ background: "var(--pink)" }} />
          <div className="dot" style={{ background: "var(--mint)" }} />
          <div className="dot" style={{ background: "var(--red)" }} />
        </div>

        <article
          className={`stage-band stage-egg ${
            activeStage === 1 ? "active" : activeStage ? "inactive" : ""
          }`}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button")) return;
            onStageClick(1);
          }}
          onMouseMove={(e) => {
            if (activeStage !== null) return;
            const key = "stage-egg";
            showTooltip(t(stageTooltipKeys[key]));
          }}
          onMouseLeave={hideTooltip}
        >
          <div className="painterly-bg" />
          <div className="default-content">
            <span className="stage-num">01</span>
            <span className="stage-name-default">
              {t("meta_stage_egg_name")}
            </span>
          </div>
          <div className="expanded-content">
            <div className="text-content">
              <h2 className="detail-header" data-text={t("meta_hdr_egg")}>
                {t("meta_hdr_egg")}
              </h2>
              <div className="detail-meta">{t("meta_stage_egg_meta")}</div>
              <div className="detail-body">
                <p>{t("meta_egg_p1")}</p>
                <br />
                <p>
                  <strong>{t("meta_observation")}:</strong> {t("meta_egg_obs")}
                </p>
              </div>
              <div style={{ marginTop: 12 }}>
                {(["egg1", "egg2", "egg3"] as const).map((k) => (
                  <div
                    key={k}
                    className="fun-fact-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFact(k);
                    }}
                  >
                    {t(funFacts[k].labelKey)}
                  </div>
                ))}
              </div>
              {(["egg1", "egg2", "egg3"] as const).map((k) => (
                <div
                  key={k}
                  className={`fun-fact-reveal ${openFactKey === k ? "open" : ""}`}
                  style={{ borderColor: `var(--${k})` }}
                >
                  {t(funFacts[k].textKey)}
                </div>
              ))}
            </div>
            <div className="illustration-container">
              <svg
                className="art-piece"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="pulse-circle"
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgba(243,197,34,0.3)"
                  strokeWidth="2"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="8"
                  strokeDasharray="10 5"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2"
                />
                <path
                  d="M 50 100 Q 100 50 150 100"
                  stroke="#111"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  d="M 50 100 Q 100 150 150 100"
                  stroke="#111"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="12"
                  fill="#F3C522"
                  stroke="#111"
                  strokeWidth="3"
                />
              </svg>
            </div>
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                collapseStage();
              }}
            >
              {t("meta_collapse")}
            </button>
            <div className="system-code">REF: OVM-001.X</div>
          </div>
        </article>

        <article
          className={`stage-band stage-larva ${
            activeStage === 2 ? "active" : activeStage ? "inactive" : ""
          }`}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button")) return;
            onStageClick(2);
          }}
          onMouseMove={() => {
            if (activeStage !== null) return;
            showTooltip(t(stageTooltipKeys["stage-larva"]));
          }}
          onMouseLeave={hideTooltip}
        >
          <div className="tear-top" />
          <div className="painterly-bg" />
          <div className="default-content">
            <span className="stage-num">02</span>
            <span className="stage-name-default">
              {t("meta_stage_larva_name")}
            </span>
          </div>
          <div className="expanded-content">
            <div className="text-content">
              <h2 className="detail-header" data-text={t("meta_hdr_larva")}>
                {t("meta_hdr_larva")}
              </h2>
              <div className="detail-meta">{t("meta_stage_larva_meta")}</div>
              <div className="detail-body">
                <p>{t("meta_larva_p1")}</p>
                <br />
                <p>
                  <strong>{t("meta_observation")}:</strong>{" "}
                  {t("meta_larva_obs")}
                </p>
              </div>
              <div style={{ marginTop: 12 }}>
                {(["larva1", "larva2", "larva3"] as const).map((k) => (
                  <div
                    key={k}
                    className="fun-fact-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFact(k);
                    }}
                  >
                    {t(funFacts[k].labelKey)}
                  </div>
                ))}
              </div>
              {(["larva1", "larva2", "larva3"] as const).map((k) => (
                <div
                  key={k}
                  className={`fun-fact-reveal ${openFactKey === k ? "open" : ""}`}
                  style={{ borderColor: `var(--${k})` }}
                >
                  {t(funFacts[k].textKey)}
                </div>
              ))}
            </div>
            <div className="illustration-container">
              <svg
                className="art-piece"
                viewBox="0 0 300 150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 20 100 Q 50 20 100 100 T 180 100 T 260 100"
                  fill="none"
                  stroke="#111"
                  strokeWidth="25"
                  strokeLinecap="round"
                />
                <circle cx="40" cy="70" r="8" fill="#fff" />
                <circle cx="120" cy="80" r="8" fill="#fff" />
                <circle cx="200" cy="70" r="8" fill="#fff" />
                <circle
                  cx="275"
                  cy="90"
                  r="14"
                  fill="#E53B82"
                  stroke="#111"
                  strokeWidth="4"
                />
                <circle cx="282" cy="84" r="4" fill="#111" />
              </svg>
            </div>
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                collapseStage();
              }}
            >
              {t("meta_collapse")}
            </button>
            <div className="system-code">REF: LRV-002.Y</div>
          </div>
        </article>

        <article
          className={`stage-band stage-pupa ${
            activeStage === 3 ? "active" : activeStage ? "inactive" : ""
          }`}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button")) return;
            onStageClick(3);
          }}
          onMouseMove={() => {
            if (activeStage !== null) return;
            showTooltip(t(stageTooltipKeys["stage-pupa"]));
          }}
          onMouseLeave={hideTooltip}
        >
          <div className="tear-top" />
          <div className="painterly-bg" />
          <div className="default-content">
            <span className="stage-num">03</span>
            <span className="stage-name-default">
              {t("meta_stage_pupa_name")}
            </span>
          </div>
          <div className="expanded-content">
            <div className="text-content">
              <h2 className="detail-header" data-text={t("meta_hdr_pupa")}>
                {t("meta_hdr_pupa")}
              </h2>
              <div className="detail-meta">{t("meta_stage_pupa_meta")}</div>
              <div className="detail-body">
                <p>{t("meta_pupa_p1")}</p>
                <br />
                <p>
                  <strong>{t("meta_observation")}:</strong> {t("meta_pupa_obs")}
                </p>
              </div>
              <div style={{ marginTop: 12 }}>
                {(["pupa1", "pupa2", "pupa3"] as const).map((k) => (
                  <div
                    key={k}
                    className="fun-fact-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFact(k);
                    }}
                  >
                    {t(funFacts[k].labelKey)}
                  </div>
                ))}
              </div>
              {(["pupa1", "pupa2", "pupa3"] as const).map((k) => (
                <div
                  key={k}
                  className={`fun-fact-reveal ${openFactKey === k ? "open" : ""}`}
                  style={{ borderColor: `var(--${k})` }}
                >
                  {t(funFacts[k].textKey)}
                </div>
              ))}
            </div>
            <div className="illustration-container">
              <svg
                className="art-piece"
                viewBox="0 0 150 250"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 75 10 L 90 50 Q 120 100 90 200 L 75 240 L 60 200 Q 30 100 60 50 Z"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="8"
                />
                <line
                  x1="75"
                  y1="10"
                  x2="75"
                  y2="240"
                  stroke="#111"
                  strokeWidth="4"
                  strokeDasharray="5 5"
                />
                <path d="M 60 100 L 90 120" stroke="#111" strokeWidth="4" />
                <path d="M 60 150 L 90 130" stroke="#111" strokeWidth="4" />
                <circle
                  cx="75"
                  cy="130"
                  r="18"
                  fill="#83D5A1"
                  stroke="#111"
                  strokeWidth="3"
                  opacity="0.7"
                />
              </svg>
            </div>
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                collapseStage();
              }}
            >
              {t("meta_collapse")}
            </button>
            <div className="system-code">REF: PPA-003.Z</div>
          </div>
        </article>

        <article
          className={`stage-band stage-adult ${
            activeStage === 4 ? "active" : activeStage ? "inactive" : ""
          }`}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button")) return;
            onStageClick(4);
          }}
          onMouseMove={() => {
            if (activeStage !== null) return;
            showTooltip(t(stageTooltipKeys["stage-adult"]));
          }}
          onMouseLeave={hideTooltip}
        >
          <div className="tear-top" />
          <div className="painterly-bg" />
          <div className="default-content">
            <span className="stage-num">04</span>
            <span className="stage-name-default">
              {t("meta_stage_adult_name")}
            </span>
          </div>
          <div className="expanded-content">
            <div className="text-content">
              <h2
                className="detail-header"
                data-text={t("meta_hdr_adult")}
                style={{
                  color: "var(--white)",
                  WebkitTextStroke: "2px var(--white)",
                }}
              >
                {t("meta_hdr_adult")}
              </h2>
              <div
                className="detail-meta"
                style={{ color: "var(--white)", borderColor: "var(--white)" }}
              >
                {t("meta_stage_adult_meta")}
              </div>
              <div className="detail-body">
                <p>{t("meta_adult_p1")}</p>
                <br />
                <p>
                  <strong>{t("meta_observation")}:</strong>{" "}
                  {t("meta_adult_obs")}
                </p>
              </div>
              <div style={{ marginTop: 12 }}>
                {(["adult1", "adult2", "adult3"] as const).map((k) => (
                  <div
                    key={k}
                    className="fun-fact-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFact(k);
                    }}
                  >
                    {t(funFacts[k].labelKey)}
                  </div>
                ))}
              </div>
              {(["adult1", "adult2", "adult3"] as const).map((k) => (
                <div
                  key={k}
                  className={`fun-fact-reveal ${openFactKey === k ? "open" : ""}`}
                  style={{ borderColor: funFacts[k].color }}
                >
                  {t(funFacts[k].textKey)}
                </div>
              ))}
            </div>
            <div className="illustration-container">
              <svg
                className="art-piece"
                viewBox="0 0 300 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 150 100 C 150 100, 250 10, 280 80 C 300 130, 200 180, 150 100"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="8"
                />
                <path
                  d="M 150 100 C 150 100, 50 10, 20 80 C 0 130, 100 180, 150 100"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="8"
                />
                <circle
                  cx="210"
                  cy="80"
                  r="20"
                  fill="#BA2433"
                  stroke="#111"
                  strokeWidth="3"
                  opacity="0.7"
                />
                <circle
                  cx="90"
                  cy="80"
                  r="20"
                  fill="#BA2433"
                  stroke="#111"
                  strokeWidth="3"
                  opacity="0.7"
                />
                <rect
                  x="145"
                  y="40"
                  width="10"
                  height="120"
                  rx="5"
                  fill="#111"
                />
                <circle cx="200" cy="90" r="15" fill="#111" />
                <circle cx="100" cy="90" r="15" fill="#111" />
                <line
                  x1="150"
                  y1="40"
                  x2="135"
                  y2="10"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line
                  x1="150"
                  y1="40"
                  x2="165"
                  y2="10"
                  stroke="#111"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <button
              className="close-btn"
              style={{ color: "var(--black)", background: "var(--white)" }}
              onClick={(e) => {
                e.stopPropagation();
                collapseStage();
              }}
            >
              {t("meta_collapse")}
            </button>
            <div className="system-code" style={{ color: "var(--white)" }}>
              REF: IMG-004.W
            </div>
          </div>
        </article>

        <button
          className="quiz-trigger"
          style={{
            opacity: activeStage !== null || quizOpen ? 0 : 1,
            pointerEvents: activeStage !== null || quizOpen ? "none" : "auto",
          }}
          onClick={(e) => {
            e.stopPropagation();
            openQuiz();
          }}
        >
          {t("meta_test_knowledge")}
        </button>
      </main>

      <section id="quiz-overlay" className={quizOpen ? "active" : ""}>
        <div className="quiz-header">
          <h2 className="quiz-title">{t("meta_arrange")}</h2>
          <button
            className="quiz-close"
            onClick={(e) => {
              e.stopPropagation();
              closeQuiz();
            }}
          >
            {t("meta_close")}
          </button>
        </div>

        <div className="quiz-workspace">
          <div className="drop-zones">
            {([1, 2, 3, 4] as const).map((z) => {
              const placedId = quizPlacements[z];
              const placedItem = placedId
                ? quizItems.find((it) => it.id === placedId)
                : undefined;

              return (
                <div
                  key={z}
                  className="drop-zone"
                  data-order={z}
                  onDragOver={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLDivElement).classList.add(
                      "hovered",
                    );
                  }}
                  onDragLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).classList.remove(
                      "hovered",
                    );
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLDivElement).classList.remove(
                      "hovered",
                    );
                    const idStr = e.dataTransfer.getData("text/plain");
                    const id = Number.parseInt(idStr, 10) as QuizItemId;
                    if (![1, 2, 3, 4].includes(id)) return;
                    if (quizPlacements[z]) return;
                    onQuizDrop(z, id);
                  }}
                  style={{
                    borderStyle: placedId
                      ? ("solid" as const)
                      : ("dashed" as const),
                    color: placedId ? "var(--black)" : undefined,
                  }}
                >
                  {placedItem ? (
                    <div
                      className={`drag-item ${placedItem.colorClass}`}
                      style={{ transform: "rotate(0deg)", boxShadow: "none" }}
                    >
                      {placedItem.label}
                    </div>
                  ) : (
                    t("meta_drop_stage", { n: z })
                  )}
                </div>
              );
            })}
          </div>

          <div className="draggable-items">
            {bankItems.map((it) => (
              <div
                key={it.id}
                className={`drag-item ${it.colorClass}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", String(it.id));
                }}
              >
                {it.label}
              </div>
            ))}
          </div>
        </div>

        {quizResultText && (
          <div className="quiz-result-msg" style={{ color: quizResultColor }}>
            {quizResultText}
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          {quizResultText && (
            <button
              className="quiz-reset-btn"
              onClick={() => {
                playClick();
                resetQuiz();
              }}
            >
              {t("meta_try_again")}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
