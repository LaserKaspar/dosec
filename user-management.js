import { changeUserKey } from "./url-management.js";

export let user_key

user_key = window.location.search.substring(1);
console.log(user_key)

if(user_key == "") {
    user_key = $("#user-key").val();
    changeUserKey();
}
else {
    $("#user-key").val(user_key);
}

$("#user-key").on('change', function() {
    user_key = $(this).val();
    changeUserKey();
});
