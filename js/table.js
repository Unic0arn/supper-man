function initTable(columns) {


 	var table = d3.select("#ingredientTable");
 	table.append("thead");
	table.append("tbody");

	var thead = d3.select("thead").append("tr").selectAll("th")
	.data(columns)
	.enter().append("th").text(function(d){return d});
};

function updateTable(data){
	var columns = d3.keys(data[0]);

	var table = d3.select("#ingredientTable");
	var tbody = table.select("tbody");
	tbody.html("");
	var tr = tbody.selectAll("tr")
	.data(data.slice(0,20))
	.enter()
	.append("tr")
	.attr("d", function(d){return d;});
// cells
	var td = tr.selectAll("td")
	  .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
	  .enter().append("td")
	  .html(function(d) { return d.value; });
}