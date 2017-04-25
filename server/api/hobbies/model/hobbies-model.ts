import * as mongoose from 'mongoose';

var hobbiesSchema = new mongoose.Schema({
	name: {type: String},
	slug: {type: String, trim: true},
	created_at: {type: Date, default: Date.now}
});

export default hobbiesSchema;
