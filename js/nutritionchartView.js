var NutritionChartView = function (container, model) {
	var axises = ["energy","protein","fat","sodium","carbohydrate"];
	var view = this;
	view.container = container;
	view.agg = true;
	model.addObserver(this);

	var margin = {top: 100, right: 100, bottom: 100, left: 100},
	width = Math.min(600, window.innerWidth - 10) - margin.left - margin.right,
	height = window.innerHeight * 0.5 - margin.top - margin.bottom - 50;
	

	var stack = d3.layout.stack()
		.offset("zero")
		.values(function(d) { return d.values; })
		.x(function(d) { return d.key; })
		.y(function(d) { return d.value; });

	var yGroupMax = 1,
		yStackMax = 1;
		var yAxis = d3.svg.axis();
		var xAxis = d3.svg.axis()
	var layers;

	var options = {
		w: width,
		h: height,
		margin: margin,
		maxValue: 0.2,
		levels: 10,
		roundStrokes: true,
		color: d3.scale.category20()
	};

	var x = d3.scale.ordinal()
		    .domain(axises)
		    .rangeRoundBands([0, width], .08);

	var y = d3.scale.linear()
	    .range([height, 0]);  

	this.update = function(code){

		if("addIngredient" === code){
			updateChart();
			updateSelectedIngredient(model.selectedIngredient);
		}else if("removeIngredient" === code){
			updateChart();
		}else if("changeAmount" === code){
			updateChart();
		} else if("changeAgg" === code){
			//updateChart();
		} else if("newRecipe" === code){
			updateChart();
		} else if(code === "newSelectedIngredient"){
			updateSelectedIngredient(model.selectedIngredient);
		}
	}

	var updateSelectedIngredient = function(id){
        var layers = view.container.selectAll(".layer");
        console.log(layers);
        var selected = layers.filter(function(d){
            return d.key === id;
        });
        var rest = layers.filter(function(d){
            return d.key != id;
        });
        selected.style("opacity",0.5);
        rest.style("opacity",1);
        console.log(rest);
    };


	var transFormIngredient = function(ingredient){
		var outIngredient = {}
		outIngredient["key"] = ingredient["id"];
		outIngredient["values"] = [];
		outIngredient["color"] = ingredient["color"] || options.color(Math.random()*20);
		d3.keys(ingredient).forEach(function(d){
			if(axises.indexOf(d) > -1){
				outIngredient["values"].push({"key":d, "value":ingredient[d]});
			}
		});
		return outIngredient;
	};


	var initChart = function(){
		container.select("svg").remove();

		xAxis.scale(x)
		.tickSize(0)
		.tickPadding(6)
		.orient("bottom");

		y.domain([0, 1])
		var formatPercent = d3.format("0%");
		yAxis.scale(y)
		.tickSize(1)
		.tickPadding(6)
		.orient("left")
		.tickFormat(formatPercent);



		this.svg = container.append("svg")
		.attr("width",  options.w + options.margin.left + options.margin.right)
		.attr("height", options.h + options.margin.top + options.margin.bottom)
		.attr("class", "nutrition");
		//Append a g element		
		this.g = svg.append("g")
		.attr("transform", "translate(" + (options.margin.left) + "," + (options.h/2 + options.margin.top) + ")");

				this.g.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

				this.g.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0, 0)")
		.call(yAxis);
	}


	var updateChart = function(){
		transformed_data = [];
		var origData = model.getPercentageData();

		origData.forEach(function(d){
			transformed_data.push(transFormIngredient(d));
		}); 

		layers = stack(transformed_data);


		// Calculate max values for when stacked and grouped
		yGroupMax = transformed_data.length > 0 ? Math.max(options.maxValue, d3.max(transformed_data, function(i){
			return d3.max(i.values.map(function(o){
				return  o.value;
			}))
		})) : 1;
		yStackMax = transformed_data.length > 0 ? Math.max(options.maxValue, d3.max(transformed_data, function(i){
			return d3.max(i.values.map(function(o){
				return  o.y0 + o.y;
			}))
		})) : 1;

		y.domain([0, yStackMax])
		yAxis.scale(y);
		container.select(".y.axis").call(yAxis);
		var layer = this.g.selectAll(".layer")
		.data(layers, function(d){return d.key;});


		layer.enter().append("g")
		.attr("class", "layer")
		.style("fill", function(d, i) { return d.color; });

		layer.exit().remove();
		var rect = layer.selectAll("rect")
		.data(function(d) { return d.values; });


		rect.enter().append("rect");
		if(view.agg === true){

			rect
			.attr("x", function(d) { return x(d.key); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.y0 + d.y); })
			.attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

		}else{

			rect.attr("x", function(d, i, j) { return x(d.key) + x.rangeBand() / layers.length * j; })
				.attr("width", x.rangeBand() / layers.length)
				.attr("y", function(d) { return y(d.y); })
				.attr("height", function(d) { return height - y(d.y); });
		}
		/*
		rect.transition()
		.delay(function(d, i) { return i * 10; })
		.attr("y", function(d) { return y(d.y0 + d.y); })
		.attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });
		*/



	};


	this.change = function(){
		if (view.agg === true) {
			transitionGrouped();
			view.agg = false;
		}
		else {
			transitionStacked();
			view.agg = true;
		}
	};


	function transitionGrouped() {
		var rect = container.selectAll(".layer").selectAll("rect");
		y.domain([0, yGroupMax]);

		rect.transition()
		.duration(500)
		.delay(function(d, i) { return i * 10; })
		.attr("x", function(d, i, j) { return x(d.key) + x.rangeBand() / layers.length * j; })
		.attr("width", x.rangeBand() / layers.length)
		.transition()
		.attr("y", function(d) { return y(d.y); })
		.attr("height", function(d) { return height - y(d.y); });
	}

	function transitionStacked() {

		var rect = container.selectAll("rect");
		y.domain([0, yStackMax]);
		rect.transition()
		.duration(500)
		.delay(function(d, i) { return i * 10; })
		.attr("y", function(d) { return y(d.y0 + d.y); })
		.attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
		.transition()
		.attr("x", function(d) { return x(d.key); })
		.attr("width", x.rangeBand());
	}

	initChart();

};
