
var TableView = function (container, model) {
    
    var view = this;
    view.container = container;
    model.addObserver(view);

    var initNameInput = function(){
        var form = container.insert("div",":first-child").classed("form-inline",true);
        
        view.nameInput = form.append("input")
            .attr("type","text")
            .attr("id","recipeName")
            .attr("placeholder","Name your recipe!")
            .attr("maxlength","30")
            .style("width","60%")
            .classed("form-control",true);

        view.btnSave = form.append("button")
            .classed("btn btn-default saveRecipeBtn",true)
            .text("Save");

        view.btnNew = form.append("button")
            .classed("btn btn-default newRecipeBtn",true)
            .text("New");

        view.btnCamera = form.append("button")
            .classed("btn btn-default newRecipeBtn",true)
            .text("Photo");

        view.inputFile = form.append("input")
            .attr("type","file")
            .attr("accept","image/*;")
            .attr("capture","camera")
            .style("visibility","hidden");



    };

    view.clearNameInput = function(){
        view.nameInput[0][0].value = model.recipe.name && model.recipe.name || "";
    };

    var redrawTable = function(){
        var table = d3.select("#ingredientTable");
        var tbody = table.select("tbody");
        var columns = ['color','name', 'amount', 'button'];
        tbody.html('');

        var tr = tbody.selectAll("tr")
            .data(model.recipe.ingredients)
            .enter()
            .append("tr")
            .attr("d", function(d){return d;})
            .attr('id', function(d,i){ return 'ingredientRow_' + i;})
            .attr("ingredient_id", function(d){return d.id;})
            .classed("ingredientTableRow", true);
        // cells

        var td = tr.selectAll("td")
            .data(function(row) {
                return columns.map(function(column, i) {
                    return {column: column, value: row[column], id: row.id};
                });
            })
            .enter().append("td")
            .html(function(d) { 
                if(d.column === 'color'){
                    d3.select(this).classed('ingredientColorRect',true).style("background", d.value).style("width", "4%");
                }else if(d.column === 'name'){
                    d3.select(this).classed('table' + d.column, true).style("width", "55%");
                    return d.value;
                }else if(d.column === 'amount'){
                    d3.select(this).classed('table' + d.column, true).style("width", "15%");
                    return d.value + 'g';
                }
                else if(d.column === 'button'){
                    d3.select(this).classed('removeBtnContainer',true).style('text-align', 'center').style("width", "26%");
                }
            });

        d3.selectAll('.removeBtnContainer').append('button').attr('class', 'btn btn-default removeBtn').text('Remove');
        model.notifyObservers('tableRowReady');
    };
    
    var initialize = function(){
        initNameInput();
        
        var columns = ['Color', 'Name', 'Amount', 'Button'];
        
        var table = d3.select("#ingredientTable");
        table.append("thead");
        table.append("tbody");

        var thead = d3.select("thead").append("tr").selectAll("th")
        .data(columns)
        .enter().append("th").text(function(d){
            if(d === 'Color'){
                d3.select(this).style("width", "4%");
                return '';
            }else if(d === 'Name'){
                d3.select(this).style("width", "55%");
                return d;
            }else if(d === 'Amount'){
                 d3.select(this).style("width", "15%");
                 return d;
            }else if(d === 'Button'){
                d3.select(this).style("width", "26%");
                return '';
            }
        });
    };


    view.update = function(code){
        if(code === "addIngredient") {
            redrawTable();
            updateSelectedIngredient(model.selectedIngredient);
        }else if(code === "removeIngredient") {
            redrawTable();
        }else if(code === "changeAmount") {
            redrawTable();
        }else if(code === "newRecipe") {
            view.clearNameInput();
            redrawTable();

        }else if(code === "newSelectedIngredient"){
            updateSelectedIngredient(model.selectedIngredient);
        }
    };

    var updateSelectedIngredient = function(id){
        var rows = view.container.selectAll(".ingredientTableRow");

        var selected = rows.filter(function(d){
            return d.id === id;
        });
        var rest = rows.filter(function(d){
            return d.id != id;
        });
        selected.style("opacity",0.5);
        rest.style("opacity",1);
/////////////////////////////////////////////////////////////
        //selected.style("opacity",1);
        //rest.style("opacity",0.6);
    };

    view.setOverlay = function(opacity){
        d3.select("#overlay").transition().style("opacity",opacity).duration(500);
    };


    initialize();
    
};