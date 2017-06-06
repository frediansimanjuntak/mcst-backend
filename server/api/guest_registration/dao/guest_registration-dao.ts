import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import guestSchema from '../model/guest_registration-model';

guestSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};
        Guest
            .find(_query)
            .populate("development contract created_by checkin_by checkout_by")
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
            .populate("development contract created_by checkin_by checkout_by")
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
            .populate("development contract created_by checkin_by checkout_by")
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

guestSchema.static('checkInGuest', (id:string, userId:string, data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = data;
        let checkIn = new Date();
        Guest
            .findById(id)
            .exec((err, guest) => {
                if (err) {
                    reject(err);
                }
                else if (guest) {
                    if (guest.visitor.pass == body.visitor.pass) {
                        guest.check_in = checkIn;
                        guest.checkin_by = userId;
                        guest.save((err, saved) => {
                            err ? reject({message: err.message})
                                : resolve(saved);
                        })
                    }
                }
                else {
                    resolve({message: "Visitor pass not same"});
                }
            })
    });
});

guestSchema.static('checkOutGuest', (id:string, userId:string, data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = data;
        let checkOut = new Date();
        Guest
            .findById(id)
            .exec((err, guest) => {
                if (err) {
                    reject(err);
                }
                else if (guest) {
                    if (guest.visitor.pass == body.visitor.pass) {
                        guest.check_out = checkOut;
                        guest.checkout_by = userId;
                        guest.save((err, saved) => {
                            err ? reject({message: err.message})
                                : resolve(saved);
                        })
                    }
                }
                else {
                    resolve({message: "Visitor pass not same"});
                }
            })
    });
});

let Guest = mongoose.model('Guest', guestSchema);

export default Guest;
