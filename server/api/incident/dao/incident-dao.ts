import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import incidentSchema from '../model/incident-model';
import Attachment from '../../attachment/dao/attachment-dao';
import Notification from '../../notification/dao/notification-dao';
import {AWSService} from '../../../global/aws.service';
import {GlobalService} from '../../../global/global.service';

incidentSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};
        Incident
          .find(_query)
          .populate("development attachment starred_by created_by contract")
          .sort({"created_at": -1})
          .exec((err, incidents) => {
              err ? reject({message: err.message})
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
              err ? reject({message: err.message})
                  : resolve(incidents);
          });
    });
});


incidentSchema.static('getOwnIncident', (userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": developmentId, "created_by": userId};
        Incident
          .find(_query)
          .populate("development attachment starred_by created_by contract")
          .exec((err, incidents) => {
              err ? reject({message: err.message})
                  : resolve(incidents);
          });
    });
});

incidentSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generateCode = function() {
          let randomCode = GlobalService.randomCode();
          console.log(randomCode);
          let _query = {"reference_no": randomCode};
          Incident
            .find(_query)
            .exec((err, incident) => {
              if (err) {
                reject({message: err.message});
              }
              if (incident) {
                if (incident.length > 0) {
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

incidentSchema.static('createIncident', (incident:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let body:any = incident;
        if(!body.incident_type){
          reject({message: "incident type empty"})
        }
        else {
          Incident.generateCode().then((code) => {
            var _incident = new Incident(incident);
            _incident.reference_no = code;
            _incident.created_by = userId;
            _incident.development = developmentId;
            _incident.save((err, incident) => {
              if (err) {
                reject({message: err.message});
              }
              else if (incident) {
                if (attachment) {
                  let _query = {"_id": incident._id};
                  Incident.addAttachmentIncident(attachment, _query, userId.toString()).then((res) => {
                    resolve(incident);
                  })
                  .catch((err) => {
                    reject(err);
                  })
                }
                else {
                  resolve(incident);
                }   
              }
            });
          })
          .catch((err)=> {
            reject({message: err.message});
          }) 
        }                    
    });
});

incidentSchema.static('deleteIncident', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Incident
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve();
          });
    });
});

incidentSchema.static('updateIncident', (id:string, userId:string, incident:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(incident)) {
          return reject(new TypeError('Incident is not a valid object.'));
        }
        let ObjectID = mongoose.Types.ObjectId; 
        let _query = {"_id": id};
        let incidentObj = {$set: {}};
        for (var param in incident) {
          incidentObj.$set[param] = incident[param];
        }        
        Incident.addAttachmentIncident(attachment, _query, userId.toString());       
        Incident
          .update(_query, incidentObj)
          .exec((err, saved) => {
                err ? reject({message: err.message})
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
          .where("status").equals("pending")
          .update({
            $set:{
              "status": "reviewing"
            }
          })     
          .exec((err, updated) => {
            err ? reject({message: err.message})
                : resolve(updated);
          });           
    });
});

incidentSchema.static('starred', (id:string, starred_by:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(starred_by)) {
        return reject(new TypeError('Starred By is not a valid object.'));
      }
      Incident
        .findByIdAndUpdate(id, {
            $push: {"starred_by": starred_by}
          })
        .exec((err, saved) => {
          err ? reject({message: err.message})
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
        .findByIdAndUpdate(id, {
            $pull: {"starred_by": starred_by}
          })
        .exec((err, saved) => {
          err ? reject({message: err.message})
              : resolve(saved);
        });
    });
});

incidentSchema.static('resolve', (id:string, userId:string, incident:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
      }
      let body:any = incident;
      Incident
        .findByIdAndUpdate(id, {
            $set: {
              "resolved_by": body.resolved_by,
              "resolved_at": new Date(),
              "remark": body.remark,
              "status": "resolve"
            }
          })
        .exec((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);
        });
    });
});

incidentSchema.static('archieve', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
      }
      Incident
        .findByIdAndUpdate(id, {
            $set: {"archieve": true}
          })
        .exec((err, saved) => {
          err ? reject({message: err.message})
              : resolve(saved);
        });
    });
});

incidentSchema.static('unarchieve', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
      }
      Incident
        .findByIdAndUpdate(id,     
          {
            $set: {"archieve": false}
          })
        .exec((err, saved) => {
          err ? reject({message: err.message})
              : resolve(saved);
        });
    });
});

incidentSchema.static('addAttachmentIncident', (attachment:Object, query:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {      
       let file:any = attachment;
       if (file.attachment) {
          Attachment.createAttachment(file.attachment, userId)
            .then((res) => {
              let idAttachment = res.idAtt;
              Incident
                .update(query, {
                  $set: {
                    "attachment": idAttachment
                  }
                })
                .exec((err, saved) => {
                    err ? reject({message: err.message})
                        : resolve(saved);
                });            
            })
            .catch((err) => {
              reject({message: err.message});
            })
      }
      else {
        resolve({message: "No Attachment Files"});
      }
    });
});

let Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
