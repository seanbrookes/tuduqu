/**
 * Simple Framework One
 *
 * User: sean
 * Date: 05/11/12
 * Time: 10:46 PM
 *
 *
 */

define(
	["modules/admin/admin-i18n","text!/modules/admin/admin-template.html"],
	function(i18n,markup) {
		log('Admin module loaded ');

		var anchorSelector = '#TemplateContainer';
		_.templateSettings.variable = 'P';


		function init(){
			log('Admin module init');
			var baseMarkup = $(markup);
			$(anchorSelector).html(baseMarkup);
			var adminModuleContainer = $('script#AdminModuleContainer').html();

			var template = _.template(adminModuleContainer);

			var templateData = {};

			var templateMarkup = template( templateData );
			$('.main-content-wrapper').html(templateMarkup);

			$('.btn-list-pending').click(function(event){
				log('list accounts');
				$.ajax({
					type:'get',
					url:'/pendingaccounts',
					success:function(response){
						log('success get pending accounts');
						log(response);

					},
					error:function(response){
						log('error get pending accounts: ' + response);
					}
				});
			});
		}
		return {
			init:init
		};
	}
);


