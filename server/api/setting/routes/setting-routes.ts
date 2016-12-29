"use strict";

import * as express from 'express';
import {SettingController} from '../controller/setting-controller';

export class SettingRoutes {
    static init(router: express.Router) {
      router
        .route('/api/setting/user/:id')
        .get(SettingController.getDetailUser)
        .post(SettingController.settingDetailUser);
    }
}
