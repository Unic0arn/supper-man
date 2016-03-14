var TableCtrl = function(tableView, model){
	var ctrl = this;
	var touch = ["touchstart", "touchmove", "touchend", function(){ return d3.event.touches[0]; }];
	var mouse = ["mousedown", "mousemove", "mouseup", function(){ d3.event.preventDefault(); return d3.event; }];
	var interaction = touch;
	
	model.addObserver(this);

	this.update = function(code){

		if(code === "tableRowReady"){
			var amounts = tableView.container.selectAll(".tableamount").on(interaction[0], function(d,i){ 
				ctrl.touchStart(d, i, this); 
			});

			tableView.container.selectAll('.removeBtn').on(interaction[0], function(d, i){
				var ingredientID = d3.select('#ingredientRow_' + i).attr("ingredient_id");
				model.removeIngredient(parseInt(ingredientID));
			});
		}
	};

	tableView.btnSave.on(interaction[0],function(){
        model.saveRecipe(tableView.nameInput[0][0].value);
    });

    tableView.btnNew.on(interaction[0],function(){
        model.newRecipe();
    });

    tableView.btnCamera.on(interaction[0],function(){
        tableView.inputFile[0][0].click();
    });

    tableView.inputFile.on("change",function(){
    	console.log("scale, convert and save img");
    });

	this.touchStart = function(d, i, element) {
		console.log(d3.select(element));
		window.ontouchmove = function(e){ e.preventDefault(); };
			
		var move;
		var previousAmount = d.value;
		var amountText;
		var start = interaction[3]();
		start = parseInt(start.clientX);
		var amount = d3.select("#overlay").append("div").style("margin","auto").style("margin-top","200px").style("font-size","170px");
		
		tableView.setOverlay(0.5);
		console.log("start: " + start);
		d3.select("body").on(interaction[1],function(event){

			move = interaction[3]();
			move = parseInt((move.clientX-start)*0.1);
			console.log("move: " + move);
			amountText = previousAmount + move;
			if(amountText < 0){
				amountText = 0;
			}
			amount.text(amountText);
			d3.select(element).html(amountText);
		});

		d3.select("body").on(interaction[2],function(){
			model.changeAmount(d.id, amountText);
			d3.select("body").on(interaction[1],null);
			d3.select("body").on(interaction[2],null);
			amount.remove();
			d3.select("#overlay").transition().style("opacity", 0).duration(500);
			window.ontouchmove = null;
		});
	};
};