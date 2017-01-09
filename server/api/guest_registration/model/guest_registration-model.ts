import * as mongoose from 'mongoose';

var guestSchema = new mongoose.Schema({
	development:{type: String, trim: true},
	property:{type: String, trim: true},
	visitor:{
		prefix:{type: String, trim: true},
		full_name:{type: String, trim: true},
		vehicle:{type: String, trim: true},
		pass:{type: String, trim: true},
	},		
	purpose:{type: String, trim: true},
	remarks:{type: String, trim: true},
	visit_date:{type: Date, trim: true},
	created_by:{type: String, trim: true},
	check_in:{type: Date, trim: true},
	check_out:{type: Date, trim: true},
	checked_by:{type: String, trim: true},
	created_at:{type: Date, default: Date.now}
});

export default guestSchema;
