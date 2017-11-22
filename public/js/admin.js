

//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var selectedGroups = [];



function hey() {
alert("kkk");
}


    function setProjectID(projectID){
        var elementsProjectID = document.getElementsByClassName('projectID');
        for(let i = 0; i < elementsProjectID.length; i++){
            elementsProjectID[i].innerHTML = projectID;
        }
    }

function close(){
    window.close();
}

$(document).ready(function() {



            //this is an scrip that will be use down in the table
        $('#example').DataTable();
        //$('#examples').DataTable();

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });



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



    // Buildseries Milestones
    $('#buildSeries').multiselect({
        selectAllValue: 'multiselect-all',
        includeSelectAllOption: true,

        numberDisplayed: 3,
        buttonWidth: '200px',
        onChange: function(element, checked) {
            var brands = $('#buildSeries option:selected');
            var selected = [];
            $(brands).each(function(index, brand){
                selected.push($(this).val());
            });


            console.log("selected teams " + selected);

            selectedGroups = selected;
        },
        onSelectAll: function() {
            alert('You selected all available teams!');
            var brands = $('#buildSeries option:selected');
            var selected = [];
            $(brands).each(function(index, brand){
                selected.push($(this).val());
            });

            console.log("selected teams " + selected);

        }
    });



    // SW Milestones

    $('#SWMilestones').multiselect({
        selectAllValue: 'multiselect-all',
        includeSelectAllOption: true,

        numberDisplayed: 3,
        buttonWidth: '200px',
        onChange: function(element, checked) {
            var brands = $('#SWMilestones option:selected');
            var selected = [];
            $(brands).each(function(index, brand){
                selected.push($(this).val());
            });


            console.log("selected teams " + selected);

            selectedGroups = selected;
        },
        onSelectAll: function() {
            alert('You selected all available teams!');
            var brands = $('#SWMilestones option:selected');
            var selected = [];
            $(brands).each(function(index, brand){
                selected.push($(this).val());
            });

            console.log("selected teams " + selected);

        }
    });

/*
//  assign employee project name

    $('#projectName').multiselect({
        selectAllValue: 'multiselect-all',
        includeSelectAllOption: true,

        numberDisplayed: 3,
        buttonWidth: '200px',
        onChange: function(element, checked) {
            var brands = $('#projectName option:selected');
            var selected = [];
            $(brands).each(function(index, brand){
                selected.push($(this).val());
            });


            console.log("selected teams " + selected);

            selectedGroups = selected;
        },
        onSelectAll: function() {
            alert('You selected all available teams!');
            var brands = $('#projectName option:selected');
            var selected = [];
            $(brands).each(function(index, brand){
                selected.push($(this).val());
            });

            console.log("selected teams " + selected);

        }
    });
 //end of assign employee

*/

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



    // Calc deadline datepicker
    $(function() {
        $("#calcDeadline").datepicker({
            showAnim:'fadeIn',
            changeMonth: true,
            changeYear: true,
            showWeek: true,
            firstDay: 1
        });

        $(function() {

            $("#calcDeadline").datepicker("option", "onSelect",
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

        var projname = $("#projectName").val();
        var sop = $( "#selectSOP").val();
        var projectDescription = $( "#projectDescription").val();
        var calcDeadline = $( "#calcDeadline").val();
        selectedGroups

        insertProject(projname,projectDescription,  sop, calcDeadline);



        console.log("MAGIC HAPPENS HERE!" + projname + sop + projectDescription  + calcDeadline + selectedGroups);
        return false;
    })











    $(".modal").each(function(l){$(this).on("show.bs.modal",function(l){var o=$(this).attr("data-easein");
    "shake"==o?$(".modal-dialog").velocity("callout."+o):"pulse"==o?$(".modal-dialog").velocity("callout."+o):
        "tada"==o?$(".modal-dialog").velocity("callout."+o):"flash"==o?$(".modal-dialog").
        velocity("callout."+o):"bounce"==o?$(".modal-dialog").velocity("callout."+o):
            "swing"==o?$(".modal-dialog").velocity("callout."+o):$(".modal-dialog").
            velocity("transition."+o)})});



});  // end of document readt











$(".modal").each(function(l){$(this).on("show.bs.modal",function(l){var o=$(this).attr("data-easein");
"shake"==o?$(".modal-dialog").velocity("callout."+o):"pulse"==o?$(".modal-dialog").velocity("callout."+o):
    "tada"==o?$(".modal-dialog").velocity("callout."+o):"flash"==o?$(".modal-dialog").
    velocity("callout."+o):"bounce"==o?$(".modal-dialog").velocity("callout."+o):
        "swing"==o?$(".modal-dialog").velocity("callout."+o):$(".modal-dialog").velocity("transition."+o)})});
