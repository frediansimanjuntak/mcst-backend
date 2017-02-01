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
          .findById(id)
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
      let ObjectID = mongoose.Types.ObjectId;  

      var _user = new User(user);
      _user.default_development = developmentId;
      _user.default_property.development=developmentId;
      _user.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
      var userId=_user._id
      var ownned_property_property = _user.owned_property.property;
      var ownned_property_development = _user.owned_property.development;
      var rented_property_property = _user.rented_property.property;
      var rented_property_development = _user.rented_property.development;

      if (ownned_property_property!=null){
        Development
        .update({"_id":ownned_property_development, "properties": { $elemMatch: {"_id": new ObjectID(ownned_property_property)}}},{
          $set:{"properties.$.lanlord":userId}
        })
      }
      
      if (rented_property_property!=null){
        Development
        .update({"_id":rented_property_development, "properties": { $elemMatch: {"_id": new ObjectID(rented_property_property)}}},{
          $push:{"properties.0.tenant.$.recident":userId}
        })
      }

    });
});

userSchema.static('createUserSuperAdmin', (user:Object, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(user)) {
        return reject(new TypeError('User is not a valid object.'));
      }

      console.log(user)

      var _user = new User(user);
      _user.role="super admin"
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

userSchema.static('settingDetailUser', (id:string, user:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(user)) {
          return reject(new TypeError('User is not a valid object.'));
        }

        let userObj = {$set: {}};
        for(var param in user) {
          userObj.$set['details.'+param] = user[param];
         }
        console.log(userObj);
        User
        .findByIdAndUpdate(id, userObj)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let User = mongoose.model('User', userSchema);

export default User;
