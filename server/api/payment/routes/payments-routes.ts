"use strict";

import * as express from 'express';
import {PaymentsController} from '../controller/payments-controller';
import * as auth from '../../../auth/auth-service';

export class PaymentsRoutes {
    static init(router: express.Router) {
      router
        .route('/payment')
        .get(auth.isAuthenticated(), PaymentsController.getAll)
        .post(auth.isAuthenticated(), PaymentsController.createPayments);

      router
        .route('/payment/:id')
        .get(auth.isAuthenticated(), PaymentsController.getById)
        .delete(auth.isAuthenticated(), PaymentsController.deletePayments);

      router
        .route('/payment/receiver/me')
        .get(auth.isAuthenticated(), PaymentsController.getByOwnPaymentReceiver);

      router
        .route('/payment/update/:id')
        .post(auth.isAuthenticated(), PaymentsController.updatePayments);
    }
}
