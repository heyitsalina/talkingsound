import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { frontPathFor, backPathFor } from "../utils/assets";

export default function Card({ personality, tracks = [], overrides = {} }) {
  const cardRef = useRef();
  const [frontUrl, setFrontUrl] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [showBack, setShowBack] = useState(false);

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
    const node = cardRef.current;
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
        ref={cardRef}
        style={{ width: 420, margin: "0 auto", borderRadius: 12, overflow: "hidden" }}
      >
        <img
          src={showBack ? backUrl : frontUrl}
          alt={showBack ? "back" : "front"}
          style={{ width: "100%", display: "block" }}
          onError={(e) => {
            e.currentTarget.src = showBack
              ? backPathFor()
              : frontPathFor(personality);
          }}
        />
      </div>

      <div style={{ width: 420, margin: "12px auto 0", textAlign: "center" }}>
        <h3 style={{ margin: 0 }}>{personality}</h3>
        <h4 style={{ marginTop: 8, marginBottom: 0 }}>Deine Top-Songs des Monats</h4>
        <ol
          style={{
            marginTop: 8,
            color: "#fff",
            fontSize: 14,
            paddingLeft: 0,
            listStylePosition: "inside",
            textAlign: "center",
          }}
        >
          {tracks?.slice(0, 5).map((t, i) => (
            <li key={t.id || i}>{t.name}</li>
          ))}
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

