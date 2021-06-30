let dropdown;
$("body").on("click touchend", ".three-dots", function(e) {
    e.stopPropagation();

    $("body").on("click touchend", function() {
        dropdown?.remove();
        $("body").off("click touchend", this);
    });

    dropdown?.remove();
    let parent = $(this).parent();
    dropdown = parent.prepend(generateDropdown(parent)).children()[0];
});

function addCellEvents(cell) {
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
            <a onclick="remindElmt(this)" href="javascript:void(0);">Reminder</a><br>
            <a onclick="editElmt(this)" href="javascript:void(0);">Edit</a><br> 
            <a onclick="deleteElmt(this)" href="javascript:void(0);" id="hoverRed">Delete</a><br> 
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
    console.log("Remove");
    
    const cell = $(element).closest("div")
    removeFromDB(cell.attr("meta-local_id"));
    cell.remove();
}