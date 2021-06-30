$(".main")[0].scrollIntoView({behavior: "smooth", block: "start"});

$(".button#add").on("click", function() { // add new (/ edit) button
    $("#overlay").toggleClass("triggered");
    $("#overlay").addClass("animatable");
    $("#overlay .edit-element .cell-title").focus();

    window.shortcutsAllowed = false;
});
$(".button#edit").on("click", function() { // save button
    $("#overlay").toggleClass("triggered");
    $("#overlay").addClass("animatable");
    window.shortcutsAllowed = true;

    let editor_window = $("#overlay .edit-element");
    console.log(editor_window);
    let cell_json = {
        color: editor_window.find(".cell-color").val(),
        title: editor_window.find(".cell-title").val(), 
        content: editor_window.find(".cell-content").val(), 
        metadata: 
        {
            date_created: Date.now(), //if editing -> dont change
            date_modified: Date.now(), 
            uniqe_id: "qq_dd_bb", //generate with local Device id
            order: 1 //append
        }
    }

    addCell(cell_json);
});
$("#overlay").on("click", function() {
    $(this).toggleClass("triggered");
    window.shortcutsAllowed = true;
}).children().click(function(e) {e.stopPropagation();});

