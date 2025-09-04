import React from "react";

export default function ArtistShareChart({ tracks = [], artists = [] }) {
  const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#bc6ff1"];

  const sanitizedArtists = artists.map((a) => ({ ...a, weight: +a.weight || 0 }));
  let data = sanitizedArtists.filter((a) => a.weight > 0);

  if (data.length === 0) {
    const counts = {};
    tracks.forEach((t) => {
      (t.artists || []).forEach((name) => {
        counts[name] = (counts[name] || 0) + 1;
      });
    });
    data = Object.entries(counts).map(([name, weight]) => ({ name, weight: +weight || 0 }));
  }

  data = data.sort((a, b) => b.weight - a.weight).slice(0, 5);
  const total = data.reduce((sum, a) => sum + a.weight, 0);

  let currentAngle = 0;
  const segments = data.map((artist, idx) => {
    const share = total ? artist.weight / total : 0;
    const startAngle = currentAngle;
    const endAngle = startAngle + share * 360;
    currentAngle = endAngle;
    return {
      data: artist,
      color: colors[idx % colors.length],
      startAngle,
      endAngle,
    };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.startAngle}deg ${s.endAngle}deg`)
    .join(", ");

  const artistMap = sanitizedArtists.reduce((map, a) => {
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
        <span style={{ fontWeight: 900, fontSize: 16 }}>Top Artist Share</span>
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
        {segments.map((d) => {
          const genres = artistMap[d.data.name]?.genres?.join(", ");
          return (
            <li
              key={d.data.name}
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
                  backgroundColor: d.color,
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: 4,
                }}
              />
              {d.data.name}
              {genres ? ` (${genres})` : ""} ({Math.round((d.data.weight / total) * 100)}%)
            </li>
          );
        })}
      </ul>
    </div>
  );
}
