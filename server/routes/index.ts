import * as express from 'express';
import {TodoRoutes} from '../api/todo/routes/todo-routes';
import {DevelopmentRoutes} from '../api/development/routes/development-routes';
import {PropertiesRoutes} from '../api/properties/routes/properties-routes';
import {NewsletterRoutes} from '../api/newsletter/routes/newsletter-routes';
import {UserRoutes} from '../api/user/routes/user-routes';
import {UserGroupRoutes} from '../api/user_group/routes/user_group-routes';
import {IncidentRoutes} from '../api/incident/routes/incident-routes';
import {PetitionRoutes} from '../api/petition/routes/petition-routes';
import {AccessControlRoutes} from '../api/access_control/routes/access_control-routes';
import {AnnouncementRoutes} from '../api/announcement/routes/announcement-routes';
import {AttachmentRoutes} from '../api/attachment/routes/attachment-routes';
import {SettingRoutes} from '../api/setting/routes/setting-routes';
import {FacilityRoutes} from '../api/facility/routes/facility-routes';
import {ScheduleRoutes} from '../api/schedule_facility/routes/schedule_facility-routes';
import {BookingRoutes} from '../api/booking/routes/booking-routes';
import {PaymentBookingRoutes} from '../api/payment_booking/routes/payment_booking-routes';
import {NotificationRoutes} from '../api/notification/routes/notification-routes';
import {GuestRoutes} from '../api/guest_registration/routes/guest_registration-routes';
import {CompanyRoutes} from '../api/company/routes/company-routes';
import {ContratorRoutes} from '../api/contractor/routes/contractor-routes';
import {PollRoutes} from '../api/polls/routes/poll-routes';
import {ContractRoutes} from '../api/contract/routes/contract-routes';
import {ContractNoteRoutes} from '../api/contract_note/routes/contract_note-routes';
import {ContractNoticeRoutes} from '../api/contract_notice/routes/contract_notice-routes';


export class Routes {
   static init(app: express.Application, router: express.Router) {
     TodoRoutes.init(router);
     DevelopmentRoutes.init(router);
     PropertiesRoutes.init(router);
     NewsletterRoutes.init(router);
     UserRoutes.init(router);
     UserGroupRoutes.init(router);
     AttachmentRoutes.init(router);
     IncidentRoutes.init(router);
     PetitionRoutes.init(router);
     AccessControlRoutes.init(router);
     AnnouncementRoutes.init(router);
     SettingRoutes.init(router);
     FacilityRoutes.init(router);
     ScheduleRoutes.init(router);
     BookingRoutes.init(router);
     PaymentBookingRoutes.init(router);
     NotificationRoutes.init(router);
     GuestRoutes.init(router);
     CompanyRoutes.init(router);
     ContratorRoutes.init(router);
     PollRoutes.init(router);
     ContractRoutes.init(router);
     ContractNoteRoutes.init(router);
     ContractNoticeRoutes.init(router);
     
     app.use('/', router);
     app.use('/auth', require('../auth').default);
   }
}
