"use strict";

import * as express from 'express';
import {ContractorController} from '../controller/contractor-controller';
import * as auth from '../../../auth/auth-service';

export class ContratorRoutes {
    static init(router: express.Router) {
      router
        .route('/api/contractor')
        .get(auth.isAuthenticated(), ContractorController.getAll)
        .post(auth.isAuthenticated(), ContractorController.createContractor);

      router
        .route('/api/contractor/:id')
        .get(auth.isAuthenticated(), ContractorController.getById)
        .delete(auth.isAuthenticated(), ContractorController.deleteContractor);

      router
        .route('/api/contractor/update/:id')
        .post(auth.isAuthenticated(), ContractorController.updateContractor);

      router
        .route('/api/contractor/activation/:id')
        .post(auth.isAuthenticated(), ContractorController.activationContractor);
    }
}
