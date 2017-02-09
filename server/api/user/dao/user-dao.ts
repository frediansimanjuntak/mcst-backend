import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import userSchema from '../model/user-model';
import Development from '../../development/dao/development-dao'

userSchema.static('index', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        User
          .find({}, '-salt -password')
          .exec((err, users) => {
              err ? reject(err)
                  : resolve(users);
          });
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
          .populate("default_development")
          .exec((err, users) => {
              err ? reject(err)
                  : resolve(users);
          });
    });
});


userSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

        User
          .findById(id, '-salt -password')
          .populate("default_development")
          .exec((err, users) => {
              err ? reject(err)
                  : resolve(users);
          });
    });
});

userSchema.static('getDetailUser', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

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
              console.log(saved);
          });

      var userId = _user._id; 

      if (_user.owned_property != null){
        var owned_property_property = [].concat(_user.owned_property); 
        console.log(owned_property_property) 
        for (var i = 0; i < owned_property_property.length; i++) {
          var ownedProperty = owned_property_property[i];
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
      }
      
      if(_user.rented_property != null){
        let developmentId = body.rented_property.development;
        let propertyId = body.rented_property.property;

          Development
            .update({"_id": developmentId, "properties": { $elemMatch: {"_id": new ObjectID(propertyId)}}},{
              $push:{
                "properties.$.tenant": {
                  "resident": userId,
                  "type": "tenant",
                  "created_at": new Date()
                }
               }
            })
            .exec((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
                      console.log("rented"+saved);
              });
        }     
    });
});

userSchema.static('createUserSuperAdmin', (user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(user)) {
        return reject(new TypeError('User is not a valid object.'));
      }
      var _user = new User(user);
      _user.role = "super admin"
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
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });

        Development
          .findByIdAndUpdate(body.development, {
            $pull: {
              "properties.0.tenant": {
                "resident": id
              }
            },
          })

        Development
          .update({"_id": body.development, "properties.landlord": id},{
            $set: {
              "properties.$.landlord": "empty"
            }
          })
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
        if (!_.isObject(user)) {
          return reject(new TypeError('User is not a valid object.'));
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
        if (!_.isObject(user)) {
          return reject(new TypeError('User is not a valid object.'));
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
        if (!_.isObject(user)) {
          return reject(new TypeError('User is not a valid object.'));
        }
        let body:any = user;
        User
          .findByIdAndUpdate(id,{
            $set:{
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
