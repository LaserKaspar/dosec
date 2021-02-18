//mouse nav
var navbar = false;
$("body").on("mousemove", function(e) {
    if(userClickedButton)
        return;

    if(e.pageX < 30 && !navbar) {
        navbar = true;
        scrollPoint = ".side"
        $(scrollPoint)[0].scrollIntoView({behavior: "smooth", block: "start"});
        
        $(".pager.active").removeClass("active");
        $("#pager-side").addClass("active");
    }
    else if(e.pageX > $(".side")[0].offsetWidth + 20 && navbar) {
        navbar = false;
        scrollPoint = ".main"
        $(scrollPoint)[0].scrollIntoView({behavior: "smooth", block: "start"});

        $(".pager.active").removeClass("active");
        $("#pager-main").addClass("active");
    }
    else if(e.pageX > window.innerWidth - 30 && navbar) {
        navbar = false;
        scrollPoint = ".main"
        $(scrollPoint)[0].scrollIntoView({behavior: "smooth", block: "start"});

        $(".pager.active").removeClass("active");
        $("#pager-main").addClass("active");
    }
});

$(".side").mouseover(function() {
    userClickedButton = false;
});
$(".main").click(function() {
    navbar = false;
    userClickedButton = false;
    $(".main")[0].scrollIntoView({behavior: "smooth", block: "start"});
});

//Pagers
var userClickedButton = false;
var scrollPoint = ".main";
$(".pager").on("click touchend", function(e) {
    var scrollTo = "." + this.getAttribute('id').split("-")[1];

    if(scrollPoint == scrollTo)
        return
    else
        scrollPoint = scrollTo;

    if(scrollPoint == ".side") {
        userClickedButton = true;
        navbar = true;
    }
    else {
        userClickedButton = false;
        navbar = false;
    }

    $(scrollPoint)[0].scrollIntoView({behavior: "smooth", block: "start"});
    $(".pager.active").removeClass("active");
    $(this).addClass("active");
});

//search bar
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

//color exclude
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