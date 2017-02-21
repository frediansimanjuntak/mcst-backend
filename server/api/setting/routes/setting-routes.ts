"use strict";

import * as express from 'express';
import {SettingController} from '../controller/setting-controller';
import * as auth from '../../../auth/auth-service';

export class SettingRoutes {
    static init(router: express.Router) {
      router
        .route('/setting/user/:id')
        .get(auth.isAuthenticated(), SettingController.getDetailUser)
        .post(auth.isAuthenticated(), SettingController.settingDetailUser);
    }
}
