function(head, req) {
    var List = require("vendor/couchapp/lib/list");
    
    provides("html", function() {
        var out = "<option value='*'></option>";
        while(row = getRow()) {
            if(row["key"][0] == "*") continue;
            if(req.query.selected == row["key"][0]) {
                var selected = ' selected="selected"';
            }else{
                var selected = '';
            }
            
            out += "<option"+selected+">"+row["key"][0]+"</option>";
        }
        return out;
    });
}