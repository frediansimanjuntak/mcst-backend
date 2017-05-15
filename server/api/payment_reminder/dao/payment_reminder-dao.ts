import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import paymentreminderSchema from '../model/payment_reminder-model';
import Development from '../../development/dao/development-dao';
import Payments from '../../payment/dao/payments-dao';
import Vehicles from '../../vehicle/dao/vehicle-dao';

paymentreminderSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

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

paymentreminderSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generateCode = function(){
          let randomCode = Math.floor(Math.random()*9000000000) + 1000000000;;
          let _query = {"reference_no": randomCode};
          Payment_reminder
            .find(_query)
            .exec((err, contract) => {
              if(err){
                reject(err);
              }
              if(contract){
                if(contract.length != 0){
                  generateCode();
                }
                if(contract.length == 0){
                  resolve(randomCode);
                }
              }
            })
        }
        generateCode();
    });
});

paymentreminderSchema.static('createPaymentReminder', (paymentreminder:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(paymentreminder)) {  
          return reject(new TypeError('Payment Reminder is not a valid object.'));
        }

        Payment_reminder.generateCode().then((code) => {
          var _paymentreminder = new Payment_reminder(paymentreminder);
          _paymentreminder.created_by = userId;
          _paymentreminder.reference_no = code;
          _paymentreminder.development = developmentId;
          _paymentreminder.save((err, saved) => {
            if(err){
              reject(err)
            }
            if(saved){
              let developmentId = saved.development;
              let notifList = saved.notification_list;
              let referenceNo = saved.reference_no;
              let referenceId = saved._id;
              for(var i = 0; i < notifList.length; i++){
                let appliesTo = notifList[i].applies_to;
                let charge = notifList[i].charge;
                let amount = notifList[i].amount;
                let remarks = notifList[i].remarks;
                if(appliesTo == "all"){
                  Development
                    .findById(developmentId)
                    .exec((err, developments) => {
                      if(err){
                        reject(err)
                      }
                      if(developments){
                        let properties = developments.properties;
                        let payments = [];
                        for(var j = 0; j < properties.length; j++){
                          let propertyId = properties[j]._id;
                          let landlordId = properties[j].landlord.resident;
                          let paymentData = {
                            "development": developmentId,
                            "property": propertyId,
                            "payment_type": "payment-reminder",
                            "sender": userId,
                            "receiver": landlordId,
                            "total_amount": amount,
                            "remark": remarks,
                            "created_by": userId,
                            "serial_no": referenceNo,
                            "reference_id": referenceId
                          }
                          payments.push(paymentData);
                        } 
                        Payments
                          .insertMany(payments, (err, result) => {
                            if (err){
                              reject(err);
                            }
                            if(result){
                              resolve(result);
                            }
                          })
                      }                                         
                    })
                }
                if(appliesTo == "Resident with vehicle"){
                  Vehicles
                    .find({})
                    .exec((err, vehicles) => {
                      if(err){
                        reject(err);
                      }
                      if(vehicles){
                        let payments = [];
                        for(var k = 0; k < vehicles.length; k++){
                          let vehicle = vehicles[k];
                          let property = vehicle.property;
                          let development = vehicle.development;
                          let owner = vehicle.owner;
                          let paymentData = {
                            "development": development,
                            "property": property,
                            "payment_type": "payment-reminder",
                            "sender": userId,
                            "receiver": owner,
                            "total_amount": amount,
                            "remark": remarks,
                            "created_by": userId,
                            "serial_no": referenceNo,
                            "reference_id": referenceId
                          }
                          payments.push(paymentData);
                        }
                        Payments
                          .insertMany(payments, (err, result) => {
                            if (err){
                              reject(err);
                            }
                            if(result){
                              resolve(result);
                            }
                          }) 
                      }
                    })
                }                
              }
            }
          })
        })
        .catch((err) => {
          reject(err);
        })        
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
