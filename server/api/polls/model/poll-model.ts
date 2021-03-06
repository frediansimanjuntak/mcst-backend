import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;
// var DateOnly = require('mongoose-dateonly')(mongoose);

var pollSchema = new mongoose.Schema({
	title: {type: String, required: true, trim: true},
	description: {type: String, trim: true},
	poll_type: {type: String, trim: true},		
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	votes: [{
		property: {type: String, trim: true},
		answer: {type: String, trim: true},
		voted_by: {
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		voted_at: {type: Date}			
	}],
	start_time: {type: Date},
	end_time: {type: Date},
	choices: [{type: String}], 
	outcome: {type: String},
	status: {
		type: String,
		enum: ['draft', 'active', 'end poll']
	},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at: {type: Date, default: Date.now}
});

export default pollSchema;
