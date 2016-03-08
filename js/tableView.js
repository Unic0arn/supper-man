var TableView = function (container, model) {
    
    var tableContainer = this;
    
    model.addObserver(tableContainer);
    
    var redrawTable = function(){
        var tbody = d3.select("tbody");
        tbody.html('');
        var tr = tbody.selectAll("tr")
            .data(model.recipe)
            .enter()
            .append("tr")
            .attr("d", function(d){return d;});
        // cells
        var td = tr.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter().append("td")
            .html(function(d) { return d.value; });
    };
    
    var initialize = function(){
        
        var columns = ['name', 'amount', ''];
        
        var table = d3.select("#ingredientTable");
        table.append("thead");
        table.append("tbody");

        var thead = d3.select("thead").append("tr").selectAll("th")
        .data(columns)
        .enter().append("th").text(function(d){return d});
        
        
    
    }
    initialize();
    tableContainer.update = function(code){
        for(var msg in code){
            if("addIngredient" === code[msg]){
                console.log("addIngredient");
                redrawTable();
            }else if("removeIngredient" === code[msg]){
                console.log("removeIngredient");
            }else if("changeAmount" === code[msg]){
                console.log("changeAmount");
            }
        }
    }
}