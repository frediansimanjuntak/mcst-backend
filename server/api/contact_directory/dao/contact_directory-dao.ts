import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import contactDirectorySchema from '../model/contact_directory-model';

contactDirectorySchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        ContactDirectory
          .find(_query)
          .exec((err, contacts) => {
              err ? reject(err)
                  : resolve(contacts);
          });
    });
});

contactDirectorySchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        ContactDirectory
          .findById(id)
          .exec((err, contact) => {
              err ? reject(err)
                  : resolve(contact);
          });
    });
});

contactDirectorySchema.static('createContactDirectory', (data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(data)) {
          return reject(new TypeError('Access Control is not a valid object.'));
        }

        var _contact = new ContactDirectory(data);
        _contact.save((err, saved) => {
          err ? reject(err)
              : resolve(saved);
        });
    });
});

contactDirectorySchema.static('deleteContactDirectory', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        ContactDirectory
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

contactDirectorySchema.static('updateContactDirectory', (id:string, data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        ContactDirectory
          .findByIdAndUpdate(id, data)
          .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let ContactDirectory = mongoose.model('ContactDirectory', contactDirectorySchema);

export default ContactDirectory;
