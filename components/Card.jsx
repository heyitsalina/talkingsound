import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { frontPathFor, backPathFor } from "../utils/assets";

export default function Card({ personality, tracks = [], overrides = {} }) {
  // reference each card face for PNG export
  const frontRef = useRef();
  const backRef = useRef();
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
    const node = showBack ? backRef.current : frontRef.current;
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { cacheBust: true });
      const suffix = showBack ? "back" : "front";
      saveAs(
        dataUrl,
        `${(personality || "card").replace(/\s+/g, "-")}-${suffix}.png`
      );
    } catch (e) {
      console.error(e);
      alert("Export failed");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="flip-scene"
        style={{ width: 420, height: cardHeight || "auto", margin: "0 auto" }}
      >
        <div
          className={`flip-card ${showBack ? "is-flipped" : ""}`}
          style={{ width: "100%", height: "100%" }}
        >
          <div className="flip-card-face">
            <img
              ref={frontRef}
              src={frontUrl}
              alt="front"
              style={{
                width: "100%",
                display: "block",
                borderRadius: 12,
                backfaceVisibility: "hidden",
              }}
              onLoad={(e) => setCardHeight(e.currentTarget.offsetHeight)}
              onError={(e) => {
                e.currentTarget.src = frontPathFor();
              }}
            />
          </div>
          <div className="flip-card-face flip-card-back">
            <img
              ref={backRef}
              src={backUrl}
              alt="back"
              style={{
                width: "100%",
                display: "block",
                borderRadius: 12,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              onError={(e) => {
                e.currentTarget.src = backPathFor();
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ width: 420, margin: "12px auto 0", textAlign: "center" }}>
        <h3 style={{ margin: 0, fontSize: 24 }}>Your Top Songs This Month</h3>
        <ol
          style={{
            marginTop: 8,
            color: "#fff",
            fontSize: 18,
            paddingLeft: 0,
            textAlign: "center",
            listStylePosition: "inside",
          }}
        >
          {tracks?.slice(0, 5).map((t, i) => {
            const artistStr = t.artists?.join(", ");
            return (
              <li key={t.id || i}>
                {artistStr ? `${t.name} by ${artistStr}` : t.name}
              </li>
            );
          })}
        </ol>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <button
          onClick={() => setShowBack((s) => !s)}
          className="auth-btn"
        >
          {showBack ? "Show Front" : "Show Back"}
        </button>
        <button onClick={download} className="auth-btn">
          Download
        </button>
      </div>
    </div>
  );
}

