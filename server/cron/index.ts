import {autoPostAnnouncement} from '../cron/auto_post';
import {autoPostPaymentReminder} from '../cron/auto_post';

export class Cron{
  static init ():void {
    autoPostPaymentReminder();
    autoPostAnnouncement();
  }
}

