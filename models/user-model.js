/**
 * Created with JetBrains WebStorm.
 * User: sean
 * Date: 02/12/12
 * Time: 7:43 AM
 *
 * user.js
 * references:
 *  - http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
 *  - http://stackoverflow.com/questions/8567414/store-user-sessions-node-js-express-mongoose-auth
 *
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10,
// these values can be whatever you want - we're defaulting to a
// max of 5 attempts, resulting in a 2 hour lock
	MAX_LOGIN_ATTEMPTS = 5,
	LOCK_TIME = 2 * 60 * 60 * 1000;

var UserSchema = new Schema({
	userName : {type: String, required: true, unique: true, trim: true },
	email : {type: String, required: true, unique: true, trim: true, lowercase: true },
	password : {type: String, required: true },
	accountStatus : {type: String, required: true },
	created: {type: Date, default: Date.now },
	preferences: [],
	loginAttempts: { type: Number, required: true, default: 0 },
	lockUntil: { type: Number }
});

UserSchema.pre('save', function(next) {
	var user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) {
		return next();
	}

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) {
			return next(err);
		}
		// hash the password along with our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {
				return next(err);
			}
			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

UserSchema.virtual('isLocked').get(function() {
	// check for a future lockUntil timestamp
	return !!(this.lockUntil && this.lockUntil > Date.now());
});
// expose enum on the model
UserSchema.statics.failedLogin = {
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
	MAX_ATTEMPTS: 2,
	INACTIVE: 3
};
// account statuses
UserSchema.statics.accountStatus = {
	ACTIVE: 'active',
	PENDING: 'pending',
	INACTIVE: 'inactive'
};
UserSchema.methods.incLoginAttempts = function(cb) {
	// if we have a previous lock that has expired, restart at 1
	if (this.lockUntil && this.lockUntil < Date.now()) {
		return this.update({
			$set: { loginAttempts: 1 },
			$unset: { lockUntil: 1 }
		}, cb);
	}
	// otherwise we're incrementing
	var updates = { $inc: { loginAttempts: 1 } };
	// lock the account if we've reached max attempts and it's not locked already
	if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
		updates.$set = { lockUntil: Date.now() + LOCK_TIME };
	}
	return this.update(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference
var reasons = UserSchema.statics.failedLogin = {
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
	MAX_ATTEMPTS: 2,
	INACTIVE: 3
};
var statuses = UserSchema.statics.accountStatus = {
	ACTIVE: 'active',
	PENDING: 'pending',
	INACTIVE: 'inactive'
};

// user friendly reason message for not logging in
// pass strigified refereces to i18n keys to the client - translations are handled in the UI
UserSchema.statics.printReason = function(reason){
	switch(reason){
		case 0:
			return 'securityI18n.k18UserNotFound';
		case 1:
			return 'securityI18n.k18IncorrectPassword';
		case 2:
			return 'securityI18n.k18AccountLocked';
		case 3:
			return 'securityI18n.k18AccountNotActive';
		default:
			return 'securityI18n.k18UnknownReason';
	}

};

UserSchema.statics.getAuthenticated = function(email, password, cb) {
	this.findOne({ email: email }, function(err, user) {
		if (err) {
			return cb(err);
		}

		// make sure the user exists
		if (!user) {
			return cb(null, null, reasons.NOT_FOUND);
		}
		// make sure the user account is active
		if (user.accountStatus !== statuses.ACTIVE) {
			return cb(null, null, reasons.INACTIVE);
		}

		// check if the account is currently locked
		if (user.isLocked) {
			// just increment login attempts if account is already locked
			return user.incLoginAttempts(function(err) {
				if (err) {
					return cb(err);
				}
				return cb(null, null, reasons.MAX_ATTEMPTS);
			});
		}

		// test for a matching password
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				return cb(err);
			}

			// check if the password was a match
			if (isMatch) {
				// if there's no lock or failed attempts, just return the user
				if (!user.loginAttempts && !user.lockUntil) {
					return cb(null, user);
				}
				// reset attempts and lock info
				var updates = {
					$set: { loginAttempts: 0 },
					$unset: { lockUntil: 1 }
				};
				return user.update(updates, function(err) {
					if (err) {
						return cb(err);
					}
					return cb(null, user);
				});
			}

			// password is incorrect, so increment login attempts before responding
			user.incLoginAttempts(function(err) {
				if (err) {
					return cb(err);
				}
				return cb(null, null, reasons.PASSWORD_INCORRECT);
			});
		});
	});
};

module.exports = mongoose.model('User', UserSchema);

