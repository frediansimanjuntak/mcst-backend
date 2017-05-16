import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import paymentreminderSchema from '../model/payment_reminder-model';
import Development from '../../development/dao/development-dao';
import Notifications from '../../notification/dao/notification-dao';
import Payments from '../../payment/dao/payments-dao';
import Vehicles from '../../vehicle/dao/vehicle-dao';
import User from '../../vehicle/dao/vehicle-dao';

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
              reject(err);
            }
            if(saved){
              let developmentId = saved.development;
              let notifLists = saved.notification_list;
              let referenceNo = saved.reference_no;
              let referenceId = saved._id;
              let title = saved.title;
              var notificationlists = _.map(notifLists, (result) => {
                let notifList = result;                
                let appliesTo = notifList.applies_to;
                let dataAll;
                let dataVehicle; 
                let data = {
                  "appliesTo": notifList.applies_to,
                  "charge": notifList.charge,
                  "amount": notifList.amount,
                  "remarks": notifList.remarks,
                  "referenceNo": referenceNo,
                  "referenceId": referenceId,
                  "developmentId": developmentId
                }
                return data;
              });
              Payment_reminder.notifPayment(notificationlists, developmentId, userId, referenceId, referenceNo);
              Payment_reminder.updateUserLandlordPaymentReminder(userId, developmentId, notificationlists);
              Payment_reminder.updateVehiclePaymentReminder(userId, notificationlists);
              resolve(saved);
            }
          })
        })
        .catch((err) => {
          reject(err);
        })        
    });
});

paymentreminderSchema.static('notifPayment', (data:Object, developmentId:string, userId:string, referenceId:string, referenceNo:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let bodies:any = data;
        let dataAll = [];
        let dataVehicle = [];
        let datas = [];
        for(var a = 0; a < bodies.length; a++){
          let body = bodies[a];
          if(body.appliesTo == "all"){
            let pays = {
              "charge": body.charge,
              "amount": body.amount,
            }
            dataAll.push(pays);
          }
          if(body.appliesTo == "Resident with vehicle"){
            let pays = {
              "charge": body.charge,
              "amount": body.amount,
            }
            dataVehicle.push(pays);
          }
          let paysAll = {
              "charge": body.charge,
              "amount": body.amount,
            }
          datas.push(paysAll);
        }

        Development
          .findById(developmentId)
          .exec((err, developments) => {
            if(err){
              reject(err)
            }
            if(developments){
              let properties = developments.properties;
              let propertyOwners = _.map(properties, (property) => {
                let propOwn = {
                  "owner": property.landlord.data.resident,
                  "prop_id": property._id
                };
                return propOwn;
              })
               Vehicles
                .find({})
                .exec((err, vehicles) => {
                  if(err){
                    reject(err);
                  }
                  if(vehicles){
                    let vehicleOwners = _.map(vehicles, (vehicle) => {
                      let vehicleOwn = {
                        "owner": vehicle.owner,
                        "prop_id": vehicle.property
                      };
                      return vehicleOwn;
                    })
                                        
                    for(var c = 0; c < propertyOwners.length; c++){
                      let propertyOwn = propertyOwners[c];
                      let owners = [];
                      if(propertyOwn.owner != null){
                        for(var d = 0; d < vehicleOwners. length; d++){
                          let vehicleOwn = vehicleOwners[d];
                          let file;
                          if(propertyOwn.owner == vehicleOwn.owner){
                            owners.push(propertyOwn);     
                            vehicleOwners.splice(d,1);                       
                          }
                        }
                        if(owners.length > 0){
                          for(var e = 0; e < owners.length; e++){
                            let owner = owners[e];
                            let file = {
                              "development": developmentId,
                              "property": owner.prop_id,
                              "user": owner.owner,
                              "type": "Payment Reminder",
                              "reference_number": referenceNo,
                              "reference_id": referenceId,
                              "extra": {"payment": datas}
                            }
                            Notifications.createNotification(userId, file);
                          }
                        }
                        else{
                            let file = {
                              "development": developmentId,
                              "property": propertyOwn.prop_id,
                              "user": propertyOwn.owner,
                              "type": "Payment Reminder",
                              "reference_number": referenceNo,
                              "reference_id": referenceId,
                              "extra": {"payment": dataAll}
                            }      
                            Notifications.createNotification(userId, file);                    
                        }
                      }
                    }
                    if(vehicleOwners.length > 0){
                      for(var f = 0; f < vehicleOwners.length; f++){
                        let vehOwner = vehicleOwners[f];
                        let file = {
                          "development": developmentId,
                          "property": vehOwner.prop_id,
                          "user": vehOwner.owner,
                          "type": "Payment Reminder",
                          "reference_number": referenceNo,
                          "reference_id": referenceId,
                          "extra": {"payment": dataVehicle}
                        }
                        Notifications.createNotification(userId, file);
                      }                        
                    }    
                  }
                })              
            }
          })
    });
});

paymentreminderSchema.static('updateUserLandlordPaymentReminder', (userId:string, developmentId:string, datas:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let bodies:any = datas;
        let attachment:any;

        for(var i = 0; i < bodies.length; i++){
          let body = bodies[i];
          if(body.appliesTo == "all"){
            Development
              .findById(developmentId)
              .exec((err, developments) => {
                if(err){
                  reject(err)
                }
                if(developments){
                  let properties = developments.properties;
                  _.each(properties, (result) => {
                    let propertyId = result._id;
                    if(result.landlord.data.resident){
                      let landlordId = result.landlord.data.resident;
                      let paymentData = {
                        "development": developmentId,
                        "property": propertyId,
                        "payment_type": "payment-reminder",
                        "sender": userId,
                        "receiver": landlordId,
                        "charge": body.charge,
                        "total_amount": body.amount,
                        "remark": body.charge,
                        "created_by": userId,
                        "serial_no": body.referenceNo,
                        "reference_id": body.referenceId
                      };
                      Payments.createPayments(paymentData, userId, developmentId, attachment);
                    }
                  })
                }
              })
          }          
        }
    });
});

paymentreminderSchema.static('updateVehiclePaymentReminder', (userId:string, datas:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let bodies:any = datas;
        let attachment:any;
        for(var j = 0; j < bodies.length; j++){
          let body = bodies[j];
          if(body.appliesTo == "Resident with vehicle"){
            Vehicles
              .find({})
              .exec((err, vehicles) => {
                if(err){
                  reject(err);
                }
                if(vehicles){
                  _.each(vehicles, (result) => {
                    let vehicle = result;
                    let property = vehicle.property;
                    let development = vehicle.development;
                    let owner = vehicle.owner;
                    let paymentData = {
                      "development": development,
                      "property": property,
                      "payment_type": "payment-reminder",
                      "sender": userId,
                      "receiver": owner,
                      "total_amount": body.amount,
                      "charge": body.charge,
                      "remark": body.remarks,
                      "created_by": userId,
                      "serial_no": body.referenceNo,
                      "reference_id": body.referenceId
                    };                
                    Payments.createPayments(paymentData, userId, body.developmentId, attachment);
                  })
                }
              })
          }
        }        
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
