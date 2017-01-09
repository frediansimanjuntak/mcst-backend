import * as mongoose from 'mongoose';

var guestSchema = new mongoose.Schema({
	development:{type: String, required: true, trim: true},
	property:{type: String, required: true, trim: true},
	visitor:{
		prefix:{type: String, required: true, trim: true},
		full_name:{type: String, required: true, trim: true},
		vehicle:{type: String, trim: true},
		pass:{type: String, trim: true},
	},		
	purpose:{type: String, trim: true},
	remarks:{type: String, trim: true},
	visit_date:{type: Date, trim: true},
	created_by:{type: String, trim: true},
	check_in:{type: Date, trim: true},
	check_out:{type: Date, trim: true},
	checkin_by:{type: String, trim: true},
	checkout_by:{type: String, trim: true},
	created_at:{type: Date, default: Date.now}
});

export default guestSchema;
