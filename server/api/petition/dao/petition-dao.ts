import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import petitionSchema from '../model/petition-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

petitionSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Petition
          .find(_query)
          .exec((err, petitions) => {
              err ? reject(err)
                  : resolve(petitions);
          });
    });
});

petitionSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Petition
          .findById(id)
          .populate("development attachment contract created_by")
          .exec((err, petitions) => {
              err ? reject(err)
                  : resolve(petitions);
          });
    });
});

petitionSchema.static('createPetition', (petition:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(petition)) {
        return reject(new TypeError('Petition is not a valid object.'));
      }
        Attachment.createAttachment(attachment, userId,).then(res => {
          var idAttachment=res.idAtt;

          var _petition = new Petition(petition);
              _petition.created_by = userId;
              _petition.development = developmentId;
              _petition.attachment = idAttachment;
              _petition.save((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
              });
        })
        .catch(err=>{
          resolve({message:"error"});
        })      
    });
});

petitionSchema.static('deletePetition', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Petition
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

petitionSchema.static('updatePetition', (id:string, userId:string, petition:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(petition)) {
          return reject(new TypeError('Petition is not a valid object.'));
        }

        let petitionObj = {$set: {}};
            for(var param in petition) {
              petitionObj.$set[param] = petition[param];
             }

            let ObjectID = mongoose.Types.ObjectId; 
            let _query={"_id":id};

            var files = [].concat(attachment);
            var idAttachment = [];

            if(attachment!=null){
              Attachment.createAttachment(attachment, userId,).then(res => {
                var idAttachment=res.idAtt;

                Petition
                  .update(_query,{$set:{'attachment':idAttachment}})
                  .exec((err, saved) => {
                        err ? reject(err)
                            : resolve(saved);
                   });
              })
              .catch(err=>{
                resolve({message:"error"});
              })                            
            } 
            
            Petition
              .update(_query,petitionObj)
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                }); 
    });
});

petitionSchema.static('archieve', (id:string, arrayId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

      Petition
        .update({_id:{$in:arrayId}}, {$set:{ archieve : "true"}}, {multi:true})
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

petitionSchema.static('unarchieve', (id:string, arrayId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      Petition
        .update({_id:{$in:arrayId}}, {$set:{ archieve : "false"}}, {multi:true})
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

let Petition = mongoose.model('Petition', petitionSchema);

export default Petition;
