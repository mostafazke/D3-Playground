(() => {
  const margin = { top: 10, right: 25, bottom: 25, left: 45 };
  const width = 900;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const formatDate = d3.timeFormat("%b %Y");
  const formatNumber = d3.format("$,.1f");

  const data_url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  const g = d3
    .select("#bar")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Title
  g.append("text")
    .attr("id", "title")
    .attr("x", innerWidth / 2)
    .attr("y", 25)
    .style("font-size", "1.5rem")
    .style("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .attr("color", "#333")
    .text("United States GDP");

  // xScale axis
  const xScale = d3.scaleTime().range([0, innerWidth]);
  const xAxis = d3.axisBottom(xScale);

  // yScale axis
  const yScale = d3
    .scaleLinear()
    .range([height - margin.top - margin.bottom, 0]);
  const yAxis = d3.axisLeft(yScale);

  // yLabel
  g.append("text")
    .attr("x", -180)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .style("font-size", "1rem")
    .style("font-family", "sans-serif")
    .attr("color", "#333")
    .text("Gross Domestic Product");

  // tooltip
  const tooltip = d3
    .select("#bar")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // Data collector
  d3.json(data_url).then((res) => {
    const data = res.data;
    data.forEach((d) => {
      // d[0] = new Date(d[0]);
      d[1] = +d[1];
    });

    xScale.domain([
      d3.min(data, (d) => new Date(d[0])),
      d3.max(data, (d) => new Date(d[0])),
    ]);
    yScale.domain([0, d3.max(data, (d) => d[1])]);

    g.append("g")
      .attr("id", "x-axis")
      .attr(
        "transform",
        "translate(0, " + (height - margin.top - margin.bottom) + ")"
      )
      .call(xAxis);
    g.append("g").attr("id", "y-axis").call(yAxis);

    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d, i) => xScale(new Date(d[0])))
      .attr("height", (d) => innerHeight - yScale(d[1]))
      .attr("width", width / data.length)
      .attr("y", (d) => yScale(d[1]))
      .attr("fill", "#1f77b4")
      .on("mouseover", function (d) {
        d3.select(this).attr("fill", "#fff");
        tooltip
          .html(
            `<span>${formatNumber(d[1])} Billion</span> <span>${formatDate(
              new Date(d[0])
            )}</span>`
          )
          .attr("data-date", d[0])
          .style("top", d3.event.pageY - 50 + "px")
          .style("left", d3.event.pageX + 5 + "px")
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#1f77b4");
        tooltip.style("opacity", 0);
      });
  });
})();
