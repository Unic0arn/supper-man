var SearchView = function(container,model){
    var view = this;
    view.container = container;
    model.addObserver(this);
    model.getAllRecipes();
    view.container.style("overflow","scroll");

    var redrawList = function(){
        view.container.html('');
        var filters = view.container.append('div').attr('id', 'searchFilterContainer');
        filters.selectAll("div").data(model.filters).enter()
            .append("div").append("span").text(function(f){
                return model.getIngredient(f).name;
            });

        view.filterItem = filters.selectAll("div")
            .append("span").classed("glyphicon glyphicon-remove filterRemove", true);


        var list = view.container.append('div').attr('id', 'searchList');
        var listItem = list.selectAll('div')
            .data(model.filterSearch()).enter()
                .append('div')
                    .classed('recipeListItem',true);

        listItem.append('img').classed('recipeImg', true).attr("src",function(d){return d.img;});

        var listHeader = listItem.append('div').style('display', 'flex').style('flex-direction','column');
        listHeader.append('h4').classed('recipeName', true).text(function(d){return d.name;});
        listHeader.append('div').classed('recipeRating', true).text('sexy rating').style();


        var recipeNutContainer = listItem.append('div').classed("recipeNutContainer", true);
        recipeNutContainer.append('div').classed('recipeNutritionValue', true).style("display","flex").style("align-items","center").style("justify-content","center")
            .text(function(d){
                return calcPersonalValue(d, 'protein');
            });
        recipeNutContainer.append('div').classed('recipeNutritionValue', true)
            .text(function(d){
                return calcPersonalValue(d, 'carbohydrate');
            });
        recipeNutContainer.append('div').classed('recipeNutritionValue', true)
            .text(function(d){
                return calcPersonalValue(d, 'fat');
            });
        recipeNutContainer.append('div').classed('recipeNutritionValue', true)
            .text(function(d){
                return calcPersonalValue(d, 'energy');
            });

        model.notifyObservers("recipeListReady");
    }; 

    var calcPersonalValue = function(d, type){
        var returnText = 0;
        console.log(d.ingredients[0]);
        for(var i = 0; i < d.ingredients.length; i++){
            returnText += parseInt(d.ingredients[i][type]);
        }
        returnText *= 100;
        if(type === 'protein'){
            return (returnText / model.dailyProteins).toFixed(1) + '%';
        }
        else if(type === 'carbohydrate'){
            return (returnText / model.carbArray[1]).toFixed(1) + '%';
        }
        else if(type === 'fat'){
            return (returnText / model.fatArray[1]).toFixed(1) + '%';   
        }
        else if(type === 'energy'){
            return (returnText / model.dailyCalories).toFixed(1) + '%';
        }
    }



    this.update = function(code){
        if(code === 'getAllRecipes'){
            redrawList();
        }else if(code === 'filterAdded'){
            redrawList();
        }else if(code === 'filterRemoved'){
            redrawList();
        }
    };
};