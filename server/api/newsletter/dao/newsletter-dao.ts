import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import newsletterSchema from '../model/newsletter-model';

newsletterSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Newsletter
          .find(_query)
          .exec((err, newsletters) => {
              err ? reject(err)
                  : resolve(newsletters);
          });
    });
});

newsletterSchema.static('createNewsletter', (newsletter:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(newsletter)) {
        return reject(new TypeError('Newsletter is not a valid object.'));
      }

      var _newsletter = new Newsletter(newsletter);

      _newsletter.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

newsletterSchema.static('deleteNewsletter', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Newsletter
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

newsletterSchema.static('updateNewsletter', (id:string, newsletter:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(newsletter)) {
          return reject(new TypeError('Newsletter is not a valid object.'));
        }

        Newsletter
        .findByIdAndUpdate(id, newsletter)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;
