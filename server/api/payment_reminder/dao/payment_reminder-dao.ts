import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import paymentreminderSchema from '../model/payment_reminder-model';

paymentreminderSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Payment_reminder
          .find(_query)
          .exec((err, guests) => {
              err ? reject(err)
                  : resolve(guests);
          });
    });
});

paymentreminderSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Payment_reminder
          .findById(id)
          .populate("development created_by")
          .exec((err, feedbacks) => {
              err ? reject(err)
                  : resolve(feedbacks);
          });
    });
});

paymentreminderSchema.static('createPaymentReminder', (paymentreminder:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(paymentreminder)) {  
          return reject(new TypeError('Payment Reminder is not a valid object.'));
        }
        
        var _paymentreminder = new Payment_reminder(paymentreminder);
        _paymentreminder.created_by = userId;
        _paymentreminder.development = developmentId;
        _paymentreminder.save((err, saved) => {
          err ? reject(err)
              : resolve(saved);
        });
    });
});

paymentreminderSchema.static('deletePaymentReminder', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Payment_reminder
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve({message: "Delete Success"});
          });
    });
});

paymentreminderSchema.static('updatePaymentReminder', (id:string, paymentreminder:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(paymentreminder)) {
          return reject(new TypeError('Payment Reminder is not a valid object.'));
        }

        Payment_reminder
          .findByIdAndUpdate(id, paymentreminder)
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

paymentreminderSchema.static('publishPaymentReminder', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
          return reject(new TypeError('Id is not a valid string.'));
        }

        Payment_reminder
          .findByIdAndUpdate(id,{
            $set: {publish: "true"}
          })
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

let Payment_reminder = mongoose.model('Payment_reminder', paymentreminderSchema);

export default Payment_reminder;
