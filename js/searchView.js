var SearchView = function(container,model){
    var view = this;
    view.container = container;
    model.addObserver(this);
    model.getAllRecipes();
    

    var redrawList = function(){
        view.container.html('');
        var filters = view.container.append('div').attr('id', 'searchFilterContainer');
        filters.selectAll("span").data(model.filters).enter()
            .append("span").text(function(f){return model.getIngredient(f).name;});

        var list = view.container.append('div').attr('id', 'searchList');
        var listItem = list.selectAll('div')
            .data(model.filterSearch()).enter()
                .append('div')
                    .classed('recipeListItem',true);

        listItem.append('img').style('width','80px').classed('recipeImg', true).attr("src",function(d){return d.img;});

        var listHeader = listItem.append('div');
        listHeader.append('h3').classed('recipeName', true).text(function(d){return d.name;});
        listHeader.append('div').classed('recipeRating', true).text('sexy rating');

        listItem.append('div').append('img').classed('recipeGraph', true).attr('src', 'img/placeholderChart.png');

        model.notifyObservers("recipeListReady");
    }; 



    this.update = function(code){
        if(code === 'getAllRecipes'){
            redrawList();
        }else if(code === 'filterAdded'){
            redrawList();
        }
    };
};