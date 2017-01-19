import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

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
	company_logo:[{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
	}],
	chief:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	employee:[{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	}],
	active:{type: String, trim: true, default:'false'},
	created_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at:{type: Date, default: Date.now}
});

export default companySchema;
