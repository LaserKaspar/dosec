import { db } from './manage-db.js'
import { addCellEvents } from './cell-interactions.js'
import { addToDB } from './manage-db.js'
import { magicGrid } from './magic-grid.js'

Handlebars.registerHelper('json', function(context) {return JSON.stringify(context);});
Handlebars.registerHelper('bothset', function(param1, param2) {return param1 != null && param1 != "" && param2 != null && param2 != "" ? "<br><br>" : ""});
Handlebars.registerHelper('parsecontent', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/#\S+/, "\n<span class='group'>$&</span>\n");
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});

const cell_handlebar = Handlebars.compile(document.getElementById("cell-handlebar").innerHTML);

$("body").on("click touchend", ".group", function(e) {
    $("#searchbar-search").focus().val($(this).text()).keyup();
});

export async function addCell(json) {
    addToDB(json).then((response) => {
        renderCell(
            json,
            response
        );
    })
}

async function renderCell(user_json, db_json) {
    let json = $.extend(user_json, db_json);

    let newCell = $(cell_handlebar(json));
    await insertAndSort(newCell, json.sorting_order);
    addCellEvents(newCell);

    magicGrid.positionItems();
}

function insertAndSort($new, sortingOrder) {
    /*
        Thanks to: https://stackoverflow.com/questions/14495400/jquery-insert-div-at-right-place-in-list-of-divs#answer-14504086
        Boilerplate to check first/last value
    */
    if($(".handlebars").children().length == 1) {
        $(".handlebars").append($new);
        return;
    }

    const $first = $(".handlebars .cell:first");
    if (sortingOrder <= $first.attr('data-sorting_order')) {
        console.log($first);
        $new.insertAfter($first);
        console.log(sortingOrder + " " + $first.attr('data-sorting_order'));
        return;
    }

    const $last = $(".handlebars .cell:last");
    if (sortingOrder >= $last.attr('data-sorting_order')) {
        $new.insertBefore($last);
        console.log("last");
        return;
    }
    /*-*/

    //Fun stuff
    let count = 0;
    let $div = $(".handlebars .cell");
    do {
        count++;
        var index = parseInt($div.length / 2)
        var $compare = $div.eq(index);
        var compare = $compare.attr('data-sorting_order');
        if (sortingOrder === compare) {
            console.log("break");
            break;
        }
        else if (sortingOrder > compare) {
            $div = $div.slice(index, $div.length);
        }
        else {
            console.log($compare.index());
            $div = $div.slice(0, index);
        }
        if (count > 1000) {
            break;
        }
    }
    while ($div.length > 1);

    if (sortingOrder === compare || sortingOrder > compare) { $new.insertAfter($compare); }
    else { $new.insertbefor($compare); }
}

// "print" db to html
export function renderCells() {
    const tx = db.transaction("cells", "readonly");
    let store = tx.objectStore("cells");

    store.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if(cursor) {
            renderCell(cursor.value, { local_id: cursor.primaryKey });
            cursor.continue();
        } else {
            console.log('Entries all displayed.');
            
            magicGrid.listen();
            magicGrid.positionItems();
        }
    };
}


/*
// WebSQL
db.transaction((tx) => {
    tx.executeSql("SELECT * FROM cells", [],
        function(tx, result) {
            for(var i = 0; i < result.rows.length; i++) {
                console.log(result.rows[i]);
                renderCell(result.rows[i])
            }
        },
        function(tx, error){
            console.error("DB error please contact me.");
        }
    );
});
*/
