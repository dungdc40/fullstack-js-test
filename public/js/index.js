const logoutTime = 300; // time in active;
let lastActivityTime = null;

$(document).ready(function () {
    lastActivityTime = new Date().getTime();
    
    // listen on action pressenter on input box
    $('input').keyup((e) => {
	if(e.keyCode == 13)
	{
	    sendMessage();
	}
    });
    
    // click send button
    $('button.btn-send').click(() => {
	sendMessage();
    });
    
    // logout
    $('a#btn-logout').click((e) => {
	e.preventDefault();
	$('form#logout').submit();
    });
    
    // remove my message
    $('#demo-chat-body').on('click', '.remove-message', (e) => {
	let time = $(e.target).attr('data-time');
	let data = {
	    username: currentUserName,
	    time: time
	}
	let removeIcon = $(e.target);
	$.post('/remove-message', data).done((result) => {
	    if(result.status == 200) {
		removeIcon.closest('.mar-btm').remove();
	    } else {
		alert(result.message);
	    }
	});
    });
    
    // add color picker div
    $('#color-picker-holder').ColorPicker({
	flat: true,
	onChange: (hsb, hex, rgb) => {
	    $('#text-color').val('#' + hex);
	}
    });
    
    // click save text color
    $('button#save-text-color').click(() => {
	let color = $('#text-color').val();
	if(color.length > 0) {
	    let data = {
		username: currentUserName,
		color: color
	    };
	    $.post('/change-text-color', data).done((result) => {
		if(result.status == 200) {
		    preferedColor = color;
		    $('.speech-me').css('color', color);
		} else {
		    alert(result.message);
		}
		$('#color-modal').modal('hide');
	    });
	}
    });
    
    // click button to show color pallete
    $('#change-text-color').click(() => {
	$('#color-modal').modal('show');
    });
    
    // change my text color
    $('.speech-me').css('color', preferedColor);

    // check if user in active
    setInterval(() => { 
	let timeNow = new Date().getTime();
	let timeDiff = (timeNow - lastActivityTime)/ 1000; // time diff in seconds
	
	if(timeDiff >= logoutTime) { // logout user if inactive more than 5 mins
	    $('form#logout').attr('action', '/logout?redirect=in-active');
	    $('form#logout').submit();
	}
    }, 1000);
    
});

// login with username
socket.emit('login', currentUserName);

// revice chat message
socket.on('chat message', (statusCode, userName, msg, time) => {
    if(statusCode == 200) {
	let div = getMesageDiv(userName, msg, time); 
	$('.media-block').append(div);
    } else if(statusCode != 403) {
	alert(msg); 
    }
});

socket.on('remove message', (username, time) => {
    console.log(username, time);
    $('.speech-right').find('p.media-heading').each(function(index){
	if($(this).attr('data-time') == time && $(this).text() == username) {
	    $(this).closest('.mar-btm').remove();
	}
    });
});

// create message div to put into the dom
function getMesageDiv(userName, msg, time) {
    let mediaClass = 'media-right';
    let speechClass = 'speech-right';
    let speechMeClass = '';
    let removeIcon = '';
    let textColor = defaultTextColor; // default;
    
    if (userName == currentUserName) {
	mediaClass = 'media-left';
	speechClass = '';
	speechMeClass = 'speech-me';
	removeIcon = `<a class="fa fa-times fa-1 remove-message" data-time="${time}"></a>`;
	textColor = preferedColor;
    }
    
    let div = '<li class="mar-btm">' +
	    '<div class="'+ mediaClass +'">' +
	    '<img src="http://bootdey.com/img/Content/avatar/avatar1.png" class="img-circle img-sm" alt="Profile Picture">' +
		    '</div>' +
		    '<div class="media-body pad-hor '+ speechClass +'">' +
		    '<div class="speech ' + speechMeClass +'" style="color:' + textColor +'">' +
		    '<p class="media-heading" data-time="' + time + '">'+ userName + removeIcon + '</p>' +
		    '<p>'+ msg +'</p>' +
		    '<p class="speech-time">' +
		    '<i class="fa fa-clock-o fa-fw"></i> ' + new Date(time).toLocaleString() +
		    '</p>' +
		    '</div>' +
		    '</div>' +
		    '</li>';
    return div;
}

// send my message to server
function sendMessage() {
    var message = $('.chat-input').val();
    socket.emit('chat message', currentUserName, message);
    lastActivityTime = new Date().getTime();
    $('.chat-input').val('');
}