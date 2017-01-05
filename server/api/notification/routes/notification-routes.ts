"use strict";

import * as express from 'express';
import {NotificationController} from '../controller/notification-controller';

export class NotificationRoutes {
    static init(router: express.Router) {
      router
        .route('/api/notifications')
        .get(NotificationController.getAll)
        .post(NotificationController.createNotification);

      router
        .route('/api/notifications/user/:userId')
        .get(NotificationController.getOwnNotification)
        .post(NotificationController.readNotification);

      router
        .route('/api/notifications/user/:userId/unread')
        .get(NotificationController.getOwnUnreadNotification);

      router
        .route('/api/notifications/:id')
        .delete(NotificationController.deleteNotification);

      router
        .route('/api/notifications/update/:id')
        .post(NotificationController.updateNotification);
    }
}
