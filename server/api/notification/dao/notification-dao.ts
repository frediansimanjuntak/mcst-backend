import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import notificationSchema from '../model/notification-model';
import PaymentReminder from '../../payment_reminder/dao/payment_reminder-dao';
import User from '../../user/dao/user-dao';
import {GlobalService} from '../../../global/global.service';
import {FCMService} from '../../../global/fcm.service';

notificationSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      let _query = {"development": development};
      Notifications
        .find(_query)
        .populate("development")
        .populate({
              path: 'user',
              model: 'User',
              select: '-salt -password'
          })
        .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
        .sort({"created_at": -1})
        .exec((err, notifications) => {
          err ? reject({message: err.message})
              : resolve(notifications);
        });
    });
});

notificationSchema.static('getOwnNotification', (userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!GlobalService.validateObjectId(userId)) {
        return reject(new TypeError('User ID is not a valid ObjectId.'));
      }
      let _query = {"development": developmentId, "user": userId};
      Notifications
        .find(_query)
        .populate("development")
        .populate({
              path: 'user',
              model: 'User',
              select: '-salt -password'
          })
        .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
        .sort({"created_at": -1})
        .exec((err, notifications) => {
          err ? reject({message: err.message})
              : resolve(notifications);
        });
    });
});

notificationSchema.static('getOwnUnreadNotification', (userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!GlobalService.validateObjectId(userId)) {
        return reject(new TypeError('User ID is not a valid ObjectId.'));
      }
      let _query = {"development": developmentId, "user": userId, read_at: { $exists: false }};
      Notifications
        .find(_query)
        .populate("development")
        .populate({
              path: 'user',
              model: 'User',
              select: '-salt -password'
          })
        .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
        .sort({"created_at": -1})
        .exec((err, notifications) => {
          err ? reject({message: err.message})
              : resolve(notifications);
        });
    });
});

notificationSchema.static('getOwnPaymentNotification', (userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!GlobalService.validateObjectId(userId)) {
        return reject(new TypeError('User ID is not a valid ObjectId.'));
      }
      var pipeline = [{
        $match: {
          "development": developmentId,
           "user": userId,
           "type": "Payment Reminder"
          }
        },
        {
          $lookup:
          {
            from: "paymentreminders",
            localField: "reference_number",
            foreignField: "reference_no",
            as: "payment_reminder"
          }
        },
        { 
          $sort : { "created_at" : -1} 
      }];
        Notifications
        .aggregate(pipeline, (err, notif)=>{
            err ? reject({message: err.message})
                : resolve(notif);
        })
    });
});

notificationSchema.static('messageFCM', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      Notifications
        .findById(id)
        .exec((err, notif) => {
          if (err) {
            reject({message: err.message});
          }
          else if (notif) {
            let idUser = notif.user;
            User
              .findById(idUser)
              .exec((err, users) => {
                if (err) {
                  reject({message: err.message});
                }
                if (users) {
                  if (users.token_notif.length > 0) {
                      FCMService.sendMessage(users.token_notif, notif.type, notif.message);
                  }  
                }
              })
          }
        })
    });
});

notificationSchema.static('createNotification', (idUser:string, notification:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(notification)) {
        return reject(new TypeError('Notification is not a valid object.'));
      }
      let _notification = new Notifications(notification);
      _notification.created_by = idUser;
      _notification.save((err, saved) => {
        if (err) {
          reject({message: err.message});
        }
        else if (saved) {
          Notifications.messageFCM(saved._id);
          resolve(saved);
        }
      });
    });
});

notificationSchema.static('deleteNotification', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Notifications
          .findById(id)
          .exec((err, notification) => {
            if (err)
              reject({message: err.message})
            if (notification)
              notification.remove((err:any) => {
                if (err)
                  reject({message: err.message})
                resolve({ message: "success" });
              });
            else
              reject(new Error("Notification not found."));
          });
    });
});

notificationSchema.static('readNotification', (userId:string, arrayId:string[]):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!GlobalService.validateObjectId(userId)) {
          return reject(new TypeError('User ID is not a valid ObjectId.'));
        }

        Notifications
        .update({_id: {$in: arrayId}}, {
          $set: {
            "read_at": new Date()
          }
        }, {multi: true})
        .exec((err, updated) => {
              err ? reject({message: err.message})
                  : resolve(updated);
          });
    });
});

notificationSchema.static('updateNotification', (id:string, notification:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(notification)) {
          return reject(new TypeError('Notification is not a valid object.'));
        }

        Notifications
        .findByIdAndUpdate(id, notification)
        .exec((err, updated) => {
              err ? reject({message: err.message})
                  : resolve(updated);
          });
    });
});

notificationSchema.static('markRead', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isString(id)) {
          return reject(new TypeError('Id is not a valid string.'));
      }
      Notifications
        .findById(id)
        .exec((err, notif) => {
          if (err) {
            reject(err);
          }
          else if (notif) {
            let markRead;
            if (notif.mark_read == false) {
              markRead = true;
            }
            else {
              markRead = false;
            }
            Notifications
              .findByIdAndUpdate(id, {
                $set: {
                  "mark_read": markRead
                }
              })
              .exec((err, updated) => {
                    err ? reject({message: err.message})
                        : resolve(updated);
                });
          }
        })      
    });
});

let Notifications = mongoose.model('Notification', notificationSchema);

export default Notifications;