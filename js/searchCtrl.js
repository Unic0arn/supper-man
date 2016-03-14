var SearchCtrl = function (view, model) {
  
  model.addObserver(this);

  view.container.on('touchstart',function(){    
    console.log("slide");
    view.container.transition().style("left",function(){
      if(parseInt(view.container.style("left").substring(-1,2)) < 0 ){
        model.search = true;
        return "0vw";
      }else{
        model.search = false;
        return "-55vw";
      }
    }).duration(500);
  });


  var initListItemCtrl = function(){
    view.container.selectAll(".recipeListItem").on("touchstart",function(d){
      model.editRecipe(d.id);
      //collapse
    });

    view.filterItem.on('touchstart', function(d){
      d3.event.stopPropagation(); // Stops the side bar to collapse.
      model.removeFilter(d);
    });

  };


  this.update = function(code){
    if(code == "recipeListReady"){
      initListItemCtrl();
    }
  };
  
};