import * as mongoose from 'mongoose';

var accesscontrolSchema = new mongoose.Schema({
	card_number:{type: String, required: true, trim: true},
	issued_to:{type: String, trim: true},
	unit_number:{type: String, trim: true},		
	access_level:{type: String, trim: true},
	issued_by:{type: String, trim: true},
	issued_on:{type: String, trim: true},
	status:{type: String, trim: true},
	created_at:{type: Date, default: Date.now}
});

export default accesscontrolSchema;
