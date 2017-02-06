"use strict";

import * as express from 'express';
import {ContractNoteController} from '../controller/contract_note-controller';
import * as auth from '../../../auth/auth-service';

export class ContractNoteRoutes {
    static init(router: express.Router) {
      router
        .route('/api/contract_note/:id')
        .get(auth.isAuthenticated(), ContractNoteController.getAllContractNote)
        .post(auth.isAuthenticated(), ContractNoteController.createContractNote);

      router
        .route('/api/contract_note/:id/:idcontractnote')
        .get(auth.isAuthenticated(), ContractNoteController.getByIdContractNote)
        .delete(auth.isAuthenticated(), ContractNoteController.deleteContractNote);

      router
        .route('/api/contract_note/:id/update/:idcontractnote')
        .post(auth.isAuthenticated(), ContractNoteController.updateContractNote);      
    }
}
