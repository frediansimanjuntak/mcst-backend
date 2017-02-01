import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var paymentreminderSchema = new mongoose.Schema({
	development:{
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	// property:{type: String, required: true, trim: true},
	title:{type: String, trim: true},
	auto_issue_on:{type: String, trim: true},
	due_on:{type: String, trim: true},
	message_to_receiver:{type: String, trim: true},
	notification_list:[{
		charge:{type: String, trim: true},
		remarks:{type: String, trim: true},
		applies_to:{type: String, trim: true},
		amount:{type: String, trim: true}
	}],
	publish:{type: String, trim: true, default:"false"},
	created_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at:{type: Date, default: Date.now}
});

export default paymentreminderSchema;
