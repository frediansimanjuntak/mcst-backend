import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import userSchema from '../model/user-model';
import Development from '../../development/dao/development-dao'
import UserGroup from '../../user_group/dao/user_group-dao'
import * as auth from '../../../auth/auth-service';

userSchema.static('index', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        auth.isAuthenticated();
    });
});

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

userSchema.static('me', (userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

        User
          .findOne({_id:userId}, '-salt -password')
          .populate("default_development user_group")
          .exec((err, users) => {
              err ? reject(err)
                  : resolve(users);
          });
    });
});


userSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        User
          .findById(id, '-salt -password')
          .populate("default_development user_group")
          .exec((err, users) => {
              err ? reject(err)
                  : resolve(users);
          });
    });
});

userSchema.static('getDetailUser', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        User
          .findById(id)
          .select("details")
          .exec((err, users) => {
              err ? reject(err)
                  : resolve(users);
          });
    });
});

userSchema.static('createUser', (user:Object, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(user)) {
          return reject(new TypeError('User is not a valid object.'));
        }

        var ObjectID = mongoose.Types.ObjectId;  
        let body:any = user;
        
        var _user = new User(user);
        _user.default_development = developmentId;
        _user.default_property.development = developmentId;
        _user.save((err, saved)=>{
          err ? reject(err)
              : resolve(saved);
        });

        var userId = _user._id; 

        if (_user.owned_property != null){
          var ownedProperty_landlord = [].concat(_user.owned_property)
          for (var i = 0; i < ownedProperty_landlord.length; i++) {
            var ownedProperty = ownedProperty_landlord[i];
            let developmentId = ownedProperty.development;
            let propertyId= ownedProperty.property;
            Development
              .update({"_id": developmentId, "properties": {$elemMatch: {"_id": new ObjectID(propertyId)}}},
                  {
                    $set: {  
                      "properties.$.landlord": userId
                    }
                  }, {upsert: true})
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
              });
          }
          resolve({message: "Success"});
        }
        
        if(_user.rented_property != null){
          let developmentId = body.rented_property.development;
          let propertyId = body.rented_property.property;

          Development
            .update({"_id": developmentId, "properties": {$elemMatch: {"_id": new ObjectID(propertyId)}}},{
              $push:{
                "properties.$.tenant": {
                  "resident": userId,
                  "type": "tenant",
                  "remarks": body.remarks_tenant,
                  "created_at": new Date()
                }
               },
               $set:{
                 "properties.$.status": "tenanted"
               }
            })
            .exec((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
            });
        }     
    });
});

userSchema.static('InputUserInLandlordOrTenant', (user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(user)) {
          return reject(new TypeError('User is not a valid object.'));
        }

        let body:any = user;
        let ObjectID = mongoose.Types.ObjectId;

        if(body.type == 'landlord'){
          User
            .findByIdAndUpdate(body.id_user, {
              $push:{
                "owned_property": {
                  "development": body.id_development,
                  "property": body.id_property
                }
              }
            })
            .exec((err, updated) => {
                  err ? reject(err)
                      : resolve(updated);
            });

          Development
            .update({"_id": body.id_development, "properties": {$elemMatch: {"_id": new ObjectID(body.id_property)}}},
                {
                  $set: {  
                    "properties.$.landlord": body.id_user
                  }
                }, {upsert: true})
            .exec((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
            });
        }

        if(body.type == 'tenant') {
          User
            .findByIdAndUpdate(body.id_user, {
              $push:{
                "rented_property":{
                  "development": body.id_development,
                  "property": body.id_property
                }
              }
            })
            .exec((err, updated) => {
                  err ? reject(err)
                      : resolve(updated);
            });

          Development
            .update({"_id": body.id_development, "properties": {$elemMatch: {"_id": new ObjectID(body.id_property)}}},{
              $push:{
                "properties.$.tenant": {
                  "resident": body.id_user,
                  "type": "tenant",
                  "created_at": new Date()
                }
               },
               $set:{
                 "properties.$.status": "tenanted"
               }
            })
            .exec((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
            });
        }      
    });
});

