import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var paymentSchema = new mongoose.Schema({
	serial_no: {type: String, required: true, trim: true},
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	reference_id : {type: String, trim: true},
	property: {type: String, trim: true},		
	payment_type: {type: String, trim: true},
	payment_proof: [{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
    }],
    payment_method: {type: String, trim: true},
	sender: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	receiver: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	fees: [{
			deposit_fee: {type: Number, trim: true},
			booking_fee: {type: Number, trim: true},
			admin_fee: {type: Number, trim: true},
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

export default paymentSchema;
