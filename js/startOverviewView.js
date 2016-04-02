var StartOverviewView = function(container,model){
    var view = this;
    view.container = container;
    model.addObserver(this);

    var initialize = function(){
        view.container.append("div")
        .text("SMOOTHLY")
        .classed("title", true)
        .style('margin-top','5%')
        .style('font-size','50px')
        .style('color','#ffa901');

        view.container.append("div")
        .text("Enter your personal data")
        .style('font-size','22px')
        .style('color','black')
        .style('margin-top','3%');

        view.container.append("br");
        view.container.append("br");

        var gender = view.container.append("div").classed("genderInput",true).attr("title","Please select a gender").attr("name","gender");
        //Gender
        var male = gender.append("button")
            //.attr('value', 'male')
            .attr('id','genderMale')
            .classed("btn btnGender", true)
            .style("margin-right","10px");

        male.append('img')
            .attr('src','img/male.png')
            .attr('height','40');

        var female = gender.append("button")
            //.attr('value', 'female')
            .attr('id','genderFemale')
            .classed("btn btnGender", true)
            .style("margin-left","10px");

        female.append('img')
            .attr('src','img/female.png')
            .attr('height','40');



        view.container.append("br");
        view.container.append("br");

        // Age
        var ageDiv = view.container.append("div").classed("ageInputDiv",true).style('font-weight','bold').style('font-size','20px');

        var ageText = ageDiv.append("div").attr('id',"ageText").text("Age: 18");
        var ageSelector = ageDiv.append("input")
         .attr('type', 'range')
         .attr('id','ageInput')
         .attr('name','age')
         .attr('min','0')
         .attr('max','100')
         .attr('value','18')
         .attr('step','1')
         .style('width','400px')
         .style('margin','auto')
         .style('margin-top','15px');

       

        view.container.append("br");
        view.container.append("br");

        //Weight
        var weightDiv = view.container.append("div").style('font-weight','bold').style('font-size','20px');

        var weightText = weightDiv.append("div").attr('id',"weightText").text("Weight (kg): 70");
        var weightSelector = weightDiv.append("input")
         .attr('type', 'range')
         .attr('id','weightInput')
         .attr('name','weight')
         .attr('min','30')
         .attr('max','150')
         .attr('value','70')
         .attr('step','1')
         .style('width','400px')
         .style('margin','auto')
         .style('margin-top','15px');


        view.container.append("br");
        view.container.append("br");

        //Height
        var heightDiv = view.container.append("div").style('font-weight','bold').style('font-size','20px');

        var heightText = heightDiv.append("div").attr('id',"heightText").text("Height (cm): 170");
        var heightSelector = heightDiv.append("input")
         .attr('type', 'range')
         .attr('id','heightInput')
         .attr('name','height')
         .attr('min','100')
         .attr('max','210')
         .attr('value','170')
         .attr('step','1')
         .style('width','400px')
         .style('margin','auto')
         .style('margin-top','15px');

        view.container.append("br");
        view.container.append("br");

        var exerciseDiv = view.container.append("div").style('font-weight','bold').style('font-size','20px');

        var exerciseText = exerciseDiv.append("div").attr('id',"exerciseText").text("Daily Exercise: None");
        var exerciseSelector = exerciseDiv.append("input")
         .attr('type', 'range')
         .attr('id','exerciseInput')
         .attr('name','exercise')
         .attr('value','0')
         .attr('min','0')
         .attr('max','3')
         .attr('step','1')
         .style('width','400px')
         .style('margin','auto')
         .style('margin-top','15px');

        var buttonContainer = view.container.append('div').classed('wrap', true).style('margin','auto').style('margin-top','25px');

        view.container.startBtn = buttonContainer.append("button").classed('btn btn-success submitBtn', true).text("Submit!");
        view.container.skipBtn = buttonContainer.append("button").classed('btn btn-default skipBtn', true).text("Use average values");
    
    };

    initialize();

    this.update = function(){
        return
    };
};