$(function (){
    
    var model = new Model();
    
    var radarView = new RadarView();
    var radarCtrl = new RadarCtrl(model);
    
    var tableView = new TableView();
    var tableCtrl = new TableCtrl(model);
    
    var sunburstView = new SunburstView();
    var sunburstCtrl = new SunburstCtrl();
    
    var mainView = new MainView();
    var mainCtrl = new MainCtrl();
});