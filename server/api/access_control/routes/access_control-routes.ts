"use strict";

import * as express from 'express';
import {AccessControlController} from '../controller/access_control-controller';
import * as auth from '../../../auth/auth-service';

export class AccessControlRoutes {
    static init(router: express.Router) {
      router
        .route('/access_controls')
        .get(auth.isAuthenticated(), AccessControlController.getAll)
        .post(auth.isAuthenticated(), AccessControlController.createAccessControl);

      router
        .route('/access_controls/:id')
        .get(auth.isAuthenticated(), AccessControlController.getById)
        .delete(auth.isAuthenticated(), AccessControlController.deleteAccessControl);

      router
        .route('/access_controls/update/:id')
        .post(auth.isAuthenticated(), AccessControlController.updateAccessControl);
    }
}
