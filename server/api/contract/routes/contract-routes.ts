"use strict";

import * as express from 'express';
import {ContractController} from '../controller/contract-controller';
import * as auth from '../../../auth/auth-service';

export class ContractRoutes {
    static init(router: express.Router) {
      router
        .route('/contracts')
        .get(auth.isAuthenticated(), ContractController.getAll)
        .post(auth.isAuthenticated(), ContractController.createContract);

      router
        .route('/contracts/:id')
        .get(auth.isAuthenticated(), ContractController.getById)
        .delete(auth.isAuthenticated(), ContractController.deleteContract);

      router
        .route('/contracts/update/:id')
        .post(auth.isAuthenticated(), ContractController.updateContract);      
    }
}
