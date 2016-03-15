var NutritionChartCtrl = function (view, model) {
	var NutritionChartCtrl = this;
	d3.select("#agg-switch").on("click", function(){
		console.log("Pressed aggregate switch");
		view.agg = !view.agg;
		view.change();
		model.notifyObservers("changeAgg");
	});

};