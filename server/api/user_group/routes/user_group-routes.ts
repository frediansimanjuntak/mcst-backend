"use strict";

import * as express from 'express';
import {UserGroupController} from '../controller/user_group-controller';

export class UserGroupRoutes {
    static init(router: express.Router) {
      router
        .route('/api/usergroups')
        .get(UserGroupController.getAll)
        .post(UserGroupController.createUserGroup);

      router
        .route('/api/usergroups/:id')
        .delete(UserGroupController.deleteUserGroup);

      router
        .route('/api/usergroups/update/:id')
        .post(UserGroupController.updateUserGroup);
    }
}
