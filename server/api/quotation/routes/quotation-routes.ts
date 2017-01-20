"use strict";

import * as express from 'express';
import {QuotationController} from '../controller/quotation-controller';
import * as auth from '../../../auth/auth-service';

export class QuotationRoutes {
    static init(router: express.Router) {
      router
        .route('/api/quotations')
        .get(auth.isAuthenticated(), QuotationController.getAll)
        .post(auth.isAuthenticated(), QuotationController.createQuotation);

      router
        .route('/api/quotations/:id')
        .get(auth.isAuthenticated(), QuotationController.getById)
        .delete(auth.isAuthenticated(), QuotationController.deleteQuotation);

      router
        .route('/api/quotations/update/:id')
        .post(auth.isAuthenticated(), QuotationController.updateQuotation);      
    }
}
