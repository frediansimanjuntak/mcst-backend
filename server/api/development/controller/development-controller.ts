import * as express from 'express';
import DevelopmentDAO from '../dao/development-dao';

export class DevelopmentController {
  static getAll(req: express.Request, res: express.Response):void {
      DevelopmentDAO
        ['getAll']()
        .then(developments => res.status(200).json(developments))
        .catch(error => res.status(400).json(error));
  }

   static getById(req: express.Request, res: express.Response):void {
     let _namedevelopment = req.params.namedevelopment;

      DevelopmentDAO
        ['getById'](_namedevelopment)
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

  static createStaffDevelopment(req: express.Request, res: express.Response):void {
      let _development = req.body;
      let _namedevelopment = req.params.namedevelopment;

      DevelopmentDAO
        ['createStaffDevelopment'](_development, _namedevelopment)
        .then(development => res.status(201).json(development))
        .catch(error => res.status(400).json(error));
  }

  static deleteStaffDevelopment(req: express.Request, res: express.Response):void {
      let _development = req.body;
      let _namedevelopment = req.params.namedevelopment;

      DevelopmentDAO
        ['deleteStaffDevelopment'](_development, _namedevelopment)
        .then(development => res.status(201).json(development))
        .catch(error => res.status(400).json(error));
  }

  static deleteDevelopment(req: express.Request, res: express.Response):void {
    let _namedevelopment = req.params.namedevelopment;

    DevelopmentDAO
      ['deleteDevelopment'](_namedevelopment)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateDevelopment(req: express.Request, res: express.Response):void {
    let _namedevelopment = req.params.namedevelopment;
    let _development = req.body;

    DevelopmentDAO
      ['updateDevelopment'](_namedevelopment, _development)
      .then(development => res.status(201).json(development))
      .catch(error => res.status(400).json(error));
  }
}
