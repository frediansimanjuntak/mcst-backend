"use strict";

import * as express from 'express';
import {PetitionController} from '../controller/petition-controller';
import * as auth from '../../../auth/auth-service';

export class PetitionRoutes {
    static init(router: express.Router) {
      router
        .route('/petitions')
        .get(auth.isAuthenticated(), PetitionController.getAll)
        .post(auth.isAuthenticated(), PetitionController.createPetition);

      router
        .route('/petitions/new_tenant')
        .post(auth.isAuthenticated(), PetitionController.createPetitionNewTenant);

      router
        .route('/petitions/:id')
        .get(auth.isAuthenticated(), PetitionController.getById)
        .delete(auth.isAuthenticated(), PetitionController.deletePetition);

      router
        .route('/petitions/update/:id')
        .post(auth.isAuthenticated(), PetitionController.updatePetition);

      router
        .route('/petitions/archieve')
        .post(auth.isAuthenticated(), PetitionController.archieve)
        .put(auth.isAuthenticated(), PetitionController.unarchieve);
    }
}
