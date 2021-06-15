d3.json('/data/edu_industry.json').then(function(data){ 

   
    width = 975
    height = 720
    color = d3.scaleOrdinal().domain(data)
    .range(d3.schemeSet3);
    //color = d3.scaleOrdinal(["1"], ["#da4f81"]).unknown("#ccc")
    var keys = ['education','field_of_study','salary_range']
    console.log(keys)

    sankey = d3.sankey()
    .nodeSort(undefined)
    .linkSort(null)
    .nodeWidth(4)
    .nodePadding(20)
    .extent([[0, 5], [width, height - 5]])

    function create_graph(){
        let index = -1;
        const nodes = [];
        const nodeByKey = new Map;
        const indexByKey = new Map;
        const links = [];
      
        for (const k of keys) {
          for (const d of data) {
            const key = JSON.stringify([k, d[k]]);
            if (nodeByKey.has(key)) continue;
            const node = {name: d[k]};
            nodes.push(node);
            nodeByKey.set(key, node);
            indexByKey.set(key, ++index);
          }
        }
      
        for (let i = 1; i < keys.length; ++i) {
          const a = keys[i - 1];
          const b = keys[i];
          const prefix = keys.slice(0, i + 1);
          const linkByKey = new Map;
          for (const d of data) {
            const names = prefix.map(k => d[k]);
            const key = JSON.stringify(names);
            const value = d.value || 1;
            let link = linkByKey.get(key);
            if (link) { link.value += value; continue; }
            link = {
              source: indexByKey.get(JSON.stringify([a, d[a]])),
              target: indexByKey.get(JSON.stringify([b, d[b]])),
              names,
              value
            };
            links.push(link);
            linkByKey.set(key, link);
          }
        }
      
        return {nodes, links}
    }
    graph =  create_graph();
    console.log(graph)

      


    var svg = d3.select('svg')
      .attr("viewBox", [0, 0, width, height]);

  const {nodes, links} = sankey({
    nodes: graph.nodes.map(d => Object.assign({}, d)),
    links: graph.links.map(d => Object.assign({}, d))
  });

  svg.append("g")
    .selectAll("rect")
    .data(nodes)
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
    .append("title")
      .text(d => `${d.name}\n${d.value.toLocaleString()}`);

    links_s = svg.append("g")
      .attr("fill", "none")
    .selectAll("g")
    .data(links).join("path");
    links_s
    .transition().duration(1000)
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", d => color(d.names[0]))
      .attr("stroke-width", d => d.width)
      .style("mix-blend-mode", "multiply");
    links_s
    .append("title")
      .text(d => `${d.names.join(" → ")}\n${d.value.toLocaleString()}`);

  svg.append("g")
      .style("font", "10px sans-serif")
    .selectAll("text")
    .data(nodes)
    .join("text")
      .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
      .text(d => d.name)
    .append("tspan")
      .attr("fill-opacity", 0.7)
      .text(d => ` ${d.value.toLocaleString()}`);

  return svg.node();
    
})