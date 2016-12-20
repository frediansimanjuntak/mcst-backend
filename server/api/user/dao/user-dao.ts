import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import userSchema from '../model/user-model';

userSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        User
          .find(_query)
          .exec((err, users) => {
              err ? reject(err)
                  : resolve(users);
          });
    });
});

userSchema.static('createUser', (user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(user)) {
        return reject(new TypeError('User is not a valid object.'));
      }

      var _user = new User(user);

      _user.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

userSchema.static('deleteUser', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        User
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

userSchema.static('updateUser', (id:string, user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(user)) {
          return reject(new TypeError('User is not a valid object.'));
        }

        User
        .findByIdAndUpdate(id, user)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let User = mongoose.model('User', userSchema);

export default User;
