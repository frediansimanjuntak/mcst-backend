"use strict";

import * as express from 'express';
import {PetitionController} from '../controller/petition-controller';

export class PetitionRoutes {
    static init(router: express.Router) {
      router
        .route('/api/petitions')
        .get(PetitionController.getAll)
        .post(PetitionController.createPetition);

      router
        .route('/api/petitions/:id')
        .get(PetitionController.getById)
        .delete(PetitionController.deletePetition);

      router
        .route('/api/petitions/update/:id')
        .post(PetitionController.updatePetition);

      router
        .route('/api/incidents/archieve/:id')
        .post(PetitionController.archieve)
        .put(PetitionController.unarchieve);
    }
}
