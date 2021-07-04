import { renderCells } from "./cell-creation.js"

//*----------------*
//      init
//*----------------*

//#region webSQL
/*
const db = openDatabase('DosecData', '1.0', 'Local storage for Dosec tasks.', 2 * 1024 * 1024);  

db.transaction(function populateDB(tx) {
    tx.executeSql("SELECT COUNT(*) FROM sqlite_master WHERE type='table' and name='cells'", [],
        function(tx, result) {
            if(result.rows[0]["COUNT(*)"]) // If cells exists
                return;
            tx.executeSql('CREATE TABLE cells (title, content, color DEFAULT BLACK, sorting_order, date_modified, date_created, local BOOLEAN DEFAULT TRUE)');
            
            //Check for Online DB
            
            //Insert Defaults if nothing found Online
            tx.executeSql('INSERT INTO cells (title, content, color, sorting_order, date_modified, date_created, local)' + 
                'VALUES ("Shortcuts:", "S -> Search \n N -> New \n D -> Sort by Date \n C -> Sort by Color \n O -> Sort by Order", "red", 1, ' + Date.now() + ', ' + Date.now() + ', false)');
            tx.executeSql('INSERT INTO cells (title, content, color, sorting_order, date_modified, date_created, local)' + 
                'VALUES ("Groups:", "Group cells together with #groupname and search for them in the searchbar", "red", 1, ' + Date.now() + ', ' + Date.now() + ', false)');
        },
        function(tx, error){
            console.error("DB error please contact me.");
        }
    );
});
*/
//#endregion

//#region indexedDB

// migration guide: https://www.w3.org/TR/IndexedDB/

function initDatabase() {

}

const request = indexedDB.open("dosec-data");
export let db;

request.onupgradeneeded = function() {
    // The database did not previously exist, so create object stores and indexes.
    const db = request.result;
    const store = db.createObjectStore("cells", { autoIncrement: true });
    const titleIndex = store.createIndex("by_title", "title");
    const contentIndex = store.createIndex("by_content", "content");
    const colorIndex = store.createIndex("by_color", "color");
    const sorting_orderIndex = store.createIndex("by_sorting_order", "sorting_order");
    const date_createdIndex = store.createIndex("by_date_created", "date_created");
    const date_modifiedIndex = store.createIndex("by_date_modified", "date_modified");
    const deviceIDIndex = store.createIndex("by_deviceID", "deviceID");
    const localIndex = store.createIndex("by_local", "local");
  
    // Populate with initial data.
    store.add({
        title: "Gruppierung", content: "Gruppierung durch #gruppenname und anderem", color: "green", 
        sorting_order: 0, date_created: "invalid", date_modified: "", deviceID: "none", local: true,
    });
    store.add({
        title: "Shortcuts", content: "S -> search \n N -> New \n D -> Sort by Date \n C -> Sort by Color \n O -> Sort by Order", color: "blue", 
        sorting_order: 1, date_created: "invalid", date_modified: "", deviceID: "none", local: true,
    });
};

request.onsuccess = function() {
    db = request.result;
    
    renderCells();
};

//#endregion


//*----------------*
//  user triggered
//*----------------*
function editFromDB() {
    console.log("Not Implemented");

    //use store store.put to update
}
export function addToDB(json) {
    return new Promise(function(resolve, reject) {
        const tx = db.transaction("cells", "readwrite");
        const store = tx.objectStore("cells");
    
        var response = store.add({
            title: json.title, content: json.content, color: json.color, 
            sorting_order: json.order, date_created: json.date_created, date_modified: json.date_modified, 
            deviceID: "Test", local: true,
        });

        response.onsuccess = function(event) {
            resolve(event.target.result);
        };
    });

    /*
    db.transaction((tx) => {
        
        tx.executeSql('INSERT INTO cells (title, content, color, sorting_order, date_modified, date_created, local)' + 
            'VALUES ( \
                "' + json.title + '", \
                "' + json.content + '", \
                "' + json.color + '", \
                ' + json.metadata.order + ', ' +
                json.metadata.date_modified + ', ' + 
                json.metadata.date_created + ', \
                false\
            )'
        );
    });
    */
}
export function removeFromDB(key) {
    const tx = db.transaction("cells", "readwrite");
    const store = tx.objectStore("cells");
    store.delete(parseInt(key));

    tx.oncomplete = function(event) {
        console.log("Deletion complete")
    };
}