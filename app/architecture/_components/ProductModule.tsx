"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "./types";
import { pad2 } from "./utils";

export default function ProductModule(props: { products: Product[] }) {
  const { products } = props;
  const [productIndex, setProductIndex] = useState(0);
  const productTimerRef = useRef<number | null>(null);

  const product = products[productIndex];

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

  const imgBg = useMemo(() => {
    if (product.accent === "green") return "linear-gradient(135deg, #0d1a0d 0%, #111 100%)";
    if (product.accent === "blue") return "linear-gradient(135deg, #0d0d1a 0%, #111 100%)";
    if (product.accent === "orange") return "linear-gradient(135deg, #1a0d0d 0%, #111 100%)";
    return "linear-gradient(135deg, #0d1515 0%, #111 100%)";
  }, [product.accent]);

  return (
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
        <div className="product-image" style={{ background: imgBg }}>
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
  );
}
