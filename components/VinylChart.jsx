import React, { useEffect, useRef } from "react";

export default function VinylChart({ artistData = [], trackData = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let svg;
    let tooltip;
    let audio;
    let cancelled = false;

    import("d3").then((d3) => {
      if (cancelled) return;
      const width = 300;
      const height = 300;
      const root = containerRef.current;
      if (!root) return;

      svg = d3
        .select(root)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const radii = d3.range(5).map((i) => width / 2 - i * 25);
      g.selectAll("circle")
        .data(radii)
        .enter()
        .append("circle")
        .attr("r", (d) => d)
        .attr("fill", (_, i) => (i % 2 ? "#222" : "#111"));

      tooltip = d3
        .select(root)
        .append("div")
        .attr("class", "vinyl-tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background", "rgba(0,0,0,0.8)")
        .style("color", "#fff")
        .style("padding", "4px 8px")
        .style("border-radius", "4px")
        .style("opacity", 0);

      svg
        .on("mousemove", (event) => {
          tooltip
            .style("left", event.offsetX + 10 + "px")
            .style("top", event.offsetY + 10 + "px")
            .style("opacity", 1)
            .text(trackData[0]?.name || "Vinyl");
        })
        .on("mouseleave", () => tooltip.style("opacity", 0));

      if (trackData[0]?.preview_url) {
        audio = new Audio(trackData[0].preview_url);
        audio.loop = true;
        audio.play().catch(() => {});
      }
    });

    return () => {
      cancelled = true;
      if (audio) {
        audio.pause();
        audio.src = "";
        audio = null;
      }
      if (tooltip) tooltip.remove();
      if (svg) svg.remove();
    };
  }, [artistData, trackData]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}
