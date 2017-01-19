import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var incidentSchema = new mongoose.Schema({
	reference_no:{type: String, required: true, trim: true},
	title:{type: String, required: true, trim: true},
	development:{
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property:{type: String, trim: true},		
	incident_type:{type: String, trim: true},
	landlord_acceptance:{type: String, trim: true},
	attachment:{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
	},
	contract:{type: Date, trim: true},
	remark:{type: String, trim: true},
	starred_by:[{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	}],
	archieve:{type: String, trim: true, default: "false"},
	status:{type: String, trim: true},
	created_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	updated_at:{type: Date},
	created_at:{type: Date, default: Date.now}
});

export default incidentSchema;
