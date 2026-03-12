"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import "@/lib/i18n";
import { featuredResources } from "@/lib/featuredResources";
import GenerativeFlower from "./GenerativeFlower";

const Landing: React.FC = () => {
  const { t, i18n } = useTranslation();
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const blurLayerRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  const shouldPlayFlower = useCallback(() => {
    try {
      const key = "bioluma:last_visit_ms";
      const raw = localStorage.getItem(key);
      const last = raw ? Number(raw) : NaN;
      const now = Date.now();
      const thresholdMs = 30 * 60 * 1000;
      if (!Number.isFinite(last)) return true;
      return now - last >= thresholdMs;
    } catch {
      return true;
    }
  }, []);

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  // flowerVisible = true → flower shown; false → flower fades out
  const [flowerVisible, setFlowerVisible] = useState(() => shouldPlayFlower());
  // uiVisible = false → UI/3D hidden; true → visible
  const [uiVisible, setUiVisible] = useState(() => !shouldPlayFlower());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Called when flower finishes drawing — fade it out and show the rest
  const handleFlowerFinished = useCallback(() => {
    // 800ms pause so user sees the finished bouquet
    setTimeout(() => {
      setFlowerVisible(false); // flower dissolves (2s opacity transition)
      setUiVisible(true); // 3D + UI fades in
    }, 800);
  }, []);

  useEffect(() => {
    try {
      const key = "bioluma:last_visit_ms";
      const write = () => localStorage.setItem(key, String(Date.now()));
      write();
      const onVis = () => {
        if (document.visibilityState === "hidden") write();
      };
      window.addEventListener("beforeunload", write);
      document.addEventListener("visibilitychange", onVis);
      return () => {
        window.removeEventListener("beforeunload", write);
        document.removeEventListener("visibilitychange", onVis);
      };
    } catch {
      return;
    }
  }, []);

  // Three.js — mount once uiVisible becomes true
  useEffect(() => {
    if (!uiVisible || !threeContainerRef.current) return;
    const container = threeContainerRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.01,
      40,
    );
    // Position camera so the head appears on the RIGHT half of the screen
    camera.position.set(0.35, 0, 1.4);
    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.5;
    controls.maxDistance = 6;
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    // Orbit target shifted right
    controls.target.set(0.25, 0, 0);

    let fallbackPoints: THREE.Points | null = null;
    let pointsObject: THREE.Points | null = null;
    let rafId: number;

    const createFallback = () => {
      const count = 15000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const orange = new THREE.Color(0xe67e22);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const r = 0.4 + Math.random() * 0.3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);
        colors[i3] = orange.r;
        colors[i3 + 1] = orange.g;
        colors[i3 + 2] = orange.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      fallbackPoints = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size: 0.002,
          vertexColors: true,
          transparent: true,
          opacity: 0.65,
        }),
      );
      scene.add(fallbackPoints);
    };

    new PCDLoader().load(
      "https://threejs.org/examples/models/pcd/binary/Zaghetto.pcd",
      (pts) => {
        pts.geometry.center();
        pts.geometry.rotateX(Math.PI);
        pts.material.size = 0.003;
        pts.material.color.setHex(0xe67e22);
        pts.material.opacity = 0.75;
        pts.material.transparent = true;
        // Offset the model to the right
        pts.position.x = 0.25;
        scene.add(pts);
        pointsObject = pts;
      },
      undefined,
      () => createFallback(),
    );

    scene.add(new THREE.AmbientLight(0xfff5e1, 1.0));
    const dLight = new THREE.DirectionalLight(0xff7f50, 1.5);
    dLight.position.set(5, 5, 5);
    scene.add(dLight);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      if (fallbackPoints) fallbackPoints.rotation.y += 0.0005;
      if (pointsObject) pointsObject.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [uiVisible]);

  // Cursor effects — only after UI is visible
  useEffect(() => {
    if (!uiVisible) return;
    let mouseX = window.innerWidth / 2,
      mouseY = window.innerHeight / 2;
    let cursorX = mouseX,
      cursorY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${mouseX}px`;
        cursorDotRef.current.style.top = `${mouseY}px`;
      }
    };
    document.addEventListener("mousemove", onMouseMove);

    const tick = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      if (cursorOutlineRef.current) {
        cursorOutlineRef.current.style.left = `${cursorX}px`;
        cursorOutlineRef.current.style.top = `${cursorY}px`;
      }
      if (blurLayerRef.current) {
        blurLayerRef.current.style.setProperty(
          "--x",
          `${(cursorX / window.innerWidth) * 100}%`,
        );
        blurLayerRef.current.style.setProperty(
          "--y",
          `${(cursorY / window.innerHeight) * 100}%`,
        );
      }
      setCoords({ x: Math.round(cursorX), y: Math.round(cursorY) });
      rafId = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = () => {
      if (!cursorOutlineRef.current) return;
      cursorOutlineRef.current.style.width = "60px";
      cursorOutlineRef.current.style.height = "60px";
      cursorOutlineRef.current.style.borderColor = "#e67e22";
    };
    const onLeave = () => {
      if (!cursorOutlineRef.current) return;
      cursorOutlineRef.current.style.width = "40px";
      cursorOutlineRef.current.style.height = "40px";
      cursorOutlineRef.current.style.borderColor = "rgba(230, 126, 34, 0.4)";
    };
    const els = document.querySelectorAll(
      ".btn, .nav-text, .lang-btn, .gallery-card",
    );
    els.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [uiVisible]);

  const changeLanguage = (lng: string) => {
    try {
      localStorage.setItem("bioluma:lang", lng);
    } catch {
      // ignore
    }
    i18n.changeLanguage(lng);
  };

  return (
    <div className="landing-body">
      {/* Flower — rendered always, fades out when flowerVisible=false */}
      <GenerativeFlower
        onFinished={handleFlowerFinished}
        visible={flowerVisible}
      />

      {/* Three.js canvas — mounted once uiVisible, positioned right side */}
      <div
        id="three-container"
        ref={threeContainerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
          opacity: uiVisible ? 1 : 0,
          transition: "opacity 1.5s ease 0.5s",
        }}
      />

      <div className="layer-sharp" />
      <div className="layer-blur" ref={blurLayerRef} />
      <div className="noise-overlay" />

      {/* UI — fades in when uiVisible */}
      <div
        className="ui-layer"
        style={{
          opacity: uiVisible ? 1 : 0,
          transition: "opacity 1.5s ease 0.3s",
          pointerEvents: uiVisible ? "none" : "none",
        }}
      >
        <header className="header-top">
          <Link href="/" className="nav-text brand">
            {t("brand")}
          </Link>
          <div className="header-actions">
            <button
              className="mobile-menu-btn"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((p) => !p)}
              style={{ pointerEvents: "auto" }}
            >
              ☰
            </button>
            <nav className={`header-nav${mobileMenuOpen ? " open" : ""}`}>
              <Link
                href="#gallery"
                className="nav-text"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("projects")}
              </Link>
              <Link
                href="/model"
                className="nav-text"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("capabilities")}
              </Link>
            </nav>
            <div className="lang-switcher">
              <button
                className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
                onClick={() => changeLanguage("en")}
              >
                EN
              </button>
              <button
                className={`lang-btn ${i18n.language === "uk" ? "active" : ""}`}
                onClick={() => changeLanguage("uk")}
              >
                UA
              </button>
            </div>
          </div>
        </header>

        {/* Hero text sits on LEFT, 3D model occupies RIGHT via camera offset */}
        <main className="hero-text">
          <h1
            className="prompt-main"
            dangerouslySetInnerHTML={{
              __html: t("hero_title").replace(" ", "<br/>"),
            }}
          />
          <p className="prompt-sub">{t("hero_sub")}</p>
          <div className="cta-container" style={{ pointerEvents: "auto" }}>
            <Link
              href={isMobile ? "/metamorphosis" : "/model"}
              className="btn btn-primary"
            >
              {isMobile ? t("cta_metamorphosis") : t("cta_start")}
            </Link>
            <Link href="#gallery" className="btn btn-secondary">
              {t("cta_demo")}
            </Link>
          </div>
        </main>

        <section id="gallery" className="gallery-section">
          <div className="gallery-label">
            <span className="gallery-label-line" />
            <span className="gallery-label-text">
              {t("landing_featured_resources")}
            </span>
            <span className="gallery-label-line" />
          </div>
          <div className="gallery-grid">
            {featuredResources.map((res) => (
              <Link key={res.id} href={res.href} className="gallery-card">
                <div className="card-ink">{res.indexLabel}</div>
                <h3>{t(res.titleKey)}</h3>
                <p>{t(res.descKey)}</p>
                <div className="card-arrow">→</div>
              </Link>
            ))}
          </div>
        </section>

        <div className="coords" style={{ pointerEvents: "none" }}>
          {t("est")}
          <br />
          X: {coords.x} / Y: {coords.y}
        </div>
        <div className="scroll-indicator">
          <div className="chevron" />
        </div>
      </div>

      {uiVisible && <div className="cursor-dot" ref={cursorDotRef} />}
      {uiVisible && <div className="cursor-outline" ref={cursorOutlineRef} />}
    </div>
  );
};

export default Landing;
