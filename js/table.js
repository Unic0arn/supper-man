function initTable(columns) {


 	var table = d3.select("#ingredientTable");
 	table.append("thead");
	table.append("tbody");

	var thead = d3.select("thead").append("tr").selectAll("th")
	.data(columns)
	.enter().append("th").text(function(d){
		if(d === 'id' || d === 'name'){
			return d;
		}
	});
}

function updateTable(data){
	var columns = d3.keys(data[0]);

	var table = d3.select("#ingredientTable");
	var tbody = table.select("tbody");
	tbody.html("");
	var tr = tbody.selectAll("tr")
		.data(data.slice(0,20))
		.enter()
		.append("tr")
			.attr("d", function(d){return d;})
			.attr('class',function(d){ return'ingredientRow_' + d.id; });
// cells
	var td = tr.selectAll("td")
	 	.data(function(row) {
        	return columns.map(function(column) {
            	return {column: column, value: row[column]};
            });
        })
		.enter()
		.append("td")
			.html(function(d) { 
				if(d.column === 'id' || d.column === 'name'){
	  				return d.value; 
	  			}
	  		});

	d3.select("tbody").selectAll('tr')
		.append('td').classed('tableBtns', true).attr('id', function(d){ return 'tdNut_' + d.id; });
	d3.select("tbody").selectAll('tr')
		.append('td').classed('removeBtns', true).attr('id', function(d){ return 'removeBtn_' + d.id; });

	d3.selectAll('.removeBtns')
		.append('button').attr('class', 'btn btn-default removeBtn').text('Remove');

}