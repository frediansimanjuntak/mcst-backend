"use strict";

import * as express from 'express';
import {AnnouncementController} from '../controller/announcement-controller';

export class AnnouncementRoutes {
    static init(router: express.Router) {
      router
        .route('/api/announcements')
        .get(AnnouncementController.getAll)
        .post(AnnouncementController.createAnnouncement);

      router
        .route('/api/announcements/:id')
        .get(AnnouncementController.getById)
        .delete(AnnouncementController.deleteAnnouncement);

      router
        .route('/api/announcements/update/:id')
        .post(AnnouncementController.updateAnnouncement);

      router
        .route('/api/announcements/publish/:id')
        .post(AnnouncementController.publishAnnouncement);
    }
}
