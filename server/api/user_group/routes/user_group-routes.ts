"use strict";

import * as express from 'express';
import {UserGroupController} from '../controller/user_group-controller';
import * as auth from '../../../auth/auth-service';

export class UserGroupRoutes {
    static init(router: express.Router) {
      router
        .route('/api/usergroups')
        .get(auth.isAuthenticated(), UserGroupController.getAll)
        .post(auth.isAuthenticated(), UserGroupController.createUserGroup);

      router
        .route('/api/usergroups/:id')
        .delete(auth.isAuthenticated(), UserGroupController.deleteUserGroup);

      router
        .route('/api/usergroups/update/:id')
        .post(auth.isAuthenticated(), UserGroupController.updateUserGroup);
    }
}
