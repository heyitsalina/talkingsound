import React, { useRef, useEffect } from "react";

export default function VinylDanceWave({ trackData = [], size = 300 }) {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const stopAnims = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let svg;
    let tooltip;

    import("d3").then((d3) => {
      const root = containerRef.current;
      if (!root) return;
      const R = size / 2;
      const innerR = R * 0.72;
      const barBase = innerR - 8;
      const tracks = trackData.slice(0, 20);
      const angle = (i) => (i / tracks.length) * Math.PI * 2;
      const length = d3.scaleLinear().domain([0, 1]).range([2, innerR * 0.3]);

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

      const bars = g
        .selectAll("line.dance-bar")
        .data(tracks)
        .enter()
        .append("line")
        .attr("class", "dance-bar")
        .attr("x1", (_, i) => barBase * Math.cos(angle(i)))
        .attr("y1", (_, i) => barBase * Math.sin(angle(i)))
        .attr("x2", (d, i) => (barBase + length(d.danceability || 0)) * Math.cos(angle(i)))
        .attr("y2", (d, i) => (barBase + length(d.danceability || 0)) * Math.sin(angle(i)))
        .attr("stroke", "#1db954")
        .attr("stroke-width", 2)
        .attr("tabindex", 0)
        .attr(
          "aria-label",
          (d) => `${d.name} danceability ${(d.danceability * 100).toFixed(0)}%`
        )
        .on("mousemove", (event, d) => {
          tooltip
            .style("opacity", 1)
            .style("left", event.offsetX + 10 + "px")
            .style("top", event.offsetY + 10 + "px")
            .html(
              `<strong>${d.name}</strong><div style="font-size:11px">Danceability ${(d.danceability || 0) * 100}%</div>`
            );
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

      // Pulse animation for top 3
      const pulses = [];
      bars
        .filter((_, i) => i < 3)
        .each(function () {
          const bar = d3.select(this);
          const animate = () => {
            bar
              .transition()
              .duration(800)
              .attr("stroke-width", 4)
              .transition()
              .duration(800)
              .attr("stroke-width", 2)
              .on("end", animate);
          };
          animate();
          pulses.push(() => bar.interrupt());
        });
      stopAnims.current = pulses;
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      stopAnims.current.forEach((fn) => fn());
      stopAnims.current = [];
      if (tooltip) tooltip.remove();
      if (svg) svg.remove();
    };
  }, [trackData, size]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}

