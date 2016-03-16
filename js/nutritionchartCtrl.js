var NutritionChartCtrl = function (view, model) {
	var NutritionChartCtrl = this;
	d3.select("#agg-switch").on("click", function(){
		console.log("Pressed aggregate switch");
		if(view.agg){
			this.innerHTML = 'Aggregate!';
		}else{
			this.innerHTML = 'Divide!';
		}
		console.log(view.agg);
		view.change();
		model.notifyObservers("changeAgg");
	});

};