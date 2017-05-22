import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import paymentSchema from '../model/payments-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

paymentSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};
        Payments
          .find(_query)
          .populate("development payment_proof sender receiver")
          .exec((err, payments) => {
              err ? reject(err)
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
          .populate("development payment_proof development payment_proof sender receiver")
          .exec((err, payments) => {
              err ? reject(err)
                  : resolve(payments);
          });
    });
});

paymentSchema.static('getByOwnPaymentReceiver', (userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": developmentId, "receiver":userId};
        Payments
          .find(_query)
          .populate("development payment_proof development payment_proof sender receiver")
          .exec((err, payments) => {
              err ? reject(err)
                  : resolve(payments);
          });
    });
});

paymentSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generate = function(){
          let randomCode = Math.floor(Math.random()*9000000000) + 1000000000;;
          let _query = {"serial_no": randomCode};
          Payments
            .find(_query)
            .exec((err, payment) => {
              if(err){
                reject(err);
              }
              if(payment){
                if(payment.length != 0){
                  generate();
                }
                if(payment.length == 0){
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

      let files:any = attachment;      
      Payments.generateCode().then((code)=> {
        var _payment = new Payments(payment);
        _payment.created_by = userId;
        _payment.serial_no = code;
        _payment.development = developmentId;
        _payment.save((err, payment) => {
          if(err){
            reject(err);
          }
          if(payment){
            let paymentId = payment._id;
            if(attachment){
              let paymentProof = files.payment_proof;
              Attachment.createAttachment(paymentProof, userId).then(res => {
                var idAttachment = res.idAtt;
                payment.payment_proof = idAttachment;
                payment.status = "paid";
                payment.save((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
                })              
              })
              .catch(err=>{
                resolve({message: "attachment error", err});
              })
            }
            resolve(payment);
          }
        });
      })
      .catch((err) => {
        reject(err);
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
              err ? reject(err)
                  : resolve();
          });
    });
});

paymentSchema.static('updatePayments', (id:string, userId:string, payment:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(payment)) {
          return reject(new TypeError('Incident is not a valid object.'));
        }

        let files:any = attachment;
        let paymentProof = files.payment_proof;

        let paymentObj = {$set: {}};
        for(var param in payment) {
          paymentObj.$set[param] = payment[param];
        }

        let ObjectID = mongoose.Types.ObjectId; 
        let _query = {"_id": id};

        if(paymentProof){
          Attachment.createAttachment(paymentProof, userId)
            .then(res => {
              var idAttachment=res.idAtt;

              Payments
                .update(_query,{
                  $set: {
                    "payment_proof": idAttachment,
                    "status": "paid"
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
        
        Payments
          .update(_query, paymentObj)
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
            });
    });
});


let Payments = mongoose.model('Payments', paymentSchema);

export default Payments;
