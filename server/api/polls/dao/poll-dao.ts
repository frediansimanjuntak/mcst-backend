import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import pollSchema from '../model/poll-model';

var DateOnly = require('mongoose-dateonly')(mongoose);

pollSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

        Poll
          .find(_query)
          .populate("development created_by votes.voted_by")
          .sort({"created_at": -1})
          .exec((err, polls) => {
              err ? reject({message: err.message})
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
          .populate("development created_by votes.voted_by")
          .exec((err, polls) => {
              err ? reject({message: err.message})
                  : resolve(polls);
          });
    });
});

pollSchema.static('createPoll', (poll:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(poll)) {
          return reject(new TypeError('Poll is not a valid object.'));
        }

        var _poll = new Poll(poll);
        _poll.created_by = userId;
        _poll.development = developmentId;
        _poll.save((err, saved) => {
          err ? reject({message: err.message})
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
              err ? reject({message: err.message})
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
              err ? reject({message: err.message})
                  : resolve(updated);
          });
    });
});

pollSchema.static('addVotePoll', (id:string, userId:string, poll:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = poll;
        let voted_at = new Date();

        Poll
          .findByIdAndUpdate(id, {
            $push:{
              votes:{
                "property": body.property,
                "answer": body.answer,
                "voted_by": userId,
                "voted_at": voted_at
              }
            }
          })
          .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
          });
    });
});

pollSchema.static('startPoll', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Poll
          .findByIdAndUpdate(id,{
            $set: {
              "status": "active",
              "start_time": new Date()
            }
          })
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
          });
    });
});

pollSchema.static('stopPoll', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Poll
          .findById(id)
          .exec((err, polls) => {
            if(err){
              reject({message: err.message});
            }
            if(polls){
              if(polls.status == "active"){
                Poll.outcomePoll(id).then(res => {
                  Poll
                    .update({"_id": id},{
                      $set: {
                        "status": "end poll",
                        "outcome": res
                      }
                    })
                  .exec((err, updated) => {
                    if(err){
                      reject({message: err.message});
                    }    
                    else
                    {
                      resolve(updated);
                    } 
                  });
                })
              }
              else{
                resolve("forbidden");
              }
            }
          })
    });
});

pollSchema.static('outcomePoll', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

        var pipeline = [{
            $match: {
                "_id": mongoose.Types.ObjectId(id)
                }
            },
            {
              $unwind: "$votes"
            },
            { 
              $group: { 
                _id: "$votes.answer",
                total_vote: { $sum: 1 }
              } 
            },
            {
            $sort : {
              total_vote : -1
            }
          }, 
          {
            $limit : 1 
          }];      

        Poll
        .aggregate(pipeline, (err, res)=>{
            if(err){
              reject({message: err.message});
            }
            if(res){
              if(res != null){
                let result = [].concat(res);
                for (var j = 0; j < result.length; j++) {
                    let voteresult = result[j];
                    let vote = voteresult._id;
                    if(vote != ""){
                      resolve(vote);
                    }
                    else{
                      resolve("empty vote");
                    }  
                }
              }
              if(res == null){
                resolve("empty vote");
              }              
            }
        })
    });
});

pollSchema.static('stopAllPollToday', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

        let today = new Date();

        Poll
        .find({"end_time": {$lte: today}})
        .exec((err, polls) => {
          if(err){
            reject({message: err.message});
          }
          if(polls){
            for(var i = 0; i < polls.length; i++){
              let status = polls[i].status;
              let pollId = polls[i]._id;
              let vote = polls[i].votes;

              if (status == "active"){
                if(vote.length == 0){
                  polls[i].status = "end poll";
                  polls[i].outcome = "empty vote";
                  polls[i].save((err, updated) => {
                      if(err){
                        reject({message: err.message});
                      }    
                      else
                      {
                        resolve(updated);
                      } 
                    });
                }
                else if(vote.length != 0){
                  Poll.outcomePoll(pollId).then(res => {
                    Poll
                      .update({"_id": pollId},{
                        $set: {
                          "status": "end poll",
                          "outcome": res
                        }
                      })
                    .exec((err, updated) => {
                      if(err){
                        reject({message: err.message});
                      }    
                      else
                      {
                        resolve(updated);
                      } 
                    });
                  })
                }                               
              }
              else{
                resolve("uptodate");
              }
            }            
          }
        })
    });
});

let Poll = mongoose.model('Poll', pollSchema);

export default Poll;
