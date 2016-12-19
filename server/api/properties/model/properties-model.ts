import * as mongoose from 'mongoose';

var propertiesSchema = new mongoose.Schema({
	address:{
    unit_no:{type: String, required: true, trim: true},
	unit_no_2:{type: String, required: true, trim: true},
	block_no:{type: String, required: true, trim: true},
	street_name:{type: String, required: true, trim: true},
	postal_code:{type: String, required: false, trim: true},
	country:{type: String, required: true, trim: true},
	full_address:{type: String, required: true, trim: true}
	},
	landlord:{type: String, required: true,},
	tenant:{type: String, required: true,},
	status:{type: String, required: true,},
	created_by:{type: String, required: true,},
	created_at:{type: Date, default: Date.now}
});

export default propertiesSchema;
