import React, { useRef, useState, useEffect } from "react";
import CdViz from "./CdViz";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { frontPathFor, backPathFor } from "../utils/assets";

export default function Card({ personality, artists = [], overrides = {} }) {
  const nodeRef = useRef();
  const [frontUrl, setFrontUrl] = useState(null);
  const [backUrl, setBackUrl] = useState(null);
  const [showBack, setShowBack] = useState(false);

  useEffect(()=>{
    const key = personality || "";
    const norm = key.toLowerCase().replace(/\s+/g,'-');

    if (overrides?.map && overrides.map[norm]) {
      setFrontUrl(overrides.map[norm]);
    } else if (overrides?.front) {
      setFrontUrl(typeof overrides.front === "string" ? overrides.front : URL.createObjectURL(overrides.front));
    } else {
      setFrontUrl(frontPathFor(personality));
    }

    if (overrides?.back) {
      setBackUrl(typeof overrides.back === "string" ? overrides.back : URL.createObjectURL(overrides.back));
    } else {
      setBackUrl(backPathFor(personality));
    }
  }, [personality, overrides]);

  const download = async () => {
    if (!nodeRef.current) return;
    try {
      const dataUrl = await toPng(nodeRef.current, { cacheBust: true });
      saveAs(dataUrl, `${(personality||"card").replace(/\s+/g,'-')}.png`);
    } catch (e) {
      console.error(e);
      alert("Export failed");
    }
  };

  return (
    <div>
      <div ref={nodeRef} style={{ width: 420, borderRadius: 12, overflow: "hidden" }}>
        {!showBack ? (
          <div>
            <img src={frontUrl} alt="front" style={{ width: "100%", display:"block" }}
                 onError={(e)=>{ e.currentTarget.src="/cards/fronts/default-front.png"; }} />
            <div style={{ padding:12 }}>
              <h3 style={{ margin:0 }}>{personality}</h3>
              <p style={{ marginTop:8, color: "#333", fontSize: 14 }}>{artists?.slice(0,3).map(a=>a.name).join(", ")}</p>
            </div>
          </div>
        ) : (
          <div style={{ position:"relative" }}>
            <img src={backUrl} alt="back" style={{ width: "100%", display:"block" }}
                 onError={(e)=>{ e.currentTarget.src="/cards/backs/back.png"; }} />
            <div style={{ position:"absolute", left:0, top:0, right:0, bottom:0, display:"flex", justifyContent:"center", alignItems:"center", pointerEvents:"none" }}>
              <div style={{ width:"60%" , pointerEvents:"auto" }}>
                <CdViz artists={artists} size={320} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop:8, display:"flex", gap:8 }}>
        <button onClick={()=>setShowBack(s=>!s)}>{showBack? "Vorderseite" : "Rückseite"}</button>
        <button onClick={download} style={{ background:"var(--brand-red)", color:"#fff" }}>Download</button>
      </div>
    </div>
  );
}
