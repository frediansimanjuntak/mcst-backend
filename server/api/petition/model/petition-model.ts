import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var petitionSchema = new mongoose.Schema({
	reference_no: {type: String, trim: true},
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property: {type: String, trim: true},		
	petition_type: {type: String, trim: true},
	attachment: [{
			type: Schema.Types.ObjectId,
	    	ref: 'Attachment'
		}],
	contract: {
		type: Schema.Types.ObjectId,
    	ref: 'Contract'
	},
	additional : {},
	remark: {type: String, trim: true},
	archieve: {type: Boolean, trim: true, default: false},
	status: {type: String, trim: true, default: "pending"},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	updated_at: {type: Date},
	created_at: {type: Date, default: Date.now}
});

export default petitionSchema;
