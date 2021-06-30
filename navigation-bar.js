
$(function() {

//#region mouseNav
var navbar = false;
$("body").on("mousemove", function(e) {
    if(userClickedButton)
        return;

    if(e.pageX < 30 && !navbar) {
        console.log("Side")

        navbar = true;
        $(".side")[0].scrollIntoView({behavior: "smooth", block: 'nearest', inline: 'end'});
        
        $(".pager.active").removeClass("active");
        $("#pager-side").addClass("active");
    }
    else if(e.pageX > $(".side")[0].offsetWidth + 20 && navbar) {
        navbar = false;
        $(".main")[0].scrollIntoView({behavior: "smooth", block: 'nearest', inline: 'end'});

        $(".pager.active").removeClass("active");
        $("#pager-main").addClass("active");
    }
    else if(e.pageX > window.innerWidth - 30 && navbar) {
        navbar = false;
        $(".main")[0].scrollIntoView({behavior: "smooth", block: 'nearest', inline: 'end'});

        $(".pager.active").removeClass("active");
        $("#pager-main").addClass("active");
    }
});

$(".side").mouseover(function() {
    userClickedButton = false;
});
$(".main").click(function() {
    console.log("Main Element clicked")
    navbar = false;
    userClickedButton = false;
    $(".main")[0].scrollIntoView({behavior: "smooth", block: 'nearest', inline: 'end'});
});
//#endregion

//#region Pagers
let userClickedButton = false;
$(".pager").on("click touchend", function(e) {
    let scrollPoint = "." + this.getAttribute('id').split("-")[1];


    if(scrollPoint == ".side") {
        userClickedButton = true;
        navbar = true;
    }
    else {
        userClickedButton = false;
        navbar = false;
    }

    $(scrollPoint)[0].scrollIntoView({behavior: "smooth", block: 'nearest', inline: 'end'});
    $(".pager.active").removeClass("active");
    $(this).addClass("active");
});
//#endregion

//#region searchBar
function filterSearch() {
    var input, filter, container, cell, a, i, txtValue;
    input = document.getElementById("searchbar-search");
    filter = input.value.toUpperCase();
    container = document.getElementsByClassName("handlebars")[0];
    cell = container.getElementsByClassName("cell");
    for (i = 0; i < cell.length; i++) {
        txtValue = cell[i].textContent || cell[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            cell[i].style.display = "";
        } else {
            cell[i].style.display = "none";
        }
    }
}
//#endregion

//#region colorExclude
var check_count = 0;
$(".color-checkbox").click(function() {
    if(this.checked) {
        if(check_count == 0) {
            $(".cell").addClass("hidden");
        }
        check_count++;

        $("." + this.getAttribute("id")).removeClass("hidden");
    }
    else {
        check_count--;
        if(check_count == 0) {
            $(".cell").removeClass("hidden");
        }
        else {
            $("." + this.getAttribute("id")).addClass("hidden");
        }
    }   
});
//#endregion

});