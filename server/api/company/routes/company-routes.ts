"use strict";

import * as express from 'express';
import {CompanyController} from '../controller/company-controller';
import * as auth from '../../../auth/auth-service';

export class CompanyRoutes {
    static init(router: express.Router) {
      router
        .route('/company')
        .get(auth.isAuthenticated(), CompanyController.getAll)
        .post(auth.isAuthenticated(), CompanyController.createCompany);

      router
        .route('/company/name')
        .get(auth.isAuthenticated(), CompanyController.getAllNameCompany);

      router
        .route('/company/:id')
        .get(auth.isAuthenticated(), CompanyController.getById)
        .delete(auth.isAuthenticated(), CompanyController.deleteCompany);

      router
        .route('/company/update/:id')
        .post(auth.isAuthenticated(), CompanyController.updateCompany);

      router
        .route('/company/activation/:id')
        .post(auth.isAuthenticated(), CompanyController.activationCompany);

      router
        .route('/company/employee/:id')
        .post(auth.isAuthenticated(), CompanyController.addEmployeeCompany)
        .delete(auth.isAuthenticated(), CompanyController.removeEmployeeCompany);
    }
}
