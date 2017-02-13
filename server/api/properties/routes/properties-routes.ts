"use strict";

import * as express from 'express';
import {PropertiesController} from '../controller/properties-controller';
import * as auth from '../../../auth/auth-service';

export class PropertiesRoutes {
    static init(router: express.Router) {
      //Route Property
      router
        .route('/api/properties/:name_url')
        .get(auth.isAuthenticated(), PropertiesController.getProperties)
        .post(auth.isAuthenticated(), PropertiesController.createProperties);

      router
        .route('/api/properties/:name_url/:idproperties')
        .get(auth.isAuthenticated(), PropertiesController.getByIdProperties)
        .delete(auth.isAuthenticated(), PropertiesController.deleteProperties);

      router
        .route('/api/properties/:name_url/update/:idproperties')
        .post(auth.isAuthenticated(), PropertiesController.updateProperties);


      //Route Tenant
      router
        .route('/api/properties/:name_url/tenant/:idproperties')
        .get(auth.isAuthenticated(), PropertiesController.getTenantProperties)
        .post(auth.isAuthenticated(), PropertiesController.createTenantProperties);

      router
        .route('/api/properties/:name_url/:idproperties/tenant/:idtenant')
        .get(auth.isAuthenticated(), PropertiesController.getByIdTenantProperties)
        .post(auth.isAuthenticated(), PropertiesController.updateTenantProperties)
        .delete(auth.isAuthenticated(), PropertiesController.deleteTenantProperties);


      //Route Register Vehicle
      router
        .route('/api/properties/:name_url/register_vehicle/:idproperties')
        .get(auth.isAuthenticated(), PropertiesController.getRegisterVehicleProperties)
        .post(auth.isAuthenticated(), PropertiesController.createRegisterVehicleProperties);

      router
        .route('/api/properties/:name_url/:idproperties/register_vehicle/:idregistervehicle')
        .get(auth.isAuthenticated(), PropertiesController.getByIdRegisterVehicleProperties)
        .post(auth.isAuthenticated(), PropertiesController.updateRegisterVehicleProperties)
        .delete(auth.isAuthenticated(), PropertiesController.deleteRegisterVehicleProperties);

    }
}
