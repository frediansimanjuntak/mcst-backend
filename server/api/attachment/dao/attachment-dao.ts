import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
// import * as fs from 'fs-extra';
import attachmentSchema from '../model/attachment-model';
import developmentSchema from '../../development/model/development-model';
import {AWSService} from '../../../global/aws.service';

var fs = require('fs-extra');

export function localAttachment(attachment, done){
    let file:any = attachment['files'];
      let key:string = 'test/' + file.name
      AWSService.upload(key, file).then(fileDetails => {
        let _attachment = new Attachment(attachment);
        _attachment['name'] = fileDetails['name'];
        _attachment['type'] = fileDetails['type'];
        _attachment['url'] = fileDetails['url'];
        _attachment.save((err, attach) => {
          err ? done(err)
              : done(attach);
        });
      })
      .catch(err => done(err));
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

attachmentSchema.static('createAttachment', (attachment:Object, newsletter:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(attachment)) {
        return reject(new TypeError('Attachment is not a valid object.'));
      }
      if (!_.isObject(newsletter)) {
        return reject(new TypeError('Attachment is not a valid object.'));
      }

      let ObjectID = mongoose.Types.ObjectId;   

      Development.findById(newsletter,(err, development)=>{
          let file:any = attachment['files'];
          let key:string = 'test/' + file.name
          AWSService.upload(key, file).then(fileDetails => {
            let _attachment = new Attachment(attachment);
            _attachment['name'] = fileDetails['name'];
            _attachment['type'] = fileDetails['type'];
            _attachment['url'] = fileDetails['url'];
            _attachment.save();
            development.newsletter.attachment.push(_attachment._id);            
          });
            development.newsletter.save((err, saved)=>{
              err ? reject(err)
                  : resolve(saved);
            })
        });
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
let Development = mongoose.model('Development', developmentSchema);

export default Attachment;
