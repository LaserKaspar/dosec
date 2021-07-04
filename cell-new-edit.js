import { addElement, closeElement } from './url-management.js';
import { addCell } from './cell-creation.js'

$(".main")[0].scrollIntoView({behavior: "smooth", block: "start"});

$(".button#add").on("click", function() { // add new (/ edit) button
    $("#overlay").toggleClass("triggered");
    $("#overlay").addClass("animatable");
    $("#overlay .edit-element .cell-title").focus();
    addElement();

    window.shortcutsAllowed = false;
});
$(".button#edit").on("click", function() { // save button
    $("#overlay").addClass("animatable");
    closeAdd("#overlay");

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
    closeAdd(this);
}).children().click(function(e) {e.stopPropagation();});

function closeAdd(element) {
    if($(element).hasClass("triggered"))
        $(element).toggleClass("triggered");
    window.shortcutsAllowed = true;
    closeElement();
}