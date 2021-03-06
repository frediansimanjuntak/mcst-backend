"use strict";

import * as express from 'express';
import {NotificationController} from '../controller/notification-controller';
import * as auth from '../../../auth/auth-service';

export class NotificationRoutes {
    static init(router: express.Router) {
      router
        .route('/notifications')
        .get(auth.isAuthenticated(),NotificationController.getAll)
        .post(auth.isAuthenticated(),NotificationController.createNotification);

      router
        .route('/notifications/user/')
        .get(auth.isAuthenticated(),NotificationController.getOwnNotification)
        .post(auth.isAuthenticated(),NotificationController.readNotification);

      router
        .route('/notifications/user/unread')
        .get(auth.isAuthenticated(),NotificationController.getOwnUnreadNotification);

      router
        .route('/notifications/:id')
        .delete(auth.isAuthenticated(),NotificationController.deleteNotification);

      router
        .route('/notifications/update/:id')
        .post(auth.isAuthenticated(),NotificationController.updateNotification);

      router
        .route('/notifications/mark_read/:id')
        .post(auth.isAuthenticated(),NotificationController.markRead);
      
      router
        .route('/notifications/payment/me')
        .get(auth.isAuthenticated(),NotificationController.getOwnPaymentNotification);
    }
}
