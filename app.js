/**
 * Module dependencies.
 *
 * references:
 * - http://stackoverflow.com/questions/6819911/nodejs-expressjs-session-handling-with-mongodb-mongoose
 *
 *
 * TODO - parameterize index.html properties
 *
 */
var express = require('express')
//, config = require('./config')
	, routes = require('./routes')
	, user = require('./routes/user')
	, admin = require('./routes/admin')
	, UserModel = require('./models/user-model')
//	, geoizr = require('./routes/geoizr')
//	, organization = require('./routes/organization')
//	, producers = require('./routes/producers')
	, http = require('http')
	, path = require('path')
	, MongoStore = require('connect-mongo')(express)
	, mongoose = require('mongoose')
	, winston = require('winston');
var events = require('events');
var EE = require('events').EventEmitter;
var EventBus = new EE();
//var Session = require('connect-mongodb');
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'app.log' })
	]
});
var config = {
	app: {
		friendlyName: 'tuduqu',
		name:'tuduqu'
	},
	db: {
		db: 'tuduqu',
		host: 'localhost',
		port: 27017,  // optional, default: 27017
//			username: 'admin', // optional
//			password: 'secret', // optional
		collection: 'sessions' // optional, default: sessions
	},
	salt: '076ee61d63aa10a125ea872411e433bc'
};
var app = express();
/**
 *
 *  Uncaught exceptions
 *
 */
//process.on('uncaughtException',function(err){
//	console.log('[app.js] Caught- uncaught exception (try to keep application running): ' + err);
//});
app.configure(function(){
	app.set('port', process.env.PORT || 3002);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

	app.use(express.cookieParser('the secret string'));
	app.use(express.session({
		//maxAge: new Date(Date.now() + 3600000),
		store: new MongoStore({
			db: config.db.db
		}),
		secret: config.salt,
		cookie: {
			path     : '/',
			httpOnly : true,
			maxAge   : null    //one year(ish)
		}
	}));

	app.use(express.methodOverride());	// important that this comes after session management
	/*
	*
	* LOCALE
	*
	*
	* */
	app.use(function(req, res, next) {
		console.log('--------------   Start locale processing ---------');
		EventBus.on('createUser',function(obj){
			console.log('Create User Event handler called - app.js - locale test request intercept');
		});
		/*

		 make sure the locale is set
		 check if there is a user preference set for locale
		 if there is make sure the session is set to it
		 if there is no user preference and no session value set
		 then set it based on the accept-language value from the header

		 */
		var locales = req.headers["accept-language"];

		var sessionLocale = 'en';
		console.log('Default locale: ' + sessionLocale);
		var localeArray = locales.split(',');

		for (var i = 0;i < localeArray.length;i++){
			// parse on semi colon to isolate value from 'quality'?
			var currentItem = localeArray[i];
			var tempArray = currentItem.split(';');
			var consoleOutput = '';
			if (tempArray.length > 1){
				for (var j = 0;j < tempArray.length;j++){
					consoleOutput += '[' + tempArray[j] + ']';
				}
			}
			else{
				consoleOutput = tempArray[0];
			}
			console.log('accept-language item: ' + consoleOutput);
		}
		/*
		 * there is no locale set for this session so we need
		 * to check if the user is authenticated
		 * this may be the first visit to the site
		 * or may be a visit from an anonymous user
		 *
		 * */
		if (!req.session.userLocale){
			console.log('No userLocale detected');
			if (req.session.isAuthenticated){
				/*
				 * this is an authenticated user so we need to check if they have a user preference for locale
				 *
				 *
				 * get user id from session
				 *
				 * query db for specific user preference for locale
				 * if we find it set it
				 *
				 * if we don't find it then set to sessionLocale
				 * */
				var currentUserId = req.session.userId;
				console.log('Current session is authenticated id:' + currentUserId);
				// query mongo for user preference
				var userPreferenceName = 'userLocale';


				UserModel.findOne({_id:currentUserId},function(err,user){
					if (err){
						console.log('ERROR finding user in db for session locale preference');
					}
					if(user){
						console.log('We found the logged in user for preference');
						/*
						* check if user has a user preference set for the locale property
						* */
						if (((user.preferences)) && (user.preferences.locale)){
							console.log('THIS USER HAS A PREFERENCE FOR LOCALE');
							req.session.userLocale = user.preferences.locale;
						}
						else{
							// no persisted locale preference so set default
							console.log('the authenticated user has not yet set a preference for user locale')
							req.session.userLocale = sessionLocale;
						}
					}
					else{
						console.log('this should not happen but indicates there was no user and no error returned from findOne request');
					}
				});

				// user.preferences[userPreference]

			}
			else{
				console.log('Locale AAA');
				console.log('req.session is not authenticated');
				/*
				*
				* set the default in the session
				*
				* emit set locale event
				*
				* */
				req.session.userLocale = sessionLocale;
			}
		}
		else{
			console.log('We have a session.userLocale');
		}



		next();
	});
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler());
	//app.set('db-uri', 'mongodb://localhost:27017/plentyofood');
});

