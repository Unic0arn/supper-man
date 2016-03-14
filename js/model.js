var Model = function () {
    var model = this;

    model.data = []; //parse csv
    model.dataIds = [];
    model.recipe = {"ingredients":[]}; //list active ingredients
    model.ingredientIds = []; 
    model.observers = [];
    model.filters = [];
    model.search = false;

    model.recipeDBref = new Firebase("https://brilliant-heat-2649.firebaseio.com/");

    this.saveRecipe = function(name){
        model.recipe.name = name;
        if(model.recipe.img == undefined || model.recipe.img == ""){
            model.recipe.img = "img/Logo.png";
        }
        if(model.recipe.id == null){
            var ref = model.recipeDBref.push();
            model.recipe.id = ref.key();
            ref.set(model.recipe);
            
        }else{
            var ref = model.recipeDBref.child(model.recipe.id);            
            ref.update(model.recipe);
        }
        model.getAllRecipes();
    };

    this.addFilter = function(id){
        if (model.filters.indexOf(id) == -1){
            model.filters.push(id);
            model.notifyObservers("filterAdded");
        }
    };

    this.removeFilter = function(id){
        model.filters.splice(model.filters.indexOf(id),1);
        model.notifyObservers("filterRemoved");
    };

    this.filterSearch = function(){
        result = model.recipeDB.filter(function(d){
            var push = true;
            var ingredients = d.ingredients.map(function(i){return i.id;});
                for(var f in model.filters){
                    if(ingredients.indexOf(model.filters[f]) == -1){
                        push = false;
                        break;
                    }
                }
            return push;

        });
        console.log(result);
        return result;
    };

    this.editRecipe = function(id){
        model.recipeDBref.child(id).once("value",function(snapshot){
            model.recipe = snapshot.val();
            model.notifyObservers("newRecipe");
        });
    };

    this.newRecipe = function(){
        model.recipe = {"ingredients":[]};
        model.ingredientIds = [];
        model.notifyObservers("newRecipe"); 
    };

    this.getAllRecipes = function(){
        model.recipeDBref.once("value",function(snapshot){
            var tmp = snapshot.val();
            model.recipeDB = [];
            for(var obj in tmp){
                model.recipeDB.push(tmp[obj]);
            }
            model.notifyObservers("getAllRecipes");
        });
    };

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
        model.dataIds = data.map(function(d){return d.id;});
        model.notifyObservers("dataReady");
        model.addIngredient(1001, 200);
        model.addIngredient(1011, 2000);

      });
    };

    this.getIngredient = function(id){
        var tmp = model.data[model.dataIds.indexOf(id)];
        if(model.dataIds.indexOf(id) == -1){
            console.log("ingredient with id: " +id+ " does not exist, getting id 1001 instead");
            tmp = model.getIngredient(1049);
        }
        
        var obj = {};
        for (var attr in tmp){
            obj[attr] = tmp[attr];
        }
        return obj;
    };

    this.addIngredient = function(id,amount){
        var ingredient = model.getIngredient(id);
        if(model.ingredientIds.indexOf(ingredient.id) > -1){
            var tmp = model.recipe.ingredients[model.ingredientIds.indexOf(ingredient.id)];
            tmp.amount += amount;
            if(tmp.amount <= 0){
                model.removeIngredient(ingredient.id);
            }
        }else{
            ingredient["amount"] = amount;
            model.recipe.ingredients.push(ingredient);
            model.ingredientIds.push(ingredient.id);
        }
        model.notifyObservers("addIngredient");
    };

    this.removeIngredient = function(id){
        var index = model.ingredientIds.indexOf(id);
        model.recipe.ingredients.splice(index, 1);
        model.ingredientIds.splice(index, 1);
        model.notifyObservers("removeIngredient");
    };

    this.changeAmount = function(id,amount){
        var index = model.ingredientIds.indexOf(id);
        model.recipe.ingredients[index].amount = amount;
        model.notifyObservers("changeAmount");
    };


    this.addObserver = function(obs){
        model.observers.push(obs);
    };

    this.notifyObservers = function(code){
        console.log("Notify obsevers: " + code);
        for (var i in model.observers){
            model.observers[i].update(code);
        }
    };

    this.getPercentageData = function(){
        outdata = [];
        model.recipe.ingredients.forEach(function(d){
            outdata.push(model.calculateIngredient(d));
        }); 
        return outdata;
    };

    this.calculateIngredient = function(ingredient){
        var daily_intake = {"energy":2000,"fat":65,"carbohydrate":300,"protein":50,"sodium":2400};
        var outIngredient = {};
        d3.keys(ingredient).forEach(function(d){
            console.log(d);
            if(d3.keys(daily_intake).indexOf(d) > -1){
                outIngredient[d] = (ingredient.amount / 100) * ingredient[d] / daily_intake[d];
            }else{
                outIngredient[d] = ingredient[d];
            }
        });
        return outIngredient;
    };

    /*
        Algorithms for calculation of RDI
    */
    this.calculateIntakeCalories = function(){
        //Men: BMR = 66.5 + ( 13.75 x weight in kg ) + ( 5.003 x height in cm ) – ( 6.755 x age in years )
        //Women: BMR = 655.1 + ( 9.563 x weight in kg ) + ( 1.850 x height in cm ) – ( 4.676 x age in years )
        // returns amount (I think...)
        var BMR = 0;
        if(gender === 'M'){
            BMR = 66.5 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
        }else{
            BMR = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
        }

        if(exercise === 'none'){
            BMR *= 1.2;
        }else if(exercise === 'little'){
            BMR *= 1.375;
        }else if(exercise === 'moderate'){
            BMR *= 1.55;
        }else if(exercise === 'heavy'){
            BMR *= 1.725;
        }else if(exercise === ' very heavy'){
            BMR *= 1.9;
        }
        return BMR;
    };

    this.calculateIntakeProteins = function(){
        // Recomended daily intake of proteins in (grams). Based on weight.
        var dailyProteins = weight * 0.8;
        return dailyProteins;
    };

    this.calculateIntakeCarbs = function(){
        // Recommended daily intake of carbs in (grams). 
        // Carbs grams = (55%) to (75%) of the total calories / 3.75
        var carbArray = [];
        var dailyCalories = model.calculateIntakeCalories();
        var minimumCarbs =  (dailyCalories * 0.55) / 3.75;
        var maximumCarbs = (dailyCalories * 0.75) / 3.75;
        carbArray.push(minimumCarbs);
        carbArray.push(maximumCarbs);
        return carbArray;
    };

    this.calculateIntakeFats = function(){
        // Recommended daily intake of fats in (grams). 
        var dailyCalories = model.calculateIntakeCalories;
        var minimumFat;
        var maximumFat;
        var saturatedFat;
        var fatArray = [];
        if(age > 1 && age < 4){
            minimumFat = (dailyCalories * 0.3) / 9;
            maximumFat = (dailyCalories * 0.4) / 9;
        }else if(age > 3 && age < 19){
            minimumFat = (dailyCalories * 0.25) / 9;
            maximumFat = (dailyCalories * 0.35) / 9;
        }else if(age > 18){
            minimumFat = (dailyCalories * 0.2) / 9;
            maximumFat = (dailyCalories * 0.35) / 9;
        }

        saturatedFat = (dailyCalories * 0.1) / 9;
        fatArray.push(minimumFat);
        fatArray.push(maximumFat);
        fatArray.push(saturatedFat);

        return fatArray;
    };

    this.calculateDailySodiums = function(){
        // Values in (mg)
        var minimumSodium = 250;
        var maximumSodium = 500;
        var sodiumArray = [];
        return sodiumArray;
    };


    this.loadCsv("data/reduced.csv");

};