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
  });
  view.container.skipBtn.on('click', function(){
    ctrl.savePersonalData(false);
    view.container.style('display','none');
  });

  this.update = function(){
    return;
  };
};