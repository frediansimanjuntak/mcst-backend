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
          .populate("created_by development facility payment")
          .sort({"created_at": -1})
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
              // select:('url')
            }]
          }])
          .exec((err, bookings) => {
              err ? reject(err)
                  : resolve(bookings);
          });
    });
});

bookingSchema.static('getOwn', (userId:string, development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development, "created_by": userId};

        Booking
          .find(_query)
          .populate("created_by development facility payment" )
          .exec((err, bookings) => {
              err ? reject(err)
                  : resolve(bookings);
          });
    });
});

bookingSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generateCode = function(){
          let randomCode = Math.floor(Math.random()*9000000000) + 1000000000;;
          console.log(randomCode);
          let _query = {"reference_no": randomCode};
          Booking
            .find(_query)
            .exec((err, bookings) => {
              if(err){
                reject(err);
              }
              if(bookings){
                if(bookings.length != 0){
                  generateCode();
                }
                if(bookings.length == 0){
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
          if(paymentProof){
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
              if(err){
                reject(err);
              }
              if(booking){
                let bookingId = booking._id;
                Payments
                  .findById(paymentId)
                  .exec((err, payment) => {
                    if(err){
                      reject(err);
                    }
                    if(payment){
                      payment.reference_id = bookingId;
                      payment.save((err, saved) => {
                        if(err){
                          reject(err);
                        }
                        if(saved){
                          resolve({"booking": booking, "payment": saved});
                        }  
                      })
                    }
                  })
                }
            })
          })
          .catch((err) => {
            reject(err);
          })
        })
        .catch((err) => {
          reject(err);
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
