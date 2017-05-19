import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var contactDirectorySchema = new mongoose.Schema({
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	name: {type: String, required: true},
	type_contact: {type: String, enum: ['other', 'management']},
	service: {type: String},
	register_number: {type: String},
	ratings: {type: Number},
	address: {type: String},
	website: {type: String},
	contact: {type: String},
	created_at: {type: Date, default: Date.now}
});

export default contactDirectorySchema;
