var touchStart = function touchStart(d) {
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