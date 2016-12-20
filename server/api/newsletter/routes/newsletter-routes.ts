"use strict";

import * as express from 'express';
import {NewsletterController} from '../controller/newsletter-controller';

export class NewsletterRoutes {
    static init(router: express.Router) {
      router
        .route('/api/newsletters')
        .get(NewsletterController.getAll)
        .post(NewsletterController.createNewsletter);

      router
        .route('/api/newsletters/:id')
        .delete(NewsletterController.deleteNewsletter);

      router
        .route('/api/newsletters/update/:id')
        .post(NewsletterController.updateNewsletter);
    }
}
