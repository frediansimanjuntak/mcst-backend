"use strict";

import * as express from 'express';
import {AttachmentController} from '../controller/attachment-controller';
import * as auth from '../../../auth/auth-service';

export class AttachmentRoutes {
    static init(router: express.Router) {
      router
        .route('/api/attachments')
        .get(AttachmentController.getAll)
        .post(auth.isAuthenticated(), AttachmentController.createAttachment);

      router
        .route('/api/attachments/:id')
        .delete(auth.isAuthenticated(), AttachmentController.deleteAttachment);
        
    }
}
