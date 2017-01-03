"use strict";

import * as express from 'express';
import {BookingController} from '../controller/booking-controller';

export class BookingRoutes {
    static init(router: express.Router) {
      router
        .route('/api/booking')
        .get(BookingController.getAll)
        .post(BookingController.createBooking);

      router
        .route('/api/booking/:id')
        .get(BookingController.getById)
        .delete(BookingController.deleteBooking);

      router
        .route('/api/booking/update/:id')
        .post(BookingController.updateBooking);
    }
}
