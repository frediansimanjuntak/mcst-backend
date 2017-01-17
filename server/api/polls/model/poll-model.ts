import * as mongoose from 'mongoose';

var pollSchema = new mongoose.Schema({
	title:{type: String, required: true, trim: true},
	description:{type: String, trim: true},
	poll_type:{type: String, trim: true},		
	development:{type: String, trim: true},
	votes:[{
		property:{type: String, trim: true},
		answer:{type: String, trim: true},
		voted_by:{type: String, trim: true},
		voted_at:{type: Date}			
	}],
	choices:[{type: String}],
	outcome:{type: String},
	status:{type: String, trim: true, default:'not active'},
	created_by:{type: String, trim: true},
	created_at:{type: Date, default: Date.now}
});

export default pollSchema;
