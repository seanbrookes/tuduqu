/**
 * tuduqu
 *
 * User: sean
 * Date: 02/02/13
 * Time: 11:31 PM
 *

 *
 * define SF as Social Framework namespace
 *
 * export log and EventBus as global objects
 *
 *
 */

(function(exports,$){
	var that = this;
	var sf1 = {};



	// usage: POF.log('inside coolFunc',this,arguments);
	// inspired by: http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	sf1.log =  function(){
		sf1.log.history = sf1.log.history || [];   // store logs to an array for reference
		sf1.log.history.push(arguments);
		if(exports.console){
			console.log( Array.prototype.slice.call(arguments) );
		}
	};
	sf1.io = Object.create({});
	sf1.io.ajax = function(ioObj){
		if (ioObj){
			// check if there is an ajax request type and other properties
			// make sure the required parameters (url and type are there )
			$.ajax(ioObj);
			sf1.log('in sfo.io.ajax');
			sf1.log(ioObj);


		}
	};
	var defaultLocale = 'en';
	sf1.getUserLocale = function(){
		var returnVal;
		if ($.cookie('userLocale')){
			returnVal = $.cookie('userLocale');// get cookie value
		}
		else{
			returnVal = defaultLocale;
		}
		return returnVal;
	};
	// declare a name-spaced event bus
	sf1.EventBus = $(Object.create({}));
	sf1.translate = function(){
		sf1.log('translate this string key: ' + JSON.stringify(arguments) + '  with this locale value: ' + sf1.getUserLocale());
		return arguments[0];
	};

	exports.sf1 = sf1;

}(window,jQuery));

