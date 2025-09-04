import React, { useRef, useEffect } from "react";

export default function VinylMoodScatter({ trackData = [], size = 300 }) {
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

      const tracks = trackData.slice(0, 20);
      const valToAngle = d3.scaleLinear().domain([0, 1]).range([0, Math.PI * 2]);
      const energyToR = d3
        .scaleLinear()
        .domain([0, 1])
        .range([innerR * 0.4, innerR - 6]);
      const sizeScale = d3.scaleLinear().domain([0, 100]).range([2, 6]);
      const color = d3.scaleSequential(d3.interpolateTurbo).domain([0, 1]);

      g
        .selectAll("circle.track-dot")
        .data(tracks)
        .enter()
        .append("circle")
        .attr("class", "track-dot")
        .attr("cx", (d) => energyToR(d.energy || 0) * Math.cos(valToAngle(d.valence || 0)))
        .attr("cy", (d) => energyToR(d.energy || 0) * Math.sin(valToAngle(d.valence || 0)))
        .attr("r", (d) => sizeScale(d.popularity || 0))
        .attr("fill", (d) => color(d.valence || 0))
        .attr("tabindex", 0)
        .attr(
          "aria-label",
          (d) =>
            `${d.name} energy ${(d.energy * 100).toFixed(0)}% valence ${(d.valence * 100).toFixed(0)}%`
        )
        .on("mousemove", (event, d) => {
          tooltip
            .style("opacity", 1)
            .style("left", event.offsetX + 10 + "px")
            .style("top", event.offsetY + 10 + "px")
            .html(`
              <strong>${d.name}</strong>
              <div style="display:flex;gap:4px;margin-top:2px;font-size:10px;">
                <div style="width:60px;background:#555;height:4px;">
                  <div style="width:${(d.energy || 0) * 100}%;background:#1db954;height:100%"></div>
                </div>
                <div style="width:60px;background:#555;height:4px;">
                  <div style="width:${(d.valence || 0) * 100}%;background:#e91e63;height:100%"></div>
                </div>
                <div style="width:60px;background:#555;height:4px;">
                  <div style="width:${(d.danceability || 0) * 100}%;background:#03a9f4;height:100%"></div>
                </div>
              </div>`);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0))
        .on("click", (_, d) => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
          }
          if (d.preview_url) {
            const a = new Audio(d.preview_url);
            audioRef.current = a;
            a.play().catch(() => {});
          } else {
            window.open(
              `https://open.spotify.com/search/${encodeURIComponent(d.name)}`,
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
  }, [trackData, size]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}

