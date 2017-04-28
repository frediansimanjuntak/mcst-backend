import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import userSchema from '../model/user-model';
import Development from '../../development/dao/development-dao';
import Hobbies from '../../hobbies/dao/hobbies-dao';
import UserGroup from '../../user_group/dao/user_group-dao';
import * as auth from '../../../auth/auth-service';
import {mail} from '../../../email/email';

userSchema.static('index', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        auth.isAuthenticated();
    });
});

userSchema.static('userAll', ():Promise<any> => {
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

userSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"default_development": development};

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
        let IDdevelopment;
        let password = Math.random().toString(36).substr(2, 6); 
        let code = Math.random().toString(36).substr(2, 4); 

        var _user = new User(user);
        _user.default_development = developmentId;
        _user.default_property.development = developmentId;
        _user.password = password.toUpperCase();
        _user.verification.code = code.toUpperCase();
        _user.save((err, saved)=>{
          if(err){
            reject(err);
          }
          if(saved){
            var userId = saved._id;
            let data = {
              "emailTo": saved.email,
              "fullname": saved.details.first_name +" "+ saved.details.last_name,
              "username": saved.username,
              "verifyCode": saved.verification.code,
              "password": password.toUpperCase(),
              "from": "mcst-admin@mcst.sg.com",
              "link": "http://mcst-web.shrimpventures.com/login"
            } 
            let typeMail = "signUp";
            User.email(data, typeMail)

            if (body.owned_property != null){
              var ownedProperty_landlord = [].concat(saved.owned_property)
              for (var i = 0; i < ownedProperty_landlord.length; i++) {
                var ownedProperty = ownedProperty_landlord[i];
                IDdevelopment = ownedProperty.development;
                let propertyId = ownedProperty.property;
                Development
                  .update({"_id": IDdevelopment, "properties": {$elemMatch: {"_id": new ObjectID(propertyId)}}},
                      {
                        $set: {  
                          "properties.$.landlord.data": {
                            "resident": userId,
                            "remarks": body.remarks,
                            "created_at": new Date()
                          },
                          "properties.$.status": "own stay"
                        }
                      })
                  .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                  });
              }
              resolve({message: "Success"});
            }
            
            if(body.rented_property != null){
              // for(var i = 0; i < saved.rented_property.)
              IDdevelopment = body.rented_property.development;
              let propertyId = body.rented_property.property;

              Development
                .update({"_id": IDdevelopment, "properties": {$elemMatch: {"_id": new ObjectID(propertyId)}}},{
                  $push:{
                    "properties.$.tenant.data": {
                      "resident": userId,
                      "type": "tenant",
                      "remarks": body.remarks,
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
          }
        });             
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
                    "properties.$.landlord.data": {
                      "resident": body.id_user,
                      "remarks": body.remarks,
                      "created_at": new Date()
                    },
                    "properties.$.status": "own stay"
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
                "properties.$.tenant.data": {
                  "resident": body.id_user,
                  "remarks": body.remarks,
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
      _user.active = true;
      _user.provider = "local";
      _user.role = "superadmin";
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

userSchema.static('resendVerificationUser', (userId:string, user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let body:any = user;
        let code = Math.random().toString(36).substr(2, 4); 
        User
          .findById(userId, (err,user)=>{
            var verified = user.verification.verified;
            if(verified == "false"){
              user.verification.code = code.toUpperCase();
              user.save((err, saved) => {
                if(err){
                  reject(err);
                }
                if(saved){
                    let data = {
                      "emailTo": saved.email,
                      "fullname": saved.details.first_name +" "+ saved.details.last_name,
                      "username": saved.username,
                      "verifyCode": code.toUpperCase(),
                      "from": "mcst-admin@mcst.sg.com"
                    } 
                    let typeMail = "resendVerificationCode";
                    User.email(data, typeMail).then(res => {
                      resolve(saved);
                    })
                }
              }) 
            }
            else{
              reject({message: "Your Account is Verified"})
            }
               
          })
    });
});

userSchema.static('verifiedUser', (userId:string, data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let body:any = data;
        console.log(body);
        User
          .findById(userId, (err,user)=>{
            var verified = user.verification.verified;
            var code = user.verification.code; 
            if(verified == "false"){
              console.log(code);         
              if (code == body.code){
                  user.verification.verified = true;
                  user.verification.verified_date = new Date();
                  user.save((err, saved) => {
                    if(err){
                      reject(err);
                    }
                    if(saved){
                      let data = {
                        "emailTo": saved.email,
                        "fullname": saved.details.first_name +" "+ saved.details.last_name,
                        "username": saved.username,
                        "verifyCode": code.toUpperCase(),
                        "from": "mcst-admin@mcst.sg.com"
                      } 
                      let typeMail = "verifiedCode";
                      User.email(data, typeMail).then(res => {
                        resolve(saved);
                      })
                    }
                  })            
              }
              else{
                reject({message: 'Your code is wrong'});
              }
            }
             else{
              reject({message: "Already Verified"})
            }
          })
    });
});

userSchema.static('updateUser', (id:string, data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = data;
        User
          .findById(id, (err, user)=>{
            user.username = body.username;
            user.email = body.email;
            user.phone = body.phone;
            if(body.password){
              user.password = body.password;
            }            
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
                  : resolve({message: "user activated"});
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
                  : resolve({message: "user not activated"});
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

userSchema.static('getAllSocialProfile', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

        var ObjectID = mongoose.Types.ObjectId;
        let _query = {};

        User
          .find(_query)
          .populate("default_property.development")
          .exec((err, users) => {
            if(err){
              reject(err);
            }
            if(users){              
              if(users.length == 0){
                resolve({message: "no data"})
              }
              if(users.length >= 1){
                let dataArr = [];
                for(var i = 0; i < users.length; i++){
                  let userData = users[i];
                  let phone;
                  let email;
                  let property;
                  let unit;
                  let unit_no;
                  let unit_no_2;
                  let defaultPropertyDev;
                  let defaultPropertyDevId;
                  let socialProfile = userData.social_profile;
                  let defaultProperty = userData.default_property.property;
                  let defaultDevelopment = userData.default_property.development;
                  if(defaultDevelopment){
                    defaultPropertyDev = defaultDevelopment.properties;
                    defaultPropertyDevId = defaultDevelopment._id;
                    for(var i = 0; i < defaultPropertyDev.length; i++){
                       if(defaultPropertyDev[i]._id == defaultProperty){
                         property = defaultPropertyDev[i].address;
                         unit_no = defaultPropertyDev[i].address.unit_no;
                         unit_no_2 = defaultPropertyDev[i].address.unit_no_2;
                       }
                    }
                  }                 
                  let privacy = userData.private;
                  if(privacy.phone == false){
                    phone = userData.phone;
                  }
                  if(privacy.email == false){
                    email = userData.email;
                  }           
                  if(unit_no && unit_no_2){
                    unit = "Unit #" + unit_no + "-" + unit_no_2
                  }       
                  let data = {
                    "default_development": defaultPropertyDevId,
                    "default_property": defaultProperty,
                    "unit": unit,
                    "name": userData.name,
                    "username": userData.username,
                    "resident_since": socialProfile.resident_since,
                    "social_interaction": socialProfile.social_interaction,
                    "young_kids": socialProfile.young_kids,
                    "age_kids": socialProfile.age_kids,
                    "hobbies": socialProfile.hobbies,
                    "phone": phone,
                    "email": email
                  };            
                  dataArr.push(data);      
                }
                resolve(dataArr);
              }              
            }            
          })          
    });
});

userSchema.static('getOwnSocialProfile', (userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(userId)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        User
          .findById(userId)
          .exec((err, users) => {
            if(err){
              reject(err);
            }
            if(users){
              let phone;
              let email;
              let privacy = users.private;
              let property;
              let unit;
              let unit_no;
              let unit_no_2;
              let defaultPropertyDev;
              let defaultPropertyDevId;
              let socialProfile = users.social_profile;
              let defaultProperty = users.default_property.property;
              let defaultDevelopment = users.default_property.development;
              if(defaultDevelopment){
                defaultPropertyDev = defaultDevelopment.properties;
                defaultPropertyDevId = defaultDevelopment._id;
                for(var i = 0; i < defaultPropertyDev.length; i++){
                   if(defaultPropertyDev[i]._id == defaultProperty){
                     property = defaultPropertyDev[i].address;
                     unit_no = defaultPropertyDev[i].address.unit_no;
                     unit_no_2 = defaultPropertyDev[i].address.unit_no_2;
                   }
                }
              }                 
              if(privacy.phone == false){
                phone = users.phone;
              }
              if(privacy.email == false){
                email = users.email;
              }
              if(unit_no && unit_no_2){
                unit = "Unit #" + unit_no + "-" + unit_no_2
              }

              let data = {
                "default_development": defaultPropertyDevId,
                "default_property": defaultProperty,
                "unit": unit,
                "resident_since": socialProfile.resident_since,
                "social_interaction": socialProfile.social_interaction,
                "young_kids": socialProfile.young_kids,
                "age_kids": socialProfile.age_kids,
                "hobbies": socialProfile.hobbies,
                "phone": phone,
                "email": email
              }
              resolve(data);
            }            
          })          
    });
});

