import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import bookingSchema from '../model/booking-model';
import Payments from '../../payment/dao/payments-dao';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

bookingSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

        Booking
          .find(_query)
          .populate("created_by development facility" )
          .exec((err, bookings) => {
              err ? reject(err)
                  : resolve(bookings);
          });
    });
});

bookingSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Booking
          .findById(id)
          .populate("created_by development facility" )
          .exec((err, bookings) => {
              err ? reject(err)
                  : resolve(bookings);
          });
    });
});

bookingSchema.static('createBooking', (booking:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

        let idAttachment;
        let file:any = attachment;
        let attachmentFile = file.payment_proof;

        var _paymentbooking = new Payments(booking);
        _paymentbooking.created_by = userId;
        _paymentbooking.payment_proof = idAttachment;
        _paymentbooking.development = developmentId;
        _paymentbooking.save((err, saved) => {
          err ? reject(err)
              : resolve(saved);
        });

        var paymentID = _paymentbooking._id;

        var _booking = new Booking(booking);
        _booking.created_by = userId;
        _booking.development = developmentId;
        _booking.payment = paymentID;
        _booking.save((err, saved) => {
          err ? reject(err)
              : resolve(saved);
        });
        var bookingID = _booking._id;

        if(attachmentFile){
          Attachment.createAttachment(attachmentFile, userId)
          .then(res => {
              idAttachment = res.idAtt;  
              Payments
                .findByIdAndUpdate(paymentID,{
                  $set: {
                    "payment_proof": idAttachment,
                    "status": "paid"
                  }
                })  
                .exec((err, updated) => {
                    err ? reject(err)
                        : resolve(updated);
                });

              Booking
                .findByIdAndUpdate(bookingID, {
                  $set: {
                    "status": "paid"
                  }
                }) 
                .exec((err, updated) => {
                    err ? reject(err)
                        : resolve(updated);
                });         
          })
          .catch(err=>{
              resolve({message: "attachment error"});
          }) 
        }                    
    });
});

bookingSchema.static('deleteBooking', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Booking
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

bookingSchema.static('updateBooking', (id:string, booking:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        if (!_.isObject(booking)) {
          return reject(new TypeError('Booking is not a valid object.'));
        }

        Booking
          .findByIdAndUpdate(id, booking)
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

let Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
