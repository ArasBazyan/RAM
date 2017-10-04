

//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var selectedGroups = [];



function hey(){
    alert("works");


    console.log(" GGG  " + selectedGroups);
}
$(document).ready(function() {


    $('#affectedTeams').multiselect({
        selectAllValue: 'multiselect-all',
        includeSelectAllOption: true,

        numberDisplayed: 3,
        buttonWidth: '300px',
        onChange: function(element, checked) {
            var brands = $('#affectedTeams option:selected');
            var selected = [];
            $(brands).each(function(index, brand){
                selected.push($(this).val());
            });


            console.log("selected teams " + selected);

            selectedGroups = selected;
        },
        onSelectAll: function() {
            alert('You selected all available teams!');
            var brands = $('#affectedTeams option:selected');
            var selected = [];
            $(brands).each(function(index, brand){
                selected.push($(this).val());
            });

            console.log("selected teams " + selected);

        }



    });






    $(function() {


        $("#selectSOP").datepicker({
            showAnim:'fadeIn',
            changeMonth: true,
            changeYear: true,
            showWeek: true,
            firstDay: 1
        });

        $(function() {

            $("#selectSOP").datepicker("option", "onSelect",
                function(value, date)
                { var week=$.datepicker.iso8601Week (
                    new Date(date.selectedYear,
                        date.selectedMonth,
                        date.selectedDay));
                    $(this).val(date.selectedYear+'-'+(week<10?'0':'')+week);

                }
            );

        });
    });




    $(".next").click(function(){
        //alert("hhhh");
        if(animating) return false;
        animating = true;

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale current_fs down to 80%
                scale = 1 - (1 - now) * 0.2;
                //2. bring next_fs from the right(50%)
                left = (now * 50)+"%";
                //3. increase opacity of next_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({
                    'transform': 'scale('+scale+')',
                    'position': 'absolute'
                });
                next_fs.css({'left': left, 'opacity': opacity});
            },
            duration: 500,
            complete: function(){
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });

    $(".previous").click(function(){
        if(animating) return false;
        animating = true;

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //de-activate current step on progressbar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + (1 - now) * 0.2;
                //2. take current_fs to the right(50%) - from 0%
                left = ((1-now) * 50)+"%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({'left': left});
                previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
            },
            duration: 500,
            complete: function(){
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });

    $(".submit").click(function(){
        console.log("MAGIC HAPPENS HERE!")
        return false;
    })











    $(".modal").each(function(l){$(this).on("show.bs.modal",function(l){var o=$(this).attr("data-easein");"shake"==o?$(".modal-dialog").velocity("callout."+o):"pulse"==o?$(".modal-dialog").velocity("callout."+o):"tada"==o?$(".modal-dialog").velocity("callout."+o):"flash"==o?$(".modal-dialog").velocity("callout."+o):"bounce"==o?$(".modal-dialog").velocity("callout."+o):"swing"==o?$(".modal-dialog").velocity("callout."+o):$(".modal-dialog").velocity("transition."+o)})});



});  // end of document readt











$(".modal").each(function(l){$(this).on("show.bs.modal",function(l){var o=$(this).attr("data-easein");"shake"==o?$(".modal-dialog").velocity("callout."+o):"pulse"==o?$(".modal-dialog").velocity("callout."+o):"tada"==o?$(".modal-dialog").velocity("callout."+o):"flash"==o?$(".modal-dialog").velocity("callout."+o):"bounce"==o?$(".modal-dialog").velocity("callout."+o):"swing"==o?$(".modal-dialog").velocity("callout."+o):$(".modal-dialog").velocity("transition."+o)})});