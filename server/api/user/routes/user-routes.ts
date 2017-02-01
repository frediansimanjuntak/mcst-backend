"use strict";

import * as express from 'express';
import {UserController} from '../controller/user-controller';
import * as auth from '../../../auth/auth-service';

export class UserRoutes {
    static init(router: express.Router) {
      router
        .route('/api/users')
        .get(auth.isAuthenticated(), UserController.getAll)
        .post(auth.isAuthenticated(), UserController.createUser);

      router
        .route('/api/users/:id')
        .get(auth.isAuthenticated(), UserController.getById)
        .delete(auth.isAuthenticated(), UserController.deleteUser);

      router
        .route('/api/users/update/:id')
        .post(auth.isAuthenticated(), UserController.updateUser);

      router
        .route('/')
        .get(auth.hasRole('admin'), UserController.index);

      router
        .route('/me')
        .get(auth.isAuthenticated(), UserController.me);

      router
        .route('/api/users/super_admin')
        .post(auth.isAuthenticated(), auth.hasRole('master'), UserController.createUserSuperAdmin);
    }
}
