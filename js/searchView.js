var SearchView = function(container,model){
    var view = this;
    view.container = container;
    model.addObserver(this);
    model.getAllRecipes();
    view.container.style('width','60vw').style('height','100vh').style('background-color', 'pink').style("position","absolute").style("top",0).style("left","-55vw");

    var redrawList = function(){
        view.container.html = '';
        view.container.append('div').style('background-color','red').style('height','50px');

        var list = view.container.append('div').style('overflow','auto').style("width","55vw");
        var listItem = list.selectAll('div')
            .data(model.recipeDB).enter()
                .append('div')
                    .style('height','100px')
                    .style('background-color','yellow')
                    .classed('recipeListItem',true);

        listItem.append('img').style('width','80px').style('height', '80px').style('border', 'solid').style('border-width', '1px').style('border-radius','50%').attr("src",function(d){return d.img;});
        var listHeader = listItem.append('div');
        listHeader.append('h3').text(function(d){return d.name;});
        listHeader.append('div').text('sexy rating');

        listItem.append('div').append('img').style('height', '80px').attr('src', 'img/placeholderChart.png').style("position","absolute").style("right","5vw");

        model.notifyObservers("recipeListReady");
    }; 



    this.update = function(code){
        if(code === 'getAllRecipes'){
            redrawList();
        }
    };
}