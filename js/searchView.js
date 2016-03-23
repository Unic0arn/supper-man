var SearchView = function(container,model){
    var view = this;
    view.container = container;
    model.addObserver(this);
    model.getAllRecipes();

    var colorFill = d3.scale.linear()
        .domain([0,100])
        .range(["hsl(200, 80%, 20%)","hsl(180, 80%, 70%)"]);
    // var colorFill = d3.scale.linear()
    //     .domain([0, 100])
    //     .range("rgb(1, 149, 223)");

    var redrawList = function(){
        view.container.html('');
        // collapse button
        view.container.collapseBtn = view.container.append('img').attr('src','img/search.png').style('width','30px').style('position','absolute').style('right','7px').style('top', '2%').style('margin','5px 5px').style('-webkit-transform','rotate(-90deg)').style('-moz-transform','rotate(-90deg)');


        // filter Container
        var filters = view.container.append('div').attr('id', 'searchFilterContainer');
        if(model.filters.length > 0){
        filters.selectAll("div").data(model.filters).enter()
            .append("div")
                .style('background-color', function(d){
                    var categoryColor = model.categoricalColors[model.getIngredient(d).food_group_name];
                    return 'hsla(' + categoryColor[0] + ',' + categoryColor[1] + '%,' + categoryColor[2] + '%,' + categoryColor[2] + ')';
                })
                .style('color','white')
            .append("span").text(function(d){
                return model.getIngredient(d).name;
            });
        view.container.filterItem = filters.selectAll("div");
        view.container.filterItem.append("span").style('width','14px').style('color','white').classed("glyphicon glyphicon-remove filterRemove", true);
        }else{
            filters.append("div").append("span").text(function(f){
                return 'Use the sunburst to select ingredients for filtering!';
            });
        view.container.filterItem = filters.append('text');
        }


        //view.container.filterItem.append("span").classed("glyphicon glyphicon-remove filterRemove", true);

        // tableheader Container
        var tableHeader = view.container.append('div').attr('id', 'searchTableHeader');
        tableHeader.append('span').text('Click on a category to sort recipes!').style('position','absolute').style("left","2%").style('top',"10%").style('font-size','16px');
       var tableArrows = tableHeader.append('span').style('position','relative').style('width','20px').style('height','100%');
       tableArrows.append('img').attr('src','img/arrowUp.png')
           .style('position', 'absolute')
           .style('left','0')
           .style('top', '15px')
           .style('width','10px')
           .style('height','auto')
           .style('opacity', function(d){
                if(model.sortAscending === false){
                    return '1';
                }else{
                    return '0.2';
                }
           });
       tableArrows.append('img').attr('src','img/arrowDown.png')
           .style('position', 'absolute')
           .style('left','0')
           .style('bottom', '15px')
           .style('width','10px')
           .style('height','auto')
           .style('opacity', function(d){
                if(model.sortAscending === true){
                    return '1';
                }else{
                    return '0.2';
                }
           });
        view.container.tableBtn = tableHeader.selectAll('div').data(['Energy', 'Protein', 'Fat', 'Carbs']).enter()
            .append('div')
                .style('width','50px')
                .style('height', '100%')
                .style('font-size','14px')
                .style('font-weight', function(d){
                    if(d === model.sortCategory){
                        return 'bold';
                    }
                });
        view.container.tableBtn.append('div')
                .text(function(d){
                    return d;
                })
                .style("-webkit-transform","rotate(-70deg)");

        // calculates the height of the list
        var searchListHeight = window.innerHeight - ( parseFloat(filters.style('height').substring(-1,2)) + parseFloat(tableHeader.style('height').substring(-1,2)) ) - 3;

        // searchlist Container
        var list = view.container.append('div').attr('id', 'searchList').style('height',searchListHeight + 'px');
        view.container.list = list;
        if(model.filterSearch().length === 0){
            list.append('div').text('No results found!').style('margin', '0 auto').style('height','20px').style('font-size','20px');
        }
        else{
            var listItem = list.selectAll('div')
                .data(model.filterSearch()).enter()
                    .append('div')
                        .classed('recipeListItem',true);

            listItem.append('img').classed('recipeImg', true).attr("src",function(d){return d.img;});

            var listHeader = listItem.append('div').style('display', 'flex').style('flex-direction','column');
            listHeader.append('h4').classed('recipeName', true).text(function(d){return d.name;});
            //listHeader.append('div').classed('recipeRating', true).text('sexy rating');

            var recipeNutContainer = listItem.append('div').classed("recipeNutContainer", true);

            // td for ENERGY
            recipeNutContainer.append('div').classed('recipeNutritionValue', true)
                .text(function(d){
                    return calcPersonalValue(d, 'energy');
                })
                .style('background-color', function(d){
                    // return "rgba(1, 149, 223," + (parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, '')) / 100) + ")" ;
                    var percentage = parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, ''));
                    if(percentage > 100){
                        percentage = 100;
                    }
                    return colorFill(percentage);
                })
                .style('color',function(d){
                    return "rgba(255,255,255,0.8)";
                });

            // td for PROTEIN
            recipeNutContainer
                .append('div').classed('recipeNutritionValue', true)
                    .text(function(d){
                        return calcPersonalValue(d, 'protein');
                    })
                    .style('background-color', function(d){
                        // return "rgba(0,0,0," + d3.select(this).attr('opacity') + ")";
                        // return "rgba(1, 149, 223," + (parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, '')) / 100) + ")" ;
                        var percentage = parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, ''));
                        if(percentage > 100){
                            percentage = 100;
                        }
                        return colorFill(percentage);
                    })
                    .style('color',function(d){
                        return "rgba(255,255,255,0.8)";
                    });

            // td for FATS
            recipeNutContainer.append('div').classed('recipeNutritionValue', true)
                .text(function(d){
                    return calcPersonalValue(d, 'fat');
                })
                .style('background-color', function(d){
                    // return "rgba(1, 149, 223," + (parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, '')) / 100) + ")" ;
                    var percentage = parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, ''));
                    if(percentage > 100){
                        percentage = 100;
                    }
                    return colorFill(percentage);
                })
                .style('color',function(d){
                    return "rgba(255,255,255,0.8)";
                });

            // td for CARBOHYDRATES
            recipeNutContainer
                .append('div').classed('recipeNutritionValue', true)
                    .text(function(d){
                        return calcPersonalValue(d, 'carbohydrate');
                    })
                    .style('background-color', function(d){
                        // return "rgba(1, 149, 223," + (parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, '')) / 100) + ")" ;
                        var percentage = parseFloat(d3.select(this)[0][0].innerHTML.replace(/%/g, ''));
                        if(percentage > 100){
                            percentage = 100;
                        }
                        return colorFill(percentage);
                    })
                    .style('color',function(d){
                        return "rgba(255,255,255,0.8)";
                    });
        }

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
            return (returnText / model.dailyCarbs).toFixed(1) + '%';
        }
        else if(type === 'fat'){
            return (returnText / model.dailyFats).toFixed(1) + '%';   
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