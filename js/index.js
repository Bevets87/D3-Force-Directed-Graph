(function (d3) {

  'use strict'
  const h = 600
  const w = 800
  const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json'

  const app = d3.select('body').append('div')
  .attr('id', 'app');

  const svg = d3.select('#app')
  .append('svg')
  .attr('width', w)
  .attr('height', h)
  .append('g')

  app.append('title')
  .text('Force-Directed Layout of National Contiguity')


  d3.json(url, function(error, dataset) {
    if (error) throw error;

    var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id((d) => d.index))
    .force('charge', d3.forceManyBody().strength(-80).distanceMax(-60))
    .force('center', d3.forceCenter(w /2, h / 2))


    const link = svg.append('g')
    .selectAll('line')
    .data(dataset.links)
    .enter().append('line')
    .attr('stroke','#CCC');

    const node = svg.append('g')
    .selectAll('image')
    .data(dataset.nodes)
    .enter().append('image')
    .attr('width', 18)
    .attr('height', 10)
    .attr('xlink:href', function (d) {return 'js/images/flags/' + d.code + '.png'})
    .style('cursor','pointer')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    );

    node.append('title')
    .text(function (d) { return d.country; });

    simulation
    .nodes(dataset.nodes)
    .on('tick', ticked);

    simulation.force('link')
    .links(dataset.links);


    function ticked () {
      link
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y;  })
        .attr('x2', function(d) { return d.target.x;  })
        .attr('y2', function(d) { return d.target.y;  });
      node
        .attr('x',function(d) {return d.x })
  			.attr('y',function(d) {return  d.y });
    }

    function dragstarted (d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged (d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended (d) {
      if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

  })


}(d3))
