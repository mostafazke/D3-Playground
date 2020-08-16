(() => {
  const width = 900;
  const height = 500;

  const svg = d3
    .select('#treemap')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10);

  const fader = (color) => d3.interpolateRgb(color, '#fff')(0.2);
  const color = d3.scaleOrdinal(d3.schemeCategory10.map(fader));
  const format = d3.format(',d');

  const treemap = d3
    .treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .round(true)
    .paddingInner(1);

  d3.json('data/flare-2.json')
    .then((data) => {
      const root = d3
        .hierarchy(data)
        .eachBefore(
          (d) =>
            (d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name)
        )
        .sum(sumByValue)
        .sort((a, b) => b.height - a.height || b.value - a.value);

      const cell = g
        .selectAll('g')
        .data(treemap(root).leaves())
        .join('g')
        .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`);

      cell
        .append('rect')
        .attr('id', (d) => d.data.id)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('fill', (d) => color(d.parent.data.id));

      cell
        .append('clipPath')
        .attr('id', (d) => 'clip-' + d.data.id)
        .append('use')
        .attr('xlink:href', (d) => '#' + d.data.id);

      cell
        .append('text')
        .attr('clip-path', (d) => `url(#clip-${d.data.id})`)
        .selectAll('tspan')
        .data((d) => d.data.name.split(/(?=[A-Z[^A-Z]])/g))
        .join('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 13 + i * 10)
        .text((d) => d);

      cell.append('title').text((d) => d.data.id + '\n' + format(d.value));

      const update = (sum) => {
        treemap(root.sum(sum));

        cell
          .transition().duration(750)
          .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`)
          .select('rect')
          .attr('width', (d) => d.x1 - d.x0)
          .attr('height', (d) => d.y1 - d.y0);
      };
      let byValue = true;
      setInterval(() => {
        update(byValue ? sumByCount : sumByValue);
        byValue = !byValue;
      }, 5000);
    })  
    .catch(console.error);

  const sumByCount = (d) => (d.children ? 0 : 1);
  const sumByValue = (d) => d.value;
})();
