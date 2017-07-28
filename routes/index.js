module.exports = function Router(express, socketIo, usersModel) {    
    var router = express.Router();
    
    // show login form
    router.get('/', (req, res, next) => {
	let redirect = req.query.redirect;
	if(redirect === 'in-active') {
	    res.render('login', {error: 'You have been inactive for a while, please login again'});
	} else {
	    res.render('login');
	}
    });
    
    // login
    router.post('/', (req, res, next) => {
	let username = req.body.username;
	if(username) {	    
	    if(usersModel.userExist(username)) {
		res.render('login', {error: 'Username exist, please choose another username'});
	    } else {
		res.render('index', {
		    messages: usersModel.messages, 
		    username:username,
		    textColor: usersModel.getPreferedColor(username)
		}); 
	    }
	} else {
	    res.render('login');
	}
    });
    
    // logout
    router.post('/logout', (req, res, next) => {
	let username = req.body.username;
	usersModel.removeUser(username);
	let redirect = req.query.redirect;

	let redirectUrl = '/';
	if(typeof redirect !== 'undefined') {
	    redirectUrl = `/?redirect=${redirect}`;
	}
	res.redirect(redirectUrl);
    });
    
    // remove message
    router.post('/remove-message', (req, res, next) => {
	let username = req.body.username;
	let time = req.body.time;
	if(username.length > 0 && time.length > 0) {
	    let deletedMsg = usersModel.removeMessage(username, time);
	    if(deletedMsg === true) {
		socketIo.removeMessage(username, time);
		res.json({ status: 200, message: '' });
	    } else {
		res.json({ status: 400, message: deletedMsg });
	    }
	} else {
	    res.json({ status: 400, message: 'Bad request' });
	}
    });
    
    // change text color
    router.post('/change-text-color', (req, res, next) => {
	let color = req.body.color;
	let username = req.body.username;
	if(color.length > 0) {
	    usersModel.changeTextColor(username, color);
	    res.json({ status: 200, message: '' }); 
	} else {
	    res.json({ status: 400, message: 'Bad request' });
	}
    });
    
    
    return router;
};
