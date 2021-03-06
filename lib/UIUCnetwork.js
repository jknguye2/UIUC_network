var color = d3.scale.category10();

var width = 1200,
    height = 1000

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .gravity(0.4)
    .charge(-100)
    .linkDistance(100)
    .size([width, height]);

d3.json("lib/uiucSample.json", function(error, json) {
  if (error) throw error;

  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(json.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  var circle = node.append("circle")
      .attr("r", function(d) { return d.value+5; })
      .style("fill", function (d) { return color(d.group); });

  var label = node.append("text")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .style("font-weight", "bold")
      .text(function(d) { return d.name; });

  var cell = node.append("path")
      .attr("class", "cell");


  node.on('mouseover', function(d) {
  link.style('stroke', function(l) {
    if (d === l.source || d === l.target)
      return '#ff3333';
    else
      return '#e6e600';
    });
  });

  node.on('mouseout', function() {
    link.style('stroke', '#e6e600');
  });

  force.on("tick", function() {
    cell
        .data(json.nodes)
        .attr("d", function(d) { return d.length ? "M" + d.join("L") : null; });

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    circle
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    label
        .attr("x", function(d) { return d.x + 8; })
        .attr("y", function(d) { return d.y; });
  });
});