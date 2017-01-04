"use strict";

import * as express from 'express';
import {ScheduleController} from '../controller/schedule_facility-controller';

export class ScheduleRoutes {
    static init(router: express.Router) {
      router
        .route('/api/schedule_facilities/:idfacility')
        .get(ScheduleController.getSchedule)
        .post(ScheduleController.createSchedule);

      router
        .route('/api/schedule_facilities/:idfacility/:idschedule')
        .get(ScheduleController.getByIdSchedule)
        .delete(ScheduleController.deleteSchedule);

      router
        .route('/api/schedule_facilities/:idfacility/update/:idschedule')
        .post(ScheduleController.updateSchedule);
    }
}
