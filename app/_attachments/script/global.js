$(document).ready(function() {
    $("#navigation li:last a").click(function(e) {
        e.preventDefault();
        var today = new Date();
        var startkey = '["*",'+today.getFullYear()+','+today.getMonth()+','+today.getDate()+',{}]';
        var endkey = '["*",'+today.getFullYear()+','+today.getMonth()+','+today.getDate()+']';
        location.href='/stats/applications/today/unique/false/?startkey='+startkey+'&endkey='+endkey;
    });
});