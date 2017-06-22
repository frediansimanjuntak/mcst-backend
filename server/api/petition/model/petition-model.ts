import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;
import attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

var petitionSchema = new mongoose.Schema({
	reference_no: {type: String, trim: true},
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property: {type: String, trim: true},		
	petition_type: {type: String, trim: true},
	attachment: [{
		type: Schema.Types.ObjectId,
		ref: 'Attachment'
	}],
	contract: {
		type: Schema.Types.ObjectId,
    	ref: 'Contract'
	},
	extra: {},
	remark: {type: String, trim: true},
	archieve: {type: Boolean, trim: true, default: false},
	status: {type: String, trim: true, default: "pending"},
	created_by: {
		type: Schema.Types.ObjectId,
    	ref: 'User'
	},
	approval: {
		status: {type: String, enum:['pending', 'accepted', 'rejected'], default: 'pending'},
		by: {
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		date: {type: Date}
	},
	updated_at: {type: Date},
	created_at: {type: Date, default: Date.now}
});

petitionSchema.pre('remove', (next) => {
	var petition = this;
	attachment.find({_id: {$in: petition.attachment}}, (err, attachments) => {
		for (var i = 0; i < attachments.length; i++) {
			if (attachments[i].name) AWSService.delete(attachments[i].name);
			attachments[i].name.remove();
		}
	});
});

export default petitionSchema;
