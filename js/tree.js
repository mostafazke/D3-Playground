(() => {
  const width = 900;
  const height = 500;

  const svg = d3
    .select('#tree')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg
    .append('g')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10);

  const tree = d3.tree().size([height, width])

  d3.json('data/flare-2.json')
    .then((data) => {
      const root = d3.hierarchy(data);
      root.dx = 10;
      root.dy = width / (root.height + 1);

      const link = g
        .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(tree(root).links())
        .join('path')
        .attr(
          'd',
          d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x)
        );

      const node = g
        .append('g')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', (d) => `translate(${d.y},${d.x})`);

      node
        .append('circle')
        .attr('fill', (d) => (d.children ? '#555' : '#999'))
        .attr('r', 2.5);

      node
        .append('text')
        .attr('dy', '0.31em')
        .attr('x', (d) => (d.children ? -6 : 6))
        .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
        .text((d) => d.data.name)
        .clone(true)
        .lower()
        .attr('stroke', 'white');
    })
    .catch(console.error);
})();
