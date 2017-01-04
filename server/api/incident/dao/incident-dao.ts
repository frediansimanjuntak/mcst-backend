import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import incidentSchema from '../model/incident-model';

incidentSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Incident
          .find(_query)
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
          .exec((err, incidents) => {
              err ? reject(err)
                  : resolve(incidents);
          });
    });
});

incidentSchema.static('createIncident', (incident:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(incident)) {
        return reject(new TypeError('Incident is not a valid object.'));
      }

      var _incident = new Incident(incident);

      _incident.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
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

incidentSchema.static('updateIncident', (id:string, incident:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(incident)) {
          return reject(new TypeError('Incident is not a valid object.'));
        }

        Incident
        .findByIdAndUpdate(id, incident)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
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

incidentSchema.static('starred', (id:string, userid:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(userid)) {
        return reject(new TypeError('user id is not a valid object.'));
      }
      Incident
      .findByIdAndUpdate(id,     
        {
          $push:{"starred_by":userid.starred_by}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

incidentSchema.static('unstarred', (id:string, userid:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(userid)) {
        return reject(new TypeError('user id is not a valid object.'));
      }
      Incident
      .findByIdAndUpdate(id,     
        {
          $pull:{"starred_by":userid.starred_by}
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
          $set:{"archieve":"true"}
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
          $set:{"archieve":"false"}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

let Incident = mongoose.model('Incident', incidentSchema);

export default Incident;
