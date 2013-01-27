/**
 * Simple Framework One

 * User: sean
 * Date: 11/12/12
 * Time: 10:43 PM
 *
 */
// Router
var AppRouter = Backbone.Router.extend({

	routes:{
		"":"index",
		"home":"index",
		"login":"login",
		"signup":"signup",
		"admin":"admin"
	},

	index:function () {
		log('index');
		SF.EventBus.trigger('route-event',{route:'index'});
		require(['../modules/index/index-module'],function(module){
			module.init();
		});
		//indexModule.init();
	},


	signup:function () {
		log('signup route');
		SF.EventBus.trigger('route-event',{route:'signup'});
		securityModule.initSignup();

	},

	login:function () {
		log('login route');
		SF.EventBus.trigger('route-event',{route:'login'});
		securityModule.initLogin();

	},

	admin:function () {
		log('admin route');
		SF.EventBus.trigger('route-event',{route:'admin'});
		require(['../modules/admin/admin-module'],function(module){
			module.init();
		});
		// load admin view/module
		//adminModule.init();

	}


});

var router = new AppRouter();
Backbone.history.start();

$(document).ready(function(){
	_.templateSettings.variable = "G";

	//iaModule.init();

	SF.EventBus.bind('route-event',function(event){
		log('router - route-event detected');
	});


});