import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function CdViz({ artists = [], size = 300 }) {
  const ref = useRef();

  useEffect(() => {
    const data = (artists.slice(0,8).map(a => ({ name: a.name, value: a.popularity || 50 })) );
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", size).attr("height", size);

    const g = svg.append("g").attr("transform", `translate(${size/2},${size/2})`);
    const radiusOuter = size * 0.45;
    const radiusInner = size * 0.12;

    const pie = d3.pie().value(d => d.value)(data);
    const arc = d3.arc().innerRadius(radiusInner).outerRadius(d => radiusInner + (d.data.value/100) * (radiusOuter - radiusInner));

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    g.selectAll("path")
      .data(pie)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
      });

    g.append("circle").attr("r", radiusInner * 0.55).attr("fill", "#fff");
    g.append("text").text("Vinyl").attr("text-anchor", "middle").attr("dy", "0.35em").style("font-size", 12);

  }, [artists, size]);

  return <svg ref={ref} />;
}
