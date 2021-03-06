import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import feedbackSchema from '../model/feedback-model';

feedbackSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};
        Feedback
            .find(_query)
            .populate("development created_by reply_by")
            .exec((err, guests) => {
                err ? reject({message: err.message})
                    : resolve(guests);
            });
    });
});

feedbackSchema.static('getAllPublish', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"status": "publish"};
        Feedback
            .find(_query)
            .populate("development created_by reply_by")
            .exec((err, guests) => {
                err ? reject({message: err.message})
                    : resolve(guests);
            });
    });
});

feedbackSchema.static('getAllUnPublish', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"status": "unpublish"};
        Feedback
            .find(_query)
            .populate("development created_by reply_by")
            .exec((err, guests) => {
                err ? reject({message: err.message})
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
            .populate("development created_by reply_by")
            .exec((err, feedbacks) => {
                err ? reject({message: err.message})
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
            err ? reject({message: err.message})
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
                err ? reject({message: err.message})
                    : resolve({message: "Delete Success"});
            });
    });
});

feedbackSchema.static('updateFeedback', (id:string, feedback:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Feedback
            .findByIdAndUpdate(id, feedback)
            .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
            });
    });
});

feedbackSchema.static('replyFeedback', (id:string, userId:string, reply:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = reply;
        if (body.reply) {
          Feedback
            .findByIdAndUpdate(id, {
              $set: {
                "reply": body.reply,
                "reply_by": userId,
                "reply_at": new Date()
              }
            })
            .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
            });
        }
        else {
          reject({message: "no data to reply"});
        }        
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
            err ? reject({message: err.message})
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
                err ? reject({message: err.message})
                    : resolve(updated);
            });
    });
});

let Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
