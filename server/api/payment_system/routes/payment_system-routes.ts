"use strict";

import * as express from 'express';
import {PaymentSystemController} from '../controller/payment_system-controller';
import * as auth from '../../../auth/auth-service';

export class PaymentSystemRoutes {
    static init(router: express.Router) {
      router
        .route('/api/feedback')
        .get(auth.isAuthenticated(), PaymentSystemController.getAll)
        .post(auth.isAuthenticated(), PaymentSystemController.createPaymentSystem);

      router
        .route('/api/feedback/:id')
        .get(auth.isAuthenticated(), PaymentSystemController.getById)
        .delete(auth.isAuthenticated(), PaymentSystemController.deletePaymentSystem);

      router
        .route('/api/feedback/update/:id')
        .post(auth.isAuthenticated(), PaymentSystemController.updatePaymentSystem);

      router
        .route('/api/feedback/publish/:id')
        .post(auth.isAuthenticated(), PaymentSystemController.publishPaymentSystem);

    }
}
