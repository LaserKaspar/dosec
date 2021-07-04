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

const editor_window = $("#overlay .edit-element");

$(".button#edit").on("click", function() { // save button

    let cell_json = {
        color: editor_window.find(".cell-color").val(),
        title: editor_window.find(".cell-title").val().trim(), 
        content: editor_window.find(".cell-content").val().trim(), 
        date_created: Date.now(), //if editing -> dont change
        date_modified: Date.now(),
    }
    if(cell_json.title || cell_json.content)
        addCell(cell_json);

    $("#overlay").addClass("animatable");
    closeAdd("#overlay");
});
$("#overlay").on("click", function() {
    closeAdd(this);
}).children().click(function(e) {e.stopPropagation();});

export function closeAdd(element) {
    if($(element).hasClass("triggered"))
        $(element).toggleClass("triggered");
    window.shortcutsAllowed = true;
    editor_window.delay(500).children("input, textarea").val(undefined);

    closeElement();
}