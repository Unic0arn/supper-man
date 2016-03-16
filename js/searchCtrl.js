var SearchCtrl = function (view, model) {
  
  model.addObserver(this);
  var sortToggle = true;
  var initSideView = function(){

    view.container.collapseBtn.on('click',function(){    
      console.log("slide");
      collapseSideView();
      
    });
  };

  var collapseSideView = function(){
    view.container.transition().style("left",function(){
        if(parseInt(view.container.style("left").substring(-1,2)) < 0 ){
          model.search = true;
          return "0vw";
        }else{
          model.search = false;
          return "-55vw";
        }
      }).duration(500);
  };

  var initListItemCtrl = function(){
    view.container.selectAll(".recipeListItem").on("click",function(d){
      model.editRecipe(d.id);
      collapseSideView();
    });

    view.container.filterItem.on('click', function(d){
      model.removeFilter(d);
    });

    view.container.tableBtn.on('click', function(d){
      var tempArray = [];
      for(var i in model.recipeDB){
        var tempValue = 0;
        for(var j in model.recipeDB[i].ingredients){
          if(d === 'P'){
            tempValue +=  model.recipeDB[i].ingredients[j].protein * model.recipeDB[i].ingredients[j].amount;
          }else if(d === 'C'){
            tempValue +=  model.recipeDB[i].ingredients[j].carbohydrate * model.recipeDB[i].ingredients[j].amount;
          }else if(d === 'F'){
            tempValue +=  model.recipeDB[i].ingredients[j].fat * model.recipeDB[i].ingredients[j].amount;
          }else if(d === 'E'){
            tempValue +=  model.recipeDB[i].ingredients[j].energy * model.recipeDB[i].ingredients[j].amount;
          }
        }

        tempArray.push(
          { 'id' : model.recipeDB[i].id, 
            'val' : tempValue
          });
      }
      if(sortToggle){
        console.log('true');
        tempArray.sort(function(a,b) {return b.val - a.val;});
      }else{
        console.log('false');
        tempArray.sort(function(a,b) {return a.val - b.val;});
      }

      sortToggle = !sortToggle;

      var sortedModelDB = [];
      for(var k in tempArray){
        for(var m in model.recipeDB){
          if(model.recipeDB[m].id === tempArray[k].id){
            sortedModelDB.push(model.recipeDB[m]);
            model.recipeDB.splice(m,1);
          }
        }
      }
      model.recipeDB = sortedModelDB;
      model.notifyObservers("getAllRecipes");
    });
  };


  this.update = function(code){
    if(code == "recipeListReady"){
      initListItemCtrl();
      initSideView();
    }
  };
  
};