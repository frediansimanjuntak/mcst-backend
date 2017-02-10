"use strict";

import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var UserGroupSchema = new mongoose.Schema({
    description: {type: String, required: true},
    chief: {
    	type: Schema.Types.ObjectId,
    	ref: 'User'
    },
    development:{
    	type: Schema.Types.ObjectId,
    	ref: 'Development'
    },
    users: [{
    	type: Schema.Types.ObjectId,
    	ref: 'User'
    }], 
    status: {type: String},
    created_by: {
    	type: Schema.Types.ObjectId,
    	ref: 'User'
    },
    approved_by: {type: String},
    created_at: {type: String}
});

export default UserGroupSchema;