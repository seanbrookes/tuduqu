/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 02/12/12
 * Time: 7:43 AM
 *
 * user.js
 * references:
 *  - http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
 *  - http://blog.mongodb.org/post/32866457221/password-authentication-with-mongoose-part-1
 *
 *  - http://crackstation.net/hashing-security.htm
 *
 *
 * http://lostechies.com/derickbailey/2011/05/24/dont-do-role-based-authorization-checks-do-activity-based-checks/
 *
 *  TODO stabilize the message structure back to the client
 *
 */

var User = require('../models/user-model'),
	PendingUser = require('../models/pendingUser-model'),
	winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'user.log' })
	]
});

/**
 * createUser - Primary create account method
 *
 * @param req
 * @param res
 */
exports.createUser = function(req, res){
// create a user a new user
	console.log('createUser');
	logger.log('info', 'createUser request');
	console.log('req body: ' + req.body);
	var userName = req.param('email', null);
	var password = req.param('password', null);

	if ( null === userName || userName.length < 1
		|| null === password || password.length < 1 ) {
		res.send(400);
		return;
	}

	if (req.body){
		console.log('1: userName:' + userName);
		var reqUserModel = req.body;
		var user = {
			userName: userName,
			email: userName,
			password: password
		};
		var newUser = new User(user);
		newUser.accountStatus = 'pending';
		/*
		 * test to see if the user already exists before creating
		 *
		 * USER EXIST ALREADY?
		 *
		 * test to see if user was created - create the user
		 *
		 * */
		User.findOne({email: req.body.email}, function (err, existingUser) {
			if (!err) {

				if (!existingUser) {
					/*
					 CREATE NEW USER - SAVE
					 */
					newUser.save(function(err) {
						if (err) {
							logger.error('ERROR saving new user: ' + err.message);
							res.send(400);
						}

						/**
						 * New user creation success test
						 */
						User.findOne({ _id: newUser._id }, function(err, user) {
							if (err) {
								logger.error('ERROR looking for new user: ' + err.message);
								res.send(400);
							}
							/*

							 we have created and saved user [pending activation]

							 */
							logger.info('new user successfully created [pending activation]: ' + newUser.userName);
							/**
							 * create a pending user token
							 *
							 * save new record to new pending User collection
							 * @type {PendingUser}
							 *
							 */
							var pendingUser = new PendingUser({
								userId:user._id,
								token:getToken()
							});

							pendingUser.save(function(err){
								if (err){
									logger.error('save pending user token error: ' + err.message);
									res.send(400);
								}
								logger.info('new user pending activation token record created: ' + user);
								// TODO - wrap this with more protection - establish a consistent response message structure
								res.send(user);
							});


						});
					});
				} else {
					// Does exist, update reginfo with the values from req.body and then
					// TODO confirm this level of logging / structure
					logger.info('createUser request: user already exists' + user);
					console.log(' user exists');
					// call reginfo.save
				}
			}
			else{
				logger.error('ERROR trying see if a user exists: ' + err.message);
				// TODO wrap this with more established message structure to the client
				res.send(400);
			}
		});


	}
};
/**
 * Basic token generator
 *
 * used in the pending user activation process to tokenize the url sent to the user for activation
 *
 * // TODO fix 'undefined' exception somewhere in the token generation loop
 *
 * @return {String}
 */
var getToken = function(){
	var token = '';
	var rndIndex;
	var characters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];
	var tokenLength = 8;
	for (var i = 0;i < tokenLength;i++){
		rndIndex = Math.floor((Math.random()*36)+1);
		if (rndIndex < 1){
			rndIndex = 0;
		}
		//console.log('random index: ' + rndIndex);
		token += characters[rndIndex];
	}
	//console.log('getToken: - ' + token);
	return token;
};
/**
 * Authenticate
 *
 * checks include:
 *  - user exists
 *  - is account active
 *  - password match
 *
 */
exports.postAuthenticate = function(req, res){
	logger.info('login attempt');
	if (req.body){
		if(req.body.email && req.body.password){
			try{
				/**
				 * User.getAuthenticated
				 *
				 * Primary server auth request method
				 *
				 */
				User.getAuthenticated(req.body.email, req.body.password, function(err, user, reason){

					// make sure there is no error on auth attempt
					if (!err){
						// make sure there is a user
						if (user){
							console.log('THIS USER IS LOGGED IN: ' + user);
							req.session.isAuthenticated = true;
							req.session.userName = user.userName;
							req.session.userId = user._id;
							console.log('Session User Name: ' + req.session.userName);
							console.log('Session object: ' + JSON.stringify(req.session));
							//res.send('LOGGED IN');
							exports.isUserAuth(req, res);
						}
						// no user but no error
						else{
							console.log('exports.postAuthenticate - no user returned on auth - reason: ' + User.printReason(reason));
						}
					}
					// auth attempt threw an error
					else{
						console.log('exports.postAuthenticate - error during auth attempt: ' + err.message);
					}


					// we didn't get a user and a reason is supplied
					// eg - user account is pending - there is no error

				});
			}
			catch(e){
				console.log('error login: ' + e.message);
				logger.error('exports.postAuthentcate uncaught exception during auth attempt: ' + e.message);
				// TODO - message structure and content
				res.send('error login: ' + e.message);
			}
		}
		else{
			console.log('no req.userName or req.password');
			logger.warn('login attempt missing username or password');
			// TODO - message structure and content
			res.send('no req.userName or req.password');
		}

	}
	else{
		// TODO - message content and structure
		console.log('no Req. body');
		logger.info('exports.postAuthenticate - request made with no req.body');
		res.send('no req.body');
	}

};

/*
 *
 * check if user is authenticated
 *
 * */
/**
 * isUserAuth
 *
 * Test to see if the user session information has been persisted
 *
 * @param req
 * @return {Boolean}
 */
exports.isUserAuth = function(req,res){
	console.log('exports.isUserAuth - COOKIE: ' + JSON.stringify(req.session));
	if (!req.session.userName) {
		// if false render login page
		res.send({ isAuthenticated: false});
	} else {
		// if true redirect to member page
		res.send({
			isAuthenticated: req.session.isAuthenticated,
			userName:req.session.userName,
			userId:req.session.userId
		});
	}
};
/*
 *
 * log user out
 *
 * */
exports.logout = function(req,res){


	if (req.session.isAuthenticated) {
		req.session.isAuthenticated = false;
		req.session.userName = null;
		req.session.userId = null;
		//res.clearCookie('auth');
		req.session.destroy(function() {});
	}
	res.redirect('/');





};

exports.list = function(req, res){
	res.send("respond with a resource");
};