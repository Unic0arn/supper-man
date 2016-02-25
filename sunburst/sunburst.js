var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.linear()
    .range([0, radius]);

//var color = d3.scale.category20c();
//hsl values
function color(node,i){
  // console.log(i);
  cuttingBoard = {"meat":[0, 100, 65, 0.8],
   "fish":[200, 100, 65, 1],
   "seafood":[80, 100, 65, 0.8],
   "vegetables":[120, 100, 65, 1],
   "herbs & spices":[160, 100, 65, 1],
   "fruit":[60, 100, 65, 1],
   "dairy":[240, 100, 65, 1]};
  if (node.name == "ingredients"){
    return "white";
  }
  if (node.name in cuttingBoard){
    var c = cuttingBoard[node.name];
    return "hsla("+c[0]+","+c[1]+"%,"+c[2]+"%,"+c[3]+")";
  }else{
    o=node.depth;
    while (node.parent.name != "ingredients"){
      node = node.parent;
    }
    var c = cuttingBoard[node.name];
    i = i%2;
    o = 50 + 10*o - 10*i;
  return "hsla("+c[0]+","+c[1]+"%,"+o+"%,"+c[3]+")";
  }
}

var sunburstSvg = d3.select(".sunburstContainer").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

d3.json("sunburst/flare_1.json", function(error, root) {
  
  var g = sunburstSvg.selectAll("g")
      .data(partition.nodes(root))
    .enter().append("g");

  console.log(g);

  var path = g.append("path")
    .attr("d", arc)
    .style("fill", function(d,i) { return color(d,i); })
    .on("click", click);

  var text1 = g.append("text")
    .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
    .attr("x", function(d) { return y(d.y); })
    .attr("dx", "6") // margin
    .attr("dy", ".35em") // vertical-align
    .text(function(d) { return d.name; });

  function click(d) {
    // fade out all text elements
    text1.transition().attr("opacity", 0);

    path.transition()
      .duration(750)
      .attrTween("d", arcTween(d))
      .each("end", function(e, i) {
          // check if the animated element's data e lies within the visible angle span given in d
          if (e.x >= d.x && e.x < (d.x + d.dx)) {
            // get a selection of the associated text element
            var arcText = d3.select(this.parentNode).select("text");
            // fade in the text element and recalculate positions
            arcText.transition().duration(500)
              .attr("opacity", 1)
              .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")"; })
              .attr("x", function(d) { return y(d.y); });
          }
      });
  }
});

d3.select(self.frameElement).style("height", height + "px");

// Interpolate the scales!
function arcTween(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 50 : 0, radius]);
  return function(d, i) {
    return i ? function(t) { return arc(d); } : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}

function computeTextRotation(d) {
  return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
}