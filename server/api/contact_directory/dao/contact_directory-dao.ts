import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import contactDirectorySchema from '../model/contact_directory-model';

contactDirectorySchema.static('getAll', (developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": developmentId};
        ContactDirectory
          .find(_query)
          .sort({"created_at": -1})
          .exec((err, contacts) => {
              err ? reject({message: err.message})
                  : resolve(contacts);
          });
    });
});

contactDirectorySchema.static('getById', (id:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let _query = {"_id": id,"development": developmentId};
        ContactDirectory
          .findOne(_query)
          .exec((err, contact) => {
              err ? reject({message: err.message})
                  : resolve(contact);
          });
    });
});

contactDirectorySchema.static('createContactDirectory', (data:Object, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(data)) {
          return reject(new TypeError('Access Control is not a valid object.'));
        }
        var _contact = new ContactDirectory(data);
        _contact.development = developmentId;
        _contact.save((err, saved) => {
          err ? reject({message: err.message})
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
              err ? reject({message: err.message})
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
              err ? reject({message: err.message})
                  : resolve(updated);
          });
    });
});

let ContactDirectory = mongoose.model('ContactDirectory', contactDirectorySchema);

export default ContactDirectory;
