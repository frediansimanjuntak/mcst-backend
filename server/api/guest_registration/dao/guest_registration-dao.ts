import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import guestSchema from '../model/guest_registration-model';

guestSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

        Guest
          .find(_query)
          .populate("development created_by checkin_by checkout_by contract")
          .exec((err, guests) => {
              err ? reject({message: err.message})
                  : resolve(guests);
          });
    });
});

guestSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Guest
          .findById(id)
          .populate("development created_by checkin_by checkout_by contract")
          .exec((err, guests) => {
              err ? reject({message: err.message})
                  : resolve(guests);
          });
    });
});

guestSchema.static('getOwnGuest', (userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": developmentId, "created_by": userId};

        Guest
          .find(_query)
          .populate("development created_by checkin_by checkout_by contract")
          .exec((err, guests) => {
              err ? reject({message: err.message})
                  : resolve(guests);
          });
    });
});

guestSchema.static('createGuest', (guest:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(guest)) {  
        return reject(new TypeError('Guest is not a valid object.'));
      }
      var _guest = new Guest(guest);
          _guest.created_by = userId;
          _guest.development = developmentId;
          _guest.save((err, saved) => {
            err ? reject({message: err.message})
                : resolve(saved);
              });
    });
});

guestSchema.static('deleteGuest', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Guest
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve();
                });
    });
});

guestSchema.static('updateGuest', (id:string, guest:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(guest)) {
          return reject(new TypeError('Guest is not a valid object.'));
        }

        Guest
          .findByIdAndUpdate(id, guest)
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
                  });
    });
});

guestSchema.static('checkInGuest', (id:string, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let checkIn = Date.now();

        Guest
          .findByIdAndUpdate(id, {
            $set: {
              "check_in": checkIn,
              "checkin_by": userId
            }
          })
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
                  });
    });
});

guestSchema.static('checkOutGuest', (id:string, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let checkOut = Date.now();

        Guest
        .findByIdAndUpdate(id, {
          $set: {
            "check_out": checkOut,
            "checkout_by": userId
          }
        })
        .exec((err, updated) => {
              err ? reject({message: err.message})
                  : resolve(updated);
          });
    });
});

let Guest = mongoose.model('Guest', guestSchema);

export default Guest;
