"use strict";

import * as express from 'express';
import {AnnouncementController} from '../controller/announcement-controller';
import * as auth from '../../../auth/auth-service';

export class AnnouncementRoutes {
    static init(router: express.Router) {
      router
        .route('/announcements')
        .get(auth.isAuthenticated(), AnnouncementController.getAll)
        .post(auth.isAuthenticated(), AnnouncementController.createAnnouncement);

      router
        .route('/announcements/:id')
        .get(auth.isAuthenticated(), AnnouncementController.getById)
        .delete(auth.isAuthenticated(), AnnouncementController.deleteAnnouncement);

      router
        .route('/announcements/update/:id')
        .post(auth.isAuthenticated(), AnnouncementController.updateAnnouncement);

      router
        .route('/announcements/publish/:id')
        .post(auth.isAuthenticated(), AnnouncementController.publishAnnouncement);
    }
}
