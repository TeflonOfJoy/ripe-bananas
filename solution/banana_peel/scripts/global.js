const _api_base_address = "https://split-banana-88c30c01daf5.herokuapp.com/";

$('#main-search-button').on('click', () => {
    //If #main-search-bar is focused and user presses ENTER, it triggers like a click
    if($('#main-search-bar').val().length > 0){
        var search = get_search_values();
        var search_hash = "/" + search.type + "/" + search.term;
        redirect_search(search_hash);
    }
    return;
});

function get_search_values(){
    return {
        term : $('#main-search-bar').val(),
        type : $('#search-type').val()
    };
}

function redirect_search(search_term) {
    redirect_url("search/#" + search_term);
}

function fixnull(unfixed_string){
    if(unfixed_string == "null"){
        return "-";
    }else{
        return unfixed_string;
    }
}

function fixdate(date){
    var fixed_date = new Date(date);
    return fixed_date;
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

function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function rand_color() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}