"use strict";

import * as express from 'express';
import * as mongoose from 'mongoose';
var crypto = require('crypto')

var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: true, trim: true},
    name: {type: String},
    salulation: {type: String},
    gender: {type: String},
    email: {type: String, lowercase: true, unique: true, trim: true},
    password: {type: String},  
    salt: {type: String}, 
    role: {type: String, enum:['user', 'admin', 'superadmin', 'master'], default: "user"},
    phone:{type: String},
    provider: {type: String, default: "local"},
    emergency_contact:{
      name: {type: String},
      contact_number: {type: String}
    },
    default_property:
    {
      development: {
        type: Schema.Types.ObjectId,
        ref: 'Development'
      },
      property: {type: String },
      role: {type: String }
    },
    details:
    {
      first_name: {type: String},
      last_name: {type: String},      
      identification_type: {type: String},
      identification_no: {type: String},
      identification_proof: {
        front: {type: String},
        back: {type: String}
      }
    },
    social_profile: {
      resident_since: {type: String},
      social_interaction: {type: String},
      young_kids: {type: String},
      age_kids: {type: String},
      hobbies: [{type: String}]
    },
    private: {
      phone: {type: Boolean, default: false},
      email: {type: Boolean, default: false},
      unit: {type: Boolean, default: false}
    },
    verification: {
      verified: {type: Boolean, default: false},
      verified_date: {type: Date},
      code: {type: String}
    },
    active: {type: Boolean, default: true},
    rented_property:
    [{
      development: {
        type: Schema.Types.ObjectId,
        ref: 'Development'
      },
      property: {type: String},
      active: {type: Boolean, default: true}
    }],
    owned_property:
    [{
      development: {
        type: Schema.Types.ObjectId,
        ref: 'Development'
      },
      property: {type: String}, 
      active: {type: Boolean, default: true} 
    }],
    authorized_property:
    [{
      development: {
        type: Schema.Types.ObjectId,
        ref: 'Development'
      },
      property: {type: String}  
    }],    
    default_development: {
      type: Schema.Types.ObjectId,
      ref: 'Development' 
    },
    autorized_development: {
      type: Schema.Types.ObjectId,
      ref: 'Development'
    },
    vehicles: [{
      type: Schema.Types.ObjectId,
      ref: 'Vehicles'
    }],
    user_group: {
      type: Schema.Types.ObjectId,
      ref: 'UserGroup'
    },  
    created_at: {type: Date, default: Date.now}
});

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      name: this.name,
      role: this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
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
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
// UserSchema
//   .path('password')
//   .validate(function(password) {
//     return password.length;
//   }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
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
UserSchema
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
UserSchema.methods = {
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

export default UserSchema;