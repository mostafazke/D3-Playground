(() => {
  const width = 900;
  const height = 500;
  const margin = { top: 10, right: 20, bottom: 30, left: 50 };

  const parseTime = d3.timeParse('%Y'),
    bisectyear = d3.bisector(function (d) {
      return d.year;
    }).left;

  const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
  const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);

  const yAxis = d3
    .axisLeft(yScale)
    .ticks(6)
    .tickFormat(function (d) {
      return parseInt(d / 1000) + 'k';
    });
  const xAxis = d3.axisBottom(xScale);

  const line = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value))
    .curve(d3.curveNatural);

  const svg = d3
    .select('#new_line')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  d3.json('../data/new_line.json')
    .then((data) => {
      data.forEach(function (d) {
        d.year = parseTime(d.year);
        d.value = +d.value;
      });

      xScale.domain(d3.extent(data, (d) => d.year));
      yScale.domain(d3.extent(data, (d) => d.value)).nice();

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis)
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('x', -10)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .attr('fill', '#5D6971')
        .text('Population');

      svg.append('path').datum(data).attr('class', 'line').attr('d', line);

      // Tooltip

      const focus = svg
        .append('g')
        .attr('class', 'focus')
        .style('display', 'none');

      focus
        .append('line')
        .attr('class', 'x-hover-line hover-line')
        .attr('y1', 0)
        .attr('y2', height);

      focus
        .append('line')
        .attr('class', 'y-hover-line hover-line')
        .attr('x1', -width)
        .attr('x2', 0);

      focus.append('circle').attr('r', 7.5);

      focus.append('text').attr('x', 15).attr('dy', '.31em');

      svg
        .append('rect')
         .attr('class', 'overlay')
         .attr('width', width)
         .attr('height', height)
        .on('mouseover', function () {
          focus.style('display', null);
        })
        .on('mouseout', function () {
          focus.style('display', 'none');
        })
        .on('mousemove', function () {
          const x0 = xScale.invert(d3.mouse(this)[0]),
            i = bisectyear(data, x0, 1),
            d0 = data[i - 1] || {},
            d1 = data[i] || {},
            d = x0 - d0.year > d1.year - x0 ? d1 : d0;

            focus.attr(
            'transform',
            'translate(' + xScale(d.year) + ',' + yScale(d.value) + ')'
          );
          focus.select('text').text(function () {
            return d.value;
          });
        });
    })
    .catch((err) => {
      console.log(err);
    });
})();
