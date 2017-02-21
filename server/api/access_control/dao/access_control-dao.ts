import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import accesscontrolSchema from '../model/access_control-model';

accesscontrolSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        AccessControl
          .find(_query)
          .exec((err, accesscontrols) => {
              err ? reject(err)
                  : resolve(accesscontrols);
          });
    });
});

accesscontrolSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        AccessControl
          .findById(id)
          .exec((err, accesscontrols) => {
              err ? reject(err)
                  : resolve(accesscontrols);
          });
    });
});

accesscontrolSchema.static('createAccessControl', (accesscontrol:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(accesscontrol)) {
          return reject(new TypeError('Access Control is not a valid object.'));
        }

        var _accesscontrol = new AccessControl(accesscontrol);

        _accesscontrol.save((err, saved) => {
          err ? reject(err)
              : resolve(saved);
        });
    });
});

accesscontrolSchema.static('deleteAccessControl', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        AccessControl
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

accesscontrolSchema.static('updateAccessControl', (id:string, accesscontrol:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        if (!_.isObject(accesscontrol)) {
          return reject(new TypeError('Access Control is not a valid object.'));
        }

        AccessControl
          .findByIdAndUpdate(id, accesscontrol)
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

let AccessControl = mongoose.model('AccessControl', accesscontrolSchema);

export default AccessControl;
