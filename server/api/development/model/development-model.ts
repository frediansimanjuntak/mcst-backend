// import * as mongoose from 'mongoose';

import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

import attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

var developmentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    owner: {
    	type: Schema.Types.ObjectId,
    	ref: 'User'
    },
    staff: [{
    	type: Schema.Types.ObjectId,
    	ref: 'User'
    }],
    description: {type: String},
    properties: [{    	
    	address: {
		    unit_no:{type: String},
			unit_no_2:{type: String},
			block_no:{type: String},
			street_name:{type: String},
			postal_code:{type: String},
			country:{type: String},
			full_address:{type: String}
		},
		landlord: {
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		tenant: [{
			resident: {
				type: Schema.Types.ObjectId,
    			ref: 'User'
			},
			type: {type: String},
			social_page: {type: String},
			remarks: {type: String},
			created_at: {type: Date}
		}],
		registered_vehicle: [{
			license_plate: {type:String},
			owner: {
				type: Schema.Types.ObjectId,
    			ref: 'User'
			},
			transponder: {type: String},
			document: {type:String},
			registered_on: {type: Date},
			remarks: {type: String}
		}],
		status: {type: String},
		created_by: {
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		created_at: {type: Date, default: Date.now}
    }],
    newsletter: [{
		title: {type: String},
		description: {type: String},
		type: {type: String},
		attachment: [{
			type: Schema.Types.ObjectId,
    		ref: 'Attachment'
		}],
		released: {type: Boolean, default: false},
		pinned: {
			rank: {type:Number}
		},
		released_by: {
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		created_by: {
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		release_at: {type: Date},
		created_at: {type: Date, default: Date.now}
    }]      
});	

developmentSchema.pre('remove',(next)=>{
	var development = this;
	attachment.find({_id:{$in: development.newsletter.attachment}},(err, attachments)=>{
		for(var i = 0; i <attachments.length; i++){
			if(attachments[i].name) AWSService.delete(attachments[i].name);
			attachments[i].name.remove();
		}
	});
});

export default developmentSchema;
