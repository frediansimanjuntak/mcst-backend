"use strict";

import * as express from 'express';
import {VehicleController} from '../controller/vehicle-controller';
import * as auth from '../../../auth/auth-service';

export class VehicleRoutes {
    static init(router: express.Router) {
      router
        .route('/vehicles')
        .get(auth.isAuthenticated(), VehicleController.getAll)
        .post(auth.isAuthenticated(), VehicleController.createVehicle);

      router
        .route('/vehicles/:id')
        .get(auth.isAuthenticated(), VehicleController.getById)
        .delete(auth.isAuthenticated(), VehicleController.deleteVehicle);

      router
        .route('/vehicles/owner/:owner')
        .get(auth.isAuthenticated(), VehicleController.getByOwner);

      router
        .route('/vehicles/license_plate/:license')
        .get(auth.isAuthenticated(), VehicleController.getByLicensePlate);

      router
        .route('/vehicles/update/:id')
        .post(auth.isAuthenticated(), VehicleController.updateVehicle);
    }
}
