"use strict";

import * as express from 'express';
import {PropertiesController} from '../controller/properties-controller';
import * as auth from '../../../auth/auth-service';

export class PropertiesRoutes {
    static init(router: express.Router) {
      //Route Property
      router
        .route('/properties/:name_url')
        .get(auth.isAuthenticated(), PropertiesController.getProperties)
        .post(auth.isAuthenticated(), PropertiesController.createProperties);

      router
        .route('/properties/:name_url/:idproperties')
        .get(auth.isAuthenticated(), PropertiesController.getByIdProperties)
        .delete(auth.isAuthenticated(), PropertiesController.deleteProperties);

      router
        .route('/properties/:name_url/update/:idproperties')
        .post(auth.isAuthenticated(), PropertiesController.updateProperties);

      router
        .route('/properties/:name_url/generate_code/:idproperties')
        .post(auth.isAuthenticated(), PropertiesController.generateCodeProperties)
        .put(auth.isAuthenticated(), PropertiesController.deleteCodeProperties);        

      //Route Tenant
      router
        .route('/properties/:name_url/tenant/:idproperties')
        .get(auth.isAuthenticated(), PropertiesController.getTenantProperties)
        .post(auth.isAuthenticated(), PropertiesController.createTenantProperties);

      router
        .route('/properties/:name_url/:idproperties/tenant/:idtenant')
        .get(auth.isAuthenticated(), PropertiesController.getByIdTenantProperties)
        .post(auth.isAuthenticated(), PropertiesController.updateTenantProperties)
        .put(auth.isAuthenticated(), PropertiesController.deleteTenantProperties);

      //Route Landlord
      router
        .route('/properties/:name_url/landlord/:idproperties')
        .delete(auth.isAuthenticated(), PropertiesController.deleteLandlord)
        .put(auth.isAuthenticated(), PropertiesController.changeLandlord);
    }
}
