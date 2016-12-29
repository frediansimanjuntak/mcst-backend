"use strict";

import * as express from 'express';
import {AccessControlController} from '../controller/access_control-controller';

export class AccessControlRoutes {
    static init(router: express.Router) {
      router
        .route('/api/accesscontrols')
        .get(AccessControlController.getAll)
        .post(AccessControlController.createAccessControl);

      router
        .route('/api/accesscontrols/:id')
        .get(AccessControlController.getById)
        .delete(AccessControlController.deleteAccessControl);

      router
        .route('/api/accesscontrols/update/:id')
        .post(AccessControlController.updateAccessControl);
    }
}
