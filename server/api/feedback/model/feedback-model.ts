import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var feedbackSchema = new mongoose.Schema({
	development:{
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property:{type: String, required: true, trim: true},		
	title:{type: String, trim: true},
	feedback_type:{type: String, trim: true},
	feedback_reply:{type: String, trim: true},
	feedback_privacy:{type: String, trim: true},
	archieve:{type: Boolean, trim: true, default: false},
	remarks:{type: String, trim: true},
	status:{type: String, trim: true, default:"unpublish"},
	reply_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	reply_at:{type: String, trim: true},
	created_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at:{type: Date, default: Date.now}
});

export default feedbackSchema;
