"use strict";

import * as express from 'express';
import {AttachmentController} from '../controller/attachment-controller';

export class AttachmentRoutes {
    static init(router: express.Router) {
      router
        .route('/api/attachments')
        // .get(AttachmentController.getAll)
        .post(AttachmentController.createAttachment);

      router
        .route('/api/attachments/:id')
        .delete(AttachmentController.deleteAttachment);

      // router
      //   .route('/api/attachments/update/:id')
      //   .post(AttachmentController.updateAttachment);
    }
}
