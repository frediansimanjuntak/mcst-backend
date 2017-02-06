"use strict";

import * as express from 'express';
import {UserGroupController} from '../controller/user_group-controller';
import * as auth from '../../../auth/auth-service';

export class UserGroupRoutes {
    static init(router: express.Router) {
      router
        .route('/api/user_groups')
        .get(auth.isAuthenticated(), UserGroupController.getAll)
        .post(auth.isAuthenticated(), UserGroupController.createUserGroup);

      router
        .route('/api/user_groups/:id')
        .delete(auth.isAuthenticated(), UserGroupController.deleteUserGroup);

      router
        .route('/api/user_groups/update/:id')
        .post(auth.isAuthenticated(), UserGroupController.updateUserGroup);

      router
        .route('/api/user_groups/users/:id')
        .post(auth.isAuthenticated(), UserGroupController.addUser)
        .delete(auth.isAuthenticated(), UserGroupController.deleteUser);
    }
}
