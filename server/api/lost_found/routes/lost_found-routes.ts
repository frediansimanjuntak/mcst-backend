"use strict";

import * as express from 'express';
import {LostfoundController} from '../controller/lost_found-controller';
import * as auth from '../../../auth/auth-service';

export class LostfoundRoutes {
    static init(router: express.Router) {
      router
        .route('/lost_found')
        .get(auth.isAuthenticated(), LostfoundController.getAll)
        .post(auth.isAuthenticated(), LostfoundController.createLostfound);
      
       router
        .route('/lost_found/me')
        .get(auth.isAuthenticated(), LostfoundController.getOwnLostFound)

      router
        .route('/lost_found/:id')
        .get(auth.isAuthenticated(), LostfoundController.getById)
        .delete(auth.isAuthenticated(), LostfoundController.deleteLostfound);

      router
        .route('/lost_found/update/:id')
        .post(auth.isAuthenticated(), LostfoundController.updateLostfound);

      router
        .route('/lost_found/archieve/:id')
        .post(auth.isAuthenticated(), LostfoundController.archieveLostfound);

    }
}
