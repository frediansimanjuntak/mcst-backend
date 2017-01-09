"use strict";

import * as express from 'express';
import {NewsletterController} from '../controller/newsletter-controller';
import * as auth from '../../../auth/auth-service';

export class NewsletterRoutes {
    static init(router: express.Router) {
      // router
      //   .route('/api/newsletters')
      //   .get(NewsletterController.getAll);

      router
        .route('/api/newsletters/:id') 
        .get(auth.isAuthenticated(), NewsletterController.getNewsletter)       
        .post(auth.isAuthenticated(), NewsletterController.createNewsletter);

      router
        .route('/api/newsletters/:id/:idnewsletter')
        .get(auth.isAuthenticated(), NewsletterController.getByIdNewsletter)
        .delete(auth.isAuthenticated(), NewsletterController.deleteNewsletter);

      router
        .route('/api/newsletters/:id/update/:idnewsletter')
        .post(auth.isAuthenticated(), NewsletterController.updateNewsletter);

      // router
      //   .route('/api/newsletters/update/:id')
      //   .get(NewsletterController.updateGetById);
    }
}
