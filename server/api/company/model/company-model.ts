import * as mongoose from 'mongoose';

var companySchema = new mongoose.Schema({
	name:{type: String, required: true, trim: true},
	registration_no:{type: String, trim: true},
	category:{type: String, trim: true},
	phone:{type: String, trim: true},		
	email:{type: String, trim: true},
	address:{
		street_name:{type: String, trim: true},
		block_no:{type: String, trim: true},
		postal_code:{type: String, trim: true},
		country:{type: String, trim: true},
		coordinates:[{type: String, trim: true}],
		type:{type: String, trim: true},
		full_address:{type: String, trim: true}
	},
	description:{type: String, trim: true},
	company_logo:{type: String, trim: true},
	chief:{type: String, trim: true},
	employee:[{type: String, trim: true}],
	active:{type: String, trim: true, default:'false'},
	created_by:{type: String, trim: true},
	created_at:{type: Date, default: Date.now}
});

export default companySchema;