userSchema.static('settingsocialProfile', (userId:string, user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(userId)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        let body:any = user;
        User
          .findByIdAndUpdate(userId,{
            $set: {
              "social_profile.resident_since": body.resident_since,
              "social_profile.social_interaction": body.social_interaction,
              "social_profile.young_kids": body.young_kids,
              "social_profile.age_kids": body.age_kids,
              "social_profile.hobbies": body.hobbies,
              "private.phone_number": body.showPhoneNumber,
              "private.email": body.showEmail
            }
        })
        .exec((err, updated) => {
            if(err){
              reject(err);
            }
            if(updated){
              Hobbies.createHobbies(body).then((res) => {
                  resolve(updated);
                })
                .catch((err) => {
                  reject(err);
                })
            }                  
        });
    });
});

userSchema.static('email', (data:Object, type:string):Promise<any> => {
  return new Promise((resolve:Function, reject:Function) => {

    if(type == 'signUp'){
      mail.signUp(data).then(res => {
        resolve(res);
      });
    }
    if(type == 'resendVerificationCode'){
      mail.resendVerificationCode(data).then(res => {
        resolve(res);
      });
    }
    if(type == 'verifiedCode'){
      mail.verifiedCode(data).then(res => {
        resolve(res);
      });
    }
  });
});

let User = mongoose.model('User', userSchema);

export default User;
