import {AutoPost} from './auto_post';

export class Cron{
  static init ():void {
    AutoPost.autoPostPaymentReminder();
    AutoPost.autoPostPublishAnnouncement();
    AutoPost.autoPostValidAnnouncement();
    AutoPost.autoStartPoll();
    AutoPost.autoEndPoll();
  }
}