import { closeElement } from "./url-management.js";
import { closeAdd } from "./cell-new-edit.js"

window.shortcutsAllowed = true;

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        $(':focus').blur();

        switch (window.location.hash) {
            case "#add":
                closeAdd("#overlay");
                break;
            default:
                $(".pager").not(".active").click();
                break;
        }

        closeElement();
        return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
        switch (window.location.hash) {
            case "#add":
                $(".button#edit").click();
        }

        return;
    }

    if(!window.shortcutsAllowed) return;

    if (event.ctrlKey && event.key === 'z') {
        console.log("strg z");
    }
    else if (event.key === 'n') {
        console.log("new element");
        $("#add").click();
        event.preventDefault();
    }
    else if (event.ctrlKey && event.key === 'f') {
        console.log("search");
        event.preventDefault();
        $("#searchbar-search").trigger("focus");
    }
    else if (event.key === 'd') {
        console.log("sort by date");
    }
    else if (event.key === 'c') {
        console.log("sort by color");
    }
    else if (event.key === 'o') {
        console.log("sort by order");
    }
});

