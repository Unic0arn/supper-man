var SunburstCtrl = function (view, model) {
  var ctrl = this;
  var touch = ["touchstart","touchmove","touchend",function(){return d3.event.touches[0];}];
  var mouse = ["mousedown","mousemove","mouseup",function(){d3.event.preventDefault(); return d3.event;}];
  var interaction = touch;
  var filtering = true;
  model.addObserver(this);

  

 
  this.update = function(code){
    if(code == "sunburstReady"){
      view.container.selectAll(".segment").on("touchstart",function(d,i){interaction = touch; ctrl.touchStart(d,i,this)});
      view.container.selectAll(".segment").on("mousedown",function(d,i){interaction = mouse; ctrl.touchStart(d,i,this)});
    }
  }
  
  this.touchStart = function (d,i,path) {
    d3.event.preventDefault();
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
        start = parseInt(start.clientX);
        var overlay = d3.select("#overlay");
        overlay.append
        overlay.append("div").style("margin","auto").style("margin-top","150px").style("font-size","70px").text(d.name);
        
        var amount = overlay.append("div").style("margin","auto").style("margin-top","50px").style("font-size","70px");
        amount.text("Drag to set amount");
        
        view.setOverlay(0.5);

        d3.select("body").on(interaction[1],function(event){
          amount.style("font-size","170px").style("margin-top","15px");
          move = interaction[3]();
          move = -parseInt(move.clientX-start);
          if (move <= 0){
            move = 0;
          }else{
            move = parseInt(Math.pow(move,1.8)*0.005);
            move -= move%5;
          }
          amount.text(move + "g");
          if(Math.abs(move-previousAmount)>0){
            model.addIngredient(d.id, move-previousAmount);
          }
          previousAmount = move;
        });
        d3.select("body").on(interaction[2],function(){
          window.ontouchmove = null;
          overlay.selectAll("div").remove();
          d3.select("#overlay").transition().style("opacity",0).duration(500);
          
          if(move > 0){
            while(d.parent.name != "ingredients"){
              d = d.parent;
              view.arcTransition(d.parent);
            }
          }
          d3.select("body").on(interaction[1],null);
          d3.select("body").on(interaction[2],null);
          
        });
      }
    }else{
      view.arcTransition(d,i);
      window.ontouchmove = null;
    }
  };
};