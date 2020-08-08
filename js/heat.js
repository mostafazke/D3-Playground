(() => {
  const margin = { top: 50, right: 25, bottom: 80, left: 70 };
  const width = 900;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const data_url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  const xScale = d3.scaleLinear().range([0, innerWidth]);
  const yScale = d3.scaleTime().range([0, height - margin.bottom]);
  const colors = d3.scaleOrdinal().range(d3.schemeCategory10);

  const g = d3
    .select("#heat")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Title
  // g.append("text")
  //   .attr("id", "title")
  //   .attr("x", innerWidth / 2)
  //   .attr("y", -25)
  //   .style("font-size", "1.5rem")
  //   .style("font-family", "sans-serif")
  //   .style("text-anchor", "middle")
  //   .attr("color", "#333")
  //   .text("Doping in Professional Bicycle Racing");

  // tooltip
  const tooltip = d3
    .select("#heat")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // Label
  // g.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("x", -160)
  //   .attr("y", -44)
  //   .style("font-size", 18)
  //   .text("Time in Minutes");

  // Legend
  const legendContainer = g.append("g").attr("class", "legend-container");

  d3.json(data_url).then((data) => {
    // console.log(data);
    xScale.domain(d3.extent(data.monthlyVariance, (d) => d.year)).nice();
    // console.log(d3.max(data.monthlyVariance, (d) => d.year));

    // xScale.domain([
    //   d3.min(data, (d) => d.Year) - 1,
    //   d3.max(data, (d) => d.Year) + 1,
    // ]);
    yScale.domain([new Date().setMonth(0), new Date().setMonth(11)]);
    // .domain(d3.extent(data.monthlyVariance, (d) => d.month));
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(""));
    const yAxis = d3.axisLeft(yScale).ticks(12).tickFormat(d3.timeFormat("%B"));

    g.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    g.append("g").attr("id", "y-axis").call(yAxis);
  });
})();
