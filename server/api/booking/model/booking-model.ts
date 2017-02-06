import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var bookingSchema = new mongoose.Schema({
	reference_no:{type: String, required: true, trim: true},
	development:{
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property:{type: String, trim: true},		
	facility:{
		type: Schema.Types.ObjectId,
    	ref: 'Facility'
	},
	booking_type:{type: String, trim: true},
	booking_date:{type: Date, trim: true},
	start_time:{type: String, trim: true},
	end_time:{type: String, trim: true},
	payment:{type: String, trim: true},
	remark:{type: String, trim: true},
	status:{type: String, trim: true, default:'unpaid'},
	created_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at:{type: Date, default: Date.now}
});

export default bookingSchema;
