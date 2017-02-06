"use strict";

import * as mongoose from 'mongoose';

var UserGroupSchema = new mongoose.Schema({
    description: {type: String, required: true},
    chief: {type: String},
    users: [{type: String}], 
    status:{type: String},
    created_by: {type: String},
    approved_by:{type: String},
    created_at:{type: String}
});

export default UserGroupSchema;