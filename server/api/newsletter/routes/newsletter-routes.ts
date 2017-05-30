"use strict";

import * as express from 'express';
import {NewsletterController} from '../controller/newsletter-controller';
import * as auth from '../../../auth/auth-service';

export class NewsletterRoutes {
    static init(router: express.Router) {
      router
        .route('/newsletters/:name_url') 
        .get(auth.isAuthenticated(), NewsletterController.getNewsletter)       
        .post(auth.isAuthenticated(), NewsletterController.createNewsletter);

      router
        .route('/newsletters/:name_url/:idnewsletter')
        .get(auth.isAuthenticated(), NewsletterController.getByIdNewsletter)
        .delete(auth.isAuthenticated(), NewsletterController.deleteNewsletter);

      router
        .route('/newsletters/:name_url/update/:idnewsletter')
        .post(auth.isAuthenticated(), NewsletterController.updateNewsletter);

      router
        .route('/newsletters/:name_url/release/:idnewsletter')
        .post(auth.isAuthenticated(), NewsletterController.releaseNewsletter);      
    }
}
