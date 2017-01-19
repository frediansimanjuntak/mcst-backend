import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var contractSchema = new mongoose.Schema({
	reference_no:{type: String, required: true, trim: true},
	development:{
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property:{type: String, trim: true},
	title:{type: String, trim: true},		
	contract_type:{type: String, trim: true},
	reference_type:{type: String, trim: true},
	reference_id:{
		type: Schema.Types.ObjectId,
    	ref: 'Incident'
	},
	attachment:[{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
	}],
	quotations:[{
		type: Schema.Types.ObjectId,
    	ref: 'Quotation'
	}],
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
			attachment : [{
				type: Schema.Types.ObjectId,
    			ref: 'Attachment'
			}],
			posted_by : {
				type: Schema.Types.ObjectId,
    			ref: 'User'
			},
			posted_on : {type: String, trim: true}
	    }],
	contract_notice : [{
			title : {type: String, trim: true},
			start_time : {type: Date, trim: true},
			end_time : {type: Date, trim: true},
			description: {type: String, trim: true},
			attachment : [{
				type: Schema.Types.ObjectId,
    			ref: 'Attachment'
			}],
			publish : {type: String, trim: true, default: "false"}
		}],
	tracking_document:[{type: String, trim: true}],
	remark:[{type: String, trim: true}],
	status:{type: String, trim: true},
	created_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at:{type: Date, default: Date.now}
});

export default contractSchema;
