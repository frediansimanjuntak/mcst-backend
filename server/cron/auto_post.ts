import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import Announcement from '../api/announcement/dao/announcement-dao';
import PaymentReminder from '../api/payment_reminder/dao/payment_reminder-dao';

var CronJob = require('cron').CronJob;

export function autoPostAnnouncement(){
    new CronJob('1 12 1-31 * *', function() {
      /* runs once at the specified date. */

      let today = new Date();
      console.log(today);
      Announcement
        .update({"auto_post_on": today},{
          $set: {
            "publish": true
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

export function autoPostPaymentReminder(){
    new CronJob('1 12 1-31 * *', function() {
      /* runs once at the specified date. */
      let today = new Date();

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