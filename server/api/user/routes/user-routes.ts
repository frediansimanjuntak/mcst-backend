"use strict";

import * as express from 'express';
import {UserController} from '../controller/user-controller';
import * as auth from '../../../auth/auth-service';

export class UserRoutes {
    static init(router: express.Router) {
      router
        .route('/users')
        .get(auth.isAuthenticated(), UserController.getAll)
        .post(auth.isAuthenticated(), UserController.createUser);

      router
        .route('/users/:id')
        .get(auth.isAuthenticated(), UserController.getById)
        .put(auth.isAuthenticated(), UserController.deleteUser);

      router
        .route('/users/update/:id')
        .post(auth.isAuthenticated(), UserController.updateUser);

      router
        .route('/users/active/:id')
        .post(auth.isAuthenticated(), UserController.activationUser);

      router
        .route('/users/unactive/:id')
        .post(auth.isAuthenticated(), UserController.unActiveUser);

      router
        .route('/')
        .get(auth.hasRole('admin'), UserController.index);

      router
        .route('/me')
        .get(auth.isAuthenticated(), UserController.me);

      router
        .route('/users/super_admin')
        .post(auth.isAuthenticated(), auth.hasRole('master'), UserController.createUserSuperAdmin);
    }
}
