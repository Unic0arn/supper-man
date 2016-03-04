d3.csv("data/sr28/FOOD.csv", function(d){
	if(d["Post ID"] == "" || d["Type"] == "") return;
	return {
		id: +d["ABBREV_NDB_No"] || 0 ,
		food_group_id: +d["FOOD_DES_FdGrp_Cd"] || 0 ,
		food_group_name: d["FdGrp_Desc"],
		name: d["ABBREV_Shrt_Desc"] || "",
		description: d["Long_Desc"] || "",
		energy: +(d["Energ_Kcal"].replace(",",".")) || 0,
		protein: +(d["Protein_(g)"].replace(",",".")) || 0,
		fat: +(d["Lipid_Tot_(g)"].replace(",",".")) || 0,
    	sodium: +(d["Sodium_(mg)"].replace(",",".")) || 0,
    	carbohydrate: +(d["Carbohydrt_(g)"].replace(",",".")) || 0
  };}, function(error, data) {
	console.log(data[0]);
	var selectedIngredients = [];
	var agg = false;
	initTable(d3.keys(data[0])); // Init table with the columns



	var color = d3.scale.category20();
	


	var margin = {top: 100, right: 100, bottom: 100, left: 100},
	width = Math.min(450, window.innerWidth - 10) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 50);
	
	var radarChartOptions = {
	  w: width,
	  h: height,
	  margin: margin,
	  maxValue: 0,
	  levels: 10,
	  roundStrokes: true,
	  color: color
	};

	var axises = ["energy","protein","fat","sodium","carbohydrate"];

	d3.select("#add-switch").on("click", function(){

		addIngredient();
	});
	d3.select("#agg-switch").on("click", function(){
		switchBetweenAgg();
	});
	var funkActive = false;
	d3.select("#funk-switch").on("click", function(){
			agg = true;
			d3.select(".sunburstContainer").remove();
			d3.select(".tableContainer").remove();
			d3.select(".infoContainer").style("background-color","white");
			radarChartOptions["w"] = window.innerWidth  - margin.left - margin.right;
			radarChartOptions["h"] = window.innerHeight - margin.top - margin.bottom;
			setInterval(addIngredient, 50);
			
	});


	function  switchBetweenAgg(){
		agg = !agg;
		reDrawAll();
	}
	function addIngredient(ingredientId){
		var randomIngredient = Math.floor((Math.random() * data.length));
		selectedIngredients.push(data[randomIngredient]);
		reDrawAll();
	}
	function removeIngredient(ingredientId){
		selectedIngredients = removeObject(selectedIngredients,"id",ingredientId);
		reDrawAll();
	}
	function removeObject(array, key, value){
		var newArray = [];
		array.forEach(function(d){
			if(d[key] != value) newArray.push(d);
		});
		return newArray;
	}

	function reDrawAll(){
		updateTable(selectedIngredients);
		d3.selectAll(".removeBtn").on("click", function(d){removeIngredient(d["id"]);});
		draw(selectedIngredients, agg, axises, radarChartOptions);	
	}
});


