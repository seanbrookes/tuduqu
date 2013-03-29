/**
 * tuduqu
 *
 * User: sean
 * Date: 02/02/13
 * Time: 5:52 PM
 *
 *
 * in.js
 *
 * route for handling incoming content posts
 *
 */
var URL = require('../models/url-model')
	winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'input.log' })
	]
});
exports.newURL = function(req,res){

	var reqURL = req.body.url;
	var userID;

	var urlQueryObj = {
		url: reqURL
	};
	/*
	*
	* if user is authenticated save the userId with the url
	* */
	if (req.session.isAuthenticated){
		urlQueryObj.userId = req.session.userId;
		logger.info('user is authenticated so assigning user id to url submission');
	}

	var newURL = new URL(urlQueryObj);
	console.log('exports.newURL: ' + urlQueryObj.url);
	logger.info(urlQueryObj.url);
	var findOneQuery;

	URL.findOne(urlQueryObj, function (err, existingURL) {
		if (err){
			logger.error('error checking if requested url exists: ' + err.message);
			res.send({status:'error',responseText:'error checking if requested url exists: ' + err.message});
		}
		else{
			// it is not found so can be created
			//console.log('existing url doc:  ' + existingURL.url);
			if (!existingURL){
				console.log('BEGIN CREATE URL DOCUMENT FLOW: ' + urlQueryObj.url);
				// create the url
				/*
				 CREATE NEW USER - SAVE
				 */
				newURL.save(function(err) {
					if (err) {
						logger.error('ERROR saving new url: ' + err.message);
						res.send(400);
					}

					/**
					 * New user creation success test
					 */
					URL.findOne({ _id: newURL._id }, function(err, content) {
						if (err) {
							logger.error('ERROR looking for new url: ' + err.message);
							res.send(400);
						}
						/*
						*
						* SUCCESS!!
						*
						* */
						if (content){
							logger.info('content created successfully: ' + content.url);
							res.send({status:'success',responseText:'url saved: ' + content.url});
						}
						/*
						*
						* WARNING - EXPECTED CONTENT INSTANCE
						*
						* */
						else{
							// wasn't saved for some reaseon
							logger.warn('content may not have been created: ' + newURL._id);
							res.send(400);
						}


					});
				});

			}
			else{
				console.log('THIS URL IS ALREADY SAVED: ' + existingURL.url );
			}
		}

	});

};
