// pages/app.jsx
import React, { useEffect, useState } from "react";
import { fetchTopArtists, fetchTopTracks } from "../utils/spotify";
import { mapToPersonality } from "../utils/mapping";
import Card from "../components/Card";

export default function AppPage() {
  const [token, setToken] = useState(null);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [personality, setPersonality] = useState(null);
  const [overrides, setOverrides] = useState({ map: {} });

  // read access_token from URL (set by callback) and clean URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("access_token");
    if (t) {
      setToken(t);
      history.replaceState({}, "", "/app");
    }
  }, []);

  // fetch spotify data when we have a token
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const a = await fetchTopArtists(token, 20);
        const t = await fetchTopTracks(token, 20);
        setArtists(a);
        setTracks(t);
        setPersonality(mapToPersonality(a, t));
      } catch (e) {
        console.error("Fetch failed", e);
        alert("Loading failed — try 'Load sample data' or upload your Spotify export.");
      }
    })();
  }, [token]);

  // quick handler: upload override for a specific personality (local only)
  const handlePersonalityUpload = (personalityKey, file) => {
    const key = personalityKey.toLowerCase().replace(/\s+/g, "-");
    setOverrides((prev) => ({ ...prev, map: { ...prev.map, [key]: URL.createObjectURL(file) } }));
  };

  // load bundled sample data (fallback)
  const loadSample = async () => {
    const res = await fetch("/sample-data.json").catch(() => null);
    if (!res) {
      alert("No sample data found. Please login with Spotify or upload a sample JSON.");
      return;
    }
    const json = await res.json();
    setArtists(json.top_artists || []);
    setTracks(json.top_tracks || []);
    setPersonality(mapToPersonality(json.top_artists || [], json.top_tracks || []));
  };

  return (
    <main className="main-container" style={{ color: "var(--text-white)" }}>
      <h2 style={{ fontSize: 24, marginBottom: 8, color: "var(--text-white)" }}>Talking Sounds — App</h2>

      <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={loadSample}
          className="app-btn app-btn--primary"
          title="Load sample data"
        >
          Load sample data
        </button>

        <div style={{ fontSize: 14, color: "var(--muted-white)" }}>
          Or upload a Spotify export JSON or use overrides below to test specific cards.
        </div>
      </div>

      <div style={{ marginTop: 20, color: "var(--text-white)" }}>
        <p><strong>Auth status:</strong> {token ? "Connected — fetching your data" : "Not connected"}</p>
        <p><strong>Assigned personality:</strong> {personality || "—"}</p>
        <p><strong>Top artists:</strong> {artists.slice(0, 5).map((a) => a.name).join(", ") || "—"}</p>
      </div>

      <div className="card-wrapper">
        <Card personality={personality} artists={artists} overrides={overrides} />
      </div>

      <section style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 8, fontSize: 16, color: "var(--text-white)" }}>Quick overrides — test specific fronts</h3>
        <p style={{ marginTop: 0, marginBottom: 12, color: "var(--muted-white)", fontSize: 13 }}>
          Upload a PNG to temporarily replace a personality front (local only). Handy for design checks.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            "The Ace","The Seeker","The Nostalgic","The Rebel",
            "The Pulse","The Dreamer","The Poet","The Virtuoso",
            "The Loner","The Romantic","The Firestarter","The Prophet",
            "The Shadow","The Siren","The Shapeshifter","The Oracle"
          ].map((p) => (
            <label key={p} style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 6, color: "var(--text-white)" }}>
              <span style={{ fontSize: 12 }}>{p}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handlePersonalityUpload(p, f);
                }}
              />
            </label>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 18, fontSize: 13, color: "var(--muted-white)" }}>
        Need the layout reworked or want the app to export print-ready PNGs? Say the word — I’ll patch it.
      </div>
    </main>
  );
}
