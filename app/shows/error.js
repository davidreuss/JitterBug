function(doc, req) {
    var ddoc = this;
    var Mustache = require("lib/mustache");
    var List = require("vendor/couchapp/lib/list");
    var Path = require("vendor/couchapp/lib/path").init(req);
    
    function prepare_content(doc) {
        if(doc.content) {
            if(!doc.language) doc.language = "plain";
            doc.first_line = 0;
            var content = "";
            for(var i in doc.content) {
                if(doc.first_line == 0) doc.first_line = i;
                content += doc.content[i] + "\n";
            }
            doc.content = content;
        }
        return doc;
    }
    
    doc = prepare_content(doc);
    
    for(i in doc.trace)
        doc.trace[i] = prepare_content(doc.trace[i]);
    
    function create_table(content) {
        var rows = [];
        for(var key in content) {
            if(typeof(content[key]) != "object") {
                rows.push({key:key, value:content[key]});
            }else{
                rows.push({key:key, value:create_table(content[key])});
            }
        }
        
        return Mustache.to_html(ddoc.templates.partials.table, {rows:rows}, ddoc.templates.partials);
    }
    
    var data = [];
    for(var key in doc.data)
        data.push({key: key.replace(/[\W]/gi, '_'), name:key, table:create_table(doc.data[key])})
    
    doc.data = data;
    
    return Mustache.to_html(ddoc.templates.error, doc, ddoc.templates.partials, List.send);
    
}