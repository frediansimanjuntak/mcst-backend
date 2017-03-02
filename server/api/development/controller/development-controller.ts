import * as express from 'express';
import DevelopmentDAO from '../dao/development-dao';

export class DevelopmentController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      DevelopmentDAO
        ['getAll'](_developmentId)
        .then(developments => res.status(200).json(developments))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      DevelopmentDAO
        ['getById'](_id)
        .then(developments => res.status(200).json(developments))
        .catch(error => res.status(400).json(error));
  }

  static createDevelopment(req: express.Request, res: express.Response):void {
      let _development = req.body;

      DevelopmentDAO
        ['createDevelopment'](_development)
        .then(development => res.status(201).json(development))
        .catch(error => res.status(400).json(error));
  }
  

  static deleteDevelopment(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      DevelopmentDAO
        ['deleteDevelopment'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateDevelopment(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _development = req.body;

      DevelopmentDAO
        ['updateDevelopment'](_id, _development)
        .then(development => res.status(201).json(development))
        .catch(error => res.status(400).json(error));
  }  

  static createStaffDevelopment(req: express.Request, res: express.Response):void {
      let _staff = req.body.staff;
      let _namedevelopment = req.params.namedevelopment;

      DevelopmentDAO
        ['createStaffDevelopment'](_staff, _namedevelopment)
        .then(development => res.status(201).json(development))
        .catch(error => res.status(400).json(error));
  }

  static deleteStaffDevelopment(req: express.Request, res: express.Response):void {
      let _staff = req.body.staff;
      let _namedevelopment = req.params.namedevelopment;

      DevelopmentDAO
        ['deleteStaffDevelopment'](_staff, _namedevelopment)
        .then(development => res.status(201).json(development))
        .catch(error => res.status(400).json(error));
  }
}
