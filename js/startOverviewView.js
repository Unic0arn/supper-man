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
         .attr('type', 'button')
         .attr('id','minusAge')
         .attr('value','-')
         .attr('onClick','ageInput.value = Math.max(0,(ageInput.value-1))');

         view.container.append("input")
         .attr('type', 'button')
         .attr('id','ageInput')
         .attr('name','age')
         .attr('value','18')
         .attr('min','0')
         .style('width','30px');

        view.container.append("input")
         .attr('type', 'button')
         .attr('id','plusAge')
         .attr('value','+')
         .attr('onClick','ageInput.value = Math.max(0,(+ageInput.value+1))');

        view.container.append("br");
        view.container.append("br");

        //Weight
        view.container.append("text").text("Weight(kg): ").style('font-weight','bold').style('font-size','16px');
         view.container.append("input")
         .attr('type', 'button')
         .attr('id','minusWeight')
         .attr('value','-')
         .attr('onClick','weightInput.value = Math.max(0,(weightInput.value-1))');

         view.container.append("input")
         .attr('type', 'button')
         .attr('id','weightInput')
         .attr('name','weight')
         .attr('value','70')
         .attr('min','0')
         .style('width','30px');

        view.container.append("input")
         .attr('type', 'button')
         .attr('id','plusWeight')
         .attr('value','+')
         .attr('onClick','weightInput.value = Math.max(0,(+weightInput.value+1))');

        view.container.append("br");
        view.container.append("br");

        //Height
        view.container.append("text").text("Height(cm): ").style('font-weight','bold').style('font-size','16px');
         view.container.append("input")
         .attr('type', 'button')
         .attr('id','minusHeight')
         .attr('value','-')
         .attr('onClick','heightInput.value = Math.max(0,(heightInput.value-1))');

         view.container.append("input")
         .attr('type', 'button')
         .attr('id','heightInput')
         .attr('name','weight')
         .attr('value','170')
         .attr('min','0')
         .style('width','30px');

        view.container.append("input")
         .attr('type', 'button')
         .attr('id','plusHeight')
         .attr('value','+')
         .attr('onClick','heightInput.value = Math.max(0,(+heightInput.value+1))');

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




        


        view.container.append("div").append("section");

        view.container.startBtn = view.container.append("button").classed('btn btn-success', true).text("start!");
        view.container.skipBtn = view.container.append("button").classed('btn btn-success', true).text("skip!");
    };

    initialize();

    this.update = function(){
        return
    };
};