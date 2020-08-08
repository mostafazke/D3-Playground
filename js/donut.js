(() => {
  const USData = [
    { type: "Poultry", value: 48.9954 },
    { type: "Beef", value: 25.9887 },
    { type: "Pig", value: 22.9373 },
    { type: "Sheep", value: 20.4869 },
  ];
  const width = 900;
  const height = 500;

  const colors = d3.scaleOrdinal(
    USData.map((d) => d.type),
    ["#976393", "#685489", "#43457f", "#ff9b83"]
  );

  const arc = d3
    .arc()
    .innerRadius((0.5 * height) / 2)
    .outerRadius((0.85 * height) / 2);

  const pie = d3.pie().value((d) => d.value);

  const labelArcs = d3
    .arc()
    .innerRadius((0.95 * height) / 2)
    .outerRadius((0.95 * height) / 2);

  const pieArcs = pie(USData);

  const svg = d3
    .select("#donut")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const donutContainer = svg
    .append("g")
    .attr("class", "donut-container")
    .attr("transform", `translate(${width / 2},${height / 2 - 30})`);

  const arcs = donutContainer
    .selectAll("path")
    .data(pieArcs)
    .join("path")
    .style("opacity", 1)
    .on("mouseover", function () {
      const active = this;
      arcs.style("opacity", function () {
        return this === active ? 1 : 0.5;
      });
    })
    .on("mouseout", function () {
      arcs.style("opacity", 1);
    })
    .style("stroke", "white")
    .style("stroke-width", 2)
    .style("fill", (d) => colors(d.data.type))
    .attr("d", arc);

  arcs.transition(d3.transition().duration(750));

  const labelsContainer = svg
    .append("g")
    .attr("class", "labels-container")
    .attr("transform", `translate(${width / 2},${height / 2 - 30})`);

  labelsContainer
    .selectAll("text")
    .data(pieArcs)
    .join("text")
    .attr("transform", (d) => `translate(${labelArcs.centroid(d)})`)
    .attr("text-anchor", "middle")
    .selectAll("tspan")
    .data((d) => [d.data.type, d.data.value.toFixed(1) + " kg"])
    .join("tspan")
    .attr("x", 0)
    .style("font-family", "sans-serif")
    .style("font-size", 12)
    .style("font-weight", (d, i) => (i ? undefined : "bold"))
    .style("fill", "#222")
    .attr("dy", (d, i) => (i ? "1.2em" : 0))
    .text((d) => d);
})();
