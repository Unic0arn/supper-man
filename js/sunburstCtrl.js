var SunburstCtrl = function (view, model) {
  var ctrl = this;
  var touch = ["touchstart","touchmove","touchend",function(){return d3.event.touches[0];}];
  var mouse = ["mousedown","mousemove","mouseup",function(){d3.event.preventDefault(); return d3.event;}];
  var interaction = touch;
  var filtering = true;
  model.addObserver(this);

  



  // var setInterface = function(type){
  //   console.log("set interface: " + type)
  //   var segments = view.container.selectAll(".segment").on(interaction[0],null);    
  //   if(type == "touch"){
  //     view.container.on("touchstart",null);
  //     interaction = touch;
  //     var segments = view.container.selectAll(".segment").on(interaction[0],function(d,i){touchStart(d,i,this)});
  //     //view.container.on("mousedown", function(){setInterface("mouse")});
  //   }else{
  //     view.container.on("mousedown",null);
  //     interaction = mouse;
  //     var segments = view.container.selectAll(".segment").on(interaction[0],function(d,i){touchStart(d,i,this)});
  //     //view.container.on("touchstart", function(){setInterface("touch")});
  //   }
  // }
 
  this.update = function(code){
    if(code == "sunburstReady"){
      var segments = view.container.selectAll(".segment").on(interaction[0],function(d,i){ctrl.touchStart(d,i,this)});
      //view.container.on("touchstart", function(){setInterface("touch")});
    }
  }
  
  this.touchStart = function (d,i,path) {
    window.ontouchmove = function(e){e.preventDefault();};
    if(d.children == undefined){
      if(model.search){
        model.addFilter(d.id);
          while(d.parent.name != "ingredients"){
            d = d.parent;
            view.arcTransition(d.parent);
          }
      }else{
        var move;
        var previousAmount = 0;
        var center = view.svgCenter;
        var start = interaction[3]();
        start = parseInt((Math.sqrt(Math.pow(start.clientX-center[0],2) + Math.pow(start.clientY - center[1],2))));
        var amount = d3.select("#overlay").append("div").style("margin","auto").style("margin-top","200px").style("font-size","170px");
        
        view.setOverlay(0.5);

        d3.select("body").on(interaction[1],function(event){
          
          move = interaction[3]();
          move = parseInt(((Math.sqrt(Math.pow(move.clientX-center[0],2) + Math.pow(move.clientY - center[1],2)))-start)*0.1);
          if (move < 0){
            move = 0;
          }
          amount.text(move);
          if(Math.abs(move-previousAmount)>0){
            model.addIngredient(d.id, move-previousAmount);
          }
          previousAmount = move;
        });
        d3.select("body").on(interaction[2],function(){
          window.ontouchmove = null;
          amount.remove();
          d3.select("#overlay").transition().style("opacity",0).duration(500);
          
          if(move > 0){
            while(d.parent.name != "ingredients"){
              d = d.parent;
              view.arcTransition(d.parent);
            }
          d3.select("body").on(interaction[1],null);
          d3.select("body").on(interaction[2],null);
          }
          
        });
      }
    }else{
      view.arcTransition(d,i);
      window.ontouchmove = null;
    }
  };
};