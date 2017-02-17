import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var facilitySchema = new mongoose.Schema({
	name: {type: String, required: true, trim: true},
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	description: {type: String, trim: true},	
	payment_type: {type: String, trim: true},
	booking_type: {type: String, trim: true},
	booking_fee: {type: String},
	deposit_fee: {type: String},
	admin_fee: {type: String},
	schedule: [{
		day: {type: String, trim: true},
		start_time: {type: String, trim: true},
		end_time: {type: String, trim: true}		
	}],
	maintenance: [{
		start_date: {type: Date, trim: true},
		end_date: {type: Date, trim: true}
	}],
	status: {type: String, trim: true},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at: {type: Date, default: Date.now}
});

export default facilitySchema;
