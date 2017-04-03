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
          .exec((err, Paymentss) => {
              err ? reject(err)
                  : resolve(Paymentss);
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
          .exec((err, Paymentss) => {
              err ? reject(err)
                  : resolve(Paymentss);
          });
    });
});

paymentSchema.static('createPayments', (payment:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(Payments)) {
        return reject(new TypeError('Incident is not a valid object.'));
      }

      let files:any = attachment;
      let paymentProof = files.payment_proof;

      var _payment = new Payments(payment);
      _payment.created_by = userId;
      _payment.development = developmentId;
      _payment.save((err, saved) => {
        if(err){
          reject(err);
        }
        if(saved){
          let paymentId = _payment._id;
          if(paymentProof){
          Attachment.createAttachment(attachment, userId).then(res => {
            var idAttachment = res.idAtt;

            Payments
              .update({"_id": paymentId}, {
                $set: {
                  "payment_proof": idAttachment
                }
              })
              .exec((err, updated) => {
                  err ? reject(err)
                      : resolve({message: "updated"});    
              })
          })
          .catch(err=>{
            resolve({message: "attachment error"});
          })
        }
        if(!paymentProof){
          resolve(saved);
        }         
        }
      });

           
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
