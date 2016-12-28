import * as express from 'express';
import {TodoRoutes} from '../api/todo/routes/todo-routes';
import {DevelopmentRoutes} from '../api/development/routes/development-routes';
import {PropertiesRoutes} from '../api/properties/routes/properties-routes';
import {NewsletterRoutes} from '../api/newsletter/routes/newsletter-routes';
import {UserRoutes} from '../api/user/routes/user-routes';
import {UserGroupRoutes} from '../api/user_group/routes/user_group-routes';
import {IncidentRoutes} from '../api/incident/routes/incident-routes';
import {PetitionRoutes} from '../api/petition/routes/petition-routes';
import {AttachmentRoutes} from '../api/attachment/routes/attachment-routes';


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
     app.use('/', router);
   }
}
