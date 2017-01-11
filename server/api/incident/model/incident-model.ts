import * as mongoose from 'mongoose';

var incidentSchema = new mongoose.Schema({
	reference_no:{type: String, required: true, trim: true},
	title:{type: String, required: true, trim: true},
	development:{type: String, trim: true},
	property:{type: String, trim: true},		
	incident_type:{type: String, trim: true},
	landlord_acceptance:{type: String, trim: true},
	attachment:{type: String, trim: true},
	contract:{type: Date, trim: true},
	remark:{type: String, trim: true},
	starred_by:[{type: String, trim: true}],
	archieve:{type: String, trim: true, default: "false"},
	status:{type: String, trim: true},
	created_by:{type: String, trim: true},
	updated_at:{type: Date},
	created_at:{type: Date, default: Date.now}
});

export default incidentSchema;
