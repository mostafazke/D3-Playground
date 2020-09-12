(() => {
  const width = 900;
  const height = 500;

  const svg = d3
    .select("#circle_packing")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const g = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10);

  const color = d3.scaleSequential([8, 0], d3.interpolateMagma);
  const format = d3.format(",d");

  const pack = d3
    .pack()
    .size([width - 2, height - 2])
    .padding(3);

  d3.json("data/flare-2.json")
    .then((data) => {
      const root = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);
      pack(root);

      const node = g
        .selectAll("g")
        .data([...d3.group(root.descendants(), (d) => d.height)])
        .join("g")

        .selectAll("g")
        .data((d) => d[1])
        .join("g")
        .attr("transform", (d) => `translate(${d.x + 1},${d.y + 1})`)
        .each(function (d) {
          d.node = this;
        })
        .on("mouseover", hoverd(true))
        .on("mouseout", hoverd(false));

      node
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill", (d) => color(d.height));

      const leaf = node.filter((d) => !d.children);

      leaf
        .select("circle")
        .attr("id", (d) => d.data.name + "___" + d.data.value);

      leaf
        .append("clipPath")
        .attr("id", (d) => d.data.name + "_" + d.data.value)
        .append("use")
        .attr("xlink:href", (d) => "#" + d.data.name + "___" + d.data.value);

      leaf
        .append("text")
        .attr("clip-path", (d) => `url(#${d.data.name + "_" + d.data.value})`)
        .selectAll("tspan")
        .data((d) => d.data.name.split(/(?=[A-Z][a-z])|\s+/g))
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
        .text((d) => d);

      node.append("title").text(
        (d) =>
          `${d
            .ancestors()
            .map((d) => d.data.name)
            .reverse()
            .join("/")}\n${format(d.value)}`
      );
    })
    .catch(console.error);

  function hoverd(hover) {
    return function (d) {
      return d3
        .selectAll(d.ancestors().map((a) => a.node))
        .select("circle")
        .classed("node--hover", hover);
    };
  }
})();
