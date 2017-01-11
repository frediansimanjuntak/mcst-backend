"use strict";

import * as express from 'express';
import {PropertiesController} from '../controller/properties-controller';
import * as auth from '../../../auth/auth-service';

export class PropertiesRoutes {
    static init(router: express.Router) {
      // router
      //   .route('/api/properties')
      //   .get(PropertiesController.getAll);

      router
        .route('/api/properties/:id')
        .get(auth.isAuthenticated(), PropertiesController.getProperties)
        .post(auth.isAuthenticated(), PropertiesController.createProperties);

      router
        .route('/api/properties/:id/:idproperties')
        .get(auth.isAuthenticated(), PropertiesController.getByIdProperties)
        .delete(auth.isAuthenticated(), PropertiesController.deleteProperties);

      router
        .route('/api/properties/:id/update/:idproperties')
        .post(auth.isAuthenticated(), PropertiesController.updateProperties);

      router
        .route('/api/properties/:id/tenant/:idproperties')
        .post(auth.isAuthenticated(), PropertiesController.createTenantProperties)
        .delete(auth.isAuthenticated(), PropertiesController.deleteTenantProperties);
    }
}
