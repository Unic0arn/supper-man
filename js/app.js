$(function (){
    
    var model = new Model();
    
    var startOverviewView = new StartOverviewView(d3.select('#start-overView'), model);
    var startOverviewCtrl = new StartOverviewCtrl(startOverviewView, model);

    var tableView = new TableView(d3.select('.tableContainer'), model);
    var tableCtrl = new TableCtrl(tableView, model);

    var nutritionChartView = new NutritionChartView(d3.select('.nutritionChartContainer'), model);
    var nutritionChartCtrl = new NutritionChartCtrl(nutritionChartView, model);
    
    var sunburstView = new SunburstView(d3.select('.sunburstContainer'), model);
    var sunburstCtrl = new SunburstCtrl(sunburstView, model);

    var searchView = new SearchView(d3.select('#searchContainer'), model);
    var searchCtrl = new SearchCtrl(searchView, model);
    
    //var mainView = new MainView();
    //var mainCtrl = new MainCtrl();
});