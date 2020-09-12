(() => {
  const width = 900;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 10;
  const format = d3.format(",d");
  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const svg = d3
    .select("#sunburst")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const x = d3.scaleLinear().range([0, 2 * Math.PI]);
  const y = d3.scaleSqrt().range([0, radius]);

  const partition = d3.partition();

  const arc = d3
    .arc()
    .startAngle((d) => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
    .endAngle((d) => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
    .innerRadius((d) => Math.max(0, y(d.y0)))
    .outerRadius((d) => Math.max(0, y(d.y1)));

  d3.json("data/flare-2.json")
    .then((data) => {
      const root = d3.hierarchy(data).sum((d) => d.value);

      g.selectAll("path")
        .data(partition(root).descendants())
        .join("path")
        .attr("d", arc)
        .attr("stroke", "white")
        .style("fill", (d) => color((d.children ? d : d.parent).data.name))
        .on("click", handlDrill)
        .append("title")
        .text((d) => d.data.name + "\n" + format(d.value));
    })
    .catch(console.error);

  function handlDrill(d) {
    g.transition()
      .duration(750)
      .tween("scales", function () {
        const xd = d3.interpolate(x.domain(), [d.x0, d.x1]);
        const yd = d3.interpolate(y.domain(), [d.y0, 1]);
        const yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);

        return function (t) {
          x.domain(xd(t));
          y.domain(yd(t)).range(yr(t));
        };
      })
      .selectAll("path")
      .attrTween("d", (d) => () => arc(d));
  }
})();
