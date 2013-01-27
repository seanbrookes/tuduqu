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
			log('Security module loaded ');
			_.templateSettings.variable = 'P';
			SF.EventBus.trigger('security.templatesLoaded');

			if (cb){
				cb();
			}

		});
	}

	SF.EventBus.bind('route-event',function(event){
		//$(SF.EventBus).trigger('checkauth-event');
		log('route-event fired - security module');

	});

	SF.EventBus.bind('ia.mainNavRendered',function(event){
		log('ia.mainNavRendered');
		$.ajax({
			type:'GET',
			url:'/isauth',
			success:function(response){
				log(response);
				/*
				 *
				 * tighten this up (event pub/sub)
				 *
				 * */
				if (response.isAuthenticated){
					$('.cmd-auth').text('hello ' + response.userName + ' (logout)');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						SF.EventBus.trigger('logout-event');
					});
				}
				else{
					SF.EventBus.trigger('route-event',{route:'login'});
					$('.cmd-auth').text('login');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						document.location.href = "#login";
					});
				}
			},
			error:function(response){
				log(response);
			}
		});
	});
	SF.EventBus.bind('checkauth-event',function(event){
		log('inside check auth event');
		$.ajax({
			type:'GET',
			url:'/isauth',
			success:function(response){
				log(response);
				/*
				 *
				 * tighten this up (event pub/sub)
				 *
				 * */
				if (response.isAuthenticated){
					$('.cmd-auth').text('hello ' + response.userName + ' (logout)');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						SF.EventBus.trigger('logout-event');
					});
				}
				else{
					SF.EventBus.trigger('route-event',{route:'login'});
					$('.cmd-auth').text('login');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						document.location.href = "#login";
					});
				}
			},
			error:function(response){
				log(response);
			}
		});
	});
	SF.EventBus.bind('logout-event',function(event){
		$.ajax({
			type:'GET',
			url:'/logout',
			success:function(response){
				log(response);
				if (response.isAuthenticated){
					$('.cmd-auth').text('hello ' + response.userName + ' (logout)');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						SF.EventBus.trigger('logout-event');
					});
				}
				else{

					SF.EventBus.trigger('route-event',{route:'login'});
					$('.cmd-auth').text('login');
					$('.cmd-auth').click(function(event){
						event.preventDefault();
						document.location.href = '#login';
					});
				}
			},
			error:function(response){
				log(response);
			}
		});
	});
	SF.EventBus.bind('route-event',function(event){
		if (event.route === 'login'){
			//log('LOGIN ROUTE EVENT DETECTED');
		}
	});
	SF.EventBus.bind('security.templatesLoaded',function(){

		log('Security template loaded');
		//isTemplateMarkupLoaded = true;

	});

	SF.EventBus.bind('main-nav-event',function(){
		//isTemplateMarkupLoaded = false;
		log('Reset Security Template loaded');
	});
	/*

		Init Sign Up View

	 */
	SF.EventBus.bind('security.signUpViewLoaded',function(){
		$('.btn-signup').click(function(event){
			event.preventDefault();
			log('sumbit sign up form');
			var signUpRequestModel = {};
			// signUpRequestModel.userName = $('.form-signup #UserName').val();
			signUpRequestModel.email = $('.form-signup #Email').val();
			signUpRequestModel.password = $('.form-signup #Password').val();
			log('signUpRequestModel populated: ' + JSON.stringify(signUpRequestModel));
			$.ajax({
				type:'POST',
				url:'/user',
				data:signUpRequestModel,
				success:function(response){
					log('success sign up');
					log(response);
					log(JSON.stringify(response));
				},
				error:function(response){
					log('error sign up');
					log(response);
					log(JSON.stringify(response));
				}

			});

		});
	});

	/*

	 Init Sign Up View

	 */
	SF.EventBus.bind('security.loginViewLoaded',function(){

		var loginButton = $('.btn-login');



		/*
		*
		* login submit button (not main navigation  that is class:cmd-auth)
		*
		* */
		loginButton.click(function(event){
			event.preventDefault();
			log('sumbit login form');
			var loginRequestModel = {};
			loginRequestModel.email = $('.form-login #Email').val();
			loginRequestModel.password = $('.form-login #Password').val();
			$.ajax({
				type:'POST',
				url:'/auth',
				data:loginRequestModel,
				success:function(response){
					/*
					* login may not have been successfull just becaus the ajax request succeeded.
					*
					* make sure the use is authenticated
					* */
					log(JSON.stringify(response));
					if (response.isAuthenticated){
						document.location.href = '/';
					}
				},
				error:function(response){
					log('error login');
					log(response);
					log(JSON.stringify(response));
				}

			});
		});
	});

	SF.EventBus.bind('security.initSignUpView',function(){
		log('Initialize Sign Up View');

//		var signUpFormMarkup = $('script#SignUpTemplate').html();
//		var textE = $('script#OrganizationListTemplate').html();

		var template = _.template($('script#SignUpTemplate').html());

		var templateData = {};

		$('.security-module-container').html(
			template( templateData )
		);

		SF.EventBus.trigger('security.signUpViewLoaded');
	});
	SF.EventBus.bind('security.initLoginView',function(){
		log('Initialize login View');



//		var signUpFormMarkup = $('script#SignUpTemplate').html();
//		var textE = $('script#OrganizationListTemplate').html();

		var template = _.template($('script#LoginFormTemplate').html());

		var templateData = {};

		$('.security-module-container').html(
			template( templateData )
		);
		SF.EventBus.trigger('security.loginViewLoaded');
	});


	return{
		init:function(callback){
			return init(callback);
		},
		initSignup:function(){
			log('|');
			log('initSignup');
			log('|');
			if ($('script#SignUpTemplate').html()){
				SF.EventBus.trigger('security.initSignUpView');
			}
			else{
				this.init(function(){
					SF.EventBus.trigger('security.initSignUpView');
				});
			}
		},
		initLogin:function(){
			log('|');
			log('initLogin');
			log('|');
			if ($('script#LoginFormTemplate').html()){
				SF.EventBus.trigger('security.initLoginView');
			}
			else{
				this.init(function(){
					SF.EventBus.trigger('security.initLoginView');
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



