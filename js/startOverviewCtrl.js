var StartOverviewCtrl = function (view, model) {
  
  model.addObserver(this);
  var ctrl = this;
    

  this.savePersonalData = function(savePersonalData){
    // code to get all the input values and save to the model!
    // Depending on bool, we either save personal data or store default data to the model!
    if(savePersonalData){
      console.log('Save personal data!');
      model.gender = d3.select('input[name="gender"]:checked').node().value;
      model.age = parseInt(d3.select('input[name="age"]').node().value);
      model.height = parseInt(d3.select('input[name="height"]').node().value);
      model.weight = parseInt(d3.select('input[name="weight"]').node().value);
      model.exercise = d3.select('input[name="exercise"]:checked').node().value;
      model.personalData = true;

      model.calculateIntakeCalories();
      model.calculateIntakeProteins();
      model.calculateIntakeCarbs();
      model.calculateIntakeFats();

      model.notifyObservers('newRecipe');
    
    }else{
      console.log('save default data!');
      model.personalData = false;
    }
  };

  view.container.startBtn.on('click', function(){
    ctrl.savePersonalData(true);
    view.container.style('display','none'); 
  });
  view.container.skipBtn.on('click', function(){
    ctrl.savePersonalData(false);
    view.container.style('display','none');
  });

  this.update = function(){
    return;
  };

  
};