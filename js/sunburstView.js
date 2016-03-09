//credit to Mike Bostock for initial sunburst code
//http://bl.ocks.org/mbostock/4348373

var SunburstView = function(container,model){
  var view = this;
  view.container = container;
  model.addObserver(this);

  var height = 760,
    width = height/2,
    radius = height/2;//Math.min(width, height) / 2;

  var x = d3.scale.linear()
      .range([Math.PI, 2*Math.PI]);

  var y = d3.scale.linear()
      .range([0, radius]);

  var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(Math.PI, Math.min(2*Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(Math.PI, Math.min(2*Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });


  //takes a list of ingredients and returns a JSON of categories>subgroups>ingredients
  var foodGroupJSON = function(food){
    var categories = [];
    var foodGroups = [];
    var finalList = [];

    for(var i in food){
      var obj = {};
      if(categories.indexOf(food[i]["food_group_name"]) == -1){
        categories.push(food[i]["food_group_name"]);
        foodGroups.push({"name":food[i]["food_group_name"],"children":[]});
      }
      obj["id"] = food[i].id;
      obj["name"] = food[i].name;
      foodGroups[categories.indexOf(food[i]["food_group_name"])].children.push(obj);
    }


    for (var i in foodGroups){
      foodGroups[i].children.sort(); //sort by name
      finalList.push({"name":foodGroups[i].name,"children":[]});
      if(foodGroups[i].children.length > 16){
        for(var j = 0; j < parseInt(foodGroups[i].children.length/16); j++){
          var strRange = foodGroups[i].children[j*16].name.substring(0,3) + " - " + foodGroups[i].children[(j+1)*15].name.substring(0,3);
          finalList[i].children.push({"name":strRange,"children":[]})
          for(var ingredient = 0; ingredient < 16; ingredient++){
            finalList[i].children[j].children.push(foodGroups[i].children[(j*16)+ingredient]);
          }
        //there will be som rest foodGroups[i].length%15 ingredients here, I will deal with it when I have some real test data //Kevin
        }
      }
    }
    finalList = {"name":"ingredients","children":finalList}
  return finalList;
  }

  var color = function(node,i){    
  //return "rgb(255,0,0)";
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

    var initialize = function(){

    var sunburstSvg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width + "," + (height / 2) + ")");

    var svg = d3.select(".sunburstContainer").select("svg")[0][0]
    view.svgCenter= [parseInt(svg.offsetLeft + width), parseInt(svg.offsetTop + (height/2))]

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
            return 1
          } 
        });

    d3.json("data/flare.json", function(error, root) {
    //var root = foodGroupJSON(model.data);
      var g = sunburstSvg.selectAll("g")
        .data(partition.nodes(root))
        .enter().append("g");

      var path = g.append("path")
        .attr("d", arc)
        .style("fill", function(d,i) { return color(d,i); })
        .classed("segment",true);
        //.on("touchstart", touchStart);

      var text1 = g.append("text")
        .attr("x", function(d) { return y(d.y); })
        .attr("dx", "6")// margin
        .attr("dy", ".35em") // vertical-align
        .style("pointer-events","none")
        .text(function(d) { return d.name; })
        .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ") rotate(180,"+ ((y(d.y) + this.clientWidth/2)+6) +","+ Math.sin(computeTextRotation(d)) +")"; });

      model.notifyObservers("sunburstReady");
    });

  d3.select(self.frameElement).style("height", height + "px");
  }

  // Interpolate the scales!
  function arcTween(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 50 : 0, radius]);
    return function(d, i) {
      return i ? function(t) { return arc(d); } : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
    };
  }

  this.arcTransition = function(d,i){
    view.container.selectAll("text").transition().attr("opacity", 0);

    view.container.selectAll(".segment").transition()
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
            .attr("transform", function(d) { return "rotate(" + computeTextRotation(e) + ") rotate(180,"+ ((y(d.y) + this.clientWidth/2)+6) +","+ Math.sin(computeTextRotation(d)) +")"; })
            .attr("x", function(d) { return y(d.y); });
        }
    });
  }

  function computeTextRotation(d) {
    return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
  }

  this.update = function(code){
    if (code == "dataReady"){
      initialize();

    }
  }
  this.setOverlay = function(opacity){
    d3.select("#overlay").transition().style("opacity",opacity).duration(500);
  }
}