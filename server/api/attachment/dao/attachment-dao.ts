import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
// import * as fs from 'fs-extra';
import attachmentSchema from '../model/attachment-model';
import Development from '../../development/dao/development-dao';
import {AWSService} from '../../../global/aws.service';

var fs = require('fs-extra');

export function localAttachment(attachment:Object, userId:string){
      return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(attachment)) {
        return reject(new TypeError('Attachment is not a valid object.'));
      }

      let file:any = attachment.files.attachmentfile;
      let key:string = 'test/'+file.name
      console.log(file);
      console.log(key);
      AWSService.upload(key, file).then(fileDetails => {
        console.log(fileDetails);
        let _attachment = new Attachment(attachment);
        _attachment.name = fileDetails.name;
        _attachment.type = fileDetails.type;
        _attachment.url = fileDetails.url;
        _attachment.description = attachment.description;
        _attachment.created_by=userId;
        _attachment.save((err, saved) => {
         err ? reject(err)
            : resolve(saved);
        });
      })
    });      
}

attachmentSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Attachment
          .find(_query)
          .exec((err, attachments) => {
              err ? reject(err)
                  : resolve(attachments);
          });
    });
});

attachmentSchema.static('createAttachment', (attachment:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(attachment)) {
        return reject(new TypeError('Attachment is not a valid object.'));
      }
      let file:any = attachment.files.attachment;
      let key:string = 'test/'+file.name
      console.log(file);
      console.log(key);
      AWSService.upload(key, file).then(fileDetails => {
        console.log(fileDetails);
        let _attachment = new Attachment(attachment);
        _attachment.name = fileDetails.name;
        _attachment.type = fileDetails.type;
        _attachment.url = fileDetails.url;
        _attachment.description = attachment.description;
        _attachment.created_by=userId;
        _attachment.save((err, saved) => {
         err ? reject(err)
            : resolve(saved);
        });
      })
    });      
});

attachmentSchema.static('deleteAttachment', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Attachment
          .findById(id)
          .exec((err, attachment) => {
            if (err)
              reject(err)
            if (attachment)
              attachment.remove((err:any) => {
                if (err)
                  reject(err)
                resolve({ message: "success" });
              });
            else
              reject(new Error("Attachment not found."));
         });
    });
});

attachmentSchema.static('updateAttachment', (id:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(attachment)) {
          return reject(new TypeError('Attachment is not a valid object.'));
        }

        Attachment
        .findByIdAndUpdate(id, attachment)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Attachment = mongoose.model('Attachment', attachmentSchema);

export default Attachment;
