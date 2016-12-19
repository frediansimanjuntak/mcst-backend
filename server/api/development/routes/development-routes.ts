"use strict";

import * as express from 'express';
import {DevelopmentController} from '../controller/development-controller';

export class DevelopmentRoutes {
    static init(router: express.Router) {
      router
        .route('/api/developments')
        .get(DevelopmentController.getAll)
        .post(DevelopmentController.createDevelopment);

      router
        .route('/api/developments/:id')
        .delete(DevelopmentController.deleteDevelopment);

      router
        .route('/api/developments/update/:id')
        .post(DevelopmentController.updateDevelopment);
    }
}
