"use strict";

import * as express from 'express';
import * as mongoose from 'mongoose';

var Schema = mongoose.Schema;

var FaqSchema = new mongoose.Schema({
	question: {type: String, required: true},
	answer: {type: String, required: true},
	for: {type: String},
	created_at: {type: Date, default: Date.now},
	created_by: {
		type: Schema.Types.ObjectId,
		ref: 'Users'
	}
});

export default FaqSchema;