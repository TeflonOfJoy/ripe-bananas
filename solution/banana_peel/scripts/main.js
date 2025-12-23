//Chat behaviour
var db_sender_name = ""
var db_sender_color = ""

$(window).on('load' ,() => {
    db_sender_name = getCookie("sender_name");
    db_sender_color = getCookie("sender_color");

    console.log(db_sender_name, ',', db_sender_color);

    if(db_sender_name == ""){
        console.log("Cookie not found");
        $('#chat-input').addClass('d-none');
        $('#name-selector').removeClass('d-none');
    }else{
        console.log("Cookie found");
        $('#name-selector').addClass('d-none');
        $('#chat-input').removeClass('d-none');
    }
});

$('#name-selector-btn').on('click', () => {
    var temp_sender_name = $('#sender-name-input').val();
    var temp_sender_color = $('#sender-color-input').val();
    if( checkNameAvailability(temp_sender_name) == false || temp_sender_name == ''){
        console.log("invalid name");
        $('#sender-name-input').addClass("is-invalid");
        $('#sender-color-input').addClass("is-valid");
    }else{
        setCookie("sender_name", temp_sender_name);
        setCookie("sender_color", temp_sender_color);
        db_sender_name = temp_sender_name;
        db_sender_color = temp_sender_color;
        $('#name-selector').addClass('d-none');
        $('#chat-input').removeClass('d-none');
    }
});


$(document).keypress(function(e) {
    if(e.which != 13) return
    if($('#message-input').is(':focus') && $('#message-input').val().length > 0){
        message_text = $('#message-input').val();
        sender_color = db_sender_color
        sender_name = db_sender_name
        $('#message-input').val('');
        send_message(message_text, sender_name, sender_color);
    }
    //prevents the textarea to register the enter as a character
    return false;
});

$('#send-message').on('click', () => {
    //alert($('#message-input').val())
    if($('#message-input').val().length > 0){
        message_text = $('#message-input').val();
        sender_color = db_sender_color
        sender_name = db_sender_name
        $('#message-input').val('');
        send_message(message_text, sender_name, sender_color);
    }
})

/* Sends message to backend and on success prints in frontend
 */
function send_message(message_text, sender_name, sender_color) {
    /*TODO outcome must be set to false, set to true for frontend debugging purposes */
    var outcome = true; //set this to true when backend does return success
    //backend
    /* sanitize inputs */
    /* backend calls */

    //if backend doesnt fail ----> frontend
    if(outcome == true){
        print_message(message_text, sender_name, sender_color);
    }
}

function print_topic(topic_string){
    $("#topic-label").val(topic_string);
}

/* Checks availability of sender_name inside DB
 */
function checkNameAvailability(sender_name){
    //if found return true
    //if not found return false
    return true;
}

/* Prints a message in the DOM, all arguments are required or it won't work
 */
function print_message(message_text, sender_name, sender_color){
    var message_html = `<div class="message w-100 p-2 d-flex">
                        <span class="nickname fw-bold mb-0" style="color:${sender_color}">${sender_name}</span>
                        <i class="divider me-1 ms-1 mb-0">:</i>
                        <p class="message-content mb-0 text-break">${message_text}</p>
                    </div>`;
    
    $('#chat-body').append(message_html);
    $('#chat-body').animate({
        scrollTop : $('#chat-body').get(0).scrollHeight
    }, 0);
}


//Utilities
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