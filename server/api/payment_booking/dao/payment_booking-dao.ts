import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import paymentBookingSchema from '../model/payment_booking-model';

paymentBookingSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        PaymentBooking
          .find(_query)
          .populate("development payment_proof")
          .exec((err, paymentbookings) => {
              err ? reject(err)
                  : resolve(paymentbookings);
          });
    });
});

paymentBookingSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        } 

        PaymentBooking
          .findById(id)
          .populate("development payment_proof")
          .exec((err, paymentbookings) => {
              err ? reject(err)
                  : resolve(paymentbookings);
          });
    });
});

paymentBookingSchema.static('createPaymentBooking', (paymentbooking:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(paymentbooking)) {
        return reject(new TypeError('Incident is not a valid object.'));
      }

      var _paymentbooking = new PaymentBooking(paymentbooking);
      _paymentbooking.created_by = userId;
      _paymentbooking.development = developmentId;
      _paymentbooking.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

paymentBookingSchema.static('deletePaymentBooking', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        PaymentBooking
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

paymentBookingSchema.static('updatePaymentBooking', (id:string, paymentbooking:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(paymentbooking)) {
          return reject(new TypeError('Incident is not a valid object.'));
        }

        PaymentBooking
        .findByIdAndUpdate(id, paymentbooking)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});


let PaymentBooking = mongoose.model('PaymentBooking', paymentBookingSchema);

export default PaymentBooking;
