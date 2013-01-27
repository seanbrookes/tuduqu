/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 02/12/12
 * Time: 7:48 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 02/12/12
 * Time: 7:43 AM
 * To change this template use File | Settings | File Templates.
 *
 *
 *
 * http://terokarvinen.com/2012/getting-started-with-openlayers-and-openstreetmap
 * http://geocoder.ca/
 * http://nominatim.openstreetmap.org/search.php?q=26227+62nd+avenue%2C+Aldergrove%2C+BC&viewbox=-201.8%2C84.94%2C201.8%2C-79.69
 * http://openlayers.org/dev/examples/
 */
/**
 * post producer data
 *
 * @param req
 * @param res
 */
require('url');
require('request');


exports.getGeoLocation = function(req, res){
	console.log('--------------------------------');
	console.log('|[exports.getGeoLocation]   exports.getGeoLocation   A');
	console.log('--------------------------------');

	var producer;
	console.log(req.url);
	var geoCodeServiceUrl = req.url;
	//var geoCodeServiceUrl = 'http://localhost:3001/geocode';
	console.log('post to geoizr: ' + geoCodeServiceUrl);

	console.log('|[exports.getGeoLocation] -------------------------------------------');
	console.log('|');
	console.log('|');
	console.log('|');
	console.log('|[exports.getGeoLocation] ');
};
exports.postGeoLocation = function(req,res){
	console.log('|[exports.postGeoLocation]');
	console.log('|[exports.postGeoLocation]  req body: ' + JSON.stringify(req.body));
	//var geoCodeServiceUrl = 'http://localhost:3001/geocode?address=' + encodeURI(req.body.address);
	var geoCodeServiceUrl = 'http://fierce-river-4917.herokuapp.com/geocode?address=' + encodeURIComponent(req.body.address);
	var request = require('request');
	console.log("URL: " + geoCodeServiceUrl);
	var reqObj = {};
	reqObj.url = geoCodeServiceUrl;
	//reqObj.path = '/geocode?address=' + req.body.address;
	reqObj.port = 80;
	var x = '';

	request.get(reqObj, function (error, response, body) {
		x = body;
		if (!error && response.statusCode == 200 && body) {
			console.log('GEOCODE:  ' + x); // Print the google web page.
			res.send(x);

		}
		else{
			console.log('NO GEO CODE');
			res.send('');
		}

	});




};
