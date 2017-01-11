// import * as mongoose from 'mongoose';

import * as mongoose from 'mongoose';
import {AWSService} from '../../../global/aws.service';

var Schema = mongoose.Schema;

var attachmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, trim: true },
  url: { type: String, trim: true },
  created_by: { type: String},
  created_at: { type: Date, default: Date.now },
  description: { type: String }
});

attachmentSchema.post('remove', function(removed){
  AWSService.delete(removed).then(res => {
    console.log(removed.name + ' removed from AWS');
  })
  .catch(err => {
    console.log(err);
    console.log('error when removing ' + removed.name + ' from AWS');
  })
});

export default attachmentSchema;
