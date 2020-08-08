(() => {
  const margin = { top: 50, right: 25, bottom: 80, left: 70 };
  const width = 900;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const data_url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  const xScale = d3.scaleLinear().range([0, innerWidth]);
  const yScale = d3.scaleTime().range([0, height - margin.bottom]);
  const colors = d3.scaleOrdinal().range(d3.schemeCategory10);

  const g = d3
    .select("#scatter-2")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Title
  g.append("text")
    .attr("id", "title")
    .attr("x", innerWidth / 2)
    .attr("y", -25)
    .style("font-size", "1.5rem")
    .style("font-family", "sans-serif")
    .style("text-anchor", "middle")
    .attr("color", "#333")
    .text("Doping in Professional Bicycle Racing");

  // tooltip
  const tooltip = d3
    .select("#scatter-2")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // Label
  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -160)
    .attr("y", -44)
    .style("font-size", 18)
    .text("Time in Minutes");

  // Legend
  const legendContainer = g.append("g").attr("class", "legend-container");

  d3.json(data_url).then((data) => {
    data.forEach((d) => {
      var parsedTime = d.Time.split(":");
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    xScale.domain([
      d3.min(data, (d) => d.Year) - 1,
      d3.max(data, (d) => d.Year) + 1,
    ]);
    yScale.domain(d3.extent(data, (d) => d.Time));
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(""));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    g.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
    g.append("g").attr("id", "y-axis").call(yAxis);

    const dots = g
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time)
      .attr("class", (d) => (d.Doping !== "" ? "dot with" : "dot without"))
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .attr("r", 6)
      .attr("fill", (d) => colors(d.Doping !== ""))
      .style("cursor", "pointer")
      .on("mouseover", function (d) {
        d3.select(this)
          .attr("fill", "#fff")
          .attr("stroke", (d) => colors(d.Doping !== ""))
          .attr("stroke-width", 5);
        tooltip
          .html(
            `<span>${d.Year} ${d3.timeFormat("%M:%S")(d.Time)}</span> <span>${
              d.Name
            } : ${d.Nationality}</span>
            <span>${d.Doping}</span>`
          )
          .attr("data-year", d.Year)
          .style("top", d3.event.pageY - 50 + "px")
          .style("left", d3.event.pageX + 8 + "px")
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("fill", (d) => colors(d.Doping !== ""))
          .attr("stroke", "#fff")
          .attr("stroke-width", 0);

        tooltip.style("opacity", 0);
      });

    const legend = legendContainer
      .selectAll("#legend")
      .data(colors.domain())
      .join("g")
      .attr("id", "legend")
      .style("cursor", "pointer")
      .attr("transform", function (d, i) {
        return "translate(0," + (innerHeight / 2 - i * 20) + ")";
      });

    legend
      .append("rect")
      .attr("x", innerWidth - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colors);

    const legendTitles = legend
      .append("text")
      .attr("x", innerWidth - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        if (d) return "Riders with doping allegations";
        else {
          return "No doping allegations";
        }
      });

    legend
      .on("mouseover", function (d) {
        const active = this;
        legend.style("opacity", function () {
          return this === active ? 1 : 0.5;
        });
        d3.selectAll(d ? ".without" : ".with").style("opacity", 0.5);
      })
      .on("mouseout", function (d) {
        legend.style("opacity", 1);
        dots.style("opacity", 1);
      });
  });
})();
