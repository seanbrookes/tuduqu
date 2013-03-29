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

		sf1.log('IA module loaded ');
		sf1.log('user locale: ' + sf1.getUserLocale());
		var anchorSelector = '#TemplateContainer';
		_.templateSettings.variable = 'P';
		init();
		sf1.EventBus.trigger('ia.templatesLoaded');


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
					title:sf1.translate(iaI18n.k18Home),
					name:sf1.translate(iaI18n.k18Home)
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
					title:sf1.translate(iaI18n.k18Admin),
					name:sf1.translate(iaI18n.k18Admin)
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
					title:sf1.translate(iaI18n.k18Login),
					name:sf1.translate(iaI18n.k18Login)
				});
			// test to make sure the user is authenicated or not before rendering this nav item
			// TODO - enhance the security to embed this logic
			//if (!sf1.isUserAuth()){
				sf1.log('user is not authenticated');
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
					title:sf1.translate(iaI18n.k18SignUp),
					name:sf1.translate(iaI18n.k18SignUp)

				});
			//}

				return templateData;

			}

		function bindEventListeners(){
			sf1.EventBus.bind('ia.templatesLoaded',function(event){
				// init main navigation
				sf1.EventBus.trigger('ia.renderMainNav');
			});
			sf1.EventBus.bind('ia.renderMainNav',function(event){
				// init main navigation
				_.templateSettings.variable = "P";
				var templateData = getMainNavMenuData();


				sf1.log('Render main nav view');
//		var signUpFormMarkup = $('script#SignUpTemplate').html();
//		var textE = $('script#OrganizationListTemplate').html();

				var template = _.template($('script#MainNavTemplate').html());
				var itemTemplate = _.template($('script#MainNavItemTemplate').html());

				$('.viewport .page-header').html(template( templateData ));
				sf1.EventBus.trigger('ia.mainNavRendered');
				sf1.EventBus.trigger('checkauth-event');
			});

		}
	}

);




