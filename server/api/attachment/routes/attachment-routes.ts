"use strict";

import * as express from 'express';
import {AttachmentController} from '../controller/attachment-controller';
import * as auth from '../../../auth/auth-service';

export class AttachmentRoutes {
    static init(router: express.Router) {
      router
        .route('/attachments')
        .get(auth.isAuthenticated(), AttachmentController.getAll)
        .post(auth.isAuthenticated(), AttachmentController.createAttachment);

      router
        .route('/attachments/:id')
        .get(auth.isAuthenticated(), AttachmentController.getById)
        .delete(auth.isAuthenticated(), AttachmentController.deleteAttachment);
        
    }
}
