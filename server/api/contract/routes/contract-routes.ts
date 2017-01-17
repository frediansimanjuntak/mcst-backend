"use strict";

import * as express from 'express';
import {ContractController} from '../controller/contract-controller';
import * as auth from '../../../auth/auth-service';

export class ContractRoutes {
    static init(router: express.Router) {
      router
        .route('/api/contracts')
        .get(auth.isAuthenticated(), ContractController.getAll)
        .post(auth.isAuthenticated(), ContractController.createContract);

      router
        .route('/api/contracts/:id')
        .get(auth.isAuthenticated(), ContractController.getById)
        .delete(auth.isAuthenticated(), ContractController.deleteContract);

      router
        .route('/api/contracts/update/:id')
        .post(auth.isAuthenticated(), ContractController.updateContract);      
    }
}
