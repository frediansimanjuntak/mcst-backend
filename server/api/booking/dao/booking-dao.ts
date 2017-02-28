import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import bookingSchema from '../model/booking-model';
import Payment from '../../payment_booking/dao/payment_booking-dao';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

bookingSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

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
        if (!_.isObject(booking)) {
          return reject(new TypeError('Booking is not a valid object.'));
        }
        if (!_.isObject(attachment)) {
          return reject(new TypeError('Attachment is not a valid.'));
        }

        let idAttachment = [];
        let file:any = attachment;
        let attachmentFile = file.payment_proof

        if(attachmentFile){
          Attachment.createAttachment(attachmentFile, userId)
          .then(res => {
              res.idAtt.push(idAttachment);              
          })
          .catch(err=>{
              resolve({message: "attachment error"});
          }) 
        }             

        var _paymentbooking = new Payment(booking);
            _paymentbooking.created_by = userId;
            _paymentbooking.payment_proof = idAttachment;
            if(idAttachment != []){
              _paymentbooking.status = "paid";
            }
            _paymentbooking.development = developmentId;
            _paymentbooking.save((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
            });

            var paymentID = _paymentbooking._id;

            var _booking = new Booking(booking);
            _booking.created_by = userId;
            _booking.development = developmentId;
            if(idAttachment != []){
              _booking.status = "paid";
            }
            _booking.payment = paymentID;
            _booking.save((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
            });
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
