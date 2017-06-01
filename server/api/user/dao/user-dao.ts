import * as mongoose from 'mongoose';
import development = require("./../../../config/environment/development")
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import userSchema from '../model/user-model';
import Development from '../../development/dao/development-dao';
import Hobbies from '../../hobbies/dao/hobbies-dao';
import UserGroup from '../../user_group/dao/user_group-dao';
import * as auth from '../../../auth/auth-service';
import {mail} from '../../../email/email';
import {signToken} from '../../../auth/auth-service';
import {GlobalService} from '../../../global/global.service';
var jwtDecode = require('jwt-decode');

userSchema.static('index', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        auth.isAuthenticated();
    });
});

userSchema.static('userAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};
        User
          .find(_query, '-salt -password')
          .exec((err, users) => {
              err ? reject({message: err.message})
                  : resolve(users);
          });
    });
});

userSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"default_development": development};
        User
          .find(_query, '-salt -password')
          .exec((err, users) => {
              err ? reject({message: err.message})
                  : resolve(users);
          });
    });
});

userSchema.static('me', (userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        User
          .findById(userId, '-salt -password')
          .populate("default_development user_group vehicles rented_property.development owned_property.development user_group")
          .exec((err, users) => {
            if (err) {
              reject({message: err.message});
            }
            if (users) {
              let developmentID = users.default_development._id;
              if (users.default_property.property) {
                let propertyID = users.default_property.property;
                Development.getByIdDevProperties(developmentID.toString(), propertyID).then((res) => {
                  let unit = "Unit #" + res.address.unit_no + "-" + res.address.unit_no_2; 
                  resolve({"user": users, "property_data": res, "unit": unit});
                })
                .catch((err) => {
                  reject({message: err.message});
                  console.log(err);
                })
              }
              else {
                resolve({"user": users});
              }
            }
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
          .populate("default_development user_group vehicles rented_property.development owned_property.development user_group")
          .exec((err, users) => {
              err ? reject({message: err.message})
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
              err ? reject({message: err.message})
                  : resolve(users);
          });
    });
});

userSchema.static('updatePropertyOwner', (idDevelopment:string, idProperty:string, idUser:string, remarks:string) :Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(idDevelopment && idProperty)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let ObjectID = mongoose.Types.ObjectId;  
        Development
          .update({"_id": idDevelopment, "properties": {$elemMatch: {"_id": new ObjectID(idProperty)}}},
              {
                $set: {  
                  "properties.$.landlord.data": {
                    "resident": idUser,
                    "remarks": remarks,
                    "created_at": new Date()
                  },
                  "properties.$.status": "own stay"
                }
              })
          .exec((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);
          });
    });
});

userSchema.static('updatePropertyTenant', (idDevelopment:string, idProperty:string, idUser:string, remarks:string) :Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(idDevelopment && idProperty)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let ObjectID = mongoose.Types.ObjectId;  
        Development
          .update({"_id": idDevelopment, "properties": {$elemMatch: {"_id": new ObjectID(idProperty)}}},{
            $push:{
              "properties.$.tenant.data": {
                "resident": idUser,
                "type": "tenant",
                "remarks": remarks,
                "created_at": new Date()
              }
             },
             $set:{
               "properties.$.status": "tenanted"
             }
          })
          .exec((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);
          });
    });
});

