$(".main")[0].scrollIntoView({behavior: "smooth", block: "start"});

$(".button#add").on("click", function() { // add new (/ edit) button
    $("#overlay").toggleClass("triggered");
    $("#overlay").addClass("animatable");
    $("#overlay .edit-element .header").focus();

    window.shortcutsAllowed = false;
});
$(".button#edit").on("click", function() { // save button
    $("#overlay").toggleClass("triggered");
    $("#overlay").addClass("animatable");
    window.shortcutsAllowed = true;
});
$("#overlay").on("click", function() {
    $(this).toggleClass("triggered");
    window.shortcutsAllowed = true;
}).children().click(function(e) {e.stopPropagation();});

