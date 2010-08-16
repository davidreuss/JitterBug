$(document).ready(function() {
    
    $(window).resize(function() {
        var error_list_height = $(window).height() - $("#header").outerHeight() - $("#searchbar").outerHeight() - $("#error_display").outerHeight();
        $("#error_list").height(error_list_height);
        if($("#error_display").height() == 0) {
            $("#spacebar").hide();
        }else{
            $("#spacebar").show();
        }
        $("#spacebar").offset({"top":$("#error_display").offset().top, "left":0});
        
        // make sure we scroll all the way!
        while(update_scroll()) {}
        
    });
    
    function update_scroll() {
        var soff = $("#error_list table tr.selected").offset();
        var trh = $("#error_list table tr:first").outerHeight();
        var elh = $("#error_list").height();
        if(elh < (trh * 3)) return false;
        if(soff != null) {
            soff = soff.top - $("#error_list").offset().top;
            if((soff + trh) > elh) {
                $("#error_list").scrollTop($("#error_list").scrollTop() + (elh / 2));
                return true;
            }
            if(soff < 0) {
                $("#error_list").scrollTop($("#error_list").scrollTop() - (elh / 2));
                return true;
            }
        }
        return false;
    }
    
    $('#error_list table tbody tr').click(function() {
        set_doc_in_url($(this).attr('id').substr(3));
    });
    
    $(document).keydown(function(e) {
        if(e.keyCode == 38) { // up
            var moveto = $("#error_list table tr.selected").prev().get(0);
            /*if(typeof(moveto) == "undefined")
                moveto = $("#error_list table tr:last").get(0);*/
        }
        if(e.keyCode == 40) { // down
            var moveto = $("#error_list table tr.selected").next().get(0);
            if($("#error_list table tr.selected").get().length == 0)
                moveto = $("#error_list table tr:first").get(0);
            /*if(typeof(moveto) == "undefined")
                moveto = $("#error_list table tr:first").get(0);*/
        }
        if(e.keyCode == 38 || e.keyCode == 40) {
            if(typeof(moveto) == "undefined") return;
            e.preventDefault();
            setSelected(moveto);
            if($("#error_display").height() > 0) {
                set_doc_in_url($(moveto).attr('id').substr(3));
            }
            $(window).resize();
        }
        if(e.keyCode == 13) { // return
            var doc = $("#error_list table tr.selected").attr("id");
            if(typeof(doc) != "undefined") {
                set_doc_in_url(doc.substr(3));
                $(window).resize();
            }
        }
        if(e.keyCode == 27) { // escape
            $("#error_display").height(0);
            $(window).resize();
        }
    });
    
    function set_doc_in_url(doc) {
        var url = location.href.split("#");
        url = url[0]+"#"+doc;
        location.href = url;
        load_doc();
    }
    
    function load_doc() {
        var url = location.href.split("#");
        if(url[1]) {
            setSelected($("#doc"+url[1]).get(0));
            $('#error_display').load('/error/'+url[1]);
            if($("#error_display").height() == 0) {
                var ed = $("#error_display");
                if(!ed.data("browse:height") == null) {
                    ed.height(ed.data("browse:height"));
                }else{
                    var height = $("#content").height() / 2;
                    ed.height(height);
                }
                $(window).resize();
            }
        }
    }
    
    function setSelected(el) {
        $('#error_list table tbody tr').removeClass("selected");
        $(el).addClass("selected");
    }
    
    $("#error_content ul.data-navigation a").live("click", function(event) {
        event.preventDefault();
        $("#error_content ul.data-navigation a").removeClass("selected");
        $(this).addClass("selected");
        $("#error_content .data").hide();
        $("#error_content .data-"+$(this).attr("name")).show();
    });
    
    $("#searchbar form").submit(function(e) {
        e.preventDefault();
        
        var period = $('#searchbar select[name="period"]').val();
        var summarize = $('#searchbar select[name="summarize"]').val();
        var application = $('#searchbar select[name="application"]').val();
        
        var url = "/browse/";
        if(application != "*") url += application+"/";
        url += period+"/";
        url += summarize+"/";
        
        var today = new Date();
        var startkey = '["'+application+'",'+today.getFullYear()+','+today.getMonth()+','+today.getDate()+',{}]';
        
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
            var endkey = '["'+application+'",'+enddate.getFullYear()+','+enddate.getMonth()+','+enddate.getDate()+']';
            url += "?startkey="+startkey+"&endkey="+endkey;
        }
        
        location.href = url;
    });
    
    // initialize
    $("#content").prepend('<div id="spacebar"></div>');
    $("#spacebar").draggable({"axis":"y","containment":"parent"})
                  .offset({"top":$("window").height()-$("#spacebar").outerHeight()})
                  .bind("drag", function() {
                      $("#error_display").height($(window).height() - $("#spacebar").offset().top);
                      $(window).resize();
                  })
                  .bind("dragstop", function() {
                      $(window).resize();
                  });
    
    $(window).resize();
    load_doc();
    
});