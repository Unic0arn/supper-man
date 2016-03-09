var SunburstCtrl = function (view, model) {
  model.addObserver(this)


  this.update = function(code){
    if(code == "sunburstReady"){
      var segments = view.container.selectAll(".segment").on("touchstart",function(d,i){touchStart(d,i,this)});
    }
  }
  
  var touchStart = function touchStart(d,i,path) {
    window.ontouchmove = function(e){e.preventDefault();};
    if(d.children == undefined){
      
      var move;
      var center = view.svgCenter;
      var start = d3.event.touches[0];
      start = parseInt((Math.sqrt(Math.pow(start.clientX-center[0],2) + Math.pow(start.clientY - center[1],2))));
      var amount = d3.select("#overlay").append("div").style("margin","auto").style("margin-top","200px").style("font-size","170px");
      
      view.setOverlay(0.5);

      view.container.select("svg").on("touchmove",function(event){
        
        move = d3.event.touches[0];
        move = parseInt(((Math.sqrt(Math.pow(move.clientX-center[0],2) + Math.pow(move.clientY - center[1],2)))-start)*0.1);
        if (move < 0){
          move = 0;
        }
        amount.text(move);
      });
      view.container.select("svg").on("touchend",function(){
        window.ontouchmove = null;
        amount.remove();
        d3.select("#overlay").transition().style("opacity",0).duration(500);
        
        if(move > 0){
          model.addIngredient(d.id, move)
          view.container.select("svg").on("touchmove",null);
          view.container.select("svg").on("touchend",null);
          while(d.parent.name != "ingredients"){
            d = d.parent;
            view.arcTransition(d.parent);
          }
        }
        
      });
    }else{
      view.arcTransition(d,i);
      window.ontouchmove = null;
    }
  }
}