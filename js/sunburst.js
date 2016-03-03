//takes a list of ingredients and returns a JSON of categories>subgroups>ingredients
function foodGroupJSON(food){

  var foodGroups = [];
  var categories = []

  for(var i in food){
    var obj = {};
    if(categories.indexOf(food[i].category) == -1){
      categories.push(food[i].category);
      foodGroups.push({"name":"food[i].category","children":[]});
    }
    obj["id"] = food[i].id;
    obj["name"] = food[i].name;
    foodGroups[food[i].cateogry].push(obj);
  }

  for (var i in foodGroups){
    foodGroups[i].sort(); //sort by name
    if(foodGroups[i].length() > 16){
      var subgroups = [];
      for(var j = 0; j < parseInt(foodGroups[i].length()/15); j++){
        var strRange = foodGroups[i][j*16].substring(0,3) + " - " + foodGroups[i][(j+1)*16].substring(0,3);
        subgroups[j] = {};
        subgroups[j]["name"] = strRange;
        subgroups[j]["children"] = [];
        for(var ingredient = 1; ingredient <=16; ingredient++){
          subgroups[j].ingredients.push(foodGroups[i][j*i])
        }
      }
      //there will be som rest foodGroups[i].length%15 ingredients here, I will deal with it when I have some real test data //Kevin
    }
    foodGroups[i] = subgroups;
  }
return foodGroups;
}

function color(node,i){
  // console.log(i);
  cuttingBoard = {
   "meat":[0, 80, 50, 0.8],
   "fish":[200, 80, 50, 1],
   "seafood":[80, 80, 50, 0.8],
   "vegetables":[120, 80, 50, 1],
   "herbs & spices":[160, 80, 50, 1],
   "fruit":[60, 80, 50, 1],
   "dairy":[240, 80, 50, 1]};

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


var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.linear()
    .range([0, radius]);

//var color = d3.scale.category20c();
//hsl values


var sunburstSvg = d3.select(".sunburstContainer").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

var partition = d3.layout.partition()
    .value(function(d) { 
      if (d.parent.children.length > 0){
        var part = 1;
        var parent = d.parent;
        while (parent.name != "ingredients"){
          part = part/parent.children.length;
          parent = parent.parent;
        }
        return part;
      }else{
        console.log("bad")
        return 1
      } 
    });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

d3.json("data/flare.json", function(error, root) {
  
  var g = sunburstSvg.selectAll("g")
    .data(partition.nodes(root))
    .enter().append("g");

  console.log(g);

  var path = g.append("path")
    .attr("d", arc)
    .style("fill", function(d,i) { return color(d,i); })
    .on("touchstart", touchStart);

  var text1 = g.append("text")
    .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
    .attr("x", function(d) { return y(d.y); })
    .attr("dx", "6") // margin
    .attr("dy", ".35em") // vertical-align
    .style("pointer-events","none")
    .text(function(d) { return d.name; });

  function touchStart(d) {
    if(d.children == undefined){
      d3.event.stopPropagation();

      var svg = d3.select(".sunburstContainer").select("svg")[0][0]
      var center= [parseInt(svg.offsetLeft + (width/2)), parseInt(svg.offsetTop + (height/2))]

      var start = d3.event.touches[0];
      start = parseInt((Math.sqrt(Math.pow(start.clientX-center[0],2) + Math.pow(start.clientY - center[1],2))));
      d3.select("#overlay").transition().style("opacity",0.5).duration(500);
      var amount = d3.select("#overlay").append("div").style("margin","auto").style("margin-top","200px").style("font-size","170px");
      console.log(start);
      sunburstSvg.on("touchmove",function(event){
        d3.event.stopPropagation();
        var move = d3.event.touches[0];
        move = parseInt(((Math.sqrt(Math.pow(move.clientX-center[0],2) + Math.pow(move.clientY - center[1],2)))-start)*0.1);
        if (move < 0){
          move = 0;
        }
        amount.text(move);
        console.log(move);
      });
      sunburstSvg.on("touchend",function(d){
        amount.remove();
        d3.select("#overlay").transition().style("opacity",0).duration(500);
        var end = d3.event.touches[0];
      });
    }else{
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