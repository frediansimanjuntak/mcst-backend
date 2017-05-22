// import * as mongoose from 'mongoose';

import * as mongoose from 'mongoose';
import {AWSService} from '../../../global/aws.service';

var Schema = mongoose.Schema;

var notificationSchema = new mongoose.Schema({
  user: { 
  	type: Schema.Types.ObjectId, 
  	ref: 'User'
  },
  type: {type: String, trim: true}, // or category
  development: {
    type: Schema.Types.ObjectId,
      ref: 'Development'
  },
  property: {type: String, trim: true},
  message: {type: String},
  reference_title: {type: String},
  reference_number: {type: String},
  reference_id: {type: String},
  created_by: { 
  	type: Schema.Types.ObjectId, 
  	ref: 'User' 
  },
  extra: {},
  clicked: {type: Boolean, default: false},
  read_at: {type: Date},
  mark_read: {type: Boolean, default: false},
  created_at: {type: Date, default: Date.now}
});


notificationSchema.post('remove', function(removed){
  //
});

export default notificationSchema;
