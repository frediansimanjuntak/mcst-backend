"use strict";

import * as express from 'express';
import {UserGroupController} from '../controller/user_group-controller';
import * as auth from '../../../auth/auth-service';

export class UserGroupRoutes {
    static init(router: express.Router) {
      router
        .route('/user_groups')
        .get(auth.isAuthenticated(), UserGroupController.getAll)
        .post(auth.isAuthenticated(), UserGroupController.createUserGroup);

      router
        .route('/user_groups/:id')
        .get(auth.isAuthenticated(), UserGroupController.getById)
        .delete(auth.isAuthenticated(), UserGroupController.deleteUserGroup);

      router
        .route('/user_groups/update/:id')
        .post(auth.isAuthenticated(), UserGroupController.updateUserGroup);

      router
        .route('/user_groups/users/:id')
        .post(auth.isAuthenticated(), UserGroupController.addUser)
        .put(auth.isAuthenticated(), UserGroupController.deleteUser);
    }
}
