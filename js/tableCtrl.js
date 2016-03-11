var TableCtrl = function(tableView, model){

	var touch = ["touchstart", "touchmove", "touchend", function(){ return d3.event.touches[0]; }];
	var mouse = ["mousedown", "mousemove", "mouseup", function(){ d3.event.preventDefault(); return d3.event; }];
	var interaction = mouse;
	
	model.addObserver(this);

	this.update = function(code){
		if(code === "createRemoveButton"){
			d3.selectAll('.removeBtn').on('click', function(d, i){
				var ingredientID = d3.select('#ingredientRow_' + i).attr("ingredient_id");
				model.removeIngredient(parseInt(ingredientID));
			});
		}
		if(code === "tableRowReady"){
			var amounts = d3.selectAll(".tableamount").on(interaction[0], function(d,i){ touchStart(d); });
		}
	};


	var touchStart = function touchStart(d) {
		window.ontouchmove = function(e){ e.preventDefault(); };
			
		var move;
		var previousAmount = 0;
		var start = interaction[3]();
		start = parseInt( (Math.sqrt( Math.pow(start.clientX,2) + Math.pow(start.clientY,2)) ) );
		var amount = d3.select("#overlay").append("div").style("margin","auto").style("margin-top","200px").style("font-size","170px");
		
		tableView.setOverlay(0.5);
		console.log(start);
		d3.select("body").on(interaction[1],function(event){

			move = interaction[3]();
			move = parseInt(((Math.sqrt(Math.pow(move.clientX,2) + Math.pow(move.clientY,2)))-start)*0.2);
			amount.text(move);
			
			if(Math.abs(move-previousAmount) > 0){
				model.addIngredient(d.id, move-previousAmount);
			}

			previousAmount = move;
		});

		d3.select("body").on(interaction[2],function(){
			d3.select("body").on(interaction[1],null);
			d3.select("body").on(interaction[2],null);
			amount.remove();
			d3.select("#overlay").transition().style("opacity", 0).duration(500);
		});
	};
};