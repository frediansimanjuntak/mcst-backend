import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import pollSchema from '../model/poll-model';

pollSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Poll
          .find(_query)
          .exec((err, polls) => {
              err ? reject(err)
                  : resolve(polls);
          });
    });
});

pollSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Poll
          .findById(id)
          .exec((err, polls) => {
              err ? reject(err)
                  : resolve(polls);
          });
    });
});

pollSchema.static('createPoll', (poll:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(poll)) {
        return reject(new TypeError('Poll is not a valid object.'));
      }

      var _poll = new Poll(poll);
      _poll.created_by = userId;
      _poll.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

pollSchema.static('deletePoll', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Poll
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

pollSchema.static('updatePoll', (id:string, poll:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(poll)) {
          return reject(new TypeError('Poll is not a valid object.'));
        }

        Poll
        .findByIdAndUpdate(id, poll)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

pollSchema.static('addVotePoll', (id:string, userId:string, poll:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(poll)) {
          return reject(new TypeError('Poll is not a valid object.'));
        }

        let voted_at = new Date();

        Poll
        .findByIdAndUpdate(id, {
          $push:{ "votes":{                                      
                     "property":poll.property,
                     "answer":poll.answer,
                     "voted_by":userId,
                     "voted_at":voted_at
                    }
                  }
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Poll = mongoose.model('Poll', pollSchema);

export default Poll;
