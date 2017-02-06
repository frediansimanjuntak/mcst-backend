"use strict";

import * as express from 'express';
import {GuestController} from '../controller/guest_registration-controller';
import * as auth from '../../../auth/auth-service';

export class GuestRoutes {
    static init(router: express.Router) {
      router
        .route('/api/guest_registrations')
        .get(auth.isAuthenticated(), GuestController.getAll)
        .post(auth.isAuthenticated(), GuestController.createGuest);

      router
        .route('/api/guest_registrations/:id')
        .get(auth.isAuthenticated(), GuestController.getById)
        .delete(auth.isAuthenticated(), GuestController.deleteGuest);

      router
        .route('/api/guest_registrations/update/:id')
        .post(auth.isAuthenticated(), GuestController.updateGuest);

      router
        .route('/api/guest_registrations/checkin/:id')
        .post(auth.isAuthenticated(), GuestController.checkInGuest);

      router
        .route('/api/guest_registrations/checkout/:id')
        .post(auth.isAuthenticated(), GuestController.checkOutGuest);
    }
}
