/**
 * tuduqu
 *
 * User: sean
 * Date: 03/02/13
 * Time: 1:26 AM
 *
 *
 * content.js
 *
 * main file for interacting with contextual content
 *
 */
var URL = require('../models/url-model')
winston = require('winston');

var jsdom = require('jsdom')
	, request = require('request')
	, url = require('url');
var events = require('events');
var EE = require('events').EventEmitter;
var EventBus = new EE();

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'content.log' })
	]
});
exports.getAllURLs = function(req, res){

	URL.find(function(err,dox){
		if (!err){
			logger.info('returning list of urls');
			res.send({status:'success',response:dox});
		}
		else{
			logger.error('error getting list of urls: ' + err.message);
			res.send(400);
		}
	});


};

exports.processURLs = function(req, res){
	var titleArray = [];
	var urlProcessCount = 0;
	EventBus.on('content.processedURL',function(data){
		logger.info('add page title to response stack: ' + data + '  title count: ' + titleArray.length);
		titleArray.push(data);
		if (titleArray.length === urlProcessCount){
			logger.info('POST RESPONSE');
			res.send({status:'success',response:titleArray});
		}

	});

	EventBus.on('content.processedAllURLs',function(data){
		res.send({status:'success',response:titleArray});
	});
	URL.find(function(err,dox){
		if (!err){
			logger.info('returning list of urls');
			logger.info('number of urls to procss: ' + dox.length);

			if (dox){

				if (dox.length){

					var urlCount = dox.length;
					urlProcessCount = urlCount;
					var j = 0;
					for (j = 0;j < dox.length;j++){
						var tuduURL = dox[j].url;
						var innerIndex = j;
						//logger.info('processing: ' + tuduURL);

						request({uri: tuduURL}, function(err, response, body){
							var self = this;
							var innerIndex2 = innerIndex;
							self.items = new Array();//I feel like I want to save my results in an array
							//Just a basic error check
							if(err && response.statusCode !== 200){console.log('Request error.');}
							//Send the body param as the HTML code we will parse in jsdom
							//also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com
							jsdom.env({
								html: body,
								scripts: ['http://code.jquery.com/jquery-1.6.min.js']
							}, function(err, window){
								//Use jQuery just as in a regular HTML page
								var $ = window.jQuery;
								var title = $('title').text();
								var bodyText = $(body).text();

								//console.log('Page Title: ' + pageTitle);
								logger.info('Page Title: ' + title);
								logger.info('Page Text: ' + bodyText);
								//res.end($('title').text());
								// trigger event
//								logger.info('|');
//								logger.info('| EMIT title');
//								logger.info('|');
								EventBus.emit('content.processedURL',title);


//								if (innerIndex2 === (urlCount - 1)){
//									//res.send({status:'success',response:data});
//									logger.info('EMIT content.processedAllURLs');
//									EventBus.emit('content.processedAllURLs');
//								}
								//res.send({status:'success',response:'?'});
							});
						});
					}



				}
			}
			else{
				logger.warn('no documents returned finding urls');
				res.send(200);
			}
		}
		else{
			logger.error('error getting list of urls: ' + err.message);
			res.send(400);
		}
	});


};
