// import * as mongoose from 'mongoose';

import * as mongoose from 'mongoose';
import {AWSService} from '../../../global/aws.service';

var Schema = mongoose.Schema;

var notificationSchema = new mongoose.Schema({
  user: { 
  	type: Schema.Types.ObjectId, 
  	ref: 'User', required: true 
  },
  type: { type: String, trim: true }, // or category
  message: { type: String },
  ref: { type: String },
  created_by: { 
  	type: Schema.Types.ObjectId, 
  	ref: 'User' 
  },
  read_at: { type: Date },
  created_at: { type: Date, default: Date.now }
});


notificationSchema.post('remove', function(removed){
  //
});

export default notificationSchema;
