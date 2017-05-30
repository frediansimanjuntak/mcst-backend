import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import bookingSchema from '../model/booking-model';
import Payments from '../../payment/dao/payments-dao';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';
import {GlobalService} from '../../../global/global.service';

bookingSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

        Booking
          .find(_query)
          .populate("development facility payment")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .sort({"created_at": -1})
          .exec((err, bookings) => {
              err ? reject({message: err.message})
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
          .populate("development facility" )
          .populate([{
            path: 'payment',
            model: 'Payments',
            populate: [{
              path: 'sender',
              model: 'User',
              select:('username _id email')
            },            
            {
              path: 'receiver',
              model: 'User',
              select:('username _id email')
            },
            {
              path: 'payment_proof',
              model: 'Attachment'
            }]
          }])
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, bookings) => {
              err ? reject({message: err.message})
                  : resolve(bookings);
          });
    });
});

bookingSchema.static('getOwn', (userId:string, development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development, "created_by": userId};
        Booking
          .find(_query)
          .populate("development facility" )
          .populate([{
            path: 'payment',
            model: 'Payments',
            populate: [{
              path: 'sender',
              model: 'User',
              select:('username _id email')
            },            
            {
              path: 'receiver',
              model: 'User',
              select:('username _id email')
            },
            {
              path: 'payment_proof',
              model: 'Attachment'
            }]
          }])
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, bookings) => {
              err ? reject({message: err.message})
                  : resolve(bookings);
          });
    });
});

bookingSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generateCode = function() {
          let randomCode = GlobalService.randomCode();
          let _query = {"reference_no": randomCode};
          Booking
            .find(_query)
            .exec((err, bookings) => {
              if (err) {
                reject({message: err.message});
              }
              if (bookings) {
                if (bookings.length > 0) {
                  generateCode();
                }
                else {
                  resolve(randomCode);
                }
              }
            })
        }
        generateCode();
    });
});

bookingSchema.static('createBooking', (booking:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let idAttachment;
        let file:any = attachment;
        let paymentProof = file.payment_proof;
        Payments.createPayments(booking, userId, developmentId, attachment).then((res) => {
          let paymentId = res._id;
          let status;
          if (paymentProof) {
            status = "paid";
          }
          Booking.generateCode().then((code)=>{
            var _booking = new Booking(booking);
            _booking.created_by = userId;
            _booking.reference_no = code;
            _booking.status = status;
            _booking.development = developmentId;
            _booking.payment = paymentId;
            _booking.save((err, booking) => {
              if (err) {
                reject({message: err.message});
              }
              if (booking) {
                let bookingId = booking._id;
                Payments
                  .findById(paymentId)
                  .exec((err, payment) => {
                    if (err) {
                      reject({message: err.message});
                    }
                    if (payment) {
                      payment.reference_id = bookingId;
                      payment.save((err, saved) => {
                        if (err) {
                          reject({message: err.message});
                        }
                        if (saved) {
                          resolve({"booking": booking, "payment": saved});
                        }  
                      })
                    }
                  })
                }
            })
          })
          .catch((err) => {
            reject({message: err.message});
          })
        })
        .catch((err) => {
          reject({message: err.message});
        })           
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
              err ? reject({message: err.message})
                  : resolve();
          });
    });
});

bookingSchema.static('updateBooking', (id:string, booking:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Booking
          .findByIdAndUpdate(id, booking)
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
          });
    });
});

let Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
