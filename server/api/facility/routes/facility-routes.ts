"use strict";

import * as express from 'express';
import {FacilityController} from '../controller/facility-controller';
import * as auth from '../../../auth/auth-service';

export class FacilityRoutes {
    static init(router: express.Router) {
      router
        .route('/facilities')
        .get(auth.isAuthenticated(), FacilityController.getAll)
        .post(auth.isAuthenticated(), FacilityController.createFacility);

      router
        .route('/facilities/:id')
        .get(auth.isAuthenticated(), FacilityController.getById)
        .delete(auth.isAuthenticated(), FacilityController.deleteFacility);

      router
        .route('/facilities/update/:id')
        .post(auth.isAuthenticated(), FacilityController.updateFacility);
    }
}
