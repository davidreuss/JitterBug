function(head, req) {
    // !code helpers/json2.js
    
    var ddoc = this;
    var Mustache = require("lib/mustache");
    var List = require("vendor/couchapp/lib/list");
    var Path = require("vendor/couchapp/lib/path").init(req);
    
    provides("html", function() {
        
        var stash = {};
        stash.categories = [];
        stash.series = [];
        
        var map = {};
        
        while(row = getRow()) {
            var cat = row.key[1]+"-"+row.key[2]+"-"+row.key[3];
            if(row.key[5]) {
                cat = row.key[4];
            }
            
            if(!map[cat]) {
                map[cat] = 0;
            }
            
            if(req.query.unique == "true") {
                map[cat] += 1;
            }else{
                map[cat] += row.value.count;
            }
            
        }
        
        for(i in map) {
            stash.categories.push(i);
            stash.series.push(map[i]);
        }
        
        stash.categories.reverse();
        stash.series.reverse();
        
        stash.categories = JSON.stringify(stash.categories);
        stash.series = JSON.stringify(stash.series);
        
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
            return '';            
        }});
        stash.shows.push({value:"errors",label:"errors",selected:function() {
            return 'selected="selected"';
        }});
        
        stash.unique_checked = "";
        if(req.query.unique == "true")
            stash.unique_checked = 'checked="checked"';
        
        return Mustache.to_html(ddoc.templates.stats.errors, stash, ddoc.templates.partials);
    });
}