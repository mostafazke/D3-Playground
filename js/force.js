(() => {
    const width = 900;
    const height = 500;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    const svg = d3
    .select("#force")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const data = d3.range(5).map(d => ({radius: Math.random() * 25}))
const drag = simulation => {
  
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }

const simulation = d3.forceSimulation(data)
            .force('charge', d3.forceManyBody().strength(150))// 
            .force('center', d3.forceCenter(width/ 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => d.radius))
            const circles = svg.selectAll('circle').data(data).join('circle').attr('r', 5)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .call(drag(simulation));
            
            simulation.on('tick', function () {
                circles
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
            });

// console.log(simulation);
})();