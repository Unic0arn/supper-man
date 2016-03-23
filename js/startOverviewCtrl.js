var StartOverviewCtrl = function (view, model) {
  var debugging = false;
  model.addObserver(this);
  var ctrl = this;
    

  this.savePersonalData = function(savePersonalData){
    // code to get all the input values and save to the model!
    // Depending on bool, we either save personal data or store default data to the model!
    if(savePersonalData){
      console.log('Save personal data!');
      try{
      model.gender = d3.select('input[name="gender"]:checked').node().value;
        
      }catch(err){
        alert("Please select a gender");
        return false;
      }
      model.age = parseInt(d3.select('input[name="age"]').node().value);
      model.height = parseInt(d3.select('input[name="height"]').node().value);
      model.weight = parseInt(d3.select('input[name="weight"]').node().value);
      try{
      
      model.exercise = d3.select('input[name="exercise"]:checked').node().value;
        
      }catch(err){
        alert("Please select how much you exercise");
        return false;
      }
      model.personalData = true;

      model.calculateIntakeCalories();
      model.calculateIntakeProteins();
      model.calculateIntakeCarbs();
      model.calculateIntakeFats();

      model.notifyObservers('newRecipe');
      model.notifyObservers('getAllRecipes');
      return true;
    }else{
      console.log('save default data!');
      model.personalData = false;
      return true;
    }
  };

  view.container.startBtn.on('click', function(){
    if(ctrl.savePersonalData(true))
      $('#start-overView').fadeOut('fast');
  });
  view.container.skipBtn.on('click', function(){
    if(ctrl.savePersonalData(false))
      $('#start-overView').fadeOut('fast');
  });

  view.container.select('#ageInput').on('input',function(){
    view.container.select('#ageText').text("Age: " + this.value);
  });

  view.container.select('#weightInput').on('input',function(){
    view.container.select('#weightText').text("Weight (kg): " + this.value);
  });

  view.container.select('#heightInput').on('input',function(){
    view.container.select('#heightText').text("Height (cm): " + this.value);
  });

  this.update = function(){
    return;
  };
$(function(){
   if(debugging){
    $('#start-overView').fadeOut('fast'); 
    $('#splash').fadeOut('slow');
  }
});

  
};