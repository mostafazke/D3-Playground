(() => {
  const width = 900;
  const height = 500;
  const margin = { top: 10, right: 10, bottom: 25, left: 45 };
  const parseTime = d3.timeParse('%Y-%m-%d');

  const g = d3
    .select('#stacked_area')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Scales
  const xScale = d3.scaleTime().range([0, width - margin.right - margin.left]);
  const yScale = d3
    .scaleLinear()
    .range([height - margin.top - margin.bottom, 0]);

  // axis
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const area = d3
    .area()
    .x((d) => xScale(d.data[0]))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]));

  const stack = d3
    .stack()
    .value(([, values], key) => values.get(key))
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  const color = d3.scaleOrdinal().range(d3.schemeCategory10);

  d3.csv('data/unemployment.csv')
    .then((data) => {
      data = data.map((d) => ({
        date: parseTime(d.date),
        key: d.industry,
        value: +d.unemployed,
      }));

      const keys = Array.from(d3.group(data, (d) => d.key).keys());
      const values = Array.from(
        d3.rollup(
          data,
          ([d]) => d.value,
          (d) => +d.date,
          (d) => d.key
        )
      );

      const series = stack.keys(keys)(values);
      color.domain(keys);

      xScale.domain(d3.extent(data, (d) => d.date));
      yScale.domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))]).nice();

      g.append('g')
        .attr('class', 'x-axis')
        .attr(
          'transform',
          'translate(0, ' + (height - margin.top - margin.bottom) + ')'
        )
        .call(xAxis);

      g.append('g').attr('class', 'y-axis').call(yAxis);

      g.append('g')
        .selectAll('path')
        .data(series)
        .join('path')
        .attr('fill', ({ key }) => color(key))
        .attr('d', area)
        .append('title')
        .text(({ key }) => key);
    })
    .catch(console.error);
})();
