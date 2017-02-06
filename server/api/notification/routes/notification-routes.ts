"use strict";

import * as express from 'express';
import {NotificationController} from '../controller/notification-controller';
import * as auth from '../../../auth/auth-service';

export class NotificationRoutes {
    static init(router: express.Router) {
      router
        .route('/api/notifications')
        .get(auth.isAuthenticated(),NotificationController.getAll)
        .post(auth.isAuthenticated(),NotificationController.createNotification);

      router
        .route('/api/notifications/user/:userId')
        .get(auth.isAuthenticated(),NotificationController.getOwnNotification)
        .post(auth.isAuthenticated(),NotificationController.readNotification);

      router
        .route('/api/notifications/user/:userId/unread')
        .get(auth.isAuthenticated(),NotificationController.getOwnUnreadNotification);

      router
        .route('/api/notifications/:id')
        .delete(auth.isAuthenticated(),NotificationController.deleteNotification);

      router
        .route('/api/notifications/update/:id')
        .post(auth.isAuthenticated(),NotificationController.updateNotification);
    }
}
