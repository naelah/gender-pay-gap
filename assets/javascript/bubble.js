// bubbleChart creation function; instantiate new bubble chart given a DOM element to display it in and a dataset to visualise
function bubbleChart() {
    const width = 940;
    const height = 500;
  
    // location to centre the bubbles
    const centre = { x: width/2, y: height/2 };
  
    // strength to apply to the position forces
    const forceStrength = 0.03;
  
    // these will be set in createNodes and chart functions
    let svg = null;
    let bubbles = null;
    let labels = null;
    let nodes = [];
  
    // charge is dependent on size of the bubble, so bigger towards the middle
    function charge(d) {
      return Math.pow(d.radius, 2.0) * 0.01
    }
  
    // create a force simulation and add forces to it
    const simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(charge))
      // .force('center', d3.forceCenter(centre.x, centre.y))
      .force('x', d3.forceX().strength(forceStrength).x(centre.x))
      .force('y', d3.forceY().strength(forceStrength).y(centre.y))
      .force('collision', d3.forceCollide().radius(d => d.radius + 1));
  
    // force simulation starts up automatically, which we don't want as there aren't any nodes yet
    simulation.stop();
  
    // set up colour scale
    const fillColour = d3.scaleOrdinal()
        .domain(["1", "2", "3", "5", "99"])
        .range(["#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#AAAAAA"]);
  
    // data manipulation function takes raw data from csv and converts it into an array of node objects
    // each node will store data and visualisation values to draw a bubble
    // rawData is expected to be an array of data objects, read in d3.csv
    // function returns the new node array, with a node for each element in the rawData input
    function createNodes(rawData) {
      // use max size in the data as the max in the scale's domain
      // note we have to ensure that size is a number
      const maxSize = d3.max(rawData, d => +d.count);
  
      // size bubbles based on area
      const radiusScale = d3.scaleSqrt()
        .domain([0, maxSize])
        .range([0, 80])
  
      // use map() to convert raw data into node data
      const myNodes = rawData.map(d => ({
        ...d,
        radius: radiusScale(+d.count),
        size: +d.count,
        x: Math.random() * 900,
        y: Math.random() * 800
      }))
  
      return myNodes;
    }
  
    // main entry point to bubble chart, returned by parent closure
    // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
    let chart = function chart(selector, rawData) {
      // convert raw data into nodes data
      nodes = createNodes(rawData);
  
      // create svg element inside provided selector
      svg = d3.select('#vis').append('svg')
        .attr('width', width)
        .attr('height', height)
  
     

    // Lavel tooltip

    const showTooltip = function(event, d) {
    tooltip
        .transition()
        .duration(200)
    tooltip
        .style("opacity", 1)
        .html("Median: " + d.median +"<br> Industry" + d.industry)
        .style("left", (event.x)/2 + "px")
        .style("top", (event.y)/2+30 + "px")
    }
    const moveTooltip = function(event, d) {
    tooltip
        .style("left", (event.x)/2 + "px")
        .style("top", (event.y)/2+30 + "px")
    }
    const hideTooltip = function(event, d) {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }
     // bind nodes data to circle elements
     const elements = svg.selectAll('.bubble')
     .data(nodes, d => d.id)
     .enter()
     .append('g')
     .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  
      bubbles = elements
        .append('circle')
        .classed('bubble', true)
        .attr('r', d => d.radius)
        .attr('fill', d => fillColour(d.median_group))
        
        
  
      // labels
      labels = elements
        .append('text')
        .attr('dy', '.3em')
        .style('text-anchor', 'middle')
        .style('font-size', 10)
        .text(function(d){
            return("")
           
        })
        
  
        const tooltip = d3.select("#vis")
        .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "black")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("color", "white")


      // set simulation's nodes to our newly created nodes array
      // simulation starts running automatically once nodes are set
      simulation.nodes(nodes)
        .on('tick', ticked)
        .restart();
    }
  
    // callback function called after every tick of the force simulation
    // here we do the actual repositioning of the circles based on current x and y value of their bound node data
    // x and y values are modified by the force simulation
    function ticked() {
      bubbles
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
  
      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y)
    }
  
    // return chart function from closure
    return chart;
  }
  
  // new bubble chart instance
  let myBubbleChart = bubbleChart();
  
  // function called once promise is resolved and data is loaded from csv
  // calls bubble chart function to display inside #vis div
  function display(data) {
      console.log(data)
    myBubbleChart('#vis', data);
  }
  
  // load data
  d3.csv('data/industry_full.csv').then(display);