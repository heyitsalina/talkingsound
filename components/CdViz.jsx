import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function CdViz({ features = {}, size = 300 }) {
  const ref = useRef();

  useEffect(() => {
    const entries = Object.entries(features || {});
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", size).attr("height", size);

    const g = svg.append("g").attr("transform", `translate(${size / 2},${size / 2})`);
    const radiusOuter = size * 0.45;
    const radiusInner = size * 0.12;

    const pie = d3.pie().value(() => 1)(entries);
    const arc = d3
      .arc()
      .innerRadius(radiusInner)
      .outerRadius((d) => radiusInner + (d.data[1] / 100) * (radiusOuter - radiusInner));

    const labelArc = d3
      .arc()
      .innerRadius(radiusOuter + 12)
      .outerRadius(radiusOuter + 12);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    g.selectAll("path")
      .data(pie)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    g.selectAll("text.label")
      .data(pie)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", 10)
      .text((d) => `${d.data[0]} ${d.data[1]}%`);

    g.append("circle").attr("r", radiusInner * 0.55).attr("fill", "#fff");
    g.append("text")
      .text("Vinyl")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", 12);
  }, [features, size]);

  return <svg ref={ref} />;
}
