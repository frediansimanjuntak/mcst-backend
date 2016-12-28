"use strict";

import * as express from 'express';
import {PetitionController} from '../controller/petition-controller';

export class PetitionRoutes {
    static init(router: express.Router) {
      router
        .route('/api/petition')
        .get(PetitionController.getAll)
        .post(PetitionController.createPetition);

      router
        .route('/api/petition/:id')
        .delete(PetitionController.deletePetition);

      router
        .route('/api/petition/update/:id')
        .post(PetitionController.updatePetition);
    }
}
