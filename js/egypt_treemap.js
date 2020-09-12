(() => {
  const width = 900;
  const height = 500;

  const svg = d3
    .select("#egypt_treemap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font", "10px sans-serif");

  const color = d3.scaleOrdinal().range([...d3.schemeSet2]);
  const format = d3.format(",d");

  const treemap = d3
    .treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .round(true)
    .paddingInner(1);

  d3.csv("data/egypt_export_2018_.csv")
    .then((data) => {
      const Sectors = Array.from(
        d3.group(data, (d) => d.Sector),
        ([key, value]) => ({ name: key, children: value })
      );

      color.domain(Sectors.map((d) => d.name));

      let groupedData = {
        name: "egypt",
        children: Sectors,
      };

      const inputsContainr = d3
        .select("#egypt_treemap")
        .append("div")
        .attr("class", "filter-options")
        .style("width", "100%")
        .selectAll("div")
        .data([...Sectors.map((d) => d.name), "All"])
        .join("label")
        .attr("for", (d) => d)
        .text((d) => d)
        .style("background", (d) => d !== "All" && color(d));

      inputsContainr
        .append("input")
        .attr("type", "radio")
        .attr("name", "sectors")
        .attr("value", (d) => d)
        .attr("id", (d) => d)
        .on("change", function (e) {
          // const groupedData = Sectors[5];
          groupedData = Sectors.find((s) => s.name === e) || {
            name: "egypt",
            children: Sectors,
          };
          draw(groupedData);
        });

      draw(groupedData);
    })
    .catch(console.error);

  function draw(data) {
    const hierarchy = d3
      .hierarchy(data)
      .sum((d) => d["Gross Export"]) //sum every child's values
      .sort((a, b) => a["Gross Export"] - b["Gross Export"]); // and sort them in descending order

    const root = treemap(hierarchy);

    const cell = svg
      .selectAll("g")
      .data(root.leaves(), (d) => d.name)
      .join("g");

    cell.attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    cell.select(".rect").remove();

    cell

      .append("rect")
      .attr("class", "rect")
      .attr("id", (d) => d.data.Code)
      .attr("height", (d) => d.y1)
      .attr("width", (d) => d.x1)
      .transition()
      .duration(750)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("fill", (d) => color(d.parent.data.name));

    cell
      .append("clipPath")
      .attr("id", (d) => "clip-" + d.data.Code)
      .append("use")
      .attr("xlink:href", (d) => "#" + d.data.Code);

    cell
      .append("text")
      .attr("clip-path", (d) => `url(#clip-${d.data.Code})`)
      .attr("fill", "white")
      .append("tspan")
      .attr("x", 4)
      .attr("y", 13)
      .text((d) => d.data.Name + "\n" + format(d.value));

    cell.select(".title").remove();
    cell
      .append("title")
      .attr("class", "title")
      .text((d) => d.data.Name + "\n" + format(d.value));
  }
})();

// const makeHierarchy = (config) => {
//   const defaultConfig = {
//     childrenAccessorFn: ([key, value]) => value.size && Array.from(value),
//     sumFn: ([key, value]) => value,
//     sortFn: (a, b) => b.value - a.value,
//   };
//   const { data, reduceFn, groupByFns, childrenAccessorFn, sumFn, sortFn } = { ...defaultConfig, ...config };
//   const rollupData = d3.rollup(data, reduceFn, ...groupByFns);
//   const hierarchyData = d3.hierarchy([null, rollupData], childrenAccessorFn)
//     .sum(sumFn)
//     .sort(sortFn);
//   return hierarchyData;
// }
