(() => {
  const margin = { top: 10, right: 25, bottom: 80, left: 55 };
  const width = 900;
  const height = 500;
  const t = d3.transition().duration(100);

  const g = d3
    .select("#bubble")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Labels
  const xLabel = g
    .append("text")
    .attr("y", height - margin.top - margin.bottom + 50)
    .attr("x", (width - margin.left - margin.right) / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("GDP Per Capita ($)");
  const yLabel = g
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Life Expectancy (Years)");

  const yearText = g
    .append("text")
    .attr("x", width - margin.left - margin.right - 40)
    .attr("y", height - margin.top - margin.bottom - 10)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text("1800");

  const xScale = d3
    .scaleLog()
    .range([0, width - margin.left - margin.right])
    .domain([142, 150000]);

  const yScale = d3
    .scaleLinear()
    .range([height - margin.top - margin.bottom, 0])
    .domain([0, 90]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format("$"));

  const yAxis = d3.axisLeft(yScale);

  g.append("g")
    .attr("class", "x-axis")
    .attr(
      "transform",
      "translate(0, " + (height - margin.top - margin.bottom) + ")"
    )
    .call(xAxis);
  g.append("g").attr("class", "y-axis").call(yAxis);

  const area = d3
    .scaleLinear()
    .range([25 * Math.PI, 1500 * Math.PI])
    .domain([2000, 1400000000]);
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  g.append("g")
    .attr("class", "grid")
    .call(
      d3
        .axisLeft(yScale)
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat("")
    )
    .selectAll(".tick > line")
    .style("stroke", "#ccc");

  g.append("g")
    .attr("class", "grid")
    .attr(
      "transform",
      "translate(0," + (height - margin.top - margin.bottom) + ")"
    )
    .call(
      d3
        .axisBottom(xScale)
        .tickValues([400, 4000, 40000])
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat("")
    )
    .selectAll(".tick > line")
    .style("stroke", "#ccc");

  const legendContainer = g
    .append("g")
    .attr("class", "legend-container")
    .attr(
      "transform",
      "translate(" +
        (width - 30 - margin.left - margin.right) +
        ", " +
        (height - 150 - margin.top - margin.bottom) +
        ")"
    );

  const tip = d3
    .tip()
    .attr("class", "d3-tip")
    .html(function (d) {
      return `
      <span style="color: #080; font-weight: bold; min-width: 120px; display: inline-block">Country:</span> <span>${
        d.country
      }</span><br>
      <span style="color: #080; font-weight: bold; min-width: 120px; display: inline-block">Continent:</span> <span style="text-transform: capitalize">${
        d.continent
      }</span><br>
      <span style="color: #080; font-weight: bold; min-width: 120px; display: inline-block">Life Expectancy:</span> <span>${d3.format(
        ".2f"
      )(d.life_exp)}</span><br>
      <span style="color: #080; font-weight: bold; min-width: 120px; display: inline-block">GDP Per Capita:</span> <span>${d3.format(
        "$,.0f"
      )(d.income)}</span><br>
      <span style="color: #080; font-weight: bold; min-width: 120px; display: inline-block">Population:</span> <span>${d3.format(
        ",.0f"
      )(d.population)}</span><br>
              `;
    });
  g.call(tip);

  // Buttons
  const playBtn = d3.select(".play-btn");
  const resetBtn = d3.select(".reset-btn");
  const selectInput = d3.select(".select-input");
  const yearRange = d3.select(".year-range");

  d3.json("data/data.json").then(function (data) {
    color.domain(data[data.length - 1].countries.map((d) => d.continent));
    let i = 0;

    let mainFormattedData = data.map(function (year) {
      return year.countries
        .filter(function (country) {
          var dataExists = country.income && country.life_exp;
          return dataExists;
        })
        .map(function (country) {
          country.income = +country.income;
          country.life_exp = +country.life_exp;
          return country;
        });
    });
    formattedData = mainFormattedData.map((data) => data);
    selectInput
      .style("text-transform", "capitalize")

      .selectAll("option")
      .data([
        "all",
        ...new Set(data[data.length - 1].countries.map((d) => d.continent)),
      ])
      .join("option")
      .attr("value", (d) => d)
      .style("text-transform", "capitalize")

      .text((d) => d);

    const legends = legendContainer
      .selectAll("g")
      .data([
        ...new Set(
          formattedData[formattedData.length - 1].map((d) => d.continent)
        ),
      ])
      .join("g")
      .attr("data-name", (d) => d)
      .attr("transform", (d, i) => "translate(0, " + i * 30 + ")");

    legends
      .append("text")
      .style("text-anchor", "end")
      .style("text-transform", "capitalize")
      .attr("color", "#333")
      .text((d) => d);
    legends
      .append("rect")
      .attr("fill", (d) => color(d))
      .attr("width", 15)
      .attr("height", 15)
      .attr("y", -10)
      .attr("x", 5);

    let interval = setInterval(animate, 100);
    draw(formattedData[0]);
    let isRunning = true;
    selectInput.on("change", function () {
      var value = d3.select(this).property("value");
      if (value === "all") {
        formattedData = mainFormattedData.map((data) => data);
      } else {
        formattedData = mainFormattedData.map((data) =>
          data.filter((d) => d.continent === value)
        );
      }
    });

    yearRange.on("change", function () {
      var value = d3.select(this).property("value");
      console.log(value);
      clearInterval(interval);

      draw(formattedData[value - 1810]);
      yearText.text(value);
    });
    resetBtn.on("click", () => {
      i = 0;
      clearInterval(interval);
      interval = setInterval(animate, 100);
      playBtn.text("⏸︎");

      isRunning = true;
    });
    playBtn.on("click", () => {
      if (isRunning) {
        clearInterval(interval);
        playBtn.text("⏵");
      } else {
        interval = setInterval(animate, 100);
        playBtn.text("⏸︎");
      }
      isRunning = !isRunning;
    });
    function animate() {
      yearText.text(data[i].year);
      i = i < 214 ? i + 1 : 0;
      draw(formattedData[i]);
    }
  });

  function draw(data) {
    const circles = g.selectAll("circle").data(data, (d) => d.country);

    circles.exit().attr("class", "exit").remove();

    const items = circles
      .enter()
      .append("circle")
      .attr("class", "enter")
      .attr("fill", (d) =>
        d.country === "Egypt" ? "#333" : color(d.continent)
      )
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .merge(circles)
      // .transition(t)
      .attr("cx", (d) => xScale(d.income))
      .attr("cy", (d) => yScale(d.life_exp))
      .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));
  }
})();
