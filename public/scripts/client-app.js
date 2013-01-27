    /**
     * added another test comment
     */

	/**
	 * kickoff the app
	 *
	 * define SF as Social Framework namespace
	 *
	 * export log and EventBus as global objects
	 *
	 *
	 */
var SF = (function(exports,$){
	var that = this;
	// usage: POF.log('inside coolFunc',this,arguments);
	// inspired by: http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
	exports.log =  function(){
		log.history = log.history || [];   // store logs to an array for reference
		log.history.push(arguments);
		if(exports.console){
			console.log( Array.prototype.slice.call(arguments) );
		}
	};
	var defaultLocale = 'en';
	function getUserLocale(){
		var returnVal;
		if ($.cookie('userLocale')){
			returnVal = $.cookie('userLocale');// get cookie value
		}
		else{
			returnVal = defaultLocale;
		}
		return returnVal;
	}
	// declare a name-spaced event bus
	var EventBus = $(Object.create({}));
	var t = function(){
		log('translate this string key: ' + JSON.stringify(arguments) + '  with this locale value: ' + getUserLocale());
		return arguments[0];
	};

	return{
		EventBus:EventBus,
		T:t,
		userLocale:getUserLocale

	};

}(window,jQuery));

