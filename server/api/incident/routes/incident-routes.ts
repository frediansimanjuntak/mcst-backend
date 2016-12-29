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
    }
}
