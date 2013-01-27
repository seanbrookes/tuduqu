/**
 * Simple Framework One

 * User: sean
 * Date: 05/01/13
 * Time: 9:31 AM
 *
 */
/**
 *
 * Baseline - make sure object is supported
 *
 *
 *
 * Twitter and Google+ to instantly connect to what's most important to me, as well as follow my friends, experts, and favorite celebs.
 LinkedIn to manage my professional identity and engage with my professional network.
 Vizify to provide a quick way for new followers to visualize my Bio.
 YouTube to categorize, store and share my professional videos.
 Instagram to share snapshots from my global business ventures...
 Newsle to track articles about my friends, colleagues or anyone else I care about.
 Klout to manage my social media reach
 */

require(
	['scripts/client-app','modules/security/security-module','modules/ia/ia-module','scripts/router'],
	function(client,security,ia,i18n,router) {

		//App.initialize();
		(function(exports){
			var sf1 = {};

			sf1.io = Object.create({});
			sf1.io.ajax = function(ioObj){
				if (ioObj){
					// check if there is an ajax request type and other properties
					// make sure the required parameters (url and type are there )
					$.ajax(ioObj);
					log('in sfo.io.ajax');
					log(ioObj);


				}
			};

			exports.sf1 = sf1;
		}(window));

	}
);