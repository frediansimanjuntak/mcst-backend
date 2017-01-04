"use strict";

import * as express from 'express';
import {PaymentBookingController} from '../controller/payment_booking-controller';

export class PaymentBookingRoutes {
    static init(router: express.Router) {
      router
        .route('/api/payment_booking')
        .get(PaymentBookingController.getAll)
        .post(PaymentBookingController.createPaymentBooking);

      router
        .route('/api/payment_booking/:id')
        .get(PaymentBookingController.getById)
        .delete(PaymentBookingController.deletePaymentBooking);

      router
        .route('/api/payment_booking/update/:id')
        .post(PaymentBookingController.updatePaymentBooking);
    }
}
