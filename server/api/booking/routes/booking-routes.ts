"use strict";

import * as express from 'express';
import {BookingController} from '../controller/booking-controller';
import * as auth from '../../../auth/auth-service';

export class BookingRoutes {
    static init(router: express.Router) {
      router
        .route('/api/booking')
        .get(auth.isAuthenticated(), BookingController.getAll)
        .post(auth.isAuthenticated(), BookingController.createBooking);

      router
        .route('/api/booking/:id')
        .get(auth.isAuthenticated(), BookingController.getById)
        .delete(auth.isAuthenticated(), BookingController.deleteBooking);

      router
        .route('/api/booking/update/:id')
        .post(auth.isAuthenticated(), BookingController.updateBooking);
    }
}
