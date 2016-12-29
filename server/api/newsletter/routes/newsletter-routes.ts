"use strict";

import * as express from 'express';
import {NewsletterController} from '../controller/newsletter-controller';

export class NewsletterRoutes {
    static init(router: express.Router) {
      router
        .route('/api/newsletters')
        .get(NewsletterController.getAll);

      router
        .route('/api/newsletters/:id') 
        .get(NewsletterController.getNewsletter)       
        .post(NewsletterController.createNewsletter);

      router
        .route('/api/newsletters/:id/:idnewsletter')
        .get(NewsletterController.getByIdNewsletter)
        .delete(NewsletterController.deleteNewsletter);

      router
        .route('/api/newsletters/:id/update/:idnewsletter')
        .post(NewsletterController.updateNewsletter);

      router
        .route('/api/newsletters/update/:id')
        .get(NewsletterController.updateGetById);
    }
}
