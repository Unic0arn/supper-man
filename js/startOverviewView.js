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
        var ageDiv = view.container.append("div").text("Age: ").style('font-weight','bold').style('font-size','20px');

         ageDiv.append("input")
         .attr('type', 'number')
         .attr('id','ageInput')
         .attr('name','age')
         .attr('value','18')
         .attr('min','0')
         .style('width','60px');

       var ageText = view.container.append("div");
        $("#ageInput").keypress(function(e) {
            ageText.text('');
            if (String.fromCharCode(e.which).match(/[^A-Za-z0-9_ ]/)) {
                e.preventDefault();
                ageText.text("Special characters are not allowed. Use only numbers.").style('font-size','17px');
           }
        });

        view.container.append("br");
        view.container.append("br");

        //Weight
        var weightDiv = view.container.append("div").text("Weight(kg): ").style('font-weight','bold').style('font-size','20px');

         weightDiv.append("input")
         .attr('type', 'number')
         .attr('id','weightInput')
         .attr('name','weight')
         .attr('value','70')
         .attr('min','0')
         .style('width','60px');

         var weightText = view.container.append("p");
         $("#weightInput").keypress(function(e) {
            weightText.text('');
            if (String.fromCharCode(e.which).match(/[^A-Za-z0-9_ ]/)) {
                e.preventDefault();
                weightText.text("Special characters are not allowed. Use only numbers.").style('font-size','17px');
           }
        });


        view.container.append("br");
        view.container.append("br");

        //Height
        var heightDiv = view.container.append("div").text("Height(cm): ").style('font-weight','bold').style('font-size','20px');

         heightDiv.append("input")
         .attr('type', 'number')
         .attr('id','heightInput')
         .attr('name','height')
         .attr('value','170')
         .attr('min','0')
         .style('width','60px');

         var heightText = view.container.append("p");
         $("#heightInput").keypress(function(e) {
            heightText.text('');
            if (String.fromCharCode(e.which).match(/[^A-Za-z0-9_ ]/)) {
                e.preventDefault();
                heightText.text("Special characters are not allowed. Use only numbers.").style('font-size','17px');
            }
        });

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

        var buttonContainer = view.container.append('div').classed('wrap', true).style('margin-top','50px');

        view.container.startBtn = buttonContainer.append("button").classed('btn btn-success submitBtn', true).text("Submit!");
        view.container.skipBtn = buttonContainer.append("button").classed('btn btn-default skipBtn', true).text("Use average values");
    
    };

    initialize();

    this.update = function(){
        return
    };
};