import * as mongoose from 'mongoose';

var petitionSchema = new mongoose.Schema({
	reference_no:{type: String, required: true, trim: true},
	development:{type: String, trim: true},
	property:{type: String, trim: true},		
	petition_type:{type: String, trim: true},
	attachment:{type: Date, trim: true},
	contract:{type: Date, trim: true},
	remark:{type: String, trim: true},
	archieve:{type: String, trim: true, default: "false"},
	status:{type: String, trim: true},
	created_by:{type: String, trim: true},
	updated_at:{type: Date},
	created_at:{type: Date, default: Date.now}
});

export default petitionSchema;