//app.get('/', routes.index);
//app.get('/producers', producers.getFVOPAProducers);
//app.get('/users', user.list);
//app.get('/geoizr', geoizr.getGeoLocation);
//app.post('/geoizr', geoizr.postGeoLocation);
//app.get('/organization', organization.getOrganizations);
//app.get('/organization/:id', organization.getOrganization);
//app.post('/organization', organization.newOrganization);
//app.put('/organization/:id', organization.updateOrganization);
//app.delete('/organization/:id', organization.deleteOrganization);
//
app.get('/logout',user.logout);
app.get('/isauth',user.isUserAuth);
app.post('/auth',user.postAuthenticate);
app.post('/user',user.createUser);
app.get('/pendingaccounts',admin.getPendingAccountList);

http.createServer(app).listen(app.get('port'), function(){
	console.log('|--------------------------------');
	console.log('|');
	console.log('|');
	console.log('|');
	console.log('|');
	console.log('|');

// TODO - parameterize the name of the application
// TODO - set configuration to enable and turn off this messaging

	console.log("|	" + config.app.friendlyName + " app server listening on port " + app.get('port'));
	console.log('|');
	console.log('|');
	console.log('|	Initialize Db connection');
	console.log('|');
	var dbConString;
//	var constring1 = 'http://' + config.db.host + ':' + config.db.port +'/' + config.db.db;
//	var conString2 = 'mongodb://heroku_app11348892:9dn7rqdmsda7qvto9g8v48ksg@ds049467.mongolab.com:49467/heroku_app11348892/';

	app.configure('development', function(){
		dbConString = 'http://' + config.db.host + ':' + config.db.port +'/' + config.db.db;

	});
	app.configure('production', function(){
		dbConString = 'mongodb://heroku_app11348892:9dn7rqdmsda7qvto9g8v48ksg@ds049467.mongolab.com:49467/heroku_app11348892/';
	});
		var db = mongoose.connect(dbConnectionString ,function(err){
		console.log('|');
		if(err){
			console.log('|');
			console.log('|');
			console.log('--------------------------------');
			console.log('|	' + config.db.db + ' [db] connection error : ' + err);
			console.log('--------------------------------');
			console.log('|');
		}
		else{
			console.log('|');
			console.log('|	Connected to db	' + config.db.db);
			console.log('|');
			console.log('|');
		}
		console.log('|==========================================');
		console.log('|==========================================');
		console.log('|');
		console.log('|');

	});
//	var dbConnection = db.connections[0];
//	function mongoStoreConnectionArgs(dbConnection) {
//		return {
//			dbname: dbConnection.db.databaseName,
//			host: dbConnection.db.serverConfig.host,
//			port: dbConnection.db.serverConfig.port//,
////			username: db.uri.username,
////			password: db.uri.password
//		};
//	}
//	app.use(express.session({
//		store: Session(mongoStoreConnectionArgs(dbConnection))
//	}));
});
