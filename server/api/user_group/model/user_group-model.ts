"use strict";

import * as mongoose from 'mongoose';

var UserGroupSchema = new mongoose.Schema({
    description: {type: String, required: true},
    chief: {type: String, required: true},
    users: [{type: String, required: true}], 
    status:{type: String, required: true},
    created_by: {type: String, required: true},
    approved_by:{type: String, required: true},
    created_at:{type: String}
});

export default UserGroupSchema;