function(head, req) {
    var ddoc = this;
    var Mustache = require("lib/mustache");
    var List = require("vendor/couchapp/lib/list");
    var Path = require("vendor/couchapp/lib/path").init(req);
    
    provides("html", function() {
        
        var total = {};
        
        while(row = getRow()) {
            if(req.query.unique && req.query.unique == "true") {
                if(!total[row.value.application])
                    total[row.value.application] = {};
                total[row.value.application][row.key.pop()] = 1
            } else {
                if(!total[row.value.application])
                    total[row.value.application] = 0;
                total[row.value.application] = total[row.value.application] + row.value.count;
            }
        }
        
        if(req.query.unique && req.query.unique == "true") {
            for(i in total) {
                var length = 0;
                for(ii in total[i])
                    length = length + 1;
                total[i] = length;
            }
        }
        
        var stash = {"total":[]};
        stash.total.push({application:"other",count:0,percent:0});
        for(i in total) {
            var percent = Math.round(((100 / sum(total)) * total[i])*10)/10;
            if(percent < 2) {
                stash.total[0]['count'] = stash.total[0]['count'] + total[i];
                stash.total[0]['percent'] = stash.total[0]['percent'] + percent;
            } else {
                stash.total.push({application:i,count:total[i],percent:percent});
            }
        }
        
        if(stash.total[0]['count'] == 0)
            stash.total.shift();
        
        stash.total.reverse();
        
        var period = "today";
        if(req.query.period)
            period = req.query.period;
        
        stash["periods"] = [];
        stash.periods.push({value:"today",label:"today",selected:function() {
            if(period == "today") return 'selected="selected"';
        }});
        stash.periods.push({value:"1week",label:"1 week",selected:function() {
            if(period == "1week") return 'selected="selected"';
        }});
        stash.periods.push({value:"1month",label:"1 month",selected:function() {
            if(period == "1month") return 'selected="selected"';
        }});
        
        stash["shows"] = [];
        stash.shows.push({value:"applications",label:"applications",selected:function() {
            return 'selected="selected"';
        }});
        stash.shows.push({value:"errors",label:"errors",selected:function() {
            return '';
        }});
        
        stash.unique_checked = "";
        if(req.query.unique == "true")
            stash.unique_checked = 'checked="checked"';
        
        return Mustache.to_html(ddoc.templates.stats.applications, stash, ddoc.templates.partials);
    });
}