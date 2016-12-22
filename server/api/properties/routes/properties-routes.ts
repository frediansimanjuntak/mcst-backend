"use strict";

import * as express from 'express';
import {PropertiesController} from '../controller/properties-controller';

export class PropertiesRoutes {
    static init(router: express.Router) {
      router
        .route('/api/properties')
        .get(PropertiesController.getAll);

      router
        .route('/api/properties/:id')
        .get(PropertiesController.getProperties)
        .post(PropertiesController.createProperties);

      router
        .route('/api/properties/:id/:idproperties')
        .get(PropertiesController.getByIdProperties)
        .delete(PropertiesController.deleteProperties);

      router
        .route('/api/properties/update/:id')
        // .get(PropertiesController.updateGetById)
        .post(PropertiesController.updateProperties);
    }
}
