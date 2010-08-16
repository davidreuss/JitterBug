$(document).ready(function() {
    
    $("#searchbar form").submit(function(e) {
        e.preventDefault();
        
        var period = $('#searchbar select[name="period"]').val();
        var show = $('#searchbar select[name="show"]').val();
        var unique = $('#searchbar input[name="unique"]:checked').val();
        //var application = $('#searchbar select[name="application"]').val();
        
        var url = "/stats/"+show+"/";
        url += period+"/";
        if(typeof(unique) != "undefined") {
            url += "unique/true/";
        }else{
            url += "unique/false/";
        }
        
        var today = new Date();
        var startkey = '["*",'+today.getFullYear()+','+today.getMonth()+','+today.getDate()+',{}]';
        
        switch(period) {
            case "today":
                var enddate = today;
                break;
            case "1week":
                var week = new Date();
                week.setDate(week.getDate() - 7);
                var enddate = week;
                break;
            case "1month":
                var month = new Date();
                month.setMonth(month.getMonth() - 1);
                var enddate = month;
                break;
        }
        
        if(typeof(enddate) != "undefined") {
            var endkey = '["*",'+enddate.getFullYear()+','+enddate.getMonth()+','+enddate.getDate()+']';
            url += "?startkey="+startkey+"&endkey="+endkey;
        }
        
        location.href = url;
    });
    
    
});