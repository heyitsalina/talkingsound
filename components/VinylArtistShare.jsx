import React, { useRef, useEffect } from "react";

export default function VinylArtistShare({ artistData = [], trackData = [], size = 300 }) {
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let svg;
    let tooltip;

    import("d3").then((d3) => {
      const root = containerRef.current;
      if (!root) return;
      const R = size / 2;
      const innerR = R * 0.72;
      const outerSpan = R * 0.28;

      svg = d3
        .select(root)
        .append("svg")
        .attr("width", size)
        .attr("height", size)
        .style("position", "absolute")
        .style("left", 0)
        .style("top", 0);

      const g = svg.append("g").attr("transform", `translate(${R},${R})`);

      tooltip = d3
        .select(root)
        .append("div")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background", "rgba(0,0,0,0.8)")
        .style("color", "#fff")
        .style("padding", "4px 8px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("opacity", 0);

      const data = artistData.slice(0, 8);
      const pie = d3.pie().value((d) => d.weight)(data);
      const color = d3.scaleOrdinal(d3.schemeTableau10);

      g
        .selectAll("path.artist-arc")
        .data(pie)
        .enter()
        .append("path")
        .attr("class", "artist-arc")
        .attr("d", (d) => {
          const arc = d3
            .arc()
            .innerRadius(innerR)
            .outerRadius(innerR + d.data.weight * outerSpan);
          return arc(d);
        })
        .attr("fill", (_, i) => color(i))
        .attr("tabindex", 0)
        .attr("aria-label", (d) => `${d.data.name} ${(d.data.weight * 100).toFixed(1)}%`)
        .on("mousemove", (event, d) => {
          const pct = (d.data.weight * 100).toFixed(1);
          tooltip
            .style("opacity", 1)
            .style("left", event.offsetX + 10 + "px")
            .style("top", event.offsetY + 10 + "px")
            .html(`<strong>${d.data.name}</strong><div style="font-size:11px">${pct}%</div>`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0))
        .on("click", (_, d) => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
          }
          const artistName = d.data.name;
          const sample = trackData.find((t) => t.artists?.includes(artistName));
          if (sample?.preview_url) {
            const a = new Audio(sample.preview_url);
            audioRef.current = a;
            a.play().catch(() => {});
          } else {
            window.open(
              `https://open.spotify.com/search/${encodeURIComponent(artistName)}`,
              "_blank"
            );
          }
        });
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (tooltip) tooltip.remove();
      if (svg) svg.remove();
    };
  }, [artistData, trackData, size]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}