userSchema.static('signUp', (user:Object, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(user)) {
          return reject(new TypeError('User is not a valid object.'));
        }
        var ObjectID = mongoose.Types.ObjectId;  
        let body:any = user;
        let IDdevelopment;
        let password = GlobalService.autoPasswordUser();
        let code = GlobalService.verivicationCode();
        let role;
        var _user = new User(user);
        _user.default_development = developmentId;
        _user.default_property.development = developmentId;
        _user.password = password;
        _user.verification.code = code;
        _user.save((err, res)=>{
          if(err){
            reject({message: err.message});
          }
          if(res){     
            var userId = res._id.toString();
            if (body.owned_property != null){
              var ownedProperty_landlord = [].concat(res.owned_property)
              for (var i = 0; i < ownedProperty_landlord.length; i++) {
                var ownedProperty = ownedProperty_landlord[i];
                let idDevelopment = ownedProperty.development.toString();
                let idProperty = ownedProperty.property.toString();
                User.updatePropertyOwner(idDevelopment, idProperty, userId, body.remarks);           
              }
              role = "owner";
            }            
            if(body.rented_property != null){
              let idDevelopment = body.rented_property.development.toString();
              let idProperty = body.rented_property.property.toString();
              User.updatePropertyTenant(idDevelopment, idProperty, userId, body.remarks); 
              role = "tenant";             
            }            
            let data = {
              "emailTo": res.email,
              "fullname": res.details.first_name +" "+ res.details.last_name,
              "username": res.username,
              "verifyCode": res.verification.code,
              "password": password,
              "from": "mcst-admin@mcst.sg.com",
              "link": "http://mcst-web.shrimpventures.com/login"
            } 
            let typeMail = "signUp";
            User.email(data, typeMail);
            res.default_property.role = role;
            res.save((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);
            })
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
        let idProperty = body.id_property.toString();
        let idDevelopment = body.id_development.toString();
        let idUser = body.id_user.toString();
        let role = body.default_property.role;
        let defaultProperty = body.default_property.property;
        let remarks = body.remarks;
        let updateObj = {$push: {}, $set: {}};
        if(body.type == 'landlord'){
          updateObj.$push["owned_property"] = ({"development": idDevelopment, "property": idProperty});
          User.updatePropertyOwner(idDevelopment, idProperty, idUser, remarks); 
        }

        if(body.type == 'tenant'){
          updateObj.$push["rented_property"] = ({"development": idDevelopment, "property": idProperty});
          User.updatePropertyTenant(idDevelopment, idProperty, idUser, remarks); 
        }

        if(body.default_property.property){
          updateObj.$set["default_property"] = ({"development": idDevelopment, "role": role, "property": defaultProperty})
          updateObj.$set["default_development"] = idDevelopment;
        }
        User
          .findByIdAndUpdate(idUser, updateObj)
          .exec((err, updated) => {
            err ? reject({message: err.message})
                : resolve(updated);
          })         
    });
});

userSchema.static('createUsers', (user:Object, development:string, role:string, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(user)) {
        return reject(new TypeError('User is not a valid object.'));
      }
      let body:any = user;
      let roleUser;
      if (role == "superadmin"){ 
        if (body.role == "admin" || body.role == "user") {
          roleUser = body.role;
        }
        else {
          reject({message: "Can not add people other than admin and user role"})
        }
      }
      else if (role == "admin") {
        if (body.role == "user") {
          roleUser = body.role;
        }
        else {
          reject({message: "Can not add people other than user role"})
        }
      }
      else if (role == "master") {
        roleUser = body.role;
      }
      else {
        reject({message: "Can not add user"})
      }
      let password = GlobalService.autoPasswordUser();
      let verifiedCode = GlobalService.verivicationCode();

      var _user = new User(user);
      _user.default_development = development;
      _user.role = roleUser;
      _user.password = password;
      _user.verification.code = verifiedCode;
      _user.created_by = userId;
      _user.active = true
      _user.save((err, saved) => {
        if (err) {
          reject({message: err.message});
        }
        else if (saved) {
          let data = {
            "emailTo": saved.email,
            "fullname": saved.details.first_name +" "+ saved.details.last_name,
            "username": saved.username,
            "verifyCode": saved.verification.code,
            "password": password,
            "from": "mcst-admin@mcst.sg.com",
            "link": "http://mcst-web.shrimpventures.com/login"
          } 
          let typeMail = "signUp";
          User.email(data, typeMail);
        }
        err ? reject({message: err.message})
            : resolve(saved);
        });
    });
});

userSchema.static('setDefaultProperty', (idUser:string, data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      let body:any = data;
      let role;
      if(body.status == "rented"){
        role = "tenant";
      }
      else {
        role = "owner";
      }
      User
        .findByIdAndUpdate(idUser, {
          $set: {
            "default_property": {
              "development": body.development,
              "property": body.property,
              "role": role
            },
            "default_development": body.development
          }
        })
        .exec((err, updated) => {
          err ? reject({message: err.message})
              : resolve(updated);
        })
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
        err ? reject({message: err.message})
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
                          "properties.$.landlord.data.resident": id
                        }
                      }, {upsert: true})
                  .exec((err, saved) => {
                        err ? reject({message: err.message})
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
              "properties.0.tenant.data": {
                "resident": id
              }
            }
          })
          .exec((err, update) => {
              err ? reject({message: err.message})
                  : resolve(update);
          });

        UserGroup
          .findByIdAndUpdate(body.user_group, {
            $pull: {
              "users": id
            }
          })
          .exec((err, update) => {
              err ? reject({message: err.message})
                  : resolve(update);
          });

        User
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve();
          });
        
    });
});

