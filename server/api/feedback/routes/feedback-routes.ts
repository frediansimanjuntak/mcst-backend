"use strict";

import * as express from 'express';
import {FeedbackController} from '../controller/feedback-controller';
import * as auth from '../../../auth/auth-service';

export class FeedbackRoutes {
    static init(router: express.Router) {
      router
        .route('/api/feedback')
        .get(auth.isAuthenticated(), FeedbackController.getAll)
        .post(auth.isAuthenticated(), FeedbackController.createFeedback);

      router
        .route('/api/feedback/:id')
        .get(auth.isAuthenticated(), FeedbackController.getById)
        .delete(auth.isAuthenticated(), FeedbackController.deleteFeedback);

      router
        .route('/api/feedback/update/:id')
        .post(auth.isAuthenticated(), FeedbackController.updateFeedback);

      router
        .route('/api/feedback/get_publish/:id')
        .get(auth.isAuthenticated(), FeedbackController.getAllPublish);

      router
        .route('/api/feedback/get_unpublish/:id')
        .get(auth.isAuthenticated(), FeedbackController.getAllUnPublish);

      router
        .route('/api/feedback/reply/:id')
        .post(auth.isAuthenticated(), FeedbackController.replyFeedback);

      router
        .route('/api/feedback/publish/:id')
        .post(auth.isAuthenticated(), FeedbackController.publishFeedback);

      router
        .route('/api/feedback/archieve/:id')
        .post(auth.isAuthenticated(), FeedbackController.archieveFeedback);

    }
}
