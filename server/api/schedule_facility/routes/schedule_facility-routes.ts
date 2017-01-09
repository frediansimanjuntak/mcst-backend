"use strict";

import * as express from 'express';
import {ScheduleController} from '../controller/schedule_facility-controller';
import * as auth from '../../../auth/auth-service';

export class ScheduleRoutes {
    static init(router: express.Router) {
      router
        .route('/api/schedule_facilities/:idfacility')
        .get(auth.isAuthenticated(), ScheduleController.getSchedule)
        .post(auth.isAuthenticated(), ScheduleController.createSchedule);

      router
        .route('/api/schedule_facilities/:idfacility/:idschedule')
        .get(auth.isAuthenticated(), ScheduleController.getByIdSchedule)
        .delete(auth.isAuthenticated(), ScheduleController.deleteSchedule);

      router
        .route('/api/schedule_facilities/:idfacility/update/:idschedule')
        .post(auth.isAuthenticated(), ScheduleController.updateSchedule);
    }
}
