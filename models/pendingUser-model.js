/**
 * Simple Framework One

 * User: sean
 * Date: 23/01/13
 * Time: 11:06 PM
 *
 *
 * pendingUser-model.js
 *
 * references:
 *  - http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
 *  - http://stackoverflow.com/questions/8567414/store-user-sessions-node-js-express-mongoose-auth
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PendingUserSchema = new Schema({
	userId : {type: String, required: true, unique: true },
	token : {type: String, required: true, unique: true },
	created: {type: Date, default: Date.now }
});


module.exports = mongoose.model('PendingUser', PendingUserSchema);


