var TableView = function (container, model) {
    
    var tableContainer = this;
    
    model.addObserver(tableContainer);


    var redrawTable = function(){
        var table = d3.select("#ingredientTable");
        var tbody = table.select("tbody");
        var columns = ['name', 'amount', ''];
        tbody.html('');
        var tr = tbody.selectAll("tr")
            .data(model.recipe.ingredients)
            .enter()
            .append("tr")
            .attr("d", function(d){return d;})
            .attr('id', function(d,i){ return 'ingredientRow_' + i;})
            .attr("ingredient_id", function(d){return d.id;});
        // cells

        var td = tr.selectAll("td")
            .data(function(row) {
                return columns.map(function(column, i) {
                    return {column: column, value: row[column]};
                });
            })
            .enter().append("td")
            .html(function(d) { 
                if(d.value === undefined){
                    d3.select(this).classed('removeBtnContainer',true).style('text-align', 'center');
                }else{
                    d3.select(this).classed('table' + d.column, true);
                }
                return d.value; 
            });

        d3.selectAll('.removeBtnContainer').append('button').attr('class', 'btn btn-default removeBtn').text('Remove');
        model.notifyObservers('createRemoveButton');
        model.notifyObservers('tableRowReady');
    };
    
    var initialize = function(){
        
        var columns = ['Name', 'Amount', ''];
        
        var table = d3.select("#ingredientTable");
        table.append("thead");
        table.append("tbody");

        var thead = d3.select("thead").append("tr").selectAll("th")
        .data(columns)
        .enter().append("th").text(function(d){return d;});
    };


    tableContainer.update = function(code){
        if("addIngredient" === code){
            console.log("adding Ingredient in tableView update");
            redrawTable();
        }else if("removeIngredient" === code){
            redrawTable();
            console.log("removeIngredient");
        }else if("changeAmount" === code){
            console.log("changeAmount");
        }
    };

    tableContainer.setOverlay = function(opacity){
        d3.select("#overlay").transition().style("opacity",opacity).duration(500);
    };


    initialize();
    
};