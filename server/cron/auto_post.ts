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
    new CronJob('01-10 08 1-31 * *', function() {
      /* runs once at the specified date. */

      let today = new Date();
      Announcement
        .update({"auto_post_on": {$lte: today}},{
          $set: {
            "publish": true,
            "publish_at": today
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
     new CronJob('01-10 08 1-31 * *', function() {
      /* runs once at the specified date. */

      let today = new Date();
      Announcement
        .update({"valid_till": {$lte: today}},{
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
    new CronJob('01-10 08 1-31 * *', function() {
      /* runs once at the specified date. */
      let today = new Date();

      PaymentReminder
        .update({"auto_issue_on": {$lte: today}},{
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
    new CronJob('01-10 08 1-31 * *', function() {
      /* runs once at the specified date. */
      let today = new Date();

      Poll
        .update({"start_time": {$lte: today}},
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
    new CronJob('01-10 08 1-31 * *', function() {
      /* runs once at the specified date. */
      let today = new Date();

      Poll
        .update({"end_time": {$lte: today}}, {
          $set: {
            "status": "end poll"
          }
        }, {multi: true})
        .exec((err, updated) => {
          if(err){
            console.log('error')
          }    
          else
          {
            console.log(updated);
          } 
        })

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
          for (var j = 0; j < result.length; j++) {
              let voteresult = result[j];
              let vote = voteresult._id;
              Poll
                .update({"end_time": {$lte: today}}, {
                  $set: {
                    "outcome": vote
                  }
                }, {multi: true})
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
      }, function () {
        /* This function is executed when the job stops */
        console.log('success!')
      },
      true,
      'Asia/Jakarta'
    );
  }
}
