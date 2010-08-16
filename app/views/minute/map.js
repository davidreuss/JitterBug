function(doc) {
    // !code helpers/jitterbug.js
    var logtime = new Date(doc.unixtime*1000);
    
    var key = [
        doc.application,
        logtime.getFullYear(), 
        logtime.getMonth(), 
        logtime.getDate(), 
        logtime.getHours(),
        logtime.getMinutes(),
        get_doc_hash(doc)
    ];
    
    var key2 = [
        "*",
        logtime.getFullYear(), 
        logtime.getMonth(), 
        logtime.getDate(), 
        logtime.getHours(),
        logtime.getMinutes(),
        get_doc_hash(doc)
    ];
    
    emit(key, get_doc_browse_value(doc));
    emit(key2, get_doc_browse_value(doc));
};
