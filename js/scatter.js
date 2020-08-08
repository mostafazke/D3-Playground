(() => {
  const USData = [
    { type: "Poultry", value: 48.9954 },
    { type: "Beef", value: 25.9887 },
    { type: "Pig", value: 22.9373 },
    { type: "Sheep", value: 20.4869 },
  ];
  const margin = { top: 10, right: 100, bottom: 30, left: 50 };
  const width = 900;
  const height = 500;
  const g = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .style("font-family", "sans-serif")
    .style("font-size", 10)
    .attr("width", width)
    .attr("height", height);

  const xScale = d3.scaleLinear().range([margin.left, width - margin.right]);
  const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
  const colors = d3.scaleOrdinal().range(d3.schemeCategory10);
  d3.csv("data/scatter_data.csv").then((data) => {
    data.map((d) => {
      d.profit_mm = +d.profit_mm;
      d.revenues_mm = +d.revenues_mm;
      d.profit_as_of_revenues = +d.profit_as_of_revenues;
    });
    xScale.domain(d3.extent(data, (d) => d.revenues_mm));
    yScale.domain(d3.extent(data, (d) => d.profit_mm));
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    g.selectAll("g")
      .data(data)
      .join("g")
      .attr("class", "scatter-point")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.revenues_mm)},${yScale(d.profit_mm)})`
      )
      .call((g) =>
        g
          .append("circle")
          .attr("r", 5)
          .style("stroke", (d) => colors(d.category))
          .style("stroke-width", 2)
          .style("fill", "transparent")
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", 8)
          .attr("dy", "0.35em")
          .text((d) => (d.revenues_mm < 10000 ? "" : d.company))
      );

    //labels
    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .select(".domain")
      .remove();

    g.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .select(".domain")
      .remove();

    g.append("g")
      .attr("transform", `translate(${margin.left + 6},${margin.top + 4})`)
      .append("text")
      .attr("transform", "rotate(90)")
      .text("Profits ($MM)");

    g.append("text")
      .attr("x", width - margin.right - 6)
      .attr("y", height - margin.bottom - 5)
      .attr("text-anchor", "end")
      .text("Revenue ($MM)");
  });
})();
