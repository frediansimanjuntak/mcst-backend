import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var companySchema = new mongoose.Schema({
	name: {type: String, required: true, trim: true},
	business_registration: {type: String, trim: true},
	category: {type: String, trim: true},
	phone: {type: String, required: true, trim: true},		
	email: {type: String, required: true, trim: true},
	address: {
		street_name: {type: String, trim: true},
		block_no: {type: String, trim: true},
		postal_code: {type: String, trim: true},
		country: {type: String, trim: true},
		coordinates: [{type: String, trim: true}],
		type: {type: String, trim: true},
		full_address: {type: String, trim: true}
	},
	description: {type: String, trim: true},
	company_logo: [{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
	}],
	chief: {
		type: Schema.Types.ObjectId,
    	ref: 'Contractor'
	},
	employee: [{
		type: Schema.Types.ObjectId,
    	ref: 'Contractor'
	}],
	active: {type: Boolean, default: false},
	created_by: { 
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at: {type: Date, default: Date.now}
});

export default companySchema;
