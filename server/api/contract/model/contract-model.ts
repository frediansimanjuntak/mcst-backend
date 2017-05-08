import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var contractSchema = new mongoose.Schema({
	reference_no: {type: String, required: true, trim: true},
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property: {type: String, trim: true},
	company: {
		type: Schema.Types.ObjectId,
    	ref: 'Company'
	},
	title: {type: String, required: true, trim: true},		
	contract_type: {type: String, trim: true},
	reference_type: {type: String, trim: true},
	reference_id: {type: String, trim: true},
	attachment: [{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
	}],
	quotations: [{
		type: Schema.Types.ObjectId,
    	ref: 'Quotation'
	}],
	confirmation:{
		costumer: {
			sign: {type: String, trim: true},
			date: {type: Date},
			remarks: {type: String}
		},
		contractor: {
			sign: {type: String, trim: true},
			date: {type: Date},
			remarks: {type: String}
		}
	},
	purchase_order: {type: String, trim: true},
	start_time: {type: Date, trim: true},
	end_time: {type: Date, trim: true},
	schedule: [{
			days:{type: String, trim: true},
			start_time: {type: Date, trim: true},
			end_time: {type: Date, trim: true}			
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
			posted_on : {type: Date, trim: true}
	}],
	contract_notice : [{
			title : {type: String, trim: true},
			start_time : {type: Date, trim: true},
			end_time : {type: Date, trim: true},
			affected_area : {type: String, trim: true},
			description: {type: String, trim: true},
			attachment : [{
				type: Schema.Types.ObjectId,
    			ref: 'Attachment'
			}],
			update_at: {type: Date},
			created_at: {type: Date},
			publish : {type: Boolean, default: false}
	}],
	tracking_document: [{type: String, trim: true}],
	remark: [{type: String, trim: true}],
	status: {type: String, trim: true, default: "open"},
	updated_at: {type: Date},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at: {type: Date, default: Date.now}
});

export default contractSchema;
	