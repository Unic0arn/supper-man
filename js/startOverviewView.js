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

        var gender = view.container.append("div").classed("genderInput",true).attr("title","Please select a gender");
        //Gender
        gender.append("input")
         .attr('type', 'radio')
         .attr('name','gender')
         .attr('value', 'male')
         .attr('id','genderMale');

        gender.append('img')
            .attr('src','img/male.png')
            .attr('width','30')
            .attr('height','40');

        gender.append('img')
            .attr('src','img/female.png')
            .attr('width','30')
            .attr('height','40');

        gender.append("input")
         .attr('type', 'radio')
         .attr('name','gender')
         .attr('value', 'female')
         .attr('id','genderFemale');

        view.container.append("br");
        view.container.append("br");

        // Age
        var ageDiv = view.container.append("div").classed("ageInputDiv",true).style('font-weight','bold').style('font-size','20px');

        var ageText = ageDiv.append("div").attr('id',"ageText").text("Age: 18");
        var ageSelector = ageDiv.append("input")
         .attr('type', 'range')
         .attr('id','ageInput')
         .attr('name','age')
         .attr('value','18')
         .attr('min','0')
         .attr('max','100')
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
         .attr('value','70')
         .attr('min','30')
         .attr('max','150')
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
         .attr('value','170')
         .attr('min','100')
         .attr('max','210')
         .attr('step','1')
         .style('width','400px')
         .style('margin','auto')
         .style('margin-top','15px');

        view.container.append("br");
        view.container.append("br");

        //Exercise    

        view.container.append('text').text("Daily Exercise: ").style('font-weight','bold').style('font-size','20px');
        view.container.append("input").attr('type', 'radio').attr('name','exercise').attr('value', 'none').attr('id','exerciseNone');
        view.container.append('text').text("None ").style('font-size','18px');
        view.container.append("input").attr('type', 'radio').attr('name','exercise').attr('value', 'light').attr('id','exerciseLight');
        view.container.append('text').text("Light ").style('font-size','18px');
        view.container.append("input").attr('type', 'radio').attr('name','exercise').attr('value', 'moderate').attr('id','exerciseModerate');
        view.container.append('text').text("Moderate ").style('font-size','18px').style('color','black');
        view.container.append("input").attr('type', 'radio').attr('name','exercise').attr('value', 'heavy').attr('id','exerciseHeavy');
        view.container.append('text').text("Heavy ").style('font-size','18px');

        var buttonContainer = view.container.append('div').classed('wrap', true).style('margin','auto').style('margin-top','25px');

        view.container.startBtn = buttonContainer.append("button").classed('btn btn-success submitBtn', true).text("Submit!");
        view.container.skipBtn = buttonContainer.append("button").classed('btn btn-default skipBtn', true).text("Use average values");
    
    };

    initialize();

    this.update = function(){
        return
    };
};