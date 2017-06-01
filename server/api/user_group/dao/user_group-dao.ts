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
          .populate("development")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'chief',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'users',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, user_groups) => {
              err ? reject({message: err.message})
                  : resolve(user_groups);
          });
    });
});

userGroupSchema.static('getById', (id: string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        UserGroup
          .findById(id)
          .populate("development")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'chief',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'users',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, user_groups) => {
              err ? reject({message: err.message})
                  : resolve(user_groups);
          });
    });
});

userGroupSchema.static('getOwn', (userid: string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        UserGroup
          .findOne({"chief": userid})
          .populate("development")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'chief',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'users',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, user_groups) => {
              err ? reject({message: err.message})
                  : resolve(user_groups);
          });
    });
});

userGroupSchema.static('createUserGroup', (userGroup:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
    //   if (!_.isObject(userGroup)) {
    //     return reject(new TypeError('User Group is not a valid object.'));
    //   }
      let body:any = userGroup;
      UserGroup
        .findOne({"chief" : body.chief})
        .exec((err, res) => {
          if (err) {
            reject({message: err.message});
          }
          if (res) {
            reject({message: "Chief is Allready"});
          }
          else{
            var _user_group = new UserGroup(userGroup);
            _user_group.development = developmentId;
            _user_group.created_by = userId;
            _user_group.save((err, saved) => {
              if (err) {
                reject({message: err});
              }
              else if (saved) {
                let userGroupId = saved._id;
                if (saved.users.length > 0) {
                  let users = saved.users;
                  _.each(users, (result) => {
                    let iduser = result;
                    UserGroup.updateUserInUserGroup(iduser, saved._id, "push");
                  })
                  resolve(saved);
                }
                else{
                  resolve(saved);
                }
              }
            });
          }
        })      
    });
});

userGroupSchema.static('deleteUserGroup', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }        
        UserGroup
          .findById(id)
          .exec((err, usergroup) => {
            if (err) {
              reject(err);
            }
            else if (usergroup) {
              if (usergroup.users.length > 0) {
                var users = [].concat(usergroup.users);
                for (var i = 0; i < users.length; i++) {
                  var iduser = users[i];
                  UserGroup.updateUserInUserGroup(iduser, id, "pull");
                }
                resolve({message: "Success"})
              }
            }                        
          })
        UserGroup
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve();
          });
    });
});

userGroupSchema.static('updateUserInUserGroup', (id:string, idUserGroup:string, type:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }        
        let updateObj;
        if (type == "push") {
          updateObj = {$push: {"user_group": idUserGroup}};
        }
        else if (type == "pull") {
          updateObj = {$pull: {"user_group": idUserGroup}};
        }
        User
          .findByIdAndUpdate(id, updateObj, {upsert: true})
          .exec((err, saved) => {
            err ? reject({message: err.message})
                : resolve(saved);
          });              
    });
});

userGroupSchema.static('updateUserGroup', (id:string, userGroup:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        UserGroup
          .findByIdAndUpdate(id, userGroup)
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
          });
    });
});

userGroupSchema.static('addUser', (id:string, users:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        UserGroup
          .findByIdAndUpdate(id, {
              $push:{"users": users}
          })
          .exec((err, updated) => {
                err ? reject({message: err.message})
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
                err ? reject({message: err.message})
                    : resolve(updated);
          });
        User
          .findByIdAndUpdate(body.user, {
            $unset: {
              "user_group": id
            }
          })
    });
});

let UserGroup = mongoose.model('UserGroup', userGroupSchema);

export default UserGroup;