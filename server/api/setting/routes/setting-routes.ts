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

      router
        .route('/setting/account')
        .post(auth.isAuthenticated(), SettingController.settingAccount);

      router
        .route('/setting/social_user')
        .get(auth.isAuthenticated(), SettingController.getOwnSocialProfile)
        .post(auth.isAuthenticated(), SettingController.settingsocialProfile);

      router
        .route('/setting/social_user/all')
        .get(auth.isAuthenticated(), SettingController.getAllSocialProfile)
    }


}
