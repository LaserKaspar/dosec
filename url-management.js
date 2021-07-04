import { user_key } from "./user-management.js";

export function changeUserKey() {
    history.pushState({}, null, "?" + user_key);
}

export function closeElement() {
    history.pushState({}, "Dosec", "?" + user_key);
    document.title = "Dosec"
}

export function addElement() {
    history.pushState({}, "Dosec - Add Element", "#add");
    document.title = "Dosec - Add Element"
}

export function editElement(element_id) {
    history.pushState({}, "Dosec - Edit Element", "?#edit/" + element_id);
    document.title = "Dosec - Edit Element"
}

//Hash Changed
$( window ).on( 'hashchange', () => {urlShortcuts()});

//Page Loaded Completely
$(() => {urlShortcuts()});

function urlShortcuts() {
    $("#overlay").click();
    switch (window.location.hash) {
        case "#add":
            $("#add").click();
            document.title = "Dosec - Add Element"
    }
}


window.addEventListener('load', function() {
    window.history.pushState({ noBackExitsApp: true }, '')
})
  
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.noBackExitsApp) {
        window.history.pushState({ noBackExitsApp: true }, '')
    }
})