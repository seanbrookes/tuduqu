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
		"in":"input",
		"login":"login",
		"signup":"signup",
		"admin":"admin"
	},

	index:function () {
		sf1.log('index');
		sf1.EventBus.trigger('route-event',{route:'index'});
		require(['../modules/index/index-module'],function(module){
			module.init();
		});
		//indexModule.init();
	},


	signup:function () {
		sf1.log('signup route');
		sf1.EventBus.trigger('route-event',{route:'signup'});
		securityModule.initSignup();

	},

	input:function () {
		sf1.log('input route');
		require(['../modules/input/input-module'],function(module){
			module.init();
			module.render();
		});

	},

	login:function () {
		sf1.log('login route');
		sf1.EventBus.trigger('route-event',{route:'login'});
		securityModule.initLogin();

	},

	admin:function () {
		sf1.log('admin route');
		sf1.EventBus.trigger('route-event',{route:'admin'});
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

	sf1.EventBus.bind('route-event',function(event){
		sf1.log('router - route-event detected');
	});


});