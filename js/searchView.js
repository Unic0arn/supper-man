var SearchView = function(container,model){
    var view = this;
    view.container = container;
    model.addObserver(this);
    model.getAllRecipes();

    var colorFill = d3.scale.linear()
        .domain([0,50,100])
        .range(["#FF0000","#ffff00", "#00FF00"]);

    var redrawList = function(){
        view.container.html('');
        // collapse button
        view.container.collapseBtn = view.container.append('button')
            .text('Search')
            .classed('btn btn-success', true)
            .style('position','absolute').style('right','-15px').style('top', '40%').style('margin','5px 5px').style('-webkit-transform','rotate(-90deg)').style('-moz-transform','rotate(-90deg)');

        // filter Container
        var filters = view.container.append('div').attr('id', 'searchFilterContainer');
        filters.selectAll("div").data(model.filters).enter()
            .append("div").append("span").text(function(f){
                return model.getIngredient(f).name;
            });

        view.container.filterItem = filters.selectAll("div");
        view.container.filterItem.append("span").classed("glyphicon glyphicon-remove filterRemove", true);

        // tableheader Container
        var tableHeader = view.container.append('div').attr('id', 'searchTableHeader');

        view.container.tableBtn = tableHeader.selectAll('div').data(['P', 'C', 'F', 'E']).enter()
            .append('div').style('width','50px').style('border','solid 1px').style('height', '100%')
                .text(function(d){
                    return d;
                });

        // calculates the height of the list
        var searchListHeight = window.innerHeight - ( parseFloat(filters.style('height').substring(-1,2)) + parseFloat(tableHeader.style('height').substring(-1,2)) ) - 3;

        // searchlist Container
        var list = view.container.append('div').attr('id', 'searchList').style('height',searchListHeight + 'px');
        view.container.list = list;
        var listItem = list.selectAll('div')
            .data(model.filterSearch()).enter()
                .append('div')
                    .classed('recipeListItem',true);

        listItem.append('img').classed('recipeImg', true).attr("src",function(d){return d.img;});

        var listHeader = listItem.append('div').style('display', 'flex').style('flex-direction','column');
        listHeader.append('h4').classed('recipeName', true).text(function(d){return d.name;});
        listHeader.append('div').classed('recipeRating', true).text('sexy rating');


        var recipeNutContainer = listItem.append('div').classed("recipeNutContainer", true);

        // td for PROTEIN
        recipeNutContainer
            .append('div').classed('recipeNutritionValue', true)
                .attr('opacity', function(d){
                    var totalVal = calcPersonalValue(d, 'protein');
                    totalVal = parseFloat(totalVal.substring(0, totalVal.length-1));
                    opacity = 1* (totalVal/100);
                    return opacity;
                })
                .style('background-color', function(d){
                    return "rgba(0,0,0," + d3.select(this).attr('opacity') + ")";
                })
                .style('color',function(d){
                    if(d3.select(this).attr('opacity') < 0.5){
                        return 'black';
                    }else{
                        return 'white';
                    }
                })
                .text(function(d){
                    return calcPersonalValue(d, 'protein');
                });
        // td for CARBOHYDRATES
        recipeNutContainer
            .append('div').classed('recipeNutritionValue', true)
                .text(function(d){
                    // console.log(d);
                    // console.log(calcPersonalValue(d, 'carbohydrate'));
                    return calcPersonalValue(d, 'carbohydrate');
                })
                .style('background-color', function(d){
                    // console.log(parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, '')));
                    return colorFill(parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, '')));
                });

        // td for FATS
        recipeNutContainer.append('div').classed('recipeNutritionValue', true)
            .text(function(d){
                return calcPersonalValue(d, 'fat');
            });

        // td for ENERGY
        recipeNutContainer.append('div').classed('recipeNutritionValue', true)
            .text(function(d){
                return calcPersonalValue(d, 'energy');
            });

        model.notifyObservers("recipeListReady");
    }; 

    var calcPersonalValue = function(d, type){
        var returnText = 0;
        for(var i = 0; i < d.ingredients.length; i++){
            var ingAmount = (d.ingredients[i].amount) * d.ingredients[i][type];
            returnText += ingAmount;
        }

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
    };



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