userSchema.static('resendVerificationUser', (userId:string, user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let body:any = user;
        let code = Math.random().toString(36).substr(2, 4).toUpperCase(); 
        User
          .findById(userId)
          .exec((err, res) => {
            if(err){
              reject({message: err.message});
            }
            if(res){
              var verified = res.verification.verified;
              if(verified == false){
                res.verification.code = code;
                res.save((err, saved) => {
                  if(err){
                    reject({message: err.message});
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
                      User.email(data, typeMail)
                      resolve(saved);
                  }
                })                  
              }
              else{
                reject({message: "Your Account Already Verified"})
              }
            }
          })        
    });
});

userSchema.static('verifiedUser', (userId:string, data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let body:any = data;
        User
          .findById(userId)
          .exec((err, user) => {
              var verified = user.verification.verified;
              var code = user.verification.code; 
              if(verified == false){    
                if (code == body.code){
                    user.verification.verified = true;
                    user.verification.verified_date = new Date();
                    user.save((err, saved) => {
                      if(err){
                        reject({message: err.message});
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


userSchema.static('changePassword', (id:string, oldpass:string, newpass:string):Promise<any> => {
  return new Promise((resolve:Function, reject:Function) => {
    if (!_.isString(id)) {
      return reject(new TypeError('Id is not a valid string.'));
    }
    User
      .findById(id)
      .exec((err, user) => {
        if(err){
          reject({message: err.message});
        }
        if(user){
          user.authenticate(oldpass, (err, ok) => {
                if(err) {
                  reject({message: err.message});
                }
                if(ok) {
                  user.password = newpass;
                  user.save((err, res) => {
                    err ? reject({message: err.message})
                        : resolve({message: 'data updated'});
                  });
                } else {
                  reject({message: "old password didn't match"});                  
                }
            });
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
            user.salulation = body.salulation;
            user.gender = body.gender;
            user.name = body.name;
            user.email = body.email;
            user.phone = body.phone;
            user.save((err, saved) => {
              if(err){
                reject({message: err.message});
              }
              if(saved){
                if(body.oldPassword && body.newPassword) {
                  User.changePassword(id, body.oldPassword, body.newPassword).then((res) => {
                    resolve(res);
                  })
                  .catch((err) => {
                    reject({message: err.message});
                  })
                }
                else{
                  resolve({message: 'data updated'});
                }
              }
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
        for (var param in body) {
          userObj.$set[param] = body[param];
        }
        User
          .findByIdAndUpdate(id, userObj)
          .exec((err, updated) => {
              err ? reject({message: err.message})
                  : resolve(updated);
          });
        if (body.password) {
          User
            .findById(id, (err, user)=>{
              user.password = body.password;
              user.save((err, saved) => {
                err ? reject({message: err.message})
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
          .findByIdAndUpdate(id, {
            $set: {"active": true}
          })
          .exec((err, deleted) => {
              err ? reject({message: err.message})
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
          .findByIdAndUpdate(id, {
            $set: {"active": false}
          })
          .exec((err, deleted) => {
              err ? reject({message: err.message})
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
        for (var param in user) {
          userObj.$set['details.'+param] = user[param];
         }
        User
          .findByIdAndUpdate(id, userObj)
          .exec((err, updated) => {
              err ? reject({message: err.message})
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
               "emergency_contact": {
                 "name": body.emergancy.name,
                 "contact_number": body.emergancy.contact_number
               }
            }
          })
          .exec((err, updated) => {
              err ? reject({message: err.message})
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
            if (err) {
              reject({message: err.message});
            }
            if (users) {              
              if (users.length == 0) {
                resolve({message: "no data"})
              }
              if (users.length >= 1) {
                let dataArr = [];
                for (var i = 0; i < users.length; i++) {
                  let phone;
                  let email;
                  let property;
                  let unit;
                  let unit_no;
                  let unit_no_2;
                  let block;
                  let address;
                  let defaultPropertyDev;
                  let defaultPropertyDevName;
                  let defaultPropertyDevId;
                  let defaultProperty;
                  let defaultDevelopment;
                  let vehicles;
                  let licenseVehicle;
                  let userData = users[i];
                  let privacy = userData.private;
                  let userId = userData._id;
                  let name = userData.name;
                  let socialProfile = userData.social_profile;
                  if (userData.default_property.property) {
                    defaultProperty = userData.default_property.property;
                  }
                  if (userData.default_property.development) {
                    defaultDevelopment = userData.default_property.development;
                    defaultPropertyDevId = userData.default_property.development._id;
                    defaultPropertyDev = defaultDevelopment.properties;
                    defaultPropertyDevName = defaultDevelopment.name;
                    if (defaultProperty) {
                      for (var j = 0; j < defaultPropertyDev.length; j++) {
                        let defaultDevPropId = defaultPropertyDev[j]._id.toString();
                        if (defaultDevPropId == defaultProperty) {
                          property = defaultPropertyDev[j];
                          vehicles = property.vehicles;
                          unit_no = property.address.unit_no;
                          unit_no_2 = property.address.unit_no_2;
                          block = property.address.block_no;
                          if (vehicles.length != 0) {
                            for (var k = 0; k < vehicles.length; k++) {
                              let vehicle = vehicles[k];
                              let owner = vehicle.owner;
                              if (owner == userId) {
                                licenseVehicle = vehicle.license_plate;
                              }
                            }
                          }
                        }
                      }
                    } 
                  }               
                  if (privacy.phone == false) {
                    phone = userData.phone;
                  }
                  if (privacy.email == false) {
                    email = userData.email;
                  }           
                  if (privacy.unit == false) {
                    if (unit_no && unit_no_2) {
                      unit = "Unit #" + unit_no + "-" + unit_no_2; 
                      address = defaultPropertyDevName + " blk " + block + " #" + unit_no + "-" + unit_no_2;               
                    }                
                  }      
                  let data = {
                    "default_development": defaultPropertyDevId,
                    "default_property": defaultProperty,
                    "unit": unit,
                    "address": address,
                    "name": name,
                    "username": userData.username,
                    "resident_since": socialProfile.resident_since,
                    "social_interaction": socialProfile.social_interaction,
                    "young_kids": socialProfile.young_kids ? socialProfile.young_kids : 0,
                    "age_kids": socialProfile.age_kids ? socialProfile.age_kids : 0,
                    "hobbies": socialProfile.hobbies ? socialProfile.hobbies : [],
                    "vehicle": licenseVehicle,
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
          .populate("default_property.development")
          .exec((err, users) => {
            if (err) {
              reject({message: err.message});
            }
            if (users) {
              let phone;
              let email;
              let privacy = users.private;
              let property;
              let unit;
              let unit_no;
              let unit_no_2;
              let block;
              let address;
              let vehicles;
              let licenseVehicle;
              let defaultPropertyDev;
              let defaultPropertyDevName;
              let defaultPropertyDevId;
              let name = users.name;
              let socialProfile = users.social_profile;
              let defaultProperty = users.default_property.property;
              let defaultDevelopment = users.default_property.development;
              if (defaultDevelopment) {
                defaultPropertyDev = defaultDevelopment.properties;
                defaultPropertyDevName = defaultDevelopment.name;
                defaultPropertyDevId = defaultDevelopment._id;
                for (var i = 0; i < defaultPropertyDev.length; i++) {
                   if (defaultPropertyDev[i]._id == defaultProperty) {
                     property = defaultPropertyDev[i];
                     unit_no = property.address.unit_no;
                     unit_no_2 = property.address.unit_no_2;
                     block = property.address.block_no;
                     vehicles = property.vehicles;
                     if (vehicles.length != 0) {
                        for (var k = 0; k < vehicles.length; k++) {
                          let vehicle = vehicles[k];
                          let owner = vehicle.owner ? vehicle.owner.toString() : "";
                          if (owner == userId) {
                            licenseVehicle = vehicle.license_plate;
                          }
                        }
                      }
                   }
                }
              }                 
              if (privacy.phone == false) {
                phone = users.phone;
              }
              if (privacy.email == false) {
                email = users.email;
              }
              if (privacy.unit == false) {
                if (unit_no && unit_no_2) {
                  unit = "Unit #" + unit_no + "-" + unit_no_2; 
                  address = defaultPropertyDevName + " Block " + block + " #" + unit_no + "-" + unit_no_2;               
                }                
              }
              let data = {
                "default_development": defaultPropertyDevId,
                "default_property": defaultProperty,
                "unit": unit,
                "name": name,
                "address": address,
                "resident_since": socialProfile.resident_since,
                "social_interaction": socialProfile.social_interaction,
                "young_kids": socialProfile.young_kids ? socialProfile.young_kids : 0,
                "age_kids": socialProfile.age_kids ? socialProfile.age_kids : 0,
                "hobbies": socialProfile.hobbies ? socialProfile.hobbies : [],
                "vehicle": licenseVehicle,
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
        let private_phone;
        let private_email;
        let private_unit;
        if (body.showPhoneNumber == true) {
          private_phone = false;
        }
        else if (body.showPhoneNumber == false) {
          private_phone = true;
        }
        if (body.showEmail == true) {
          private_email = false;
        }
        else if (body.showEmail == false) {
          private_email = true;
        }
        if (body.showUnit == true) {
          private_unit = false;
        }
        else if (body.showUnit == false) {
          private_unit = true;
        }
        
        User
          .findByIdAndUpdate(userId,{
            $set: {
              "social_profile.resident_since": body.resident_since,
              "social_profile.social_interaction": body.social_interaction,
              "social_profile.young_kids": body.young_kids,
              "social_profile.age_kids": body.age_kids,
              "social_profile.hobbies": body.hobbies,
              "private.phone": private_phone,
              "private.email": private_email,
              "private.unit": private_unit
            }
        })
        .exec((err, updated) => {
            if (err) {
              reject({message: err.message});
            }
            if (updated) {
              if (body.hobbies) {
                Hobbies.createHobbies(body);
              }
              resolve({message: "updated"});
            }                  
        });
    });
});

userSchema.static('decodeToken', (token:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var decoded = jwtDecode(token);
        resolve(decoded);
    });
});

userSchema.static('refreshToken', (authorization:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let token = authorization.substring(7);
        User.decodeToken(token).then((res) => {
          let userId = res._id;
          if (res.exp) {
            User
            .findById(userId)
            .exec((err, user) => {
              if (err) {
                reject({message: err.message});
              }
              if (user) {
                let remember = "true"
                var newToken = signToken(user._id, user.role, user.default_development, remember);
                resolve({token: newToken})
              }
            })
          }
          else {
            reject({message:"token not expired"})
          }          
        })
        .catch((err)=> {
          reject({message: err.message});
        })        
    });
});

userSchema.static('email', (data:Object, type:string):Promise<any> => {
  return new Promise((resolve:Function, reject:Function) => {
    if (type == 'signUp') {
      mail.signUp(data).then(res => {
        resolve(res);
      });
    }
    if (type == 'resendVerificationCode') {
      mail.resendVerificationCode(data).then(res => {
        resolve(res);
      });
    }
    if (type == 'verifiedCode') {
      mail.verifiedCode(data).then(res => {
        resolve(res);
      });
    }
  });
});


userSchema.static('addTokenNotif', (id:string, data:Object):Promise<any> => {
  return new Promise((resolve:Function, reject:Function) => {
    let body:any = data;
    User
      .find({"_id": id, "token_notif": {$in: [body.token]}})
      .exec((err, users) => {
        if (err) {
          reject({message: err.message});
        }
        else if (users) {
          if (users.length > 0) {
            reject({message: "Token Already Exist"});
          }
          else {
            User
              .findByIdAndUpdate(id, {
                $push: {
                  "token_notif": body.token
                }
              })
              .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
              })
          }
        }
      })
  });
});

userSchema.static('deleteTokenNotif', (id:string, data:Object):Promise<any> => {
  return new Promise((resolve:Function, reject:Function) => {
    let body:any = data;
    User
      .find({"_id": id, "token_notif": {$in: [body.token]}})
      .exec((err, users) => {
        if (err) {
          reject({message: err.message});
        }
        else if (users) {
          if (users.length > 0) {
            User
              .findByIdAndUpdate(id, {
                $pull: {
                  "token_notif": body.token
                }
              })
              .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
              })
          }
          else {            
            reject({message: "Token Not Already Exist"});
          }
        }
      })
  });
});

let User = mongoose.model('User', userSchema);

export default User;
