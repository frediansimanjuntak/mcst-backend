"use strict";

import * as express from 'express';
import {ContractNoticeController} from '../controller/contract_notice-controller';
import * as auth from '../../../auth/auth-service';

export class ContractNoticeRoutes {
    static init(router: express.Router) {
      router
        .route('/api/contract_notice/:id')
        .get(auth.isAuthenticated(), ContractNoticeController.getAllContractNotice)
        .post(auth.isAuthenticated(), ContractNoticeController.createContractNotice);

      router
        .route('/api/contract_notice/:id/:idcontractnotice')
        .get(auth.isAuthenticated(), ContractNoticeController.getByIdContractNotice)
        .delete(auth.isAuthenticated(), ContractNoticeController.deleteContractNotice);

      router
        .route('/api/contract_notice/:id/update/:idcontractnotice')
        .post(auth.isAuthenticated(), ContractNoticeController.updateContractNotice); 

      router
        .route('/api/contract_notice/:id/publish/:idcontractnotice')
        .post(auth.isAuthenticated(), ContractNoticeController.publishContractNotice);      
    }
}
