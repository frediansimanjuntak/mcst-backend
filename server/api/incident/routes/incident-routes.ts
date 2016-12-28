"use strict";

import * as express from 'express';
import {IncidentController} from '../controller/incident-controller';

export class IncidentRoutes {
    static init(router: express.Router) {
      router
        .route('/api/incident')
        .get(IncidentController.getAll)
        .post(IncidentController.createIncident);

      router
        .route('/api/incident/:id')
        .get(IncidentController.statusIncident)
        .delete(IncidentController.deleteIncident);

      router
        .route('/api/incident/update/:id')
        .post(IncidentController.updateIncident);
    }
}
