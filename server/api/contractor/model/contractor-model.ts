import * as express from 'express';
import * as mongoose from 'mongoose';
// import * as crypto from 'crypto';
var crypto = require('crypto');
var Schema = mongoose.Schema;

var contractorSchema = new mongoose.Schema({
	username: {type: String, lowercase: true, unique: true, required: true, trim: true},
	password: {type: String, trim: true},
	salt: {type: String},
	phone: {type: String, trim: true},
  role: {type: String, trim: true, default: "contractor"},
	email: {type: String, lowercase: true, unique: true, trim: true},	
	address: {
		street_name: {type: String, trim: true},
		block_no: {type: String, trim: true},
		postal_code: {type: String, trim: true},
		country: {type: String, trim: true},
		full_address: {type: String, trim: true}
	},
	profile_picture: {type: String, trim: true},
	description: {type: String, trim: true},
	company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
	position: {type: String, trim: true},
	active: {type: Boolean, default:false},
	created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
	created_at: {type: Date, default: Date.now}
});

// Public profile information
contractorSchema
  .virtual('profile')
  .get(function() {
    return {
      name: this.name,
      role: this.role
    };
  });

// Non-sensitive info we'll be putting in the token
contractorSchema
  .virtual('token')
  .get(function() {
    return {
      _id: this._id,
      role: this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
contractorSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
contractorSchema
  .path('password')
  .validate(function(password) {
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
contractorSchema
  .path('email')
  .validate(function(value, respond) {
    return this.constructor.findOne({ email: value }).exec()
      .then(user => {
        if(user) {
          if(this.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      })
      .catch(function(err) {
        throw err;
      });
  }, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
contractorSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if(!this.isModified('password')) {
      return next();
    }

    if(!validatePresenceOf(this.password)) {
      return next(new Error('Invalid password'));
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if(saltErr) {
        return next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if(encryptErr) {
          return next(encryptErr);
        }
        this.password = hashedPassword;
        return next();
      });
    });
  });

/**
 * Methods
 */
contractorSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} password
   * @param {Function} callback
   * @return {Boolean}
   * @api public
   */
  authenticate(password, callback) {
    if(!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if(err) {
        return callback(err);
      }

      if(this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

  /**
   * Make salt
   *
   * @param {Number} [byteSize] - Optional salt byte size, default to 16
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  makeSalt(byteSize, callback) {
    var defaultByteSize = 16;

    if(typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if(typeof arguments[1] === 'function') {
      callback = arguments[1];
    } else {
      throw new Error('Missing Callback');
    }

    if(!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if(err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('base64'));
      }
    });
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @param {Function} callback
   * @return {String}
   * @api public
   */
  encryptPassword(password, callback) {
    if(!password || !this.salt) {
      if(!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    var defaultIterations = 10000;
    var defaultKeyLength = 64;
    var salt = new Buffer(this.salt, 'base64');

    if(!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength)
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, (err, key) => {
      if(err) {
        return callback(err);
      } else {
        return callback(null, key.toString('base64'));
      }
    });
  }
};

export default contractorSchema;
