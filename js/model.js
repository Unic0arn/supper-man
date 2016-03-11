var Model = function () {
    var model = this;

    model.data = []; //parse csv
    model.dataIds = [];
    model.recipe = {"ingredients":[]}; //list active ingredients
    model.ingredientIds = []; 
    model.observers = [];

    model.recipeDB = new Firebase("https://brilliant-heat-2649.firebaseio.com/");

    this.setRecipeName = function(name){
        model.recipe.name = name;
    }

    this.saveRecipe = function(){
        if(model.recipe.id == null){
            var ref = model.recipeDB.push()
            ref.set({"id":ref.key()})
            model.recipe.id = ref.key();
        }else{
            var ref = model.recipeDB.child(model.recipe.id);            
            ref.update(model.recipe);
        }
    }

    this.queryFB = function(){
        var respose = []//firebasemagic
        return response
    }

    this.editRecipe = function(id){
        FBobj.child(id).once("value",function(snapshot){
            model.recipe = snapshot.val();
        });
    }

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
        model.notifyObservers("dataReady")
        model.addIngredient(1001, 200);
        model.addIngredient(1011, 2000);

      });
    };

    this.getIngredient = function(id){
        var tmp = model.data[model.dataIds.indexOf(id)];
        if(model.dataIds.indexOf(id) == -1){
            console.log("ingredient with id: " +id+ " does not exist, getting id 1001 instead")
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
        console.log(model.ingredientIds.indexOf(ingredient.id));
        if(model.ingredientIds.indexOf(ingredient.id) > -1){
            var tmp = model.recipe.ingredients[model.ingredientIds.indexOf(ingredient.id)]
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
        var index = ingredientIds.indexOf(id);
        model.recipe.ingredients[index].amount = amount;
        model.notifyObservers("changeAmount");
    };


    this.addObserver = function(obs){
        model.observers.push(obs);
    };

    this.notifyObservers = function(code){
        console.log("Notify obsevers: " + code)
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


    this.loadCsv("data/reduced.csv");

};