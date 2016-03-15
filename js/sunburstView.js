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

  //new
  var r1Inner=40;
  var r1Outer=90;
  var r2Inner=160;
  var r2Outer=190;
  var r3Inner=326;
  var r3Outer=365;
  var r1Padding=18;
  var r2Padding=-5;
  var r3Padding=0;


  var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(Math.PI, Math.min(2*Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(Math.PI, Math.min(2*Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { 
      if(d.y==0.25){
        return Math.max(0, r1Inner);
      }else if(d.y==0.5){
        return Math.max(0, r2Inner); 
      }else if(d.y==0.75){
        return Math.max(0, r3Inner);
      }else{
        return Math.max(0, y(d.y));
      }})

    .outerRadius(function(d) { 
      if(d.y==0.25){
        return Math.max(0, r1Outer);
      }else if(d.y==0.5){
        return Math.max(0, r2Outer); 
      }else if(d.y==0.75){
        return Math.max(0, r3Outer);
      }else{return Math.max(0, y(d.y+ d.dy));}});
/*
var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(Math.PI, Math.min(2*Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(Math.PI, Math.min(2*Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
*/

  //takes a list of ingredients and returns a JSON of categories>subgroups>ingredients
  var foodGroupJSON = function(food){
    var categories = [];
    var foodGroups = [];
    var finalList = [];

    for(var i in food){
      var obj = {};
      if(categories.indexOf(food[i]["food_group_name"]) == -1){
        categories.push(food[i]["food_group_name"]);
        foodGroups.push({"name":food[i]["food_group_name"].split(" ")[0],"children":[]});
      }
      obj["id"] = food[i].id;
      obj["name"] = food[i].name.split(",")[0];
      foodGroups[categories.indexOf(food[i]["food_group_name"])].children.push(obj);
    }


    for (var i in foodGroups){
      foodGroups[i].children.sort(function(a,b){return d3.ascending(a.name,b.name)}); //sort by name
      finalList.push({"name":foodGroups[i].name,"children":[]});
      if(foodGroups[i].children.length > 12){
        var fill = foodGroups[i].children.length%12;
        var rest = 0;
        if (fill > parseInt(foodGroups[i].children.length/12)){
          rest = fill;
          fill = 0;
        }
        for(var j = 0; j < parseInt(foodGroups[i].children.length/12); j++){
          var strRange = foodGroups[i].children[j*(12+(fill>0))].name.substring(0,3) + " - " + foodGroups[i].children[(j+1)*(12+(fill>0))-1].name.substring(0,3);
          finalList[i].children.push({"name":strRange,"children":[]});
          for(var ingredient = 0; ingredient < (12+(fill>0)); ingredient++){
            finalList[i].children[j].children.push(foodGroups[i].children[(j*(12+(fill>0)))+ingredient]);
          }
          fill--;
        }
        if(rest > 0){
          var j = parseInt(foodGroups[i].children.length/12);
          var strRange = foodGroups[i].children[j*12].name.substring(0,3) + " - " + foodGroups[i].children[j*12+rest-1].name.substring(0,3);
          finalList[i].children.push({"name":strRange,"children":[]});
          for(var ingredient = 0; ingredient < rest; ingredient++){
            finalList[i].children[j].children.push(foodGroups[i].children[(j*(12+(fill>0)))+ingredient]);
          }
        }
      }else{
        for(var ingredient in foodGroups[i].children){
          finalList[i].children.push(foodGroups[i].children[ingredient]);
        }
      }
    }
    finalList = {"name":"ingredients","children":finalList};
  return finalList;
  };

  var color = function(node,i){    
    //return "rgb(255,0,0)";
    var cuttingBoard = {
     "Dairy":[45, 100, 90, 0.7],
     "Fruits":[162, 70, 66, 1],
     "Legumes":[349, 100, 63, 1],
     "Nut":[22, 100, 59, 1],
     "Spices":[48, 100, 50, 1],
     "Vegetables":[60, 80, 50, 1],
     "":[240, 80, 50, 1]};

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
      o = 50 + 10*o - 5*i;
    return "hsla("+c[0]+","+c[1]+"%,"+o+"%,"+c[3]+")";
    }
  }

    var initialize = function(hierarchy){

    var sunburstSvg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width + "," + (height / 2) + ")");

    var svg = d3.select(".sunburstContainer").select("svg")[0][0];
    view.svgCenter= [parseInt(svg.offsetLeft + width), parseInt(svg.offsetTop + (height/2))];

    var partition = d3.layout.partition()
        .value(function(d,i) { 
          if (d.parent.children.length > 0){
            var part = 1;
            var parent = d.parent;
            while (parent.name != "ingredients"){
              part = part/parent.children.length;
              parent = parent.parent;
            }
            return part;
          }else{
            return 1;
          } 
        })
        .sort(function(a,b){return d3.descending(a.name,b.name);});

    //d3.json("data/flare.json", function(error, root) {
    var root = hierarchy;
      var g = sunburstSvg.selectAll("g")
        .data(partition.nodes(root))
        .enter().append("g")
        .attr("class", function(d){
          var strClass = "";
          if(d.children === undefined){
            strClass += "leaf";
          }
          return strClass;
        });

      var path = g.append("path")
        .attr("d", arc)
        .style("fill", function(d,i) { return color(d,i); })
        .classed("segment",true);
        //.on("touchstart", touchStart);

      var text1 = g.append("text")
        .attr("x", function(d) { 
            //console.log(d.y);
            if(d.y==0.25){
              return r1Inner;
            }else if(d.y==0.5){
              return r2Inner; 
            }else if(d.y==0.75){
              return r3Inner;
            }else{
              return y(d.y);
            }})
        .attr("dx", "6")// margin
        .attr("dy", ".35em") // vertical-align
        .style("pointer-events","none")
        .text(function(d,i) { return d.name; })
        .attr("transform", function(d) { 
            //console.log(d.y);
            if(d.y==0.25){
              return "rotate(" + computeTextRotation(d) + ") rotate(180,"+ ((r1Inner+r1Padding)+6) +","+ Math.sin(computeTextRotation(d)) +")"; 
            }else if(d.y==0.5){
              return "rotate(" + computeTextRotation(d) + ") rotate(180,"+ ((r2Inner+r2Padding)+6) +","+ Math.sin(computeTextRotation(d)) +")"; 
            }else if(d.y==0.75){
              return "rotate(" + computeTextRotation(d) + ") rotate(180,"+ ((r3Inner+r3Padding)+6) +","+ Math.sin(computeTextRotation(d)) +")"; 
            }else{
              return "rotate(" + computeTextRotation(d) + ") rotate(180,"+ ((y(d.y) + this.clientWidth/2)+6) +","+ Math.sin(computeTextRotation(d)) +")"; 
            }});

      model.notifyObservers("sunburstReady");
    //});

  d3.select(self.frameElement).style("height", height + "px");
  d3.selectAll(".leaf").transition().attr("transform","rotate(180)").duration(500).ease("cubic");
  };

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
    if (d.name == "ingredients"){
      d3.selectAll(".leaf").transition().attr("transform","rotate(180)").duration(500).ease("cubic");
    }else{
      d3.selectAll(".leaf").transition().attr("transform","rotate(0)").duration(500).ease("cubic");
    }

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
            .attr("transform", function(d) { 
                if(d.y==0.25){
                  return "rotate(" + computeTextRotation(d) + ") rotate(180,"+ ((r1Inner+r1Padding)+6) +","+ Math.sin(computeTextRotation(d)) +")"; 
                }else if(d.y==0.5){
                  return "rotate(" + computeTextRotation(d) + ") rotate(180,"+ ((r2Inner+r2Padding)+6) +","+ Math.sin(computeTextRotation(d)) +")"; 
                }else if(d.y==0.75){
                  return "rotate(" + computeTextRotation(d) + ") rotate(180,"+ ((r3Inner+r3Padding)) +","+ Math.sin(computeTextRotation(d)) +")"; 
                }else{
                  return "rotate(" + computeTextRotation(d) + ") rotate(180,"+ ((y(d.y) + this.clientWidth/2)+6) +","+ Math.sin(computeTextRotation(d)) +")"; 
                }})
            .attr("x", function(d) { 
                if(d.y==0.25){
                  return r1Inner;
                }else if(d.y==0.5){
                  return r2Inner; 
                }else if(d.y==0.75){
                  return r3Inner;
                }else{
                  return y(d.y);
             }});
        }
    });
  };

  function computeTextRotation(d) {
    return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
  }

  this.update = function(code){
    if (code == "dataReady"){
      var json = foodGroupJSON(model.data);
      initialize(json);

    }
  }
  this.setOverlay = function(opacity){
    d3.select("#overlay").transition().style("opacity",opacity).duration(500);
  }
}