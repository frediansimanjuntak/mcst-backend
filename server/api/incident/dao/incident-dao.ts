import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import incidentSchema from '../model/incident-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

incidentSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Incident
          .find(_query)
          .populate("development attachment starred_by created_by contract")
          .exec((err, incidents) => {
              err ? reject(err)
                  : resolve(incidents);
          });
    });
});

incidentSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        } 

        Incident
          .findById(id)
          .populate("development attachment starred_by created_by contract")
          .exec((err, incidents) => {
              err ? reject(err)
                  : resolve(incidents);
          });
    });
});

incidentSchema.static('createIncident', (incident:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(incident)) {
        return reject(new TypeError('Incident is not a valid object.'));
      }
      Attachment.createAttachment(attachment, userId,).then(res => {
        var idAttachment=res.idAtt;

        var _incident = new Incident(incident);
            _incident.created_by = userId;
            _incident.attachment = idAttachment;
            _incident.development = developmentId;
            _incident.save((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
              });
      })
      .catch(err=>{
        resolve({message:"error"});
      })             
    });
});

incidentSchema.static('deleteIncident', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Incident
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

incidentSchema.static('updateIncident', (id:string, userId:string, incident:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(incident)) {
          return reject(new TypeError('Incident is not a valid object.'));
        }

        let incidentObj = {$set: {}};
            for(var param in incident) {
              incidentObj.$set[param] = incident[param];
             }

            let ObjectID = mongoose.Types.ObjectId; 
            let _query={"_id":id};

            var files = [].concat(attachment);
            var idAttachment = [];

            if(attachment!=null){
              Attachment.createAttachment(attachment, userId,).then(res => {
                var idAttachment=res.idAtt;

                Incident
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
            
            Incident
              .update(_query,incidentObj)
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                }); 
    });
});

incidentSchema.static('statusIncident',(id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }    

        Incident
        .findById(id)
        .where('status').equals('pending')
        .update({
          $set:{
            "status":"reviewing"
          }
        })     
          .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });           
    });
});

incidentSchema.static('starred', (id:string, starred_by:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(starred_by)) {
        return reject(new TypeError('Starred By is not a valid object.'));
      }
      console.log(starred_by);
      Incident
      .findByIdAndUpdate(id,     
        {
          $push:{"starred_by":starred_by}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

incidentSchema.static('unstarred', (id:string, starred_by:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(starred_by)) {
        return reject(new TypeError('Starred By is not a valid object.'));
      }
      Incident
      .findByIdAndUpdate(id,     
        {
          $pull:{"starred_by":starred_by}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

incidentSchema.static('archieve', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

      Incident
      .findByIdAndUpdate(id,     
        {
          $set:{"archieve":true}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

incidentSchema.static('unarchieve', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      Incident
      .findByIdAndUpdate(id,     
        {
          $set:{"archieve":false}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

let Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
