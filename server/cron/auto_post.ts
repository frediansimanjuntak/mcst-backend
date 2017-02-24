import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import Announcement from '../api/announcement/dao/announcement-dao';
import PaymentReminder from '../api/payment_reminder/dao/payment_reminder-dao';
import Poll from '../api/polls/dao/poll-dao';

var CronJob = require('cron').CronJob;
var DateOnly = require('mongoose-dateonly')(mongoose);

export class AutoPost {
  static autoPostPublishAnnouncement():void{
    new CronJob('1 12 1-31 * *', function() {
      /* runs once at the specified date. */

      let today = new DateOnly();
      Announcement
        .update({"auto_post_on": today},{
          $set: {
            "publish": true,
            "publish_at": new Date()
          }
        }, {multi: true}, (err, res)=>{
          if(err){
            console.log('error');
          } 
          else
          {
            console.log(res);
          }
        })
      }, function () {
        /* This function is executed when the job stops */
        console.log('success!')
      },
      true,
      'Asia/Jakarta'
    );
  }

  static autoPostValidAnnouncement():void{
     new CronJob('1 12 1-31 * *', function() {
      /* runs once at the specified date. */

      let today = new DateOnly();
      Announcement
        .update({"valid_till": today},{
          $set: {
            "publish": false,
            "valid": false
          }
        }, {multi: true}, (err, res)=>{
          if(err){
            console.log('error');
          } 
          else
          {
            console.log(res);
          }
        })
      }, function () {
        /* This function is executed when the job stops */
        console.log('success!')
      },
      true,
      'Asia/Jakarta'
    );
  }

  static autoPostPaymentReminder():void{
    new CronJob('1 12 1-31 * *', function() {
      /* runs once at the specified date. */
      let today = new DateOnly();

      PaymentReminder
        .update({"auto_issue_on": today},{
          $set: {
            "publish": true
          }
        }, {multi: true}, (err, res)=>{
          if(err){
            console.log('error')
          }    
          else
          {
            console.log(res);
          }      
        })
      }, function () {
        /* This function is executed when the job stops */
        console.log('success!')
      },
      true,
      'Asia/Jakarta'
    );
  }

  static autoStartPoll():void{
    new CronJob('01-10 01 1-31 * *', function() {
      /* runs once at the specified date. */
      let today = new DateOnly();

      Poll
        .update({"start_time": today},
            {
              $set: {  
                "status": "active"
              }
            }, {multi: true}, (err, res)=>{
          if(err){
            console.log('error')
          }    
          else
          {
            console.log(res);
          }      
        })
      }, function () {
        /* This function is executed when the job stops */
        console.log('success!')
      },
      true,
      'Asia/Jakarta'
    );
  }

  static autoEndPoll():void{
    new CronJob('50-59 23 1-31 * *', function() {
      /* runs once at the specified date. */
      let today = new DateOnly();

      Poll
        .Update({"end_time": today},{
          $set: {
            "status": "not active"
          }
        }, {multi: true}, (err, res)=>{
          if(err){
            console.log('error')
          }    
          else
          {
            console.log(res);
            Poll
              .aggregate({
                $unwind: "$votes"
              },
              { 
                $group: { 
                  _id: '$votes.answer', total_vote: { $sum: 1 } 
                } 
              },
              {
                $sort : {
                  total_vote : -1
                }
              }, 
              {
                $limit : 1 
              },          
              function (err, res) {
                let result = [].concat(res);
                for (var i = 0; i < result.length; i++) {
                    let voteresult = result[i];
                    let vote = voteresult._id;
                    Poll
                      .findOneAndUpdate({"end_time": today}, {
                        $set: {
                          "outcome": vote
                        }
                      })
                      .exec((err, updated) => {
                          if(err){
                            console.log('error')
                          }    
                          else
                          {
                            console.log(updated);
                          }
                      });
                }                      
              });
          }      
        })
      }, function () {
        /* This function is executed when the job stops */
        console.log('success!')
      },
      true,
      'Asia/Jakarta'
    );
  }
}
