"use strict";

import * as express from 'express';
import {FacilityController} from '../controller/facility-controller';

export class FacilityRoutes {
    static init(router: express.Router) {
      router
        .route('/api/facilities')
        .get(FacilityController.getAll)
        .post(FacilityController.createFacility);

      router
        .route('/api/facilities/:id')
        .get(FacilityController.getById)
        .delete(FacilityController.deleteFacility);

      router
        .route('/api/facilities/update/:id')
        .post(FacilityController.updateFacility);
    }
}
