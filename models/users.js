var config = require('../config.json');

module.exports = class Users {
    constructor() {
	this.users = {}; // contain registered users in format: [name => socketid]
	this.messages = {}; // contain messages in format: [time => {message, username}]
	this.preferedColor = {}; // contain user's prefered color in format: [name => colorCode]
    }
    // check if user is active
    userExist(username) {
	if (this.users.hasOwnProperty(username)) {
	    return true;
	} else {
	    return false;
	}
    }
    
    // login an suer
    login(username, id) {
	this.users[username] = id;
    }
    
    // remove user from array
    removeUser(username) {
	if (this.users.hasOwnProperty(username)) {
	    delete this.users[username];
	}
    }

    removeUserBySocketId(socketid) {
	for (var username in this.users) {
	    if (this.users.hasOwnProperty(username) && this.users[username] == socketid) {
		delete this.users[username];
	    }
	}
    }
    
    // add message to message array
    addMessage(username, msg, date) {
	let timeString = date.toLocaleString();
	let time = date.getTime();
	if (!(time in this.messages)) {
	    this.messages[time] = [];
	}
	this.messages[time].push({message: msg, username: username, time: timeString});
    }
    
    // remove message from message array
    removeMessage(username, time) {
	let timeNow = new Date().getTime();
	let timeDiff = (timeNow - time) / 1000;
	if(timeDiff >= config.removeMessageTime) {
	    return 'This message is older then 15 mins, you can not delete it';
	}
	if (this.messages.hasOwnProperty(time)) {
	    for(let i=0; i < this.messages[time].length; i++) {
		let message = this.messages[time][i];
		if(message.username === username) {
		    this.messages[time].splice(i,1);
		    return true;
		}
	    }
	}
	return 'Message not found';
    }
    
    // change text color
    changeTextColor(username, color) {
	this.preferedColor[username] = color;
	return color;
    }
    
    // get prefer color
    getPreferedColor(username) {
	return this.preferedColor[username];
    }
    
    // return all users
    getUsers() {
	return this.users;
    }
}