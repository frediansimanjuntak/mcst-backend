import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var guestSchema = new mongoose.Schema({
	development:{
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
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
	created_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	check_in:{type: Date, trim: true},
	check_out:{type: Date, trim: true},
	checkin_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	checkout_by:{
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at:{type: Date, default: Date.now}
});

export default guestSchema;
