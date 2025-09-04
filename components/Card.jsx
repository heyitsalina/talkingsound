import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { frontPathFor, backPathFor } from "../utils/assets";
import ArtistShareChart from "./ArtistShareChart";
import GenreCloudChart from "./GenreCloudChart";

export default function Card({ personality, tracks = [], artists = [], overrides = {} }) {
  // reference each card face for PNG export
  const frontRef = useRef();
  const backRef = useRef();
  const [frontUrl, setFrontUrl] = useState(null);
  const [backUrl, setBackUrl] = useState(null);

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

  const download = async (side) => {
    const node = side === "back" ? backRef.current : frontRef.current;
    if (!node) return;
    try {
      const dataUrl = await toPng(node, { cacheBust: true });
      const suffix = side === "back" ? "back" : "front";
      saveAs(dataUrl, `${(personality || "card").replace(/\s+/g, "-")}-${suffix}.png`);
    } catch (e) {
      console.error(e);
      alert("Export failed");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          margin: "0 auto",
        }}
      >
        <img
          ref={frontRef}
          src={frontUrl}
          alt="front"
          style={{ width: 420, display: "block", borderRadius: 12 }}
          onError={(e) => {
            e.currentTarget.src = frontPathFor();
          }}
        />
        <div
          ref={backRef}
          style={{ position: "relative", width: 420, borderRadius: 12, overflow: "hidden" }}
        >
          <img
            src={backUrl}
            alt="back"
            style={{ width: 420, display: "block" }}
            onError={(e) => {
              e.currentTarget.src = backPathFor();
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: "24px 0",
              color: "#CB1F1F",
            }}
          >
            <ArtistShareChart tracks={tracks} artists={artists} />
            <GenreCloudChart artists={artists} />
          </div>
        </div>
      </div>

      <div style={{ width: 840, margin: "12px auto 0", textAlign: "center" }}>
      <h3
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            backgroundImage: "linear-gradient(90deg, #fff, #ffd1d1)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Your Top Songs This Month
        </h3>
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
        <button onClick={() => download("front")} className="auth-btn">
          Download Front
        </button>
        <button onClick={() => download("back")} className="auth-btn">
          Download Back
        </button>
      </div>
    </div>
  );
}

