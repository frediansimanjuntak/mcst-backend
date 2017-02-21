import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import userGroupSchema from '../model/user_group-model';
import User from '../../user/dao/user-dao'

userGroupSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        UserGroup
          .find(_query)
          .populate("development chief created_by users")
          .exec((err, user_groups) => {
              err ? reject(err)
                  : resolve(user_groups);
          });
    });
});

userGroupSchema.static('getById', (id: string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        UserGroup
          .findById(id)
          .populate("development chief created_by users")
          .exec((err, user_groups) => {
              err ? reject(err)
                  : resolve(user_groups);
          });
    });
});

userGroupSchema.static('createUserGroup', (userGroup:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(userGroup)) {
        return reject(new TypeError('User Group is not a valid object.'));
      }

      var _user_group = new UserGroup(userGroup);
          _user_group.development = developmentId;
          _user_group.created_by = userId;
          _user_group.save((err, saved) => {
            err ? reject(err)
                : resolve(saved);
          });
      var userGroupId = _user_group._id;

      if(_user_group.users != null){
        var users = [].concat(_user_group.users)
        for (var i = 0; i < users.length; i++) {
          var iduser = users[i];

          User
            .findByIdAndUpdate(iduser,
                {
                  $set: {  
                    "user_group": userGroupId
                  }
                }, {upsert: true})
            .exec((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
              });
        }
        resolve({message: "Success"});
      }
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

        UserGroup
          .findById(id, (err, usergroup) => {
            if (usergroup.users != null){
              var users = [].concat(usergroup.users)
              for (var i = 0; i < users.length; i++) {
                var iduser = users[i];

                User
                  .findByIdAndUpdate(iduser, {
                    $pull: {
                      "user_group": id
                    }
                  }, {upsert: true})
                  .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                      });
              }
              resolve({message: "Success"})
            }            
          })
    });
});

userGroupSchema.static('updateUserGroup', (id:string, userGroup:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
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
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
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
        let body:any = users;

        UserGroup
          .findByIdAndUpdate(id, {
              $pull:{"users": body.user}
          })
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });

        User
          .findByIdAndUpdate(body.user, {
            $pull: {
              "user_group": id
            }
          })
    });
});

let UserGroup = mongoose.model('UserGroup', userGroupSchema);

export default UserGroup;