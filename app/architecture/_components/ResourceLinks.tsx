"use client";

import React from "react";

export default function ResourceLinks() {
  return (
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
  );
}
