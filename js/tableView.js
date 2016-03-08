var TableView = function (container, model) {
    
    var tableContainer = this;
    
    model.addObserver(tableContainer);


    var redrawTable = function(){
        var table = d3.select("#ingredientTable");
        var tbody = table.select("tbody");
        var columns = ['name', 'amount', ''];
        tbody.html('');
        var tr = tbody.selectAll("tr")
            .data(model.recipe)
            .enter()
            .append("tr")
            .attr("d", function(d){return d;});
        // cells
        var td = tr.selectAll("td")
            .data(function(row) {
                return columns.map(function(column, i) {
                    return {column: column, value: row[column]};
                });
            })
            .enter().append("td")
            .html(function(d) { return d.value; });
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
            console.log("removeIngredient");
        }else if("changeAmount" === code){
            console.log("changeAmount");
        }
    };


    initialize();
    
    // redrawTable();
};