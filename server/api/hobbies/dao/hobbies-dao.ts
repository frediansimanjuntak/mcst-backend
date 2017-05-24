import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import hobbiesSchema from '../model/hobbies-model';
import {GlobalService} from '../../../global/global.service';

hobbiesSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Hobbies
          .find(_query)
          .exec((err, hobbies) => {
              err ? reject(err)
                  : resolve(hobbies);
          });
    });
});

hobbiesSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Hobbies
          .findById(id)
          .exec((err, hobbies) => {
              err ? reject(err)
                  : resolve(hobbies);
          });
    });
});

hobbiesSchema.static('createHobbies', (data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(data)) {
          return reject(new TypeError('Access Control is not a valid object.'));
        }

        let body:any = data;
        let hobbies = body.hobbies;

        for(var i = 0; i <hobbies.length; i++) {
          let hobby = hobbies[i];
          Hobbies
            .find({"name": hobby})
            .exec((err, res) => {
              if (err) {
                reject(err);
              }
              if (res) {
                if (res.length == 0) {
                  var _hobby = new Hobbies();
                  _hobby.name = hobby;
                  _hobby.slug = GlobalService.slugify(hobby)
                  _hobby.save((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                  });
                }
                if (res.length >= 1) {
                  resolve({message: "Already data"})
                }
              }
            })
        }        
    });
});

hobbiesSchema.static('deleteHobbies', (data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let body:any = data;
        let hobby = body.hobby;

        Hobbies
          .findOneAndRemove({"name": hobby})
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

hobbiesSchema.static('updateHobbies', (id:string, data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = data;
        let hobby = body.hobby;
        let slug = GlobalService.slugify(hobby)

        Hobbies
          .update({"_id": id}, {
            $set: {
              "name": hobby,
              "slug": slug
            }
          })
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

let Hobbies = mongoose.model('Hobbies', hobbiesSchema);

export default Hobbies;
