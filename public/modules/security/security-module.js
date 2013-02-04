/**
 * Plenty O Food

 * User: sean
 * Date: 11/12/12
 * Time: 9:15 PM
 *
 */
var securityModule = (function(exports,$){
	var anchorSelector = '.main-content-wrapper';
	var isTemplateMarkupLoaded = false;
	_.templateSettings.variable = "P";


	function init(callback){
		var cb = callback;


		$(anchorSelector).load('modules/security/security-template.html',function(markup){
			sf1.log('Security module loaded ');
			_.templateSettings.variable = 'P';
			sf1.EventBus.trigger('security.templatesLoaded');

			if (cb){
				cb();
			}

		});
	}

	sf1.EventBus.bind('route-event',function(event){
		//$(sf1.EventBus).trigger('checkauth-event');
		sf1.log('route-event fired - security module');

	});

	sf1.EventBus.bind('ia.mainNavRendered',function(event){
		sf1.log('ia.mainNavRendered');
		$.ajax({
			type:'GET',
			url:'/isauth',
			success:function(response){
				sf1.log(response);
				/*
				 *
				 * tighten this up (event pub/sub)
				 *
				 * */
				if (response.isAuthenticated){
					$('.cmd-auth').text('hello ' + response.userName + ' (logout)');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						sf1.EventBus.trigger('logout-event');
					});
				}
				else{
					sf1.EventBus.trigger('route-event',{route:'login'});
					$('.cmd-auth').text('login');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						document.location.href = "#login";
					});
				}
			},
			error:function(response){
				sf1.log(response);
			}
		});
	});
	sf1.EventBus.bind('checkauth-event',function(event){
		sf1.log('inside check auth event');
		$.ajax({
			type:'GET',
			url:'/isauth',
			success:function(response){
				sf1.log(response);
				/*
				 *
				 * tighten this up (event pub/sub)
				 *
				 * */
				if (response.isAuthenticated){
					$('.cmd-auth').text('hello ' + response.userName + ' (logout)');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						sf1.EventBus.trigger('logout-event');
					});
				}
				else{
					sf1.EventBus.trigger('route-event',{route:'login'});
					$('.cmd-auth').text('login');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						document.location.href = "#login";
					});
				}
			},
			error:function(response){
				sf1.log(response);
			}
		});
	});
	sf1.EventBus.bind('logout-event',function(event){
		$.ajax({
			type:'GET',
			url:'/logout',
			success:function(response){
				sf1.log(response);
				if (response.isAuthenticated){
					$('.cmd-auth').text('hello ' + response.userName + ' (logout)');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						sf1.EventBus.trigger('logout-event');
					});
				}
				else{

					sf1.EventBus.trigger('route-event',{route:'login'});
					$('.cmd-auth').text('login');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						document.location.href = '#login';
					});
				}
			},
			error:function(response){
				sf1.log(response);
			}
		});
	});
	sf1.EventBus.bind('route-event',function(event){
		if (event.route === 'login'){
			//sf1.log('LOGIN ROUTE EVENT DETECTED');
		}
	});
	sf1.EventBus.bind('security.templatesLoaded',function(){

		sf1.log('Security template loaded');
		//isTemplateMarkupLoaded = true;

	});

	sf1.EventBus.bind('main-nav-event',function(){
		//isTemplateMarkupLoaded = false;
		sf1.log('Reset Security Template loaded');
	});
	/*

		Init Sign Up View

	 */
	sf1.EventBus.bind('security.signUpViewLoaded',function(){
		$('.btn-signup').click(function(event){
			event.preventDefault();
			sf1.log('sumbit sign up form');
			var signUpRequestModel = {};
			// signUpRequestModel.userName = $('.form-signup #UserName').val();
			signUpRequestModel.email = $('.form-signup #Email').val();
			signUpRequestModel.password = $('.form-signup #Password').val();
			sf1.log('signUpRequestModel populated: ' + JSON.stringify(signUpRequestModel));
			$.ajax({
				type:'POST',
				url:'/user',
				data:signUpRequestModel,
				success:function(response){
					sf1.log('success sign up');
					sf1.log(response);
					sf1.log(JSON.stringify(response));
				},
				error:function(response){
					sf1.log('error sign up');
					sf1.log(response);
					sf1.log(JSON.stringify(response));
				}

			});

		});
	});

	/*

	 Init Sign Up View

	 */
	sf1.EventBus.bind('security.loginViewLoaded',function(){

		var loginButton = $('.btn-login');



		/*
		*
		* login submit button (not main navigation  that is class:cmd-auth)
		*
		* */
		loginButton.click(function(event){
			event.preventDefault();
			sf1.log('sumbit login form');
			var loginRequestModel = {};
			loginRequestModel.email = $('.form-login #Email').val();
			loginRequestModel.password = $('.form-login #Password').val();
			sf1.io.ajax({
				type:'POST',
				url:'/auth',
				data:loginRequestModel,
				success:function(response){
					/*
					* login may not have been successfull just becaus the ajax request succeeded.
					*
					* make sure the use is authenticated
					* */
					sf1.log(JSON.stringify(response));
					if (response.isAuthenticated){
						document.location.href = '/';
					}
				},
				error:function(response){
					sf1.log('error login');
					sf1.log(response);
					sf1.log(JSON.stringify(response));
				}

			});
		});
	});

	sf1.EventBus.bind('security.initSignUpView',function(){
		sf1.log('Initialize Sign Up View');

//		var signUpFormMarkup = $('script#SignUpTemplate').html();
//		var textE = $('script#OrganizationListTemplate').html();

		var template = _.template($('script#SignUpTemplate').html());

		var templateData = {};

		$('.security-module-container').html(
			template( templateData )
		);

		sf1.EventBus.trigger('security.signUpViewLoaded');
	});
	sf1.EventBus.bind('security.initLoginView',function(){
		sf1.log('Initialize login View');



//		var signUpFormMarkup = $('script#SignUpTemplate').html();
//		var textE = $('script#OrganizationListTemplate').html();

		var template = _.template($('script#LoginFormTemplate').html());

		var templateData = {};

		$('.security-module-container').html(
			template( templateData )
		);
		sf1.EventBus.trigger('security.loginViewLoaded');
	});


	return{
		init:function(callback){
			return init(callback);
		},
		initSignup:function(){
			sf1.log('|');
			sf1.log('initSignup');
			sf1.log('|');
			if ($('script#SignUpTemplate').html()){
				sf1.EventBus.trigger('security.initSignUpView');
			}
			else{
				this.init(function(){
					sf1.EventBus.trigger('security.initSignUpView');
				});
			}
		},
		initLogin:function(){
			sf1.log('|');
			sf1.log('initLogin');
			sf1.log('|');
			if ($('script#LoginFormTemplate').html()){
				sf1.EventBus.trigger('security.initLoginView');
			}
			else{
				this.init(function(){
					sf1.EventBus.trigger('security.initLoginView');
				});
			}
		},
		isActionPermitted:function(actionRequestObj){
			/*
			this will need to get more sophisticated in the future
			for now it is just a stub to turn off delete organization by accident

			for now all other actions are permitted
			 */
			if ((actionRequestObj.action) && (actionRequestObj.action === 'DELETE_ORGANIZATION')){
				return false;
			}
			return true;
		}

	};
}(window,jQuery));



