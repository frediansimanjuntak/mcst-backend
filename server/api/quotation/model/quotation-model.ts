import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var quotationSchema = new mongoose.Schema({	
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property: {type: String, trim: true},
	assignment: {type: String, trim: true},		
	offered_price: {type: String, trim: true},
	attachment: [{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
	}],
	choosen_schedule: [{
			days: {type: String, trim: true},
			date: {type: Date, trim: true},
			start_time: {type: String, trim: true},
			end_time: {type: String, trim: true}			
		}],
	company: {
		type: Schema.Types.ObjectId,
    	ref: 'Company'
	},
	contractor: {type: String, trim: true},
	remark: {type: String, trim: true},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at: {type: Date, default: Date.now}
});

export default quotationSchema;
