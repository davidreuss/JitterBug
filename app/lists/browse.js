function(head, req) {
    // !code helpers/date.js
    
    var ddoc = this;
    var Mustache = require("lib/mustache");
    var List = require("vendor/couchapp/lib/list");
    var Path = require("vendor/couchapp/lib/path").init(req);
    
    provides("html", function() {
        
        var rows = [];
        var row;
        
        while(row = getRow()) {
            rows.push(row);
        }
        
        rows.sort(function(a, b) {
            if(req.query.descending && req.query.descending == "true") {
                return b['value']['unixtime'] - a['value']['unixtime'];
            }else{
                return a['value']['unixtime'] - b['value']['unixtime'];
            }
        });
        
        var stash = {};
        stash["logs"] = [];
        for(i in rows) {
            var row_stash = {};
            row_stash["id"]             = rows[i]['value']['id'];
            row_stash["count"]          = rows[i]['value']['count'];
            row_stash["unixtime"]       = rows[i]['value']['unixtime'];
            row_stash["date"]           = date("M j, Y", rows[i]['value']['unixtime']);
            row_stash["time"]           = date("H:i:s", rows[i]['value']['unixtime']);
            row_stash["resource"]       = rows[i]['value']['resource'];
            row_stash["message"]        = rows[i]['value']['message'];
            row_stash["application"]    = rows[i]['value']['application'];
            row_stash["type"]           = rows[i]['value']['type'];
            stash["logs"].push(row_stash);
        }
        
        var period = "last100";
        if(req.query.period)
            period = req.query.period;
        
        stash["periods"] = [];
        stash.periods.push({value:"last100",label:"last 100 logs",selected:function() {
            if(period == "last100") return 'selected="selected"';
        }});
        stash.periods.push({value:"today",label:"today",selected:function() {
            if(period == "today") return 'selected="selected"';
        }});
        stash.periods.push({value:"1week",label:"1 week",selected:function() {
            if(period == "1week") return 'selected="selected"';
        }});
        stash.periods.push({value:"1month",label:"1 month",selected:function() {
            if(period == "1month") return 'selected="selected"';
        }});
        
        var summarize = "hour";
        if(req.query.summarize)
            summarize = req.query.summarize;
        
        stash["summarize"] = [];
        stash.summarize.push({value:"minute",label:"minute",selected:function() {
            if(summarize == "minute") return 'selected="selected"';
        }});
        stash.summarize.push({value:"hour",label:"hour",selected:function() {
            if(summarize == "hour") return 'selected="selected"';
        }});
        stash.summarize.push({value:"day",label:"day",selected:function() {
            if(summarize == "day") return 'selected="selected"';
        }});
        
        stash["application"] = "*";
        if(req.query.application)
            stash["application"] = req.query.application;

        return Mustache.to_html(ddoc.templates.browse, stash, ddoc.templates.partials, List.send);
    });
    
    
};
