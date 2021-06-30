//*----------------*
//      init
//*----------------*
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

//*----------------*
//  user triggered
//*----------------*
function editFromDB() {
    console.log("Not Implemented");
}
function addToDB(json) {
    console.log("add to db " + json.metadata.order);
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
}
function removeFromDB() {
    console.log("Not Implemented");
}