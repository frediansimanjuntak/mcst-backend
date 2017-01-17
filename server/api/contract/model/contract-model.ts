import * as mongoose from 'mongoose';

var contractSchema = new mongoose.Schema({
	reference_no:{type: String, required: true, trim: true},
	development:{type: String, trim: true},
	property:{type: String, trim: true},
	title:{type: String, trim: true},		
	contract_type:{type: String, trim: true},
	reference_type:{type: String, trim: true},
	reference_id:{type: String, trim: true},
	attachment:[{type: String, trim: true}],
	quotations:[{type: String, trim: true}],
	purchase_order:{type: String, trim: true},
	start_time:{type: Date, trim: true},
	end_time:{type: Date, trim: true},
	schedule:[{
			days:{type: String, trim: true},
			start_time:{type: Date, trim: true},
			end_time:{type: Date, trim: true}			
		}],
	contract_note : [{
			note_remark : {type: String, trim: true},
			attachment : [{type: String, trim: true}],
			posted_by : {type: String, trim: true},
			posted_on : {type: String, trim: true}
	    }],
	contract_notice : [{
			title : {type: String, trim: true},
			start_time : {type: Date, trim: true},
			end_time : {type: Date, trim: true},
			description: {type: String, trim: true},
			attachment : [{type: String, trim: true}],
			publish : {type: String, trim: true, default: "false"}
		}],
	tracking_document:[{type: String, trim: true}],
	remark:[{type: String, trim: true}],
	status:{type: String, trim: true},
	created_by:{type: String, trim: true},
	created_at:{type: Date, default: Date.now}
});

export default contractSchema;
