var Model = function () {

    var model = this;

    model.data = []; //parse csv
    model.dataIds = [];
    model.recipe = []; //list active ingredients
    model.recipeIds = []; 
    model.observers = [];

    this.loadCsv = function(path){
        d3.csv(path, function(d){
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
      };}, function(data) { 
        model.data = data;
        model.dataIds = data.map(function(d){return d.id;})
      });
    }

    this.getIngredient = function(id){
        var tmp = model.data[model.dataIds.indexOf(id)];
        var obj = {};
        for (var attr in tmp){
            obj[attr] = tmp[attr];
        }

        return obj;
    }

    this.addIngredient = function(id,amount){
        var ingredient = model.getIngredient(id);
        ingredient["amount"] = amount;
        model.recipe.push(ingredient);
        model.recipeIds.push(ingredient.id)
        model.notifyObservers("addIngredient");
    }

    this.removeIngredient = function(id){
        var index = recipeIds.indexOf(id);
        model.recipe.slice();
        model.recipeIds.slice();
        notifyObservers("removeIngredient");
    }

    this.changeAmount = function(id,amount){
        var index = recipeIds.indexOf(id);
        model.recipe[index].amount = amount;
        notifyObservers("changeAmount");
    }


    this.addObserver = function(obs){
        model.observers.push(obs);
    }

    this.notifyObservers = function(code){
        for (var i in this.observers){
            model.observers[i].update(code);
        }
    }

    this.getPercentageData = function(){
        outdata = [];
        model.recipe.forEach(function(d){
            outdata.push(model.calculateIngredient(d));
        }); 
        return outdata;
    }

    this.calculateIngredient = function(ingredient){
        var daily_intake = {"energy":2000,"fat":65,"carbohydrate":300,"protein":50,"sodium":2400};
        var outIngredient = {}
        d3.keys(ingredient).forEach(function(d){
            
            if(d3.keys(daily_intake).indexOf(d) > -1){
                outIngredient[d] = ingredient[d]/daily_intake[d];
            }else{
                outIngredient[d] = ingredient[d];
            }
        });
        return outIngredient;
    }


    this.loadCsv("data/sr28/FOOD.csv");

}