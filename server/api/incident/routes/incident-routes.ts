"use strict";

import * as express from 'express';
import {IncidentController} from '../controller/incident-controller';

export class IncidentRoutes {
    static init(router: express.Router) {
      router
        .route('/api/incidents')
        .get(IncidentController.getAll)
        .post(IncidentController.createIncident);

      router
        .route('/api/incidents/:id')
        .get(IncidentController.getById)
        .post(IncidentController.statusIncident)
        .delete(IncidentController.deleteIncident);

      router
        .route('/api/incidents/update/:id')
        .post(IncidentController.updateIncident);

      router
        .route('/api/incidents/starred/:id')
        .post(IncidentController.starred)
        .delete(IncidentController.unstarred);

      router
        .route('/api/incidents/archieve/:id')
        .post(IncidentController.archieve)
        .put(IncidentController.unarchieve);
    }
}
