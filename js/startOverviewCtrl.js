var StartOverviewCtrl = function (view, model) {
  
  model.addObserver(this);
  var ctrl = this;
    

  this.savePersonalData = function(savePersonalData){
    // code to get all the input values and save to the model!
    // Depending on bool, we either save personal data or store default data to the model!
    if(savePersonalData){
      console.log('Save personal data!');
    }else{
      console.log('save default data!');
    }
  };

  view.container.startBtn.on('click', function(){
    ctrl.savePersonalData(true);
    view.container.style('display','none');
    var genderMale = document.getElementById("genderMale").value;
    console.log(genderMale);
    var genderFemale = document.getElementById("genderFemale").value;
    console.log(genderFemale);
    var age = document.getElementById("ageInput").value;
    console.log(age);
    var height = document.getElementById("heightInput").value;
    console.log(height);
    var weight = document.getElementById("weightInput").value;
    console.log(weight);
    var exercise = document.getElementById("exerciseInput").value;
    console.log(exercise);
    model.age = age;
    
 
  });
  view.container.skipBtn.on('click', function(){
    ctrl.savePersonalData(false);
    view.container.style('display','none');
  });

  this.update = function(){
    return;
  };

  
};