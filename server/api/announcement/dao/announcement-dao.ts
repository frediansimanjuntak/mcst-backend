import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import announcementSchema from '../model/announcement-model';
import {FCMService} from '../../../global/fcm.service';
import User from '../../user/dao/user-dao';

var DateOnly = require('mongoose-dateonly')(mongoose);

announcementSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development, "publish": true};
        Announcement
          .find(_query)
          .populate("development")
          .populate({
              path: 'publish_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .sort({"created_at": -1})
          .exec((err, announcements) => {
              err ? reject({message: err.message})
                  : resolve(announcements);
          });
    });
});

announcementSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Announcement
          .findById(id)
          .populate("development")
          .populate({
              path: 'publish_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, announcements) => {
              err ? reject({message: err.message})
                  : resolve(announcements);
          });
    });
});

announcementSchema.static('messageFCM', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      Announcement
        .findById(id)
        .exec((err, announcement) => {
          if (err) {
            reject({message: err.message});
          }
          else if (announcement) {
            let idUser = announcement.user;
            User
              .findById(idUser)
              .exec((err, users) => {
                if (err) {
                  reject({message: err.message});
                }
                if (users) {
                  if (users.token_notif.length > 0) {
                      FCMService.sendMessage(users.token_notif, "announcement", announcement.title);
                  }  
                }
              })
          }
        })
    });
});

announcementSchema.static('createAnnouncement', (announcement:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {        
        let body:any = announcement;        
        var _announcement = new Announcement(announcement);
        _announcement.created_by = userId;
        _announcement.development = developmentId;
        _announcement.save((err, saved) => {
          err ? reject({message: err.message})
              : resolve(saved);
        });
    });
});

announcementSchema.static('deleteAnnouncement', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Announcement
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve();
          });
    });
});

announcementSchema.static('updateAnnouncement', (id:string, announcement:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Announcement
          .findByIdAndUpdate(id, announcement)
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
          });
    });
});

announcementSchema.static('publishAnnouncement', (id:string, userId:string, announcement:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = announcement
        let date = new Date();
        Announcement
          .findById(id)
          .where('publish').equals(false)
          .update({
            $set: {
              "sticky": body.sticky,
              "valid_till": body.valid_till,
              "publish": true,
              "publish_by": userId,
              "publish_at": date
            }
          })
          .exec((err, updated) => {
              if (err) {
                  reject({message: err.message});
              }
              else {
                  Announcement.messageFCM(id);
                  resolve(updated);
              }
          });
    });
});

announcementSchema.static('autoPublishAnnouncement', (data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let body:any = data
        let _query = {"auto_post_on": {$lte: body.today}};
        Announcement
            .update(_query, {
                $set: {
                    "publish": true,
                    "publish_at": body.today
                }
            }, {multi: true})
            .exec((err, updated) => {
                if (err) {
                    reject({message: err.message});
                }
                else if (updated) {
                    Announcement.getIdAnnouncementForFCM(_query);
                    resolve(updated);
                }
                else {
                   resolve({message: "No Announcements to update"});
                }
            })
    });
});

announcementSchema.static('getIdAnnouncementForFCM', (query:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        Announcement
            .find(query)
            .exec((err, announcements) => {
                if (err) {
                    reject({message: err.message});
                }
                else {
                    for (var i = 0; i < announcements.length; i++) {
                        let announcement = announcements[i];
                        Announcement.messageFCM(announcement._id);
                    }                    
                    resolve(announcements);
                }
            })
    });
});

let Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
