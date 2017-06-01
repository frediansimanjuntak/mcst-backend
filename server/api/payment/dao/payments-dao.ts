import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import paymentSchema from '../model/payments-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';
import {GlobalService} from '../../../global/global.service';

paymentSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};
        Payments
          .find(_query)
          .populate("development payment_proof")
          .populate({
              path: 'sender',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'receiver',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, payments) => {
              err ? reject({message: err.message})
                  : resolve(payments);
          });
    });
});

paymentSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        } 
        Payments
          .findById(id)
          .populate("development payment_proof development payment_proof")
          .populate({
              path: 'sender',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'receiver',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
            path: 'created_by',
            model: 'User',
            select: '-salt -password',
            populate: {
              path: 'default_development',
              model: 'Development'
            }
          })
          .exec((err, payments) => {
              err ? reject({message: err.message})
                  : resolve(payments);
          });
    });
});

paymentSchema.static('getByOwnPaymentReceiver', (userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": developmentId, "receiver":userId};
        Payments
          .find(_query)
          .populate("development payment_proof development payment_proof")
          .populate({
              path: 'sender',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'receiver',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, payments) => {
              err ? reject({message: err.message})
                  : resolve(payments);
          });
    });
});

paymentSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generate = function() {
          let randomCode = GlobalService.randomCode();
          let _query = {"serial_no": randomCode};
          Payments
            .find(_query)
            .exec((err, payment) => {
              if (err) {
                reject({message: err.message});
              }
              else if (payment) {
                if (payment.length > 0) {
                  generate();
                }
                else {
                  resolve(randomCode);
                }
              }
            })
        }
        generate();
    });
});

paymentSchema.static('createPayments', (payment:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(Payments)) {
        return reject(new TypeError('Incident is not a valid object.'));
      }  
      Payments.generateCode().then((code)=> {
        var _payment = new Payments(payment);
        _payment.created_by = userId;
        _payment.serial_no = code;
        _payment.development = developmentId;
        _payment.save((err, payment) => {
          if (err) {
            reject({message: err.message});
          }
          else if (payment) {
            let paymentId = payment._id;
            if (attachment) {
              let _query = {"_id": paymentId};
              Payments.addAttachmentPayments(attachment, userId.toString(), _query); 
            }
            resolve(payment);
          }
        });
      })
      .catch((err) => {
        reject({message: err.message});
      })
                
    });
});

paymentSchema.static('deletePayments', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Payments
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve();
          });
    });
});

paymentSchema.static('updatePayments', (id:string, userId:string, payment:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(payment)) {
          return reject(new TypeError('Incident is not a valid object.'));
        }
        let paymentObj = {$set: {}};
        for (var param in payment) {
          paymentObj.$set[param] = payment[param];
        }
        let ObjectID = mongoose.Types.ObjectId; 
        let _query = {"_id": id};
        Payments.addAttachmentPayments(attachment, userId.toString(), _query);    
        Payments
          .update(_query, paymentObj)
          .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
            });
    });
});

paymentSchema.static('addAttachmentPayments', (attachment:Object, userId:string, query:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let files:any = attachment;
        let paymentProof = files.payment_proof;
        if (paymentProof) {
          Attachment.createAttachment(paymentProof, userId)
            .then(res => {
              var idAttachment = res.idAtt;
              Payments
                .update(query,{
                  $set: {
                    "payment_proof": idAttachment,
                    "status": "paid"
                  }
                })
                .exec((err, saved) => {
                      err ? reject({message: err.message})
                          : resolve(saved);
                          console.log(saved);
                 });
            })
            .catch(err=>{
              resolve({message: "attachment error"});
            })                            
        }
        else {
          resolve({message: "No Attachment Files"});
        } 
    });
});

let Payments = mongoose.model('Payments', paymentSchema);

export default Payments;
