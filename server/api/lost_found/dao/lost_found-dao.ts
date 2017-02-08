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
          .populate("development created_by photo")
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
          .populate("development created_by photo")
          .exec((err, lostfounds) => {
              err ? reject(err)
                  : resolve(lostfounds);
          });
    });
});

lostfoundSchema.static('createLostfound', (lostfound:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(lostfound)) {  
        return reject(new TypeError('Lost and Found is not a valid object.'));
      }

        Attachment.createAttachment(attachment, userId).then(res => {
        var idAttachment = res.idAtt;

        var _lostfound = new Lost_found(lostfound);
            _lostfound.created_by = userId;
            _lostfound.development = developmentId;
            _lostfound.photo = idAttachment;
            _lostfound.save((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
              });
      })
      .catch(err=>{
        resolve({message: "attachment error"});
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

lostfoundSchema.static('updateLostfound', (id:string, userId:string, lostfound:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(lostfound)) {
          return reject(new TypeError('Lost and Found is not a valid object.'));
        }

        let lostFoundObj = {$set: {}};
        for(var param in lostfound) {
          lostFoundObj.$set[param] = lostfound[param];
         }

        let ObjectID = mongoose.Types.ObjectId; 
        let _query={"_id": id};

        let file:any = attachment;
        var files = [].concat(attachment);
        var idAttachment = [];

        if(file != null){
          Attachment.createAttachment(attachment, userId).then(res => {
            var idAttachment = res.idAtt;

            Lost_found
              .update(_query,{
                $set: {
                  "photo": idAttachment
                }
              })
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
               });
          })
          .catch(err=>{
            resolve({message: "attachment error"});
          })              
        } 
        
        Lost_found
          .update(_query, lostFoundObj)
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
            });        
    });
});


lostfoundSchema.static('archieveLostfound', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Lost_found
        .findByIdAndUpdate(id, {
            $set:{
              "archieve": true
            }
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});


let Lost_found = mongoose.model('Lost_found', lostfoundSchema);

export default Lost_found;
