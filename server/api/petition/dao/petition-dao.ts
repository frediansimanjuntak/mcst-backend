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

petitionSchema.static('createPetition', (petition:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(petition)) {
        return reject(new TypeError('Petition is not a valid object.'));
      }

      let file:any = petition.files.attachmentfile;
      let key:string = 'test/'+file.name;
      AWSService.upload(key, file).then(fileDetails => {
        let _attachment = new Attachment(petition);
        _attachment.name = fileDetails.name;
        _attachment.type = fileDetails.type;
        _attachment.url = fileDetails.url;
        _attachment.created_by=userId;
        _attachment.save((err, saved)=>{
          err ? reject(err)
              : resolve(saved);
        });
        var attachmentID=_attachment._id;
        var _petition = new Petition(petition);
            _petition.created_by = userId;
            _petition.attachment = attachmentID;
            _petition.development = developmentId;
            _petition.save((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
            });  
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

petitionSchema.static('updatePetition', (id:string, userId:string, petition:Object):Promise<any> => {
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

            let file:any = petition.files.attachmentfile;

            if(file!=null){
              let key:string = 'attachment/petition/'+file.name;
              AWSService.upload(key, file).then(fileDetails => {
              let _attachment = new Attachment(petition);
              _attachment.name = fileDetails.name;
              _attachment.type = fileDetails.type;
              _attachment.url = fileDetails.url;
              _attachment.created_by=userId;
              _attachment.save((err, saved)=>{
                err ? reject(err)
                    : resolve(saved);
              });
              var attachmentID=_attachment._id;
              Petition
                .update(_query,{$set:{'attachment':attachmentID}})
                .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                 });
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
