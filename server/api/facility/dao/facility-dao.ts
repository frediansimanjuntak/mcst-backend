import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import facilitySchema from '../model/facility-model';

facilitySchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Facility
          .find(_query)
          .exec((err, facilities) => {
              err ? reject(err)
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
          .exec((err, facilities) => {
              err ? reject(err)
                  : resolve(facilities);
          });
    });
});

facilitySchema.static('createFacility', (facility:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(facility)) {
        return reject(new TypeError('Facility is not a valid object.'));
      }

      var _facility = new Facility(facility);

      _facility.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

facilitySchema.static('deleteFacility', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Facility
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
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
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Facility = mongoose.model('Facility', facilitySchema);

export default Facility;
