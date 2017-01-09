"use strict";

import * as express from 'express';
import {CompanyController} from '../controller/company-controller';
import * as auth from '../../../auth/auth-service';

export class CompanyRoutes {
    static init(router: express.Router) {
      router
        .route('/api/company')
        .get(auth.isAuthenticated(), CompanyController.getAll)
        .post(auth.isAuthenticated(), CompanyController.createCompany);

      router
        .route('/api/company/:id')
        .get(auth.isAuthenticated(), CompanyController.getById)
        .delete(auth.isAuthenticated(), CompanyController.deleteCompany);

      router
        .route('/api/company/update/:id')
        .post(auth.isAuthenticated(), CompanyController.updateCompany);

      router
        .route('/api/company/activation/:id')
        .post(auth.isAuthenticated(), CompanyController.activationCompany);

      router
        .route('/api/company/employee/:id')
        .post(auth.isAuthenticated(), CompanyController.addEmployeeCompany)
        .delete(auth.isAuthenticated(), CompanyController.removeEmployeeCompany);
    }
}
