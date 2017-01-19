import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import lostfoundSchema from '../model/lost_found-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

lostfoundSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Lost_found
          .find(_query)
          .exec((err, lostfounds) => {
              err ? reject(err)
                  : resolve(lostfounds);
          });
    });
});

lostfoundSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Lost_found
          .findById(id)
          .populate("development created_by")
          .exec((err, lostfounds) => {
              err ? reject(err)
                  : resolve(lostfounds);
          });
    });
});

lostfoundSchema.static('createLostfound', (lostfound:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(lostfound)) {  
        return reject(new TypeError('Guest is not a valid object.'));
      }

        let file:any = lostfound.files.attachmentfile;
        let key:string = 'test/'+file.name;
        AWSService.upload(key, file).then(fileDetails => {
          let _attachment = new Attachment(lostfound);
          _attachment.name = fileDetails.name;
          _attachment.type = fileDetails.type;
          _attachment.url = fileDetails.url;
          _attachment.created_by=userId;
          _attachment.save((err, saved)=>{
            err ? reject(err)
                : resolve(saved);
          });
          var attachmentID=_attachment._id;
          var _lostfound = new Lost_found(lostfound);
          _lostfound.created_by = userId;
          _lostfound.development = developmentId;
          _lostfound.photo = attachmentID;
          _lostfound.save((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
            }); 
        })      
    });
});

lostfoundSchema.static('deleteLostfound', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Lost_found
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

lostfoundSchema.static('updateLostfound', (id:string, userId:string, lostfound:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(lostfound)) {
          return reject(new TypeError('Guest is not a valid object.'));
        }

        let Lost_foundObj = {$set: {}};
            for(var param in lostfound) {
              Lost_foundObj.$set[param] = lostfound[param];
             }

            let ObjectID = mongoose.Types.ObjectId; 
            let _query={"_id":id};

            let file:any = lostfound.files.attachmentfile;

            if(file!=null){
              let key:string = 'attachment/newsletter/'+file.name;
              AWSService.upload(key, file).then(fileDetails => {
              let _attachment = new Attachment(lostfound);
              _attachment.name = fileDetails.name;
              _attachment.type = fileDetails.type;
              _attachment.url = fileDetails.url;
              _attachment.created_by=userId;
              _attachment.save((err, saved)=>{
                err ? reject(err)
                    : resolve(saved);
              });
              var attachmentID=_attachment._id;
              Lost_found
                .update(_query,{$set:{'photo':attachmentID}})
                .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                 });
              })
            } 
            
            Lost_found
              .update(_query,Lost_foundObj)
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                });        
    });
});


lostfoundSchema.static('archieveLostfound', (id:string, lostfound:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(lostfound)) {
          return reject(new TypeError('Guest is not a valid object.'));
        }

        Lost_found
        .findByIdAndUpdate(id, {
          $set:{"archieve":"true"}
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});


let Lost_found = mongoose.model('Lost_found', lostfoundSchema);

export default Lost_found;
