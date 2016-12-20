import * as mongoose from 'mongoose';

var newsletterSchema = new mongoose.Schema({
    title:{type: String, required: true, trim: true},
	description:{type: String, required: true, trim: true},
	type:{type: String, required: true, trim: true},
	attachment:{type: String, required: true, trim: true},
	released:{type: String, required: true, trim: true},
	pinned:{type: String, required: true, trim: true},
	released_by:{type: String, required: true, trim: true},
	created_by:{type: String, required: true, trim: true},
	release_at:{type: Date},
	created_at:{type: Date, default: Date.now}
});

export default newsletterSchema;
