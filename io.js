// Routes.js
module.exports = class IO {
    
    constructor(io, users) {
	this.io = io;
	this.users = users;
	this.listenToConnection();
    }
    
    listenToConnection() {
	var thisObject = this;
	this.io.on('connection', function (socket) {
	    socket.on('chat message', function (userName, msg) {
		let timeStamp = new Date();
		let timeStampUnix = timeStamp.getTime();


		var validateMsg = thisObject.validateMessage(msg.trim());
		if (validateMsg === true) {
		    thisObject.users.addMessage(userName, msg, timeStamp);
		    thisObject.io.emit('chat message', 200, userName, msg, timeStampUnix);
		} else {
		    socket.emit('chat message', 400, userName, validateMsg, timeStampUnix);
		}
	    });

	    socket.on('login', function (userName) {
		thisObject.users.login(userName, socket.id);
	    });

	    // logout user when socket is disconnected
	    socket.on('disconnect', function () {
		thisObject.users.removeUserBySocketId(socket.id);
	    });
	});
    }
    

    validateMessage(msg) {
	if (msg === '') {
	    return 'Massge can not be empty';
	}

	if (!/^[a-z0-9.,?!:"'" ]+$/i.test(msg)) {
	    return 'Messages should only contain alphanumeric values along with following characters . , ? ! : " \'';
	}
	return true;
    }

    removeMessage(username, time) {
	this.io.emit('remove message', username, time);
    }
};