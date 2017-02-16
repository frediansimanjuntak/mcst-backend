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
        },(err, res)=>{
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
        },(err, res)=>{
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
        .findOneAndUpdate({"auto_issue_on": today},{
          $set: {
            "publish": true
          }
        },(err, res)=>{
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
    new CronJob('00 00 1-31 * *', function() {
      /* runs once at the specified date. */
      let today = new DateOnly();

      Poll
        .findOneAndUpdate({"start_time": today},{
          $set: {
            "status": "active"
          }
        },(err, res)=>{
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
    new CronJob('00 00 1-31 * *', function() {
      /* runs once at the specified date. */
      let today = new DateOnly();

      Poll
        .findOneAndUpdate({"end_time": today},{
          $set: {
            "status": "not active"
          }
        },(err, res)=>{
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
}

// export function autoPostPublishAnnouncement(){
//     new CronJob('1 12 1-31 * *', function() {
//       /* runs once at the specified date. */

//       let today = new DateOnly();
//       Announcement
//         .update({"auto_post_on": today},{
//           $set: {
//             "publish": true,
//             "publish_at": new Date()
//           }
//         },(err, res)=>{
//           if(err){
//             console.log('error');
//           } 
//           else
//           {
//             console.log(res);
//           }
//         })
//       }, function () {
//         /* This function is executed when the job stops */
//         console.log('success!')
//       },
//       true,
//       'Asia/Jakarta'
//     );
// }

// export function autoPostValidAnnouncement(){
//     new CronJob('1 12 1-31 * *', function() {
//       /* runs once at the specified date. */

//       let today = new DateOnly();
//       Announcement
//         .update({"valid_till": today},{
//           $set: {
//             "publish": false,
//             "valid": false
//           }
//         },(err, res)=>{
//           if(err){
//             console.log('error');
//           } 
//           else
//           {
//             console.log(res);
//           }
//         })
//       }, function () {
//         /* This function is executed when the job stops */
//         console.log('success!')
//       },
//       true,
//       'Asia/Jakarta'
//     );
// }

// export function autoPostPaymentReminder(){
//     new CronJob('1 12 1-31 * *', function() {
//       /* runs once at the specified date. */
//       let today = new DateOnly();

//       PaymentReminder
//         .findOneAndUpdate({"auto_issue_on": today},{
//           $set: {
//             "publish": true
//           }
//         },(err, res)=>{
//           if(err){
//             console.log('error')
//           }    
//           else
//           {
//             console.log(res);
//           }      
//         })
//       }, function () {
//         /* This function is executed when the job stops */
//         console.log('success!')
//       },
//       true,
//       'Asia/Jakarta'
//     );
// }