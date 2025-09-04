import React, { useEffect, useRef } from "react";

export default function VinylChart({ artistData = [], trackData = [] }) {
  const containerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    let svg;
    let tooltip;

    import("d3").then((d3) => {
      const root = containerRef.current;
      if (!root) return;
      const width = root.clientWidth || 300;
      const height = root.clientHeight || 300;
      const size = Math.min(width, height, 300);
      const leftOffset = (width - size) / 2;
      const topOffset = (height - size) / 2;
      const radius = size / 2;

      svg = d3
        .select(root)
        .append("svg")
        .attr("width", size)
        .attr("height", size)
        .style("position", "absolute")
        .style("left", leftOffset + "px")
        .style("top", topOffset + "px");

      const g = svg.append("g").attr("transform", `translate(${radius},${radius})`);

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

      // Artist-Share Arcs (Outer Ring)
      const artists = artistData.slice(0, 6);
      const weights = artists.map((a) => a.followers || a.popularity || 1);
      const pie = d3.pie()(weights);
      const arc = d3.arc().innerRadius(radius - 20).outerRadius(radius);
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      g.selectAll("path.artist-arc")
        .data(pie)
        .enter()
        .append("path")
        .attr("class", "artist-arc")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .on("mousemove", (event, d) => {
          const artist = artists[d.index];
          tooltip
            .style("left", event.offsetX + 10 + "px")
            .style("top", event.offsetY + 10 + "px")
            .style("opacity", 1)
            .text(artist.name);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0))
        .on("click", (_, d) => {
          const artist = artists[d.index];
          if (artist?.id) {
            window.open(`https://open.spotify.com/artist/${artist.id}`, "_blank");
          }
        });

      // Danceability Wave (Mid Ring)
      const barBase = radius - 40;
      const lengthScale = d3.scaleLinear().domain([0, 1]).range([0, 40]);
      const angle = (i) => (i / trackData.length) * 2 * Math.PI;

      g.selectAll("line.dance-bar")
        .data(trackData)
        .enter()
        .append("line")
        .attr("class", "dance-bar")
        .attr("x1", (d, i) => barBase * Math.cos(angle(i)))
        .attr("y1", (d, i) => barBase * Math.sin(angle(i)))
        .attr(
          "x2",
          (d, i) =>
            (barBase + lengthScale(d.audio_features?.danceability || 0)) * Math.cos(angle(i))
        )
        .attr(
          "y2",
          (d, i) =>
            (barBase + lengthScale(d.audio_features?.danceability || 0)) * Math.sin(angle(i))
        )
        .attr("stroke", "#ff7f00")
        .attr("stroke-width", 2);

      // Valence × Energy Scatter (Inner Emotional Map)
      const scatterRadius = barBase - 10;
      const valToAngle = d3.scaleLinear().domain([0, 1]).range([0, 2 * Math.PI]);
      const energyToR = d3.scaleLinear().domain([0, 1]).range([0, scatterRadius]);
      const valColor = d3.scaleSequential(d3.interpolateTurbo).domain([0, 1]);

      g.selectAll("circle.track-dot")
        .data(trackData)
        .enter()
        .append("circle")
        .attr("class", "track-dot")
        .attr("cx", (d) => {
          const a = valToAngle(d.audio_features?.valence || 0);
          return energyToR(d.audio_features?.energy || 0) * Math.cos(a);
        })
        .attr("cy", (d) => {
          const a = valToAngle(d.audio_features?.valence || 0);
          return energyToR(d.audio_features?.energy || 0) * Math.sin(a);
        })
        .attr("r", (d) => 3 + (d.popularity || 0) / 40)
        .attr("fill", (d) => valColor(d.audio_features?.valence || 0))
        .on("mousemove", (event, d) => {
          tooltip
            .style("left", event.offsetX + 10 + "px")
            .style("top", event.offsetY + 10 + "px")
            .style("opacity", 1)
            .text(d.name);
        })
        .on("mouseleave", () => tooltip.style("opacity", 0))
        .on("click", (_, d) => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
          if (d.preview_url) {
            const a = new Audio(d.preview_url);
            audioRef.current = a;
            a.play().catch(() => {});
          }
        });
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (tooltip) tooltip.remove();
      if (svg) svg.remove();
    };
  }, [artistData, trackData]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />;
}
