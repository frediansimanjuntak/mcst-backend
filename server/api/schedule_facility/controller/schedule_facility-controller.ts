import * as express from 'express';
import FacilityDAO from '../../facility/dao/facility-dao';

export class ScheduleController {

  static getSchedule(req: express.Request, res: express.Response):void {
      let _id = req.params.idfacility;
      FacilityDAO
        ['getSchedule'](_id)
        .then(schedules => res.status(200).json(schedules))
        .catch(error => res.status(400).json(error));
  }  
  static getByIdSchedule(req: express.Request, res: express.Response):void {
      let _id = req.params.idfacility;
      let _idschedule = req.params.idschedule;
      FacilityDAO
        ['getByIdSchedule'](_id, _idschedule)
        .then(schedules => res.status(200).json(schedules))
        .catch(error => res.status(400).json(error));
  }

  static createSchedule(req: express.Request, res: express.Response):void {
      let _id = req.params.idfacility;
      let _schedule = req.body;

      FacilityDAO
        ['createSchedule'](_id, _schedule)
        .then(schedule => res.status(201).json(schedule))
        .catch(error => res.status(400).json(error));
  }

  static deleteSchedule(req: express.Request, res: express.Response):void {
      let _id = req.params.idfacility;
      let _idschedule = req.params.idschedule;

      FacilityDAO
        ['deleteSchedule'](_id, _idschedule)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateSchedule(req: express.Request, res: express.Response):void {
      let _id = req.params.idfacility;
      let _idschedule = req.params.idschedule;
      let _schedule= req.body;

      FacilityDAO
        ['updateSchedule'](_id, _idschedule, _schedule)
        .then(schedule => res.status(201).json(schedule))
        .catch(error => res.status(400).json(error));
  }
}
