import { removeFromDB } from './manage-db.js'

let dropdown;
$("body").on("click touchend", ".three-dots", function(e) {
    e.stopPropagation();

    $("body").on("click touchend", unbind);
    function unbind(e) {
        $("body").off("click touchend", unbind);
        dropdown?.remove();
        console.log($(e.target).closest("div"));
    }

    dropdown?.remove();
    let parent = $(this).parent();
    dropdown = parent.prepend(generateDropdown(parent)).children()[0];

    let anchors = $(dropdown).children("a");

    $(anchors[0]).on("click touchend", (e) => { remindElmt(this) });
    $(anchors[1]).on("click touchend", (e) => { editElmt(this) });
    $(anchors[2]).on("click touchend", (e) => { deleteElmt(this) });
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
    console.log("Removeing: " + element);
    
    const cell = $(element).closest("div")
    console.log("Removeing: " + cell);
    
    removeFromDB(cell.attr("meta-local_id"));
    cell.remove();
}