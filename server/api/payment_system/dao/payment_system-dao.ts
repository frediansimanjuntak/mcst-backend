import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import paymentsystemSchema from '../model/payment_system-model';

paymentsystemSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Payment_system
          .find(_query)
          .exec((err, guests) => {
              err ? reject(err)
                  : resolve(guests);
          });
    });
});

paymentsystemSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Payment_system
          .findById(id)
          .populate("development created_by")
          .exec((err, feedbacks) => {
              err ? reject(err)
                  : resolve(feedbacks);
          });
    });
});

paymentsystemSchema.static('createPaymentSystem', (paymentsystem:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(paymentsystem)) {  
        return reject(new TypeError('Guest is not a valid object.'));
      }

      var _paymentsystem = new Payment_system(paymentsystem);
      _paymentsystem.created_by = userId;
      _paymentsystem.development = developmentId;
      _paymentsystem.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

paymentsystemSchema.static('deletePaymentSystem', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Payment_system
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

paymentsystemSchema.static('updatePaymentSystem', (id:string, paymentsystem:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(paymentsystem)) {
          return reject(new TypeError('Guest is not a valid object.'));
        }

        Payment_system
        .findByIdAndUpdate(id, paymentsystem)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

paymentsystemSchema.static('publishPaymentSystem', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
          return reject(new TypeError('Id is not a valid string.'));
        }

        Payment_system
        .findByIdAndUpdate(id,{
          $set:{publish:"true"}
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Payment_system = mongoose.model('Payment_system', paymentsystemSchema);

export default Payment_system;
