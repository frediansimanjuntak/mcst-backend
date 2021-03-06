import * as express from 'express';
import FacilityDAO from '../dao/facility-dao';

export class FacilityController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      FacilityDAO
        ['getAll'](_developmentId)
        .then(facilities => res.status(200).json(facilities))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      FacilityDAO
        ['getById'](_id)
        .then(facilities => res.status(200).json(facilities))
        .catch(error => res.status(400).json(error));
  }

  static getByName(req: express.Request, res: express.Response):void {
      let _name = req.params.name;

      FacilityDAO
        ['getByName'](_name)
        .then(facilities => res.status(200).json(facilities))
        .catch(error => res.status(400).json(error));
  }

  static createFacility(req: express.Request, res: express.Response):void {
      let _facility = req.body;
      let _userId= req["user"]._id;
      let _developmentId= req["user"].default_development;

      FacilityDAO
        ['createFacility'](_facility, _userId, _developmentId)
        .then(facility => res.status(201).json(facility))
        .catch(error => res.status(400).json(error));
  }

  static deleteFacility(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      FacilityDAO
        ['deleteFacility'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateFacility(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _facility = req.body;

      FacilityDAO
        ['updateFacility'](_id, _facility)
        .then(facility => res.status(201).json(facility))
        .catch(error => res.status(400).json(error));
  }
  
}
