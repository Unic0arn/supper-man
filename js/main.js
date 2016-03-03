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
  };}, function(error, rawdata) {
	console.log(rawdata[0]);
	fillTable(rawdata);
});
