// pages/app.jsx
import React, { useEffect, useState } from "react";
import { fetchTopArtists, fetchTopTracks } from "../utils/spotify";
import { mapToPersonality } from "../utils/mapping";
import Card from "../components/Card";

const FEATURE_KEYS = [
  "acousticness",
  "danceability",
  "energy",
  "instrumentalness",
  "liveness",
  "valence",
];

export default function AppPage() {
  const [token, setToken] = useState(null);
  const [artists, setArtists] = useState([]);
  const [personality, setPersonality] = useState(null);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("access_token");
    if (t) {
      setToken(t);
      history.replaceState({}, "", "/app");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const a = await fetchTopArtists(token, 20);
        const t = await fetchTopTracks(token, 20);
        setArtists(a);
        setPersonality(mapToPersonality(a, t));
        const feat = FEATURE_KEYS.reduce((acc, k) => ({ ...acc, [k]: 0 }), {});
        let count = 0;
        t.forEach((tr) => {
          if (tr.audio_features) {
            count++;
            FEATURE_KEYS.forEach((k) => {
              feat[k] += tr.audio_features[k] || 0;
            });
          }
        });
        if (count > 0) {
          FEATURE_KEYS.forEach((k) => {
            feat[k] = (feat[k] / count) * 100;
          });
        }
        setFeatures(feat);
      } catch (e) {
        console.error("Fetch failed", e);
        alert("Loading failed");
      }
    })();
  }, [token]);

  return (
    <main className="main-container" style={{ color: "var(--text-white)" }}>
      <div className="card-wrapper">
        <Card personality={personality} artists={artists} features={features} />
      </div>
    </main>
  );
}
