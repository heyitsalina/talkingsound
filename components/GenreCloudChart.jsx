import React from "react";

export default function GenreCloudChart({ artists = [] }) {
  const counts = {};
  artists.forEach((a) => {
    (a.genres || []).forEach((g) => {
      counts[g] = (counts[g] || 0) + 1;
    });
  });
  const entries = Object.entries(counts);
  if (entries.length === 0) return null;

  const max = Math.max(...entries.map(([, c]) => c));

  return (
    <div style={{ width: 260, textAlign: "center", color: "#CB1F1F" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 700 }}>Genre Cloud</span>
        <span
          style={{ cursor: "help" }}
          title="Shows which genres appear most in your top artists—bigger = more frequent."
        >
          ℹ️
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {entries
          .sort((a, b) => b[1] - a[1])
          .map(([genre, count]) => {
            const size = 12 + (count / max) * 24;
            return (
              <span key={genre} style={{ fontSize: size }}>
                {genre}
              </span>
            );
          })}
      </div>
    </div>
  );
}
