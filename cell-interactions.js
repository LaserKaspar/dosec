import { removeFromDB } from './manage-db.js'

let dropdown;
$("body").on("click touchend", ".three-dots", function(e) {
    e.stopPropagation();

    dropdown?.remove();

    $("body").on("click touchend", unbind);
    function unbind(e) {
        $("body").off("click touchend", unbind);
        dropdown?.remove();
    }

    let parent = $(this).parent();
    dropdown = parent.prepend(generateDropdown(parent)).children()[0];

    let anchors = $(dropdown).children("a");

    $(anchors[0]).on("click touchend", (e) => { remindElmt(dropdown) });
    $(anchors[1]).on("click touchend", (e) => { editElmt(dropdown) });
    $(anchors[2]).on("click touchend", (e) => { deleteElmt(dropdown) });
});

export function addCellEvents(cell) {
    /*
    $.data(cell, "foo", 52);

    cell.on("touchstart", (e) => {
        e.stopPropagation();
        console.log("down");
    });
    cell.on("mousedown", (e) => {
        console.log("down");
    });

    cell.on("touchmove", (e) => {
        e.stopPropagation();
        console.log("move");
    });
    cell.on("mousemove", (e) => {
        console.log("move");
    });

    cell.on("touchsend", (e) => {
        e.stopPropagation();
        console.log("up");
    });
    cell.on("mouseup", (e) => {
        console.log("up");
    });

    cell.on("contextmenu", function() {
        console.log("right");
    });
    */
}

function generateDropdown(parent) {
    return `
        <span class=\"cell-dropdown\">
            <a href="javascript:void(0);">Reminder</a><br>
            <a href="javascript:void(0);">Edit</a><br> 
            <a href="javascript:void(0);" id="hoverRed">Delete</a><br> 
        </span>
    `
}

function remindElmt(element) {
    console.log("not Implemented");
}

function editElmt(element) {
    console.log("not Implemented");
}

function deleteElmt(element) {
    const cell = $(element).closest(".cell");
    removeFromDB(cell.attr("data-local_id"));
    cell.remove();
}