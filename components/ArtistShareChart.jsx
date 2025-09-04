import React from "react";

export default function ArtistShareChart({ tracks = [], artists = [] }) {
  const counts = {};
  tracks.forEach((t) => {
    (t.artists || []).forEach((a) => {
      counts[a] = (counts[a] || 0) + 1;
    });
  });
  const total = Object.values(counts).reduce((sum, v) => sum + v, 0);
  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#bc6ff1"];
  let currentAngle = 0;
  const segments = entries.map(([name, count], idx) => {
    const share = count / total;
    const startAngle = currentAngle;
    const endAngle = startAngle + share * 360;
    currentAngle = endAngle;
    return { name, share, color: colors[idx % colors.length], startAngle, endAngle };
  });
  const gradient = segments
    .map((s) => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`)
    .join(", ");

  const artistMap = artists.reduce((map, a) => {
    map[a.name] = a;
    return map;
  }, {});

  return (
    <div style={{ width: 180, textAlign: "center", color: "#CB1F1F" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 700 }}>Top Artist Share</span>
        <span
          style={{ cursor: "help" }}
          title="Shows how your top tracks are distributed among artists."
        >
          ℹ️
        </span>
      </div>
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          margin: "0 auto",
          background: `conic-gradient(${gradient})`,
        }}
      />
      <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0" }}>
        {segments.map((s) => {
          const genres = artistMap[s.name]?.genres?.join(", ");
          return (
            <li
              key={s.name}
              style={{
                fontSize: 12,
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: s.color,
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: 4,
                }}
              />
              {s.name}
              {genres ? ` (${genres})` : ""} ({Math.round(s.share * 100)}%)
            </li>
          );
        })}
      </ul>
    </div>
  );
}
