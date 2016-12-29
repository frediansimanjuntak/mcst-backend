import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import announcementSchema from '../model/announcement-model';

announcementSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Announcement
          .find(_query)
          .exec((err, announcements) => {
              err ? reject(err)
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
          .exec((err, announcements) => {
              err ? reject(err)
                  : resolve(announcements);
          });
    });
});

announcementSchema.static('createAnnouncement', (announcement:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(announcement)) {
        return reject(new TypeError('Announcement is not a valid object.'));
      }

      var _announcement = new Announcement(announcement);

      _announcement.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

announcementSchema.static('deleteAnnouncement', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Announcement
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

announcementSchema.static('updateAnnouncement', (id:string, announcement:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(announcement)) {
          return reject(new TypeError('Announcement is not a valid object.'));
        }

        Announcement
        .findByIdAndUpdate(id, announcement)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
