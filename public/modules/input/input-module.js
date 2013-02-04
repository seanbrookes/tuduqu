/**
 * tuduqu
 *
 * User: sean
 * Date: 02/02/13
 * Time: 6:02 PM
 *
 *
 * input-module.js
 *
 * module for handling content input
 *
 * primarally for link posting
 *
 */
define(
	["modules/input/input-i18n","text!/modules/input/input-template.html"],
	function(i18n,template) {

		var that = this;


		sf1.log('Input module loaded ');
		sf1.log('user locale: ' + sf1.getUserLocale());
		var anchorSelector = '#TemplateContainer';
		_.templateSettings.variable = 'T';

		sf1.EventBus.trigger('input.templatesLoaded');


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

		function render(){
			var formMarkup = $('#URLFormContainer').html();
			$('.main-content-wrapper').html(formMarkup);
			bindEventListeners();
			sf1.log('render input form');
			$('.btn-submit-url').click(function(event){
				event.preventDefault();
				sf1.EventBus.trigger('input.URLFormSubmit');
			});
			}



		function bindEventListeners(){

			sf1.EventBus.bind('input.URLFormSubmit',function(event){
				// get the form field values
				// validate
				// post the form
				sf1.log('Sumbit URL form');
				var urlVal = $('#URLInputField').val();
				if (urlVal){
					// submit the url
					sf1.log('URL to post: ' + urlVal);
					var contentSubmissionObj = {};
					contentSubmissionObj.url = urlVal;

					// TODO - put some logic to determine if user is logged in and add user info to post object
					sf1.io.ajax({
						type:'post',
						url:'/in',
						data:contentSubmissionObj,
						success:function(response){
							sf1.log('successful in post');
							sf1.log(response);
						},
						error:function(response){
							sf1.log('error posting input: ');
							sf1.log(response);
						}
					})
				}
			});

		}

		return{
			init:init,
			render:render
		}
	}

);
