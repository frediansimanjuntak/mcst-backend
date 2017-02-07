import * as express from 'express';
import {TodoRoutes} from '../api/todo/routes/todo-routes';
import {UserRoutes} from '../api/user/routes/user-routes';
import {PollRoutes} from '../api/polls/routes/poll-routes';
import {GuestRoutes} from '../api/guest_registration/routes/guest_registration-routes';
import {SettingRoutes} from '../api/setting/routes/setting-routes';
import {BookingRoutes} from '../api/booking/routes/booking-routes';
import {CompanyRoutes} from '../api/company/routes/company-routes';
import {FeedbackRoutes} from '../api/feedback/routes/feedback-routes';
import {IncidentRoutes} from '../api/incident/routes/incident-routes';
import {PetitionRoutes} from '../api/petition/routes/petition-routes';
import {FacilityRoutes} from '../api/facility/routes/facility-routes';
import {ScheduleRoutes} from '../api/schedule_facility/routes/schedule_facility-routes';
import {ContractRoutes} from '../api/contract/routes/contract-routes';
import {ContratorRoutes} from '../api/contractor/routes/contractor-routes';
import {LostfoundRoutes} from '../api/lost_found/routes/lost_found-routes';
import {UserGroupRoutes} from '../api/user_group/routes/user_group-routes';
import {AttachmentRoutes} from '../api/attachment/routes/attachment-routes';
import {PropertiesRoutes} from '../api/properties/routes/properties-routes';
import {NewsletterRoutes} from '../api/newsletter/routes/newsletter-routes';
import {DevelopmentRoutes} from '../api/development/routes/development-routes';
import {AnnouncementRoutes} from '../api/announcement/routes/announcement-routes';
import {NotificationRoutes} from '../api/notification/routes/notification-routes';
import {ContractNoteRoutes} from '../api/contract_note/routes/contract_note-routes';
import {PaymentReminderRoutes} from '../api/payment_reminder/routes/payment_reminder-routes';
import {AccessControlRoutes} from '../api/access_control/routes/access_control-routes';
import {PaymentBookingRoutes} from '../api/payment_booking/routes/payment_booking-routes';
import {ContractNoticeRoutes} from '../api/contract_notice/routes/contract_notice-routes';


export class Routes {
   static init(app: express.Application, router: express.Router) {
     TodoRoutes.init(router);
     UserRoutes.init(router);     
     PollRoutes.init(router);
     GuestRoutes.init(router);
     SettingRoutes.init(router);
     CompanyRoutes.init(router);
     BookingRoutes.init(router);
     ContractRoutes.init(router);     
     IncidentRoutes.init(router);
     PetitionRoutes.init(router);
     FacilityRoutes.init(router);
     ScheduleRoutes.init(router);
     FeedbackRoutes.init(router);
     UserGroupRoutes.init(router);     
     ContratorRoutes.init(router);  
     LostfoundRoutes.init(router);     
     PropertiesRoutes.init(router);
     NewsletterRoutes.init(router);
     AttachmentRoutes.init(router);
     DevelopmentRoutes.init(router);     
     NotificationRoutes.init(router);     
     AnnouncementRoutes.init(router);
     ContractNoteRoutes.init(router);
     AccessControlRoutes.init(router);
     PaymentReminderRoutes.init(router);
     ContractNoticeRoutes.init(router);
     PaymentBookingRoutes.init(router);
          
     app.use('/', router);
     app.use('/auth', require('../auth').default);
   }
}
