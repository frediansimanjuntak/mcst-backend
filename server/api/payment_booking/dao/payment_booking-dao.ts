import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import paymentBookingSchema from '../model/payment_booking-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

paymentBookingSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

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

paymentBookingSchema.static('createPaymentBooking', (paymentbooking:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(paymentbooking)) {
        return reject(new TypeError('Incident is not a valid object.'));
      }

      Attachment.createAttachment(attachment, userId).then(res => {
          var idAttachment = res.idAtt;

          var _paymentbooking = new PaymentBooking(paymentbooking);
              _paymentbooking.created_by = userId;
              _paymentbooking.payment_proof = idAttachment
              _paymentbooking.development = developmentId;
              _paymentbooking.save((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
              });
        })
        .catch(err=>{
          resolve({message: "attachment error"});
        })
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

paymentBookingSchema.static('updatePaymentBooking', (id:string, userId:string, paymentbooking:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(paymentbooking)) {
          return reject(new TypeError('Incident is not a valid object.'));
        }

        let paymentObj = {$set: {}};
        for(var param in paymentbooking) {
          paymentObj.$set[param] = paymentbooking[param];
        }

        let ObjectID = mongoose.Types.ObjectId; 
        let _query = {"_id": id};

        if(attachment != null){
          Attachment.createAttachment(attachment, userId)
            .then(res => {
              var idAttachment=res.idAtt;

              PaymentBooking
                .update(_query,{
                  $set: {
                    "payment_proof": idAttachment
                  }
                })
                .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                 });
            })
            .catch(err=>{
              resolve({message: "attachment error"});
            })                            
        } 
        
        PaymentBooking
          .update(_query, paymentObj)
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
            });
    });
});


let PaymentBooking = mongoose.model('PaymentBooking', paymentBookingSchema);

export default PaymentBooking;
