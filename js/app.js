$(function (){
    
    var model = new Model();
    

    var radarChartView = new RadarChartView(d3.select('.radarChartContainer'), model);
    var radarChartCtrl = new RadarChartCtrl(radarChartView, model);

    var tableView = new TableView(d3.select('.tableContainer'), model);
    var tableCtrl = new TableCtrl(tableView, model);
    
    var sunburstView = new SunburstView(d3.select('.sunburstContainer'), model);
    var sunburstCtrl = new SunburstCtrl(sunburstView, model);

    var searchView = new SearchView(d3.select('#searchContainer'), model);
    var searchCtrl = new SearchCtrl(searchView, model);
    
    //var mainView = new MainView();
    //var mainCtrl = new MainCtrl();
});