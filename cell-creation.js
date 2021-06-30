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
    console.log("test");
    $("#searchbar-search").focus().val($(this).text()).trigger("onkeyup");
});

function addCell(json, updateDB = true) {
    if(updateDB)
        addToDB(json);
    renderCell(json);
}

function renderCell(json) {
    let newCell = $(cell_handlebar(json));
    insertAndSort(newCell, json.order);
    addCellEvents(newCell); //cell-interactions.js
}

function insertAndSort($new, sortingOrder) {
    /*
        Thanks to: https://stackoverflow.com/questions/14495400/jquery-insert-div-at-right-place-in-list-of-divs#answer-14504086
        Boilerplate to check first/last value
    */
    if($(".handlebars").children().length == 0) {
        $(".handlebars").append($new);
        return;
    }

    const $first = $(".handlebars div:first");
    console.log($first.attr('data-sorting_order'));
    if (sortingOrder >= $first.attr('data-sorting_order')) {
        $new.insertBefore($first);
        console.log("first");
        return;
    }

    const $last = $(".handlebars div:last");
    console.log($last);
    if (sortingOrder <= $last.attr('data-sorting_order')) {
        $new.insertAfter($last);
        console.log("last");
        return;
    }
    /*-*/

    //Fun stuff
    let count = 0;
    let $div = $(".handlebars div");
    do {
        count++;
        console.log($div.length);
        var index = parseInt($div.length / 2)
        var $compare = $div.eq(index);
        var compare = $compare.attr('data-sorting_order');
        if (sortingOrder === compare) {
            break;
        }
        else if (sortingOrder < compare) {
            $div = $div.slice(index, $div.length);
        }
        else {
            console.log($compare.index());
            $div = $div.slice(0, index);
        }
        if (count > 100) {
            break;
        }
    }
    while ($div.length > 1);

    if (sortingOrder === compare || sortingOrder > compare) { $new.insertBefore($compare); }
    else { $new.insertAfter($compare); }
}

// "print" db to html
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