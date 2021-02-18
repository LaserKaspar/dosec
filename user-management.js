var user_key = window.location.hash.substr(1);

if(user_key == "") {
    user_key = $("#user-key").val();
    history.pushState({}, null, "#" + user_key);
}
else {
    $("#user-key").val(user_key);
}

$(window).on('hashchange', function(){
    user_key = window.location.hash.substr(1);
    $("#user-key").val(user_key);
});
$("#user-key").on('change', function() {
    user_key = $(this).val();
    history.pushState({}, null, "#" + user_key);
});
