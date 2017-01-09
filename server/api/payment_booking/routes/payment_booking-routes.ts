"use strict";

import * as express from 'express';
import {PaymentBookingController} from '../controller/payment_booking-controller';
import * as auth from '../../../auth/auth-service';

export class PaymentBookingRoutes {
    static init(router: express.Router) {
      router
        .route('/api/payment_booking')
        .get(auth.isAuthenticated(), PaymentBookingController.getAll)
        .post(auth.isAuthenticated(), PaymentBookingController.createPaymentBooking);

      router
        .route('/api/payment_booking/:id')
        .get(auth.isAuthenticated(), PaymentBookingController.getById)
        .delete(auth.isAuthenticated(), PaymentBookingController.deletePaymentBooking);

      router
        .route('/api/payment_booking/update/:id')
        .post(auth.isAuthenticated(), PaymentBookingController.updatePaymentBooking);
    }
}
