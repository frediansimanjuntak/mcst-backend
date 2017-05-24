import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;
import attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

var lostfoundSchema = new mongoose.Schema({
	serial_number: {type: String, trim: true},
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property: {type: String, trim: true},
	type: {type: String, trim: true},
	description: {type: String, trim: true},
	photo: [{
		type: Schema.Types.ObjectId,
    	ref: 'Attachment'
	}],
	preferred_method_of_contact: {type: String, trim: true},
	archieve: {type: Boolean, default: false},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	created_at: {type: Date, default: Date.now}
});

lostfoundSchema.pre('remove', (next) => {
	var lostFound = this;
	attachment.find({_id: {$in: lostFound.attachment}}, (err, attachments) => {
		for (var i = 0; i < attachments.length; i++) {
			if (attachments[i].name) AWSService.delete(attachments[i].name);
			attachments[i].name.remove();
		}
	});
});

export default lostfoundSchema;
