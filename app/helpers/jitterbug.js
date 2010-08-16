// !code helpers/md5.js

function get_doc_hash(doc) {
    return hex_md5(doc.application+doc.resource+doc.type+doc.code+doc.file+doc.line+doc.message);
}

function get_doc_browse_value(doc) {
    return {
        "unixtime"      : doc.unixtime,
        "id"            : doc._id,
        "count"         : 1,
        "application"   : doc.application,
        "resource"      : doc.resource,
        "type"          : doc.type,
        "message"       : doc.message
    };
}