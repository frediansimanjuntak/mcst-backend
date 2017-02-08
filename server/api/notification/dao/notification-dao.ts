import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import notificationSchema from '../model/notification-model';
import {GlobalService} from '../../../global/global.service';

var fs = require('fs-extra');

notificationSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      let _query = {};
      Notification
        .find(_query)
        .exec((err, notifications) => {
          err ? reject(err)
              : resolve(notifications);
        });
    });
});

notificationSchema.static('getOwnNotification', (userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!GlobalService.validateObjectId(userId)) {
        return reject(new TypeError('User ID is not a valid ObjectId.'));
      }

      let _query = {user: userId};
      Notification
        .find(_query)
        .exec((err, notifications) => {
          err ? reject(err)
              : resolve(notifications);
        });
    });
});

notificationSchema.static('getOwnUnreadNotification', (userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!GlobalService.validateObjectId(userId)) {
        return reject(new TypeError('User ID is not a valid ObjectId.'));
      }

      let _query = { user: userId, read_at: { $exists: false } };
      Notification
        .find(_query)
        .exec((err, notifications) => {
          err ? reject(err)
              : resolve(notifications);
        });
    });
});

notificationSchema.static('createNotification', (idUser:string, notification:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(notification)) {
        return reject(new TypeError('Notification is not a valid object.'));
      }

      let _notification = new Notification(notification);
          _notification.created_by = idUser;
          _notification.save((err, saved) => {
            err ? reject(err)
                : resolve(saved);
          });
    });
});

notificationSchema.static('deleteNotification', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Notification
          .findById(id)
          .exec((err, notification) => {
            if (err)
              reject(err)
            if (notification)
              notification.remove((err:any) => {
                if (err)
                  reject(err)
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

        if (!_.isArray(arrayId)) {
          return reject(new TypeError('Array of ID is not a valid array.'));
        }

        Notification
        .update({_id: {$in: arrayId}}, {
          $set: {
            "read_at": new Date()
          }
        }, {multi: true})
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});


notificationSchema.static('updateNotification', (id:string, notification:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(notification)) {
          return reject(new TypeError('Notification is not a valid object.'));
        }

        Notification
        .findByIdAndUpdate(id, notification)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
