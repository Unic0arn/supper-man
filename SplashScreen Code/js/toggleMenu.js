$(document).ready(function () {
    var $answers = $('.answer');
    $(".dailyIntake").click(function () {
        var $ans = $(this).next(".answer").stop(true).slideToggle(100);
        $answers.not($ans).filter(':visible').stop(true).slideUp();
    })
});

function handleChange(input) {
    if (input.value < 0) input.value = 0;
  }

$("[type='number']").keypress(function (evt) {
    evt.preventDefault();
});

$(document).ready(function() {
	        // check cookie
	        var visited = $.cookie("visited")

	        if (visited == null) {
	            $('.splash').show();
	            $.cookie('visited', 'yes'); 
	            alert($.cookie("visited"));         
	        }

	        // set cookie
	        $.cookie('visited', 'yes', { expires: 1, path: '/' });
});