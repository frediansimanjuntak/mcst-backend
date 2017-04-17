"use strict";

import * as express from 'express';
import {ContractorController} from '../controller/contractor-controller';
import * as auth from '../../../auth/auth-service';

export class ContratorRoutes {
    static init(router: express.Router) {
      router
        .route('/contractor')
        .get(auth.isAuthenticated(), ContractorController.getAll)
        .post(auth.isAuthenticated(), ContractorController.createContractor);

      router
        .route('/contractor/:id')
        .get(auth.isAuthenticated(), ContractorController.getById)
        .delete(auth.isAuthenticated(), ContractorController.deleteContractor);

      router
        .route('/contractor/update/:id')
        .post(auth.isAuthenticated(), ContractorController.updateContractor);

      router
        .route('/contractor/activate/:id')
        .post(auth.isAuthenticated(), ContractorController.activateContractor);

      router
        .route('/contractor/deactivate/:id')
        .post(auth.isAuthenticated(), ContractorController.deactivateContractor);
    }
}
