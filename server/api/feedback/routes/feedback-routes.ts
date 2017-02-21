"use strict";

import * as express from 'express';
import {FeedbackController} from '../controller/feedback-controller';
import * as auth from '../../../auth/auth-service';

export class FeedbackRoutes {
    static init(router: express.Router) {
      router
        .route('/feedback')
        .get(auth.isAuthenticated(), FeedbackController.getAll)
        .post(auth.isAuthenticated(), FeedbackController.createFeedback);

      router
        .route('/feedback/:id')
        .get(auth.isAuthenticated(), FeedbackController.getById)
        .delete(auth.isAuthenticated(), FeedbackController.deleteFeedback);

      router
        .route('/feedback/update/:id')
        .post(auth.isAuthenticated(), FeedbackController.updateFeedback);

      router
        .route('/feedback/get_publish/:id')
        .get(auth.isAuthenticated(), FeedbackController.getAllPublish);

      router
        .route('/feedback/get_unpublish/:id')
        .get(auth.isAuthenticated(), FeedbackController.getAllUnPublish);

      router
        .route('/feedback/reply/:id')
        .post(auth.isAuthenticated(), FeedbackController.replyFeedback);

      router
        .route('/feedback/publish/:id')
        .post(auth.isAuthenticated(), FeedbackController.publishFeedback);

      router
        .route('/feedback/archieve/:id')
        .post(auth.isAuthenticated(), FeedbackController.archieveFeedback);

    }
}
