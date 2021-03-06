// import * as mongoose from 'mongoose';

import * as mongoose from 'mongoose';
import {AWSService} from '../../../global/aws.service';
import config from '../../../config/environment/index';

var Schema = mongoose.Schema;

var attachmentSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  type: {type: String, trim: true},
  key: {type: String, trim: true},
  created_at: {type: Date, default: Date.now},
  description: {type: String},
},
{
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
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

attachmentSchema
  .virtual('url')
  .get(function() {
    let keys = this.key.replace(/ /g,"%20");
    return 'https://'+config.awsBucket+config.awsUrl+'/'+keys;
  });

export default attachmentSchema;
