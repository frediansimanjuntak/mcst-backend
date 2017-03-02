import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import feedbackSchema from '../model/feedback-model';

feedbackSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

        Feedback
          .find(_query)
          .exec((err, guests) => {
              err ? reject(err)
                  : resolve(guests);
          });
    });
});

feedbackSchema.static('getAllPublish', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"status": "publish"};

        Feedback
          .find(_query)
          .exec((err, guests) => {
              err ? reject(err)
                  : resolve(guests);
          });
    });
});

feedbackSchema.static('getAllUnPublish', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"status": "unpublish"};

        Feedback
          .find(_query)
          .exec((err, guests) => {
              err ? reject(err)
                  : resolve(guests);
          });
    });
});

feedbackSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Feedback
          .findById(id)
          .populate("development reply_by created_by")
          .exec((err, feedbacks) => {
              err ? reject(err)
                  : resolve(feedbacks);
          });
    });
});

feedbackSchema.static('createFeedback', (feedback:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(feedback)) {  
        return reject(new TypeError('Feedback is not a valid object.'));
      }

      var _feedback = new Feedback(feedback);
          _feedback.created_by = userId;
          _feedback.development = developmentId;
          _feedback.save((err, saved) => {
            err ? reject(err)
                : resolve(saved);
          });
    });
});

feedbackSchema.static('deleteFeedback', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Feedback
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve({message: "Delete Success"});
          });
    });
});

feedbackSchema.static('updateFeedback', (id:string, feedback:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        if (!_.isObject(feedback)) {
            return reject(new TypeError('Feedback is not a valid object.'));
        }

        Feedback
          .findByIdAndUpdate(id, feedback)
          .exec((err, updated) => {
            err ? reject(err)
                : resolve(updated);
          });
    });
});

feedbackSchema.static('replyFeedback', (id:string, userId:string, reply:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        if (!_.isObject(reply)) {
          return reject(new TypeError('Feedback is not a valid object.'));
        }

        Feedback
          .findByIdAndUpdate(id, {
            $set: {
              "feedback_reply": reply,
              "reply_by": userId,
              "reply_at": new Date()
            }
          })
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
                  });
    });
});

feedbackSchema.static('publishFeedback', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Feedback
          .findByIdAndUpdate(id, {
            $set: {"status": "publish"}
          })
          .exec((err, updated) => {
            err ? reject(err)
                : resolve(updated);
          });
    });
});

feedbackSchema.static('archieveFeedback', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Feedback
        .findByIdAndUpdate(id, {
          $set: {"archieve": true}
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
