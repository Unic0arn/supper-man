var RadarChartCtrl = function (view, model) {
	var radarChartCtrl = this;


	d3.select("#add-switch").on("click", function(){
		console.log("Pressed add switch");
		var randomIngredient = Math.floor((Math.random() * model.data.length));
		model.addIngredient(model.data[randomIngredient].id,50);
	});

	d3.select("#agg-switch").on("click", function(){
		console.log("Pressed aggregate switch");
		view.agg = !view.agg;
		model.notifyObservers("changeAgg");
	});

};