import * as mongoose from 'mongoose';

var paymentBookingSchema = new mongoose.Schema({
	serial_no:{type: String, required: true, trim: true},
	development:{type: String, trim: true},
	property:{type: String, trim: true},		
	payment_type:{type: String, trim: true},
	payment_proof:[{type: String, trim: true}],
	sender:{type: String, trim: true},
	receiver:{type: String, trim: true},
	fees:[
		{
			deposit_fee: {type: String, trim: true},
			status:{type: String, trim: true}
		},
		{
			booking_fee:{type: String, trim: true},
			status:{type: String, trim: true}
		},
		{
			admin_fee:{type: String, trim: true},
			status:{type: String, trim: true}
		}
	],
	total_amount:{type: String, trim: true},
	remark:{type: String, trim: true},
	status:{type: String, trim: true},
	created_by:{type: String, trim: true},
	created_at:{type: Date, default: Date.now}
});

export default paymentBookingSchema;
