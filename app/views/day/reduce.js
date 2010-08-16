function(keys, values, rereduce) {
    var count = 0;
    var last_logtime = 0;
    var last_index = "";
    
    for(i in values) {
        var current_logtime = values[i].unixtime;
        if(current_logtime > last_logtime) {
            last_logtime = current_logtime;
            last_index = i;
        }
        count = count + values[i].count;
    }
    
    var return_value = values[i];
    return_value.count = count;
    
    return return_value;
}