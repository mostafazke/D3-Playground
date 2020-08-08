(() => {
  const width = 900;
  const height = 500;
  const margin = { top: 10, right: 80, bottom: 30, left: 35 };

  const svg = d3
    .select("#line")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.csv("data/big-mac-raw-index.csv")
    .then((data) => {
      const allData = data.map(({ date, name, dollar_price, iso_a3 }) => ({
        name,
        iso: iso_a3,
        date: new Date(date),
        price: dollar_price,
      }));

      data = [
        allData.filter(({ iso }) => iso === "USA"),
        allData.filter(({ iso }) => iso === "SWE"),
        allData.filter(({ iso }) => iso === "CHN"),
        allData.filter(({ iso }) => iso === "EUZ"),
      ];

      const colors = d3.scaleOrdinal(
        data.map((d) => d[0].name),
        d3.schemeCategory10
      );

      const startDate = data[0][0].date,
        endDate = data[0][data[0].length - 1].date;

      const xScale = d3.scaleTime(
        [startDate, endDate],
        [margin.left, width - margin.right]
      );

      const prices = data.flat().map((d) => d.price),
        yMax = d3.max(prices);

      const yScale = d3.scaleLinear(
        [0, yMax],
        [height - margin.bottom, margin.top]
      );

      const formatter = d3.format("$.2f");
      const yAxis = d3.axisLeft(yScale).tickFormat((d) => formatter(d));
      const xAxis = d3.axisBottom(xScale);

      const line = d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.price))
        .curve(d3.curveNatural);

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .selectAll(".domain")
        .remove();

      svg
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("class", "big-mac-line")
        .attr("d", line)
        .style("stroke", (d) => colors(d[0].name))
        .style("stroke-width", 2)
        .style("fill", "transparent");

      svg
        .selectAll("text.label")
        .data(data)
        .join("text")
        .attr("class", "label")
        .attr("x", width - margin.right + 5)
        .attr("y", (d) => yScale(d[d.length - 1].price))
        .attr("dy", "0.35em")
        .style("fill", (d) => colors(d[0].name))
        .style("font-family", "sans-serif")
        .style("font-size", 12)
        .text((d) => d[0].name);
    })
    .catch((err) => {
      console.log(err);
    });
})();
