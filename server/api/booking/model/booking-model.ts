import * as mongoose from 'mongoose';

var bookingSchema = new mongoose.Schema({
	reference_no:{type: String, required: true, trim: true},
	development:{type: String, trim: true},
	property:{type: String, trim: true},		
	facility:{type: String, trim: true},
	booking_type:{type: String, trim: true},
	booking_date:{type: Date, trim: true},
	start_time:{type: Date, trim: true},
	end_time:{type: Date, trim: true},
	payment:{type: String, trim: true},
	remark:{type: String, trim: true},
	status:{type: String, trim: true, default:'pending'},
	created_by:{type: String, trim: true},
	created_at:{type: Date, default: Date.now}
});

export default bookingSchema;
