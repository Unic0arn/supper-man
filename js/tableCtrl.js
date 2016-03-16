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

    tableView.btnCamera.on("click",function(){
        tableView.inputFile[0][0].click();
    });

    tableView.inputFile[0][0].addEventListener("change",function(e){
    	cropImage(e);
    });

    //copied from http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
	function convertImgToBase64URL(url, callback, outputFormat){
	    var img = new Image();
	    img.crossOrigin = 'Anonymous';
	    img.onload = function(){
	        var canvas = document.createElement('CANVAS'),
	        ctx = canvas.getContext('2d'), dataURL;
	        canvas.height = img.height;
	        canvas.width = img.width;
	        ctx.drawImage(img, 0, 0);
	        dataURL = canvas.toDataURL(outputFormat);
	        callback(dataURL);
	        canvas = null; 
	    };
	    img.src = url;
	}

	// copied from http://stackoverflow.com/questions/6848121/javascript-crop-image-client-side
	var cropImage = function(e){
	    e.preventDefault && e.preventDefault();
	    var image, canvas, i;
	    var images = 'files' in e.target ? e.target.files : 'dataTransfer' in e ? e.dataTransfer.files : [];
	    if(images && images.length) {
	      for(var i in images) {  
	        if(typeof images[i] != 'object') continue;
	          image = new Image();
	          image.src = createObjectURL(images[i]);
	          image.onload =  function(e){
	          model.recipe.img = resizeCrop( e.target, 64, 64 ).toDataURL('image/jpg', 90);
	        };
	      }           
	    }
	  };
	// copied from http://stackoverflow.com/questions/6848121/javascript-crop-image-client-side
  	var resizeCrop = function( src, width, height ){
	    var crop = width == 0 || height == 0;
	    // not resize
	    if(src.width && width && height == 0){
	        height = src.height * (width / src.width);
	    }

	    // check scale
	    var xscale = width  / src.width;
	    var yscale = height / src.height;
	    var scale  = crop ? Math.min(xscale, yscale) : Math.max(xscale, yscale);
	    // create empty canvas
	    var canvas = document.createElement("canvas");                  
	    canvas.width  = width ? width   : Math.round(src.width  * scale);
	    canvas.height = height ? height : Math.round(src.height * scale);
	    canvas.getContext("2d").scale(scale,scale);
	    // crop it top center
	    canvas.getContext("2d").drawImage(src, ((src.width * scale) - canvas.width) * -.5 , ((src.height * scale) - canvas.height) * -.5 );
	    return canvas;
	};
	// copied from http://stackoverflow.com/questions/6848121/javascript-crop-image-client-side
	var createObjectURL = function(i){ 
	    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
	    return URL.createObjectURL(i);
	};

	this.touchStart = function(d, i, element) {
			
		var move;
		var previousAmount = d.value;
		var amountText = previousAmount;
		var start = interaction[3]();
		start = parseInt(start.clientX);

		var overlay = d3.select("#overlay");

		overlay.append("div").style("margin","auto").style("margin-top","150px").style("font-size","70px").text(model.getIngredient(d.id).name);
		var amount = overlay.append("div").style("margin","auto").style("margin-top","50px").style("font-size","70px");

		// var amount = d3.select("#overlay").append("div").style("margin","auto").style("margin-top","200px").style("font-size","170px");
		
		tableView.setOverlay(0.5);

		d3.select("body").on(interaction[1],function(event){

			move = interaction[3]();
			move = parseInt((move.clientX-start)*0.5);
			move -= move%5;
			amountText = previousAmount + move;
			if(amountText < 0){
				amountText = 0;
			}
			amount.text(amountText + 'g');
			d3.select(element).html(amountText + 'g');
		});

		d3.select("body").on(interaction[2],function(){
			model.changeAmount(d.id, amountText);
			d3.select("body").on(interaction[1],null);
			d3.select("body").on(interaction[2],null);

	        overlay.selectAll("div").remove();
			d3.select("#overlay").transition().style("opacity", 0).duration(500);
			window.ontouchmove = null;
		});
	};
};