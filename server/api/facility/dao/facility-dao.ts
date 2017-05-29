import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import facilitySchema from '../model/facility-model';

facilitySchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};
        Facility
          .find(_query)
          .exec((err, facilities) => {
              err ? reject({message: err.message})
                  : resolve(facilities);
          });
    });
});

facilitySchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Facility
          .findById(id)
          .populate("created_by development")
          .exec((err, facilities) => {
              err ? reject({message: err.message})
                  : resolve(facilities);
          });
    });
});

facilitySchema.static('getByName', (name:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Facility
          .findOne({"name": name})
          .populate("created_by development")
          .exec((err, facilities) => {
              err ? reject({message: err.message})
                  : resolve(facilities);
          });
    });
});

facilitySchema.static('createFacility', (facility:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(facility)) {
            return reject(new TypeError('Facility is not a valid object.'));
        }
        var _facility = new Facility(facility);
        _facility.development = developmentId;
        _facility.created_by = userId;
        _facility.save((err, saved) => {
          err ? reject({message: err.message})
              : resolve(saved);
        });
    });
});

facilitySchema.static('deleteFacility', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Facility
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve({message: "Delete Success"});
          });
    });
});

facilitySchema.static('updateFacility', (id:string, facility:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(facility)) {
          return reject(new TypeError('Facility is not a valid object.'));
        }
        Facility
          .findByIdAndUpdate(id, facility)
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
          });
    });
});

//Schedule Facility
facilitySchema.static('getSchedule', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Facility
          .findById(id)
          .select("schedule")
          .exec((err, facilities) => {
              err ? reject({message: err.message})
                  : resolve(facilities);
          });
    });
});

facilitySchema.static('getByIdSchedule', (id:string, idschedule:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        var ObjectID = mongoose.Types.ObjectId;
        Facility 
          .findById(id)
          .select({"schedule": {$elemMatch: {"_id": new ObjectID(idschedule)}}})
          .exec((err, schedules) => {
            err ? reject({message: err.message})
                : resolve(schedules);
          });
    });
});

facilitySchema.static('createSchedule', (id:string, schedule:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Facility
          .findByIdAndUpdate(id, {
            $push: {
              "schedule": schedule
            }
          })
          .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
          });
    });
});

facilitySchema.static('updateSchedule', (id:string, idschedule:string, schedule:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }  
        let ObjectID = mongoose.Types.ObjectId;   
        let scheduleObj = {$set: {}};
        for(var param in schedule) {
          scheduleObj.$set['schedule.$.'+param] = schedule[param];
        }        
        Facility
          .update({"_id":id, "schedule": {$elemMatch: {"_id": new ObjectID(idschedule)}}}, scheduleObj)
          .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
          });
    });
});

facilitySchema.static('deleteSchedule', (id:string, idschedule:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Facility
          .findByIdAndUpdate(id, {
            $pull: {
              "schedule": {
                "_id": idschedule
              }
            }
          })
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve();
          });
    });
});

//maintenance
facilitySchema.static('createMaintenanceFacility', (id:string, facility:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Facility
          .findByIdAndUpdate(id, {
            $push: {"maintenance": facility}
          })
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
          });
    });
});

let Facility = mongoose.model('Facility', facilitySchema);

export default Facility;
