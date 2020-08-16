(() => {
  const width = 900;
  const height = 500;

  const svg = d3
    .select('#force_graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const simulation = d3
    .forceSimulation()
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  const color = d3.scaleOrdinal().range(d3.schemeCategory10);

  d3.json('data/miserables.json')
    .then(({ links, nodes }) => {
      color.domain(d3.map(nodes, (d) => d.group).keys());
      simulation.nodes(nodes).force('link', d3.forceLink(links).id((d) => d.id));

      const link = svg
        .append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', (d) => Math.sqrt(d.value));

      const node = svg
        .append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 5)
        .attr('fill', (d) => color(d.group))
        .call(drag(simulation));

      node.append('title').text((d) => d.id);

      simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
      });
    })
    .catch(console.error);
})();

const drag = (simulation) => {
  const dragstarted = (d) => {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (d) => {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  };

  const dragended = (d) => {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  };

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
};
