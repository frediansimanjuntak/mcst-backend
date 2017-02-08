import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import userGroupSchema from '../model/user_group-model';

userGroupSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        UserGroup
          .find(_query)
          .exec((err, user_groups) => {
              err ? reject(err)
                  : resolve(user_groups);
          });
    });
});

userGroupSchema.static('createUserGroup', (userGroup:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(userGroup)) {
        return reject(new TypeError('User Group is not a valid object.'));
      }

      var _user_group = new UserGroup(userGroup);
      _user_group.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

userGroupSchema.static('deleteUserGroup', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        UserGroup
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

userGroupSchema.static('updateUserGroup', (id:string, userGroup:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(userGroup)) {
          return reject(new TypeError('User Group is not a valid object.'));
        }

        UserGroup
        .findByIdAndUpdate(id, userGroup)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

userGroupSchema.static('addUser', (id:string, users:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(users)) {
          return reject(new TypeError('User Group is not a valid object.'));
        }

        UserGroup
        .findByIdAndUpdate(id, {
            $push:{"users": users}
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

userGroupSchema.static('deleteUser', (id:string, users:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(users)) {
          return reject(new TypeError('User Group is not a valid object.'));
        }

        UserGroup
        .findByIdAndUpdate(id, {
            $pull:{"users": users}
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let UserGroup = mongoose.model('UserGroup', userGroupSchema);

export default UserGroup;
