import React, { useRef, useState, useEffect } from "react";
import CdViz from "./CdViz";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { frontPathFor, backPathFor } from "../utils/assets";

export default function Card({ personality, artists = [], features = {}, overrides = {} }) {
  // reference the card for PNG export
  const cardRef = useRef();
  const [frontUrl, setFrontUrl] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [showBack, setShowBack] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    const key = personality || "";
    const norm = key.toLowerCase().replace(/\s+/g, "-");

    if (overrides?.map && overrides.map[norm]) {
      setFrontUrl(overrides.map[norm]);
    } else if (overrides?.front) {
      setFrontUrl(
        typeof overrides.front === "string"
          ? overrides.front
          : URL.createObjectURL(overrides.front)
      );
    } else {
      setFrontUrl(frontPathFor(personality));
    }

    if (overrides?.back) {
      setBackUrl(
        typeof overrides.back === "string"
          ? overrides.back
          : URL.createObjectURL(overrides.back)
      );
    } else {
      setBackUrl(backPathFor());
    }
  }, [personality, overrides]);

  const download = async () => {
    if (!cardRef.current) return;
    const wasBack = showBack;
    try {
      setShowBack(true);
      await new Promise((r) => setTimeout(r, 100));
      const dataUrl = await toPng(cardRef.current, { cacheBust: true });
      saveAs(
        dataUrl,
        `${(personality || "card").replace(/\s+/g, "-")}-back.png`
      );
    } catch (e) {
      console.error(e);
      alert("Export failed");
    } finally {
      setShowBack(wasBack);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="flip-scene"
        style={{ width: 420, height: cardHeight || "auto", margin: "0 auto" }}
      >
        <div
          ref={cardRef}
          className={`flip-card ${showBack ? "is-flipped" : ""}`}
          onClick={() => setShowBack((s) => !s)}
          style={{ width: "100%", height: "100%" }}
        >
          <div className="flip-card-face">
            <img
              src={frontUrl}
              alt="front"
              style={{ width: "100%", display: "block" }}
              onLoad={(e) => setCardHeight(e.currentTarget.offsetHeight)}
              onError={(e) => {
                e.currentTarget.src = "/cards/fronts/default-front.png";
              }}
            />
          </div>
          <div className="flip-card-face flip-card-back">
            <img
              src={backUrl}
              alt="back"
              style={{ width: "100%", display: "block" }}
              onError={(e) => {
                e.currentTarget.src = "/cards/backs/back.png";
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <div style={{ width: "60%", pointerEvents: "none" }}>
                <CdViz features={features} size={320} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: 420, margin: "12px auto 0", textAlign: "center" }}>
        <h3 style={{ margin: 0 }}>{personality}</h3>
        <p style={{ marginTop: 8, color: "#333", fontSize: 14 }}>
          {artists?.slice(0, 3).map((a) => a.name).join(", ")}
        </p>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={download} className="auth-btn">
          Download
        </button>
      </div>
    </div>
  );
}

