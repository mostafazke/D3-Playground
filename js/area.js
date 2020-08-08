(() => {
    const width = 900;
    const height = 500;
    const margin = { top: 10, right: 10, bottom: 25, left: 45 };
    const parseTime = d3.timeParse('%d/%m/%Y');
    
    const g = d3
      .select('#area')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Scales
    const xScale = d3.scaleTime().range([0, width - margin.right - margin.left]);
    const yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);
    
    // axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    const area = d3
      .area()
      .x((d) => xScale(d.date))
      .y1((d) => yScale(d.value))
      .y0(yScale(0));
    
    d3.json('data/coins.json')
      .then((res) => {
        const data = res.bitcoin;
        data.forEach((d) => {
          d.date = parseTime(d.date);
          d.value = +d.price_usd;
        });
        xScale.domain(d3.extent(data, (d) => d.date));
        yScale.domain([0, d3.max(data, (d) => d.value)]).nice();
    
        g.append('g')
          .attr('class', 'x-axis')
          .attr(
            'transform',
            'translate(0, ' + (height - margin.top - margin.bottom) + ')'
          )
          .call(xAxis);
    
        g.append('g').attr('class', 'y-axis').call(yAxis);
    
        g.append('path').datum(data).attr('fill', 'steelblue').attr('d', area);
      })
      .catch((err) => err);
    
})()