userSchema.static('createUsers', (user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(user)) {
        return reject(new TypeError('User is not a valid object.'));
      }
      var _user = new User(user);
      _user.active = true
      _user.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
        });
    });
});

userSchema.static('createUserSuperAdmin', (user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(user)) {
        return reject(new TypeError('User is not a valid object.'));
      }
      var _user = new User(user);
      _user.active = true
      _user.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
        });
    });
});

userSchema.static('deleteUser', (id:string, development:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        let body:any = development;

        User
          .findById(id, (err, userr) => {   
            if (userr.owned_property != null){
              var ObjectID = mongoose.Types.ObjectId; 
              var ownedProperty_landlord = [].concat(userr.owned_property)
              for (var i = 0; i < ownedProperty_landlord.length; i++) {
                var ownedProperty = ownedProperty_landlord[i];
                let developmentId = ownedProperty.development;
                let propertyId = ownedProperty.property;
                Development
                  .update({"_id": developmentId, "properties": {$elemMatch: {"_id": new ObjectID(propertyId)}}},
                      {
                        $unset: {  
                          "properties.$.landlord": id
                        }
                      }, {upsert: true})
                  .exec((err, saved) => {
                        err ? reject(err)
                            : resolve(saved);
                    });
              }
            }  
          })
          .exec((err) => {
              resolve({message: "error"});
          });

        Development
          .findByIdAndUpdate(body.development, {
            $pull: {
              "properties.0.tenant": {
                "resident": id
              }
            }
          })
          .exec((err, update) => {
              err ? reject(err)
                  : resolve(update);
          });

        UserGroup
          .findByIdAndUpdate(body.user_group, {
            $pull: {
              "users": id
            }
          })
          .exec((err, update) => {
              err ? reject(err)
                  : resolve(update);
          });

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
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        let body:any = user;

        User
          .findById(id, (err, user)=>{
            user.username = body.username;
            user.email = body.email;
            user.phone = body.phone;
            user.password = body.password;
            user.save((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
              });
          })
    });
});

userSchema.static('updateUsers', (id:string, user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        let body:any = user;
        let userObj = {$set: {}};
        for(var param in body) {
          userObj.$set[param] = body[param];
        }

        User
          .findByIdAndUpdate(id, userObj)
          .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });

        if(body.password){
          User
            .findById(id, (err, user)=>{
              user.password = body.password;
              user.save((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
                });
            })
        }


        
    });
});

userSchema.static('activationUser', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        User
          .findByIdAndUpdate(id,{
            $set:{"active": true}
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

userSchema.static('unActiveUser', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        User
          .findByIdAndUpdate(id,{
            $set:{"active": false}
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

userSchema.static('settingDetailUser', (id:string, user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        let userObj = {$set: {}};
        for(var param in user) {
          userObj.$set['details.'+param] = user[param];
         }
        User
          .findByIdAndUpdate(id, userObj)
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

userSchema.static('settingAccount', (id:string, user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        let body:any = user;
        User
          .findByIdAndUpdate(id, {
            $set:{
               "name": body.name,
               "email": body.email,
               "phone": body.phone,
               "emergancy_contact.name": body.contact_name,
               "emergency_contact.contact_number": body.contact_number
            }
          })
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

userSchema.static('settingsocialProfile', (id:string, user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        let body:any = user;

        User
          .findByIdAndUpdate(id,{
            $set: {
              "social_profile.resident_since": body.resident_since,
              "social_profile.email": body.email,
              "social_profile.phone": body.phone,
              "social_profile.social_interaction": body.social_interaction,
              "social_profile.young_kids": body.young_kids,
              "social_profile.age_kids": body.age_kids,
              "social_profile.hobbies": body.hobbies
            }
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let User = mongoose.model('User', userSchema);

export default User;
