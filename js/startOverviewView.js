var StartOverviewView = function(container,model){
    var view = this;
    view.container = container;
    model.addObserver(this);

    var initialize = function(){
       view.container.append("div")
        .text("Welcome to Crazy Blends!")
        .classed("title", true)
        .style('font-size','50px');

        view.container.append("div").append("section");

        view.container.startBtn = view.container.append("button").classed('btn btn-success', true).text("start!");
        view.container.skipBtn = view.container.append("button").classed('btn btn-success', true).text("skip!");
    };

    initialize();

    this.update = function(){
        return
    };
};