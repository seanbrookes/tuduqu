/**
 * Social Framework

 * User: sean
 * Date: 25/12/12
 * Time: 11:18 PM
 *
 */
require(
	["modules/ia/ia-i18n","text!/modules/ia/ia-template.html"],
	function(i18n,template) {

		var that = this;
		bindEventListeners();

		log('IA module loaded ');
		log('user locale: ' + SF.userLocale());
		var anchorSelector = '#TemplateContainer';
		_.templateSettings.variable = 'P';
		init();
		SF.EventBus.trigger('ia.templatesLoaded');


		//var iaModule = (function(exports,$){
			//_.templateSettings.variable = "P";


//			function init(callback){
//
//				$(anchorSelector).load('modules/ia/ia-template.html',function(template){
//
//					if (callback){
//						callback();
//					}
//
//
//				});
//			}

		function init(){
			var baseMarkup = $(template);
			$(anchorSelector).html(baseMarkup);
		}

		var renderAttrib = function(attrib){
				return 'x';
			};

		function getMainNavMenuData(){
				var templateData = {};
				templateData.mainNavItems = [];
				/*
				 *
				 * home
				 *
				 * */
				templateData.mainNavItems.push({
					href:'#home',
					cssClasses:[
						'main-nav-item'
					],
					dataAttribs:[
						{
							name:'route',
							value:'home'
						},
						{
							name:'i18nkey',
							value:'baseI18n.k18Home'
						}
					],
					title:SF.T(iaI18n.k18Home),
					name:SF.T(iaI18n.k18Home)
				});
				/*
				 *
				 * admin
				 *
				 * */
				templateData.mainNavItems.push({
					cssClasses:[
						'main-nav-item'
					],
					dataAttribs:[
						{
							name:'route',
							value:'admin'
						},
						{
							name:'i18nkey',
							value:'iaI18n.k18Admin'
						}
					],
					href:'#admin',
					title:SF.T(iaI18n.k18Admin),
					name:SF.T(iaI18n.k18Admin)
				});
				/*
				 *
				 * login
				 *
				 * */
				templateData.mainNavItems.push({
					cssClasses:[
						'main-nav-item',
						'cmd-auth'
					],
					dataAttribs:[
						{
							name:'route',
							value:'login'
						},
						{
							name:'i18nkey',
							value:'iaI18n.k18Login'
						}
					],
					href:'#login',
					title:SF.T(iaI18n.k18Login),
					name:SF.T(iaI18n.k18Login)
				});
				/*
				 *
				 * signup
				 *
				 * */
				templateData.mainNavItems.push({
					href:'#signup',
					cssClasses:[
						'main-nav-item'
					],
					dataAttribs:[
						{
							name:'route',
							value:'signup'
						},
						{
							name:'i18nkey',
							value:'iaI18n.k18SignUp'
						}
					],
					title:SF.T(iaI18n.k18SignUp),
					name:SF.T(iaI18n.k18SignUp)

				});

				return templateData;

			}

		function bindEventListeners(){
			SF.EventBus.bind('ia.templatesLoaded',function(event){
				// init main navigation
				SF.EventBus.trigger('ia.renderMainNav');
			});
			SF.EventBus.bind('ia.renderMainNav',function(event){
				// init main navigation
				_.templateSettings.variable = "P";
				var templateData = getMainNavMenuData();


				log('Render main nav view');
//		var signUpFormMarkup = $('script#SignUpTemplate').html();
//		var textE = $('script#OrganizationListTemplate').html();

				var template = _.template($('script#MainNavTemplate').html());
				var itemTemplate = _.template($('script#MainNavItemTemplate').html());

				$('.main-content header').html(template( templateData ));
				SF.EventBus.trigger('ia.mainNavRendered');
				SF.EventBus.trigger('checkauth-event');
			});

		}
	}

);




