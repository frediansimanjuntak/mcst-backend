"use strict";

import * as express from 'express';
import {ContractScheduleController} from '../controller/contract_schedule-controller';
import * as auth from '../../../auth/auth-service';

export class ContractScheduleRoutes {
    static init(router: express.Router) {
      router
        .route('/api/contract_notice/:id')
        .get(auth.isAuthenticated(), ContractScheduleController.getAllContractSchedule)
        .post(auth.isAuthenticated(), ContractScheduleController.createContractSchedule);

      router
        .route('/api/contract_notice/:id/:idcontractschedule')
        .get(auth.isAuthenticated(), ContractScheduleController.getByIdContractSchedule)
        .delete(auth.isAuthenticated(), ContractScheduleController.deleteContractSchedule);

      router
        .route('/api/contract_notice/:id/update/:idcontractschedule')
        .post(auth.isAuthenticated(), ContractScheduleController.updateContractSchedule);       
    }
}
