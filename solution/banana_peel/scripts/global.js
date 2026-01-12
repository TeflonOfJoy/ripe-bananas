const _api_base_address = "https://split-banana-88c30c01daf5.herokuapp.com/";

function fixnull(unfixed_string){
    if(unfixed_string == "null"){
        return "-";
    }else{
        return unfixed_string;
    }
}

function fixrating(rating){
    if(rating == "null"){
        return "-";
    }else if(rating.length == 1){
        return rating + ".0"
    }else if(rating.length > 3){
        return rating.substring(0,3);
    }else{
        return rating;
    }
}

function redirect_url(new_page){
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    var pathname = window.location.pathname;
    //console.log(protocol + "//" + hostname + (port ? ":" + port : "") + pathname + new_page);
    window.location.href = protocol + "//" + 
                            hostname + 
                            (port ? ":" + port : "") + 
                            //pathname + 
                            "/" +new_page;
}

function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}