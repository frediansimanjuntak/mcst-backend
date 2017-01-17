"use strict";

import * as express from 'express';
import {DevelopmentController} from '../controller/development-controller';
import * as auth from '../../../auth/auth-service';

export class DevelopmentRoutes {
    static init(router: express.Router) {
      router
        .route('/api/developments')
        .get(auth.isAuthenticated(), DevelopmentController.getAll)
        .post(auth.isAuthenticated(), DevelopmentController.createDevelopment);

      router
        .route('/api/developments/:namedevelopment')
        .get(auth.isAuthenticated(), DevelopmentController.getById)
        .delete(auth.isAuthenticated(), DevelopmentController.deleteDevelopment);

      router
        .route('/api/developments/update/:namedevelopment')
        .post(auth.isAuthenticated(), DevelopmentController.updateDevelopment);

      router
        .route('/api/developments/staff/:namedevelopment')
        .post(auth.isAuthenticated(), DevelopmentController.createStaffDevelopment)
        .delete(auth.isAuthenticated(), DevelopmentController.deleteStaffDevelopment);
    }
}
