"use strict";

import * as express from 'express';
import {HobbiesController} from '../controller/hobbies-controller';
import * as auth from '../../../auth/auth-service';

export class HobbiesRoutes {
    static init(router: express.Router) {
      router
        .route('/hobbies')
        .get(auth.isAuthenticated(), HobbiesController.getAll)
        .post(auth.isAuthenticated(), HobbiesController.createHobbies);

      router
        .route('/hobbies/:id')
        .get(auth.isAuthenticated(), HobbiesController.getById)
        .delete(auth.isAuthenticated(), HobbiesController.deleteHobbies);

      router
        .route('/hobbies/update/:id')
        .post(auth.isAuthenticated(), HobbiesController.updateHobbies);
    }
}
