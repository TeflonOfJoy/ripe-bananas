//Chat behaviour
var db_sender_name = ""
var db_sender_color = ""
var socket = null;
var banana_split_url = "https://banana-bread-36752c90e972.herokuapp.com/";

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
        initSocket();
    }
});

function initSocket() {
    socket = io(banana_split_url);

    socket.on('connect', () => {
        console.log('Connected to chat server');
        var current_room = $('#topic-label').text();
        
        socket.emit('join-room', {
            room: current_room,
            username: db_sender_name
        });
        
        // Load chat history via REST
        loadChatHistory(current_room);
    });

    socket.on('new-message', (msg) => {
        if (msg.username !== db_sender_name) {
            print_message(msg.message, msg.username, msg.colour || '#888888');
        }
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
}

function loadChatHistory(room) {
    axios.get(banana_split_url + '/api/chat/' + encodeURIComponent(room))
    .then(response => {
        if (response.data.success && response.data.data) {
            console.log('Loaded chat history:', response.data.count, 'messages');
            response.data.data.forEach(msg => {
                print_message(msg.message, msg.username, msg.colour || '#888888');
            });
        }
    })
    .catch(error => {
        console.error('Error loading chat history:', error);
    });
}

$('#name-selector-btn').on('click', async () => {
    var temp_sender_name = $('#sender-name-input').val();
    var temp_sender_color = $('#sender-color-input').val();
    var is_available = await checkNameAvailability(temp_sender_name);
    if( is_available == false || temp_sender_name == ''){
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
        initSocket();
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
    if (socket && socket.connected) {
        socket.emit('send-message', {
            room: $("#topic-label").text(),
            username: sender_name,
            message: message_text,
            colour: sender_color
        });
        print_message(message_text, sender_name, sender_color);
    } else {
        console.error('Socket not connected');
    }
}

function print_topic(topic_string){
    $("#topic-label").val(topic_string);
}

/* Checks availability of sender_name inside DB
 */
async function checkNameAvailability(sender_name) {
    try {
        var response = await axios.get(
            banana_split_url + '/api/chat/username/' + encodeURIComponent(sender_name)
        );
        return response.data.available;
    } catch (error) {
        console.error('Error checking username:', error);
        return true;
    }
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