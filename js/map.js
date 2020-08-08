(() => {
    const width = 900;
    const height = 500;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    const svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const projection = d3.geoNaturalEarth1().scale(153).translate([width / 2, height / 2]).precision(.1)

const path = d3.geoPath().projection(projection);

const graticule = d3.geoGraticule()

d3.json('../data/countries-110m.json').then(data => {
    
    svg.append('g').attr('class', 'countries').selectAll('path')
    .data(topojson.feature(data, data.objects.countries).features)
    .join('path').attr('fill', (d) =>  'gray').attr('d', path).on('mouseenter', function () {
        d3.select(this).attr('fill', '#f00')
    }).on('mouseleave', function () {
        d3.select(this).attr('fill', 'gray')
    }).append('title').text(d => d.properties.name)
    svg.append('g').attr('class', 'boundary').append('path').attr('fill', 'none').attr('stroke', '#fff').datum(topojson.mesh(data, data.objects.countries, (a, b) => a !== b)).attr('d', path)
    // svg.append('g').attr('class', 'graticule').append('path').datum(graticule).attr('d', path)

}).catch(console.error)
})();