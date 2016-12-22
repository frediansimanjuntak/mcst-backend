// import * as mongoose from 'mongoose';

import * as mongoose from 'mongoose';

var developmentSchema = new mongoose.Schema({
    name: {type: String},
    owner: {type: String},
    staff:{type: String},
    description: {type: String},
    properties:[{
    	development:{type: String},
    	address:{
		    unit_no:{type: String},
			unit_no_2:{type: String},
			block_no:{type: String},
			street_name:{type: String},
			postal_code:{type: String},
			country:{type: String},
			full_address:{type: String}
		},
		landlord:{type: String},
		tenant:{type: String},
		status:{type: String},
		created_by:{type: String},
		created_at:{type: Date, default: Date.now}
    }],
    newsletter:[{
		title:{type: String},
		description:{type: String},
		type:{type: String},
		attachment:{type: String},
		released:{type: String, default: false},
		pinned:{type: String},
		released_by:{type: String},
		created_by:{type: String},
		release_at:{type: Date},
		created_at:{type: Date, default: Date.now}
    }]      
});	

export default developmentSchema;
