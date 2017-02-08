import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var announcementSchema = new mongoose.Schema({
	title: {type: String, required: true, trim: true},
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property: {type: String, trim: true},
	message: {type: String, trim: true},
	sticky: {type: String, trim: true, default: "no"},		
	auto_post_on: {type: String, trim: true},
	valid_till: {type: Date, trim: true},
	publish: {type: Boolean, trim: true, default: false},
	publish_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	publish_at: {type: Date},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	updated_at: {type: Date},
	created_at: {type: Date, default: Date.now}
});

export default announcementSchema;
