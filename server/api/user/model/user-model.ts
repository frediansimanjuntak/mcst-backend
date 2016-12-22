"use strict";

import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true, required: true},
    email: {type: String, lowercase: true, unique: true, required: true},
    password: {type: String, required: true},    
    role: {type: String, default: 'user'}, // 'admin' and 'user'
    phone:{type: String},
    provider:  {type: String},
    default_property:
    {
      development:{  type: String },
      property:{ type: String },
      role:{ type: String }
    },
    details:
    {
      first_name:{type: String},
      last_name:{type: String},
      identification_type:{type: String},
      identification_no:{type: String},
      identification_proof:{
        front:{type: String},
        back:{type: String}
      }
    },
  rented_property:
  [{
    development:{type: String},
    property:{type: String}
  }],
  owned_property:
  [{
    development:{type: String},
    property:{type: String}  
  }],
  authorized_property:
  [{
    development:{type: String},
    property:{type: String}  
  }],
  active:{type: String},
  default_development:{type: String},
  autorized_development:{type: String},
  user_group:{type: String},
  created_at:{type: String}
});


export default UserSchema;