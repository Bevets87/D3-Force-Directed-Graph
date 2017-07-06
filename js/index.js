(function (d3) {

  'use strict'
  const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json'

  const getDataSet = function (url, drawSVG, dimensions) {
    d3.json(url, function (error, dataset) {
      if (error) throw error;
      drawSVG(dataset, dimensions)
    })
  }
  const drawSVG = function (dataset, dimensions) {
    const h = dimensions.height
    const w = dimensions.width

    d3.select('#app').selectAll("*").remove();
    const svg = d3.select('#app')
    .append('svg')
    .attr('width', w)
    .attr('height', h)
    .append('g')

    const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id((d) => d.index))
    .force('charge', d3.forceManyBody().strength(-80).distanceMax(-60))
    .force('center', d3.forceCenter(w /2, h / 2))


    const link = svg.append('g')
    .selectAll('line')
    .data(dataset.links)
    .enter().append('line')
    .attr('stroke','black');

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

  }

window.addEventListener('orientationchange', function () {
  if (screen.orientation.angle === 90) {
    getDataSet(url, drawSVG, {width: 600, height: 400})
  } else {
    getDataSet(url, drawSVG, {width: 350, height: 350})
  }
})
window.addEventListener('load', function () {
  if (this.innerWidth < 1000 && this.innerWidth >= 600) {
    getDataSet(url, drawSVG, {width: 600, height: 400})
  } else if (this.innerWidth < 600) {
    getDataSet(url, drawSVG, {width: 300, height: 300})
  } else {
    getDataSet(url, drawSVG, {width: 800, height: 500})
  }
})
window.addEventListener('resize', function () {
  if (this.innerWidth < 1000 && this.innerWidth >= 600) {
    getDataSet(url, drawSVG, {width: 600, height: 400})
  } else if (this.innerWidth < 600) {
    getDataSet(url, drawSVG, {width: 300, height: 300})
  } else {
    getDataSet(url, drawSVG, {width: 800, height: 500})
  }
})


}(d3))
