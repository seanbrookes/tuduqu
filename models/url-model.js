/**
 * tuduqu
 *
 * User: sean
 * Date: 02/02/13
 * Time: 5:54 PM
 *
 *
 * content-model.js
 *
 * file to handle the db models of content
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var URLSchema = new Schema({
	url : {type: String, required: true, unique: true },
	userId : {type: String, default: 'anonymous' },
	created: {type: Date, default: Date.now }
});

module.exports = mongoose.model('URL', URLSchema);


