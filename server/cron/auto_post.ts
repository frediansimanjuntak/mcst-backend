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
      let today = new Date().getDate();

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
      let today = new Date().getDate();
      // let today = new DateOnly();
      Poll
        .find({})
        .where("end_time").lte(today)
        .exec((err, polls) => {
          for(var i = 0; i < polls.length; i++){
            polls[i].status = "end poll";
            polls[i].save((err, saved) => {
              if(err){
                console.log(err);
              }
              if(saved){
                console.log({message: "end polling success"});
              }
            });
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
      }, function () {
        /* This function is executed when the job stops */
        console.log('success!')
      },
      true,
      'Asia/Jakarta'
    );
  }
}
