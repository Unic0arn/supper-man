var TableView = function (container, model) {
    
    var tableContainer = this;
    
    model.addObserver(tableContainer);
    
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
            }else if("removeIngredient" === code[msg]){
                console.log("removeIngredient");
            }else if("changeAmount" === code[msg]){
                console.log("changeAmount");
            }
        }
    }
}