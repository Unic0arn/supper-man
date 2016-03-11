var TableCtrl = function(tableView, model){
	console.log('TableCtrl');
	model.addObserver(this);
	// console.log(tableView.removeButtons);
	// d3.selectAll('.removeBtn').on('click', function(d){
	// 	console.log('klicka på remove');
	// // 	// var index = rawdata.indexOf(d);
	// // 	// rawdata.splice(index, 1);
	// // 	// d3.select('#nutRow_' + d.id).remove();
	// // 	// updateTable(rawdata);
	// });

	// d3.selectAll('removeBtn').style('color','pink');

	this.update = function(code){
		if(code === "createRemoveButton"){
			d3.selectAll('.removeBtn').on('click', function(d, i){
			    var ingredientID = d3.select('#ingredientRow_' + i).attr("ingredient_id");
			    model.removeIngredient(parseInt(ingredientID));
			});
		}
	};
};