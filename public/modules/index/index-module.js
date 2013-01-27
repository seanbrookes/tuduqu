/**
 * Simple Framework One
 *
 * User: sean
 * Date: 01/11/12
 * Time: 9:45 PM
 *
 */
define(
	['text!/modules/index/index-template.html'],
	function(markup) {
		log('Index module loaded ');

		var anchorSelector = '#TemplateContainer';
		// namespace for var reference in template
		_.templateSettings.variable = 'S';

		function init(){
			log('Index module init');
			var baseMarkup = $(markup);
			$(anchorSelector).html(baseMarkup);
			var indexModuleContainer = $('script#IndexModuleContainer').html();

			var template = _.template(indexModuleContainer);

			var templateData = {};

			var templateMarkup = template( templateData );
			$('.main-content-wrapper').html(templateMarkup);


			/*
			*
			* test code to demonstrate io.ajax namespace
			*
			* */
			$('#TestButton').click(function(event){
				sf1.io.ajax({
					type:'get',
					url:'/isauth',
					success:function(response){
						log('hell ya!');
						log(response);
					},
					error:function(response){
						log('hell no');
						log(response);
					}
				});
			});

		}
		return {
			init:init
		};
	}
);