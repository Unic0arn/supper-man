var StartOverviewView = function(container,model){
    var view = this;
    view.container = container;
    model.addObserver(this);

    var initialize = function(){
        view.container.append("div")
        .text("Welcome to Crazy Blends!")
        .classed("title", true)
        .style('font-size','50px')
        .style('color','#ffa901');

        view.container.append("div")
        .text("Enter your personal data")
        .style('font-size','22px');

        view.container.append("br");
        view.container.append("br");

        //Gender
        view.container.append("input")
         .attr('type', 'radio')
         .attr('name','gender')
         .attr('value', 'male')
         .attr('id','genderMale');

        view.container.append('img')
            .attr('src','img/male.png')
            .attr('width','30')
            .attr('height','40');

        view.container.append("input")
         .attr('type', 'radio')
         .attr('name','gender')
         .attr('value', 'female')
         .attr('id','genderFemale');

        view.container.append('img')
            .attr('src','img/female.png')
            .attr('width','30')
            .attr('height','40');

        view.container.append("br");
        view.container.append("br");

        // Age
        view.container.append("text").text("Age: ").style('font-weight','bold').style('font-size','16px');

         view.container.append("input")
         .attr('type', 'number')
         .attr('id','ageInput')
         .attr('name','age')
         .attr('value','18')
         .attr('min','0')
         .style('width','40px');


        view.container.append("br");
        view.container.append("br");

        //Weight
        view.container.append("text").text("Weight(kg): ").style('font-weight','bold').style('font-size','16px');

         view.container.append("input")
         .attr('type', 'number')
         .attr('id','weightInput')
         .attr('name','weight')
         .attr('value','70')
         .attr('min','0')
         .style('width','40px');


        view.container.append("br");
        view.container.append("br");

        //Height
        view.container.append("text").text("Height(cm): ").style('font-weight','bold').style('font-size','16px');

         view.container.append("input")
         .attr('type', 'number')
         .attr('id','heightInput')
         .attr('name','height')
         .attr('value','170')
         .attr('min','0')
         .style('width','40px');

        view.container.append("br");
        view.container.append("br");

        //Exercise    

        view.container.append('text').text("Daily Exercise: ").style('font-weight','bold').style('font-size','16px');
        view.container.append("input").attr('type', 'radio').attr('name','exercise').attr('value', 'none').attr('id','exerciseNone');
        view.container.append('text').text("None ").style('font-size','14px');
        view.container.append("input").attr('type', 'radio').attr('name','exercise').attr('value', 'light').attr('id','exerciseLight');
        view.container.append('text').text("Light ").style('font-size','14px');
        view.container.append("input").attr('type', 'radio').attr('name','exercise').attr('value', 'moderate').attr('id','exerciseModerate');
        view.container.append('text').text("Moderate ").style('font-size','14px');
        view.container.append("input").attr('type', 'radio').attr('name','exercise').attr('value', 'heavy').attr('id','exerciseHeavy');
        view.container.append('text').text("Heavy ").style('font-size','14px');

        var buttonContainer = view.container.append('div').style('margin-top','50px');

        view.container.startBtn = buttonContainer.append("button").classed('btn btn-success', true).text("start!").style('margin','10px 10px');
        view.container.skipBtn = buttonContainer.append("button").classed('btn btn-success', true).text("skip!").style('margin','10px 10px');
    };

    initialize();

    this.update = function(){
        return
    };
};