"use strict";

import * as express from 'express';
import {ContactDiretoryController} from '../controller/contact_directory-controller';
import * as auth from '../../../auth/auth-service';

export class ContactDiretoryRoutes {
    static init(router: express.Router) {
      router
        .route('/contact_directory')
        .get(auth.isAuthenticated(), ContactDiretoryController.getAll)
        .post(auth.isAuthenticated(), ContactDiretoryController.createContactDirectory);

      router
        .route('/contact_directory/:id')
        .get(auth.isAuthenticated(), ContactDiretoryController.getById)
        .delete(auth.isAuthenticated(), ContactDiretoryController.deleteContactDirectory);

      router
        .route('/contact_directory/update/:id')
        .post(auth.isAuthenticated(), ContactDiretoryController.updateContactDirectory);
    }
}
