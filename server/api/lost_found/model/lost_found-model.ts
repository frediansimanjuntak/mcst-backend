import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var lostfoundSchema = new mongoose.Schema({
	development:{
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property:{type: String, trim: true},
	type:{type: String, trim: true},
	description:{type: String, trim: true},
	photo:[{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
	}],
	preferred_method_of_contact:{type: String, trim: true},
	archieve:{type: Boolean, default: false},
	created_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at:{type: Date, default: Date.now}
});

export default lostfoundSchema;
