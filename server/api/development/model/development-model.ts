// import * as mongoose from 'mongoose';

import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var developmentSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    owner: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    properties:[{type: Schema.Types.ObjectId, ref: 'Properties'}],
    newsletter:[{type: Schema.Types.ObjectId, ref: 'Newsletter'}]      
});
var Properties = require('../../properties/model/properties-model');
var Newsletter = require('../../newsletter/model/newsletter-model');

export default developmentSchema;
