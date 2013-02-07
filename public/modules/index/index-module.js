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
		sf1.log('Index module loaded ');

		var anchorSelector = '#TemplateContainer';
		// namespace for var reference in template
		_.templateSettings.variable = 'S';

		function init(){
			sf1.log('Index module init');
			var baseMarkup = $(markup);
			$(anchorSelector).html(baseMarkup);

		}
		function render(){
			var indexModuleContainer = $('script#IndexModuleContainer').html();

			var template = _.template(indexModuleContainer);

			var templateData = {};

			var templateMarkup = template( templateData );
			$('.main-content-wrapper').after(templateMarkup);


			/*
			 *
			 * test code to demonstrate io.ajax namespace
			 *
			 * */
			$('.btn-get-urls').click(function(event){
				sf1.EventBus.trigger('url.getRecentEvent');

			}).hide();
			sf1.EventBus.bind('url.getRecentEvent',function(){
				getRecentUrls();
			});
			sf1.EventBus.bind('url.addNewUrl',function(){
				getRecentUrls();
			});


			$('.btn-proc-urls').click(function(event){
				sf1.io.ajax({
					type:'get',
					url:'/procurls',
					success:function(response){
						var resObj = response.response;
						sf1.log('hell ya!');
						sf1.log(resObj);
						var outputMarkup;
						for (var i = 0;i < resObj.length;i++){
							outputMarkup += '<li><a href="' + resObj[i] + '" target="_new"><span>' + resObj[i] + '</span></a></li>';
						}
						$('.proc-url-list').html(outputMarkup);
					},
					error:function(response){
						sf1.log('hell no');
						sf1.log(response);
					}
				});
			});
			sf1.EventBus.trigger('url.getRecentEvent');
		}
		var getRecentUrls = function(){
			sf1.io.ajax({
				type:'get',
				url:'/urls',
				success:function(response){
					var resObj = response.response;
					sf1.log('hell ya!');
					sf1.log(resObj);
					var outputMarkup;
					for (var i = 0;i < resObj.length;i++){
						var urlObj = resObj[i];
						outputMarkup += '<li><span class="date-pretty" title="' + urlObj.created + '"> ' + urlObj.created + ' </span> - <a href="' + urlObj.url + '" target="_new"><span> ' + resObj[i].url + ' </span></a></li>';
					}
					$('.url-list').html(outputMarkup);
					$('span.date-pretty').prettyDate();
				},
				error:function(response){
					sf1.log('hell no');
					sf1.log(response);
				}
			});
		};
		return {
			init:init,
			render:render
		};
	}
);