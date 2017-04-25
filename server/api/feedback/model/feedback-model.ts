import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var feedbackSchema = new mongoose.Schema({
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property: {type: String, trim: true},		
	title: {type: String},
	privacy: {type: String},
	type: {type: String},
	content: {type: String},
	reply: {type: String},
	archieve: {type: Boolean, trim: true, default: false},
	status: {type: String, trim: true, default:"unpublish"},
	reply_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	reply_at: {type: String, trim: true},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at: {type: Date, default: Date.now}
});

export default feedbackSchema;
