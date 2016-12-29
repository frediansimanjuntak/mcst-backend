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
     app.use('/', router);
   }
}
