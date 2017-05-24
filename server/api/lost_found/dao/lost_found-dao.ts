import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import lostfoundSchema from '../model/lost_found-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

lostfoundSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};
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

lostfoundSchema.static('getOwnLostFound', (userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": developmentId, "created_by": userId};
        Lost_found
          .find(_query)
          .populate("development created_by photo")
          .exec((err, lostfounds) => {
              err ? reject(err)
                  : resolve(lostfounds);
          });
    });
});

lostfoundSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generateCode = function() {
          let randomCode = Math.floor(Math.random() * 9000000000) + 1000000000;
          let _query = {"serial_number": randomCode};
          Lost_found
            .find(_query)
            .exec((err, petition) => {
              if (err) {
                reject(err);
              }
              else if (petition) {
                if (petition.length > 0) {
                  generateCode();
                }
                else {
                  resolve(randomCode);
                }
              }
            })
        }
        generateCode();
    });
});

lostfoundSchema.static('createLostfound', (lostfound:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(lostfound)) {  
        return reject(new TypeError('Lost and Found is not a valid object.'));
      }
      Lost_found.generateCode().then((code) => {
        var _lostfound = new Lost_found(lostfound);
        _lostfound.created_by = userId;
        _lostfound.serial_number = code;
        _lostfound.development = developmentId;
        _lostfound.save((err, saved) => {
            if (err) {
                reject(err);
            }
            else if (saved) {
                let _query = {"_id": saved._id};
                Lost_found.addAttachmentLostfound(attachment, _query, userId.toString());  
            }
        });
      })
      .catch(err=>{
        resolve(err);
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
        let ObjectID = mongoose.Types.ObjectId; 
        let _query = {"_id": id};
        let lostFoundObj = {$set: {}};
        for (var param in lostfound) {
          lostFoundObj.$set[param] = lostfound[param];
        }                
        Lost_found.addAttachmentLostfound(attachment, _query, userId.toString());        
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
            $set: {
              "archieve": true
            }
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

lostfoundSchema.static('addAttachmentLostfound', (attachment:Object, query:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {      
       let file:any = attachment;
       if (file.photo) {
          Attachment.createAttachment(file.photo, userId)
            .then((res) => {
              let idAttachment = res.idAtt;
              Lost_found
                .update(query, {
                  $set: {
                    "photo": idAttachment
                  }
                })
                .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                });            
            })
            .catch((err) => {
              reject(err);
            })
      }
      else {
        resolve({message: "No Attachment Files"});
      }
    });
});


let Lost_found = mongoose.model('Lost_found', lostfoundSchema);

export default Lost_found;
