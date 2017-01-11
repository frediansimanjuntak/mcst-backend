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
          .exec((err, petitions) => {
              err ? reject(err)
                  : resolve(petitions);
          });
    });
});

petitionSchema.static('createPetition', (petition:Object, userId:string):Promise<any> => {
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

petitionSchema.static('updatePetition', (id:string, petition:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(petition)) {
          return reject(new TypeError('Petition is not a valid object.'));
        }

        Petition
        .findByIdAndUpdate(id, petition)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

petitionSchema.static('archieve', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

      Petition
      .findByIdAndUpdate(id,     
        {
          $set:{"archieve":"true"}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

petitionSchema.static('unarchieve', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      Petition
      .findByIdAndUpdate(id,     
        {
          $set:{"archieve":"false"}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

let Petition = mongoose.model('Petition', petitionSchema);

export default Petition;
