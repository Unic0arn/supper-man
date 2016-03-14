var RadarChartView = function (container, model) {
	var axises = ["energy","protein","fat","sodium","carbohydrate"];
	var radarChartContainer = this;
	
	radarChartContainer.agg = true;
	model.addObserver(radarChartContainer);

	var margin = {top: 100, right: 100, bottom: 100, left: 100},
	width = Math.min(600, window.innerWidth - 10) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight * 0.5 - margin.top - margin.bottom - 50);
	
	console.log(width);
	console.log(height);

	var options = {
		w: width,
		h: height,
		margin: margin,
		maxValue: 0,
		levels: 10,
		roundStrokes: true,
		color: d3.scale.category20()
	};
	radarChartContainer.update = function(code){

		if("addIngredient" === code){
			redrawChart();
		}else if("removeIngredient" === code){
			redrawChart();
		}else if("changeAmount" === code){
			redrawChart();
		} else if("changeAgg" === code){
			//redrawChart();
		} else if("newRecipe" === code){
			redrawChart();
		} 
	}

	var transFormIngredient = function(ingredient){
		var outIngredient = {}
		outIngredient["key"] = ingredient["id"];
		outIngredient["values"] = [];
		d3.keys(ingredient).forEach(function(d){
			if(axises.indexOf(d) > -1){
				outIngredient["values"].push({"key":d, "value":ingredient[d]});
			}
		});
		return outIngredient;
	};

	var redrawChart = function(){
		container.select("svg").remove();
		transformed_data = [];
		var origData = model.getPercentageData();

		origData.forEach(function(d){
			transformed_data.push(transFormIngredient(d));
		}); 

		var cfg = {
			 w: 600,				//Width of the circle
			 h: 400,				//Height of the circle
			 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
			 levels: 3,				//How many levels or inner circles should there be drawn
			 maxValue: 0, 			//What is the value that the biggest circle will represent
			 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
			 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
			 opacityArea: 0.35, 	//The opacity of the area of the blob
			 dotRadius: 4, 			//The size of the colored circles of each blog
			 opacityCircles: 0.1, 	//The opacity of the circles of each blob
			 strokeWidth: 2, 		//The width of the stroke around each blob
			 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
			 color: d3.scale.category10()	//Color function
			};
			
			//Put all of the options into a variable called cfg
			if('undefined' !== typeof options){
				for(var i in options){
					if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
			  }//for i
			}//if

		var stack = d3.layout.stack()
		.offset("zero")
		.values(function(d) { return d.values; })
		.x(function(d) { return d.key; })
		.y(function(d) { return d.value; });


		var layers = stack(transformed_data);
		console.log(layers);

		var maxValue = transformed_data.length > 0 ? Math.max(cfg.maxValue, d3.max(transformed_data, function(i){
			return d3.max(i.values.map(function(o){
				return radarChartContainer.agg ? o.y0 + o.y : o.value;
			}))
		})) : 1;


//-------------------------------------------------------//-------------------------------------------------------//-------------------------------------------------------

	    var yGroupMax = transformed_data.length > 0 ? Math.max(cfg.maxValue, d3.max(transformed_data, function(i){
			return d3.max(i.values.map(function(o){
				return  o.value;
			}))
		})) : 1;
    	var	yStackMax = transformed_data.length > 0 ? Math.max(cfg.maxValue, d3.max(transformed_data, function(i){
			return d3.max(i.values.map(function(o){
				return  o.y0 + o.y;
			}))
		})) : 1;


		var x = d3.scale.ordinal()
		    .domain(axises)
		    .rangeRoundBands([0, width], .08);

		var y = d3.scale.linear()
		    .domain([0, yStackMax])
		    .range([height, 0]);    	


		var xAxis = d3.svg.axis()
		    .scale(x)
		    .tickSize(0)
		    .tickPadding(6)
		    .orient("bottom");

/*		    console.log(yGroupMax);
		    console.log(maxValue);
		    console.log(yStackMax);
		    console.log(x.domain());
		    console.log(y.domain());
*/

	//Initiate the radar chart SVG
	var svg = container.append("svg")
	.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
	.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
	.attr("class", "radar");
	//Append a g element		
	var g = svg.append("g")
	.attr("transform", "translate(" + (cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

	
	var layer = g.selectAll(".layer")
	    .data(layers)
	  .enter().append("g")
	    .attr("class", "layer")
	    .style("fill", function(d, i) { return cfg.color(i); });

	var rect = layer.selectAll("rect")
	    .data(function(d) { return d.values; })
	  .enter().append("rect")
	    .attr("x", function(d) { return x(d.key); })
	    .attr("y", height)
	    .attr("width", x.rangeBand())
	    .attr("height", 0);

	rect.transition()
	    .delay(function(d, i) { return i * 10; })
	    .attr("y", function(d) { return y(d.y0 + d.y); })
	    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

	g.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);



	radarChartContainer.change = function(){
	  if (this.agg === false) transitionGrouped();
	  else transitionStacked();
	};

	function transitionGrouped() {
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



//-------------------------------------------------------//-------------------------------------------------------//-------------------------------------------------------//-------------------------------------------------------

	



	function wrap(text, width) {
		text.each(function() {
			var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
			}
		});
	}//wrap	




};


};