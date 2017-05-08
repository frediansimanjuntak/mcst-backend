import * as express from 'express';
import {FaqRoutes} from '../faq/routes/faq-routes';
import {TodoRoutes} from '../todo/routes/todo-routes';
import {UserRoutes} from '../user/routes/user-routes';
import {PollRoutes} from '../polls/routes/poll-routes';
import {GuestRoutes} from '../guest_registration/routes/guest_registration-routes';
import {SettingRoutes} from '../setting/routes/setting-routes';
import {BookingRoutes} from '../booking/routes/booking-routes';
import {CompanyRoutes} from '../company/routes/company-routes';
import {HobbiesRoutes} from '../hobbies/routes/hobbies-routes';
import {VehicleRoutes} from '../vehicle/routes/vehicle-routes';
import {FeedbackRoutes} from '../feedback/routes/feedback-routes';
import {IncidentRoutes} from '../incident/routes/incident-routes';
import {PetitionRoutes} from '../petition/routes/petition-routes';
import {FacilityRoutes} from '../facility/routes/facility-routes';
import {ScheduleRoutes} from '../schedule_facility/routes/schedule_facility-routes';
import {ContractRoutes} from '../contract/routes/contract-routes';
import {PaymentsRoutes} from '../payment/routes/payments-routes';
import {ContratorRoutes} from '../contractor/routes/contractor-routes';
import {LostfoundRoutes} from '../lost_found/routes/lost_found-routes';
import {UserGroupRoutes} from '../user_group/routes/user_group-routes';
import {AttachmentRoutes} from '../attachment/routes/attachment-routes';
import {PropertiesRoutes} from '../properties/routes/properties-routes';
import {NewsletterRoutes} from '../newsletter/routes/newsletter-routes';
import {DevelopmentRoutes} from '../development/routes/development-routes';
import {AnnouncementRoutes} from '../announcement/routes/announcement-routes';
import {NotificationRoutes} from '../notification/routes/notification-routes';
import {ContractNoteRoutes} from '../contract_note/routes/contract_note-routes';
import {AccessControlRoutes} from '../access_control/routes/access_control-routes';
import {PaymentBookingRoutes} from '../payment_booking/routes/payment_booking-routes';
import {ContractNoticeRoutes} from '../contract_notice/routes/contract_notice-routes';
import {PaymentReminderRoutes} from '../payment_reminder/routes/payment_reminder-routes';
import {ContactDiretoryRoutes} from '../contact_directory/routes/contact_directory-routes';

var router = express.Router();

FaqRoutes.init(router);
TodoRoutes.init(router);
UserRoutes.init(router);     
PollRoutes.init(router);
GuestRoutes.init(router);
SettingRoutes.init(router);
CompanyRoutes.init(router);
BookingRoutes.init(router);
HobbiesRoutes.init(router);
VehicleRoutes.init(router);
PaymentsRoutes.init(router);  
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
ContractNoticeRoutes.init(router);
PaymentBookingRoutes.init(router); 
PaymentReminderRoutes.init(router); 
ContactDiretoryRoutes.init(router); 

export default router; 
