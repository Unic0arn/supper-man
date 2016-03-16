var Model = function () {
    var model = this;

    model.data = []; //parse csv
    model.dataIds = [];
    model.recipe = {"ingredients":[]}; //list active ingredients
    model.ingredientIds = []; 
    model.observers = [];
    model.filters = [];
    model.search = false;
    model.selectedIngredient;

    model.categoricalColors = {
     "Liquid":[45, 100, 85, 0.7],
     "Fruits":[162, 70, 66, 1],
     "Nuts and Seeds":[22, 100, 59, 1],
     "Spices and Herbs":[48, 100, 50, 1],
     "Vegetables":[60, 80, 50, 1],
     "":[240, 80, 50, 1]};

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

    this.readCookie = function(key){
        var cookie = '{"' + document.cookie.replace(/=/g,'":"').replace(/;/g,'","') + '"}';
        cookie = JSON.parse(cookie);
        return cookie[key];
    };

    this.setCookie = function(key,value){
        document.cookie = key + "=" + value;
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
        return result;
    };

    this.editRecipe = function(id){
        model.recipeDBref.child(id).once("value",function(snapshot){
            model.ingredientIds = [];
            var colorExists = false;
            for(var index in snapshot.val().ingredients){
                if(snapshot.val().ingredients[index].color != undefined) colorExists = true;
                 model.ingredientIds.push(snapshot.val().ingredients[index].id);
            }
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
            model.recipeDB.sort(function(a,b){return d3.ascending(a.name,b.name);});
            model.notifyObservers("getAllRecipes");
        });
    };

    this.loadCsv = function(path){
        d3.csv(path, function(d){
        if(d["Post ID"] == "" || d["Type"] == "") return;
        return {
            id: +d["ABBREV_NDB_No"] || 0 ,
            food_group_id: +d["FOOD_DES_FdGrp_Cd"] || 0 ,
            food_group_name: d["Only_one_group"],
            name: d["Name"] || "",
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
        model.addIngredient(1001, 150);

      });
    };

    this.setSelectedIngredient = function(id){
        model.selectedIngredient = id;
        model.notifyObservers("newSelectedIngredient");
    }

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
            var c = model.categoricalColors[ingredient.food_group_name];
            var satscale = d3.scale.linear().domain([0,100]).range([Math.max(c[1] - 25, 20), Math.min(c[1] + 25,90)]);
            var sat = satscale(Math.random()*100);
            var lightscale = d3.scale.linear().domain([0,100]).range([Math.max(c[2] - 25, 20), Math.min(c[2] + 25,90)]);
            var light = lightscale(Math.random()*100);

            ingredient["color"] = "hsla("+c[0]+","+ sat +"%,"+ light +"%,"+ 1 +")"; // Adding a color with the same heu as the category but differing other values (25% off)
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
        var gender = 'M';
        model.dailyCalories = 0;
        var weight = 80;
        var height = 179;
        var age = 25;
        var exercise = 'little';
        if(gender === 'M'){
            //BMR = 66.5 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
            model.dailyCalories = 66.5 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
        }else{
            model.dailyCalories = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
        }

        if(exercise === 'none'){
            model.dailyCalories *= 1.2;
        }else if(exercise === 'little'){
            model.dailyCalories *= 1.375;
        }else if(exercise === 'moderate'){
            model.dailyCalories *= 1.55;
        }else if(exercise === 'heavy'){
            model.dailyCalories *= 1.725;
        }else if(exercise === ' very heavy'){
            model.dailyCalories *= 1.9;
        }
    };

    this.calculateIntakeProteins = function(){
        // Recomended daily intake of proteins in (grams). Based on weight.
        //model.dailyProteins = weight * 0.8;
        model.dailyProteins = 80 * 0.8;
    };

    this.calculateIntakeCarbs = function(){
        // Recommended daily intake of carbs in (grams). 
        // Carbs grams = (55%) to (75%) of the total calories / 3.75
        model.carbArray = [];
        var dailyCalories = model.dailyCalories;
        var minimumCarbs =  (dailyCalories * 0.55) / 3.75;
        var maximumCarbs = (dailyCalories * 0.75) / 3.75;
        model.carbArray.push(minimumCarbs);
        model.carbArray.push(maximumCarbs);
    };

    this.calculateIntakeFats = function(){
        // Recommended daily intake of fats in (grams). 
        var dailyCalories = model.dailyCalories;
        var minimumFat;
        var maximumFat;
        var saturatedFat;
        model.fatArray = [];

        var age = 25;
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
        model.fatArray.push(minimumFat);
        model.fatArray.push(maximumFat);
        model.fatArray.push(saturatedFat);
    };

    this.calculateDailySodiums = function(){
        // Values in (mg)
        var minimumSodium = 250;
        var maximumSodium = 500;
        model.sodiumArray = [];
        model.sodiumArray;
    };


    this.loadCsv("data/reduced.csv");
    model.calculateIntakeCalories();
    model.calculateIntakeProteins();
    model.calculateIntakeCarbs();
    model.calculateIntakeFats();

};