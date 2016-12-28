import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import petitionSchema from '../model/petition-model';

petitionSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Petition
          .find(_query)
          .exec((err, petitions) => {
              err ? reject(err)
                  : resolve(petitions);
          });
    });
});

petitionSchema.static('createPetition', (petition:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(petition)) {
        return reject(new TypeError('Polls is not a valid object.'));
      }

      var _petition = new Petition(petition);

      _petition.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

petitionSchema.static('deletePetition', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Petition
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

petitionSchema.static('updatePetition', (id:string, petition:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(petition)) {
          return reject(new TypeError('Development is not a valid object.'));
        }

        Petition
        .findByIdAndUpdate(id, petition)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Petition = mongoose.model('Petition', petitionSchema);

export default Petition;
