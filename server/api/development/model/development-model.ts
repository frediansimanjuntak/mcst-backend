// import * as mongoose from 'mongoose';

import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

import attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

var developmentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    name_url: {type: String},
    owner: {
    	type: Schema.Types.ObjectId,
    	ref: 'User'
    },
    staff: [{
    	type: Schema.Types.ObjectId,
    	ref: 'User'
    }],
    address: {
    	street_name: {type: String},
		postal_code: {type: String},
		country: {type: String},
		full_address: {type: String}
    },
    description: {type: String},    
    properties: [{    	
    	address: {
		    unit_no: {type: String},
			unit_no_2: {type: String},
			block_no: {type: String},
			street_name: {type: String},
			postal_code: {type: String},
			country: {type: String},
			full_address: {type: String}
		},
		landlord: {
			data: {
				resident: {
					type: Schema.Types.ObjectId,
	    			ref: 'User'
				},
				remarks: {type: String},
				created_at: {type: Date}
			},
			history: [{		
				date: {type: Date},
				data: {}		
			}]
		},
		tenant: {
			data: [{
				resident: {
					type: Schema.Types.ObjectId,
	    			ref: 'User' 
				},
				remarks: {type: String},
				type: {type: String},
				created_at: {type: Date}
			}],
			history: [{		
				date: {type: Date},
				data: {}		
			}]
		},
		registered_vehicle: [{
			license_plate: {type:String},
			owner: {
				type: Schema.Types.ObjectId,
    			ref: 'User'
			},
			transponder: {type: String},
			document: {
				type: Schema.Types.ObjectId,
    			ref: 'Attachment'
			},
			registered_on: {type: Date},
			remarks: {type: String}
		}],
		code: {
	    	landlord: {type: String},
	    	create_at_landlord: {type: Date},
	    	tenant: {type: String},
	    	create_at_tenant: {type: Date}
    	},	
		status: {type: String, enum:['empty', 'tenanted', 'own stay'], default: "empty"},
		max_tenant: {type: Number, default: 20},
		created_by: {
			type: Schema.Types.ObjectId,
    		ref: 'User'
		},
		created_at: {type: Date}
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
