import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var paymentBookingSchema = new mongoose.Schema({
	serial_no: {type: String, required: true, trim: true},
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property: {type: String, trim: true},		
	payment_type: {type: String, trim: true},
	payment_proof: [{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
    }],
	sender: {type: String, trim: true},
	receiver: {type: String, trim: true},
	fees: [{
			deposit_fee: {type: String, trim: true},
			booking_fee: {type: String, trim: true},
			admin_fee: {type: String, trim: true},
			status: {type: String, trim: true}
	}],
	total_amount: {type: String, trim: true},
	remark: {type: String, trim: true},
	status: {type: String, trim: true, default: "unpaid"},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at: {type: Date, default: Date.now}
});

export default paymentBookingSchema;
