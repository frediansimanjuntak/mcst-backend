"use strict";

import * as express from 'express';
import {BookingController} from '../controller/booking-controller';
import * as auth from '../../../auth/auth-service';

export class BookingRoutes {
    static init(router: express.Router) {
      router
        .route('/booking')
        .get(auth.isAuthenticated(), BookingController.getAll)
        .post(auth.isAuthenticated(), BookingController.createBooking);
      
      router
        .route('/booking/me')
        .get(auth.isAuthenticated(), BookingController.getOwn);

      router
        .route('/booking/:id')
        .get(auth.isAuthenticated(), BookingController.getById)
        .delete(auth.isAuthenticated(), BookingController.deleteBooking);

      router
        .route('/booking/update/:id')
        .post(auth.isAuthenticated(), BookingController.updateBooking);
    }
}
