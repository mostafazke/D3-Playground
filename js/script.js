(() => {
  const config = {
    margin: { top: 20, right: 10, bottom: 100, left: 100 },
    fullWidth: 900,
    fullHeight: 500,
  };
  config.width = config.fullWidth - config.margin.left - config.margin.right;
  config.height = config.fullHeight - config.margin.top - config.margin.bottom;

  const g = d3
    .select("#main")
    .append("svg")
    .attr("width", config.fullWidth)
    .attr("height", config.fullHeight)
    .attr("viewBox", "0 0 " + config.fullWidth + " " + config.fullHeight)
    .append("g")
    .attr(
      "transform",
      `translate(${config.margin.left}, ${config.margin.top})`
    );

  g.append("text")
    .text("The world's tallest buildings")
    .attr("x", config.width / 2)
    .attr("y", 0)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle");

  g.append("text")
    .text("Height (m)")
    .attr("x", -(config.height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");

  const xScale = d3
    .scaleBand()
    .range([0, config.width])
    .paddingInner(0.2)
    .paddingOuter(0.1);

  const yScale = d3.scaleLinear().range([0, config.height]);
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  d3.json("../data/buildings.json")
    .then((data) => {
      color.domain(data.map((d) => d.name));

      data = data
        .map((building) => {
          building.height = +building.height;
          return building;
        })
        .sort((a, b) => a.height - b.height);

      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, " + config.height + ")");

      g.append("g").attr("class", "y-axis");

      d3.interval(() => {
        update(data);
      }, 1000);

      update(data);
    })
    .catch((err) => {
      console.log(err);
    });

  function update(data) {
    xScale.domain(data.map((d) => d.name));
    yScale.domain([d3.max(data, (b) => b.height), 0]).nice();
    const xAxis = d3.axisBottom(xScale); // .scale(xScale);
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => d + "m")
      .ticks(10);

    g.select(".x-axis")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-40 0 15)");

    g.select(".y-axis").call(yAxis);

    g.selectAll("rect")
      .data(data, function (d) {
        return d.height;
      })
      .enter()
      .append("rect")
      .attr("width", xScale.bandwidth)
      .attr("x", (d, i) => {
        return xScale(d.name);
      })
      .attr("height", function (d) {
        return config.height - yScale(d.height);
      })
      .attr("y", function (d) {
        return yScale(d.height);
      })
      .attr("fill", function (d) {
        return color(d.name);
      })
      .exit()
      .remove();
  }

  // const getSpiralPositions = (
  //   pointRadius = 5,
  //   n = 100,
  //   angleDiff = 3,
  //   distance = 1.5
  // ) => {
  //   let angle = 0;
  //   return new Array(n).fill(0).map((_, i) => {
  //     const radius = Math.sqrt(i + 0.3) * pointRadius * distance;
  //     angle += Math.asin(1 / radius) * pointRadius * angleDiff;
  //     angle = angle % (Math.PI * 2);
  //     return {
  //       x: Math.cos(angle) * radius,
  //       y: Math.sin(angle) * radius,
  //       angle,
  //     };
  //   });
  // };
  // const data = getSpiralPositions(10, 50, 7, 5);

  // g.selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", (d) => d.x)
  //   .attr("cy", (d) => d.y)
  //   .attr("r", "3")
  //   .attr("fill", "#456789");
})();
