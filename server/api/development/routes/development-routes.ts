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
        .route('/api/developments/:id')
        .get(auth.isAuthenticated(), DevelopmentController.getById)
        .delete(auth.isAuthenticated(), DevelopmentController.deleteDevelopment);

      router
        .route('/api/developments/update/:id')
        .post(auth.isAuthenticated(), DevelopmentController.updateDevelopment);

      router
        .route('/api/developments/staff/:id')
        .post(auth.isAuthenticated(), DevelopmentController.createStaffDevelopment)
        .delete(auth.isAuthenticated(), DevelopmentController.deleteStaffDevelopment);
    }
}
