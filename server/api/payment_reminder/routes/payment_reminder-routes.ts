"use strict";

import * as express from 'express';
import {PaymentReminderController} from '../controller/payment_reminder-controller';
import * as auth from '../../../auth/auth-service';

export class PaymentReminderRoutes {
    static init(router: express.Router) {
      router
        .route('/api/payment_reminder')
        .get(auth.isAuthenticated(), PaymentReminderController.getAll)
        .post(auth.isAuthenticated(), PaymentReminderController.createPaymentReminder);

      router
        .route('/api/payment_reminder/:id')
        .get(auth.isAuthenticated(), PaymentReminderController.getById)
        .delete(auth.isAuthenticated(), PaymentReminderController.deletePaymentReminder);

      router
        .route('/api/payment_reminder/update/:id')
        .post(auth.isAuthenticated(), PaymentReminderController.updatePaymentReminder);

      router
        .route('/api/payment_reminder/publish/:id')
        .post(auth.isAuthenticated(), PaymentReminderController.publishPaymentReminder);

    }
}
