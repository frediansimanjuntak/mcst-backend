"use strict";

import * as express from 'express';
import {IncidentController} from '../controller/incident-controller';
import * as auth from '../../../auth/auth-service';

export class IncidentRoutes {
    static init(router: express.Router) {
      router
        .route('/incidents')
        .get(auth.isAuthenticated(), IncidentController.getAll)
        .post(auth.isAuthenticated(), IncidentController.createIncident);

      router
        .route('/incidents/:id')
        .get(auth.isAuthenticated(), IncidentController.getById)
        .post(auth.isAuthenticated(), IncidentController.statusIncident)
        .delete(auth.isAuthenticated(), IncidentController.deleteIncident);

      router
        .route('/incidents/update/:id')
        .post(auth.isAuthenticated(), IncidentController.updateIncident);

      router
        .route('/incidents/starred/:id')
        .post(auth.isAuthenticated(), IncidentController.starred)
        .put(auth.isAuthenticated(), IncidentController.unstarred);

      router
        .route('/incidents/archieve/:id')
        .post(auth.isAuthenticated(), IncidentController.archieve)
        .put(auth.isAuthenticated(), IncidentController.unarchieve);

      router
        .route('/incidents/resolve/:id')
        .post(auth.isAuthenticated(), IncidentController.resolve);
    }
}
