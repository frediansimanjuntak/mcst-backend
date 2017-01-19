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
    staff:[{
    	type: Schema.Types.ObjectId,
    	ref: 'User'
    }],
    description: {type: String},
    properties:[{
    	development:{
    		type: Schema.Types.ObjectId,
    		ref: 'Development'
    	},
    	address:{
		    unit_no:{type: String},
			unit_no_2:{type: String},
			block_no:{type: String},
			street_name:{type: String},
			postal_code:{type: String},
			country:{type: String},
			full_address:{type: String}
		},
		landlord:{
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		tenant:[{
			resident:{type: String},
			type:{type: String},
			added_on:{type: String},
			social_page:{type: String},
			remarks:{type: String}
		}],
		registered_vehicle:[{
			license_plate:{type:String},
			owner:{type:String},
			transponder:{type: String},
			document:{type:String},
			registered_on:{type: Date},
			remarks:{type: String}
		}],
		status:{type: String},
		created_by:{
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		created_at:{type: Date, default: Date.now}
    }],
    newsletter:[{
		title:{type: String},
		description:{type: String},
		type:{type: String},
		attachment:[{
			type: Schema.Types.ObjectId,
    		ref: 'Attachment'
		}],
		released:{type: String, default: false},
		pinned:{type: String},
		released_by:{
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		created_by:{
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		release_at:{type: Date},
		created_at:{type: Date, default: Date.now}
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
