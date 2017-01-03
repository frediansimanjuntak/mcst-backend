import * as mongoose from 'mongoose';

var facilitySchema = new mongoose.Schema({
	name:{type: String, required: true, trim: true},
	development:{type: String, trim: true},
	description:{type: String, trim: true},		
	facility_type:{type: String, trim: true},
	payment_type:{type: String, trim: true},
	booking_type:{type: String, trim: true},
	schedule:[{
		day:[{type: String, trim: true}],
		start_time:{type: Date, trim: true},
		end_time:{type: Date, trim: true}		
	}],
	maintenance:[{
		start_date:{type: Date, trim: true},
		end_date:{type: Date, trim: true}
	}],
	status:{type: String, trim: true},
	created_by:{type: String, trim: true},
	created_at:{type: Date, default: Date.now}
});

export default facilitySchema;
