import * as mongoose from 'mongoose';

var announcementSchema = new mongoose.Schema({
	title:{type: String, required: true, trim: true},
	message:{type: String, trim: true},
	sticky:{type: String, trim: true, default:'no'},		
	auto_post_on:{type: String, trim: true},
	valid_till:{type: Date, trim: true},
	publish:{type: String, trim: true, default:'no'},
	publish_by:{type: String, trim: true},
	publish_at:{type: Date},
	created_by:{type: String, trim: true},
	updated_at:{type: Date},
	created_at:{type: Date, default: Date.now}
});

export default announcementSchema;
