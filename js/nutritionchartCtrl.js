var NutritionChartCtrl = function (view, model) {

	model.addObserver(this);
	var NutritionChartCtrl = this;
	d3.select("#agg-switch").on("click", function(){
		if(view.agg){
			this.innerHTML = '<img id="smallImg" src="img/stack.png"> ';
		}else{
			this.innerHTML = '<img id="smallImg" src="img/chart.png"> ';
		}
		view.change();
		model.notifyObservers("changeAgg");
	});


	this.update = function(code){

		if("addIngredient" === code){
			updateCtrl();
		}else if("removeIngredient" === code){
			updateCtrl();
		}else if("changeAmount" === code){
			updateCtrl();
		} else if("changeAgg" === code){
			//updateChart();
		} else if("newRecipe" === code){
			updateCtrl();
		} 
	}

	var updateCtrl = function(){

	view.container.selectAll(".layer").on("click",function(d){
		if(d.key === model.selectedIngredient) {
			model.setSelectedIngredient(0);
		}else{

			model.setSelectedIngredient(d.key);
		}
	});		
	view.container.selectAll("rect").on("click",function(d){
	});
	};


};