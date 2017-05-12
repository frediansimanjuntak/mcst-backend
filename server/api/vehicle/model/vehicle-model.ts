// import * as mongoose from 'mongoose';

import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

import attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

var vehicleSchema = new mongoose.Schema({
	development: {
		type: Schema.Types.ObjectId,
    	ref: 'Development'
	},
	property: {type: String, trim: true},
	license_plate: {type:String, unique: true},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	transponder: {type: String},
	document: [{
		type: Schema.Types.ObjectId,
		ref: 'Attachment'
	}],
	created_by: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	created_at: {type: Date, default: Date.now},
	remarks: {type: String}		
});	

vehicleSchema.pre('remove',(next)=>{
	var vehicle = this;
	attachment.find({_id:{$in: vehicle.document}},(err, attachments)=>{
		for(var i = 0; i <attachments.length; i++){
			if(attachments[i].name) AWSService.delete(attachments[i].name);
			attachments[i].name.remove();
		}
	});
});

export default vehicleSchema;
