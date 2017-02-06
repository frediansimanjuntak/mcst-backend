import * as express from 'express';
import ContractorDAO from '../dao/contractor-dao';

export class ContractorController {
  static getAll(req: express.Request, res: express.Response):void {
      ContractorDAO
        ['getAll']()
        .then(contractors => res.status(200).json(contractors))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      ContractorDAO
        ['getById'](_id)
        .then(contractors => res.status(200).json(contractors))
        .catch(error => res.status(400).json(error));
  }

  static createContractor(req: express.Request, res: express.Response):void {
      let _contractor = req.body;
      let _userId = req["user"]._id;

      ContractorDAO
        ['createContractor'](_contractor, _userId)
        .then(contractor => res.status(201).json(contractor))
        .catch(error => res.status(400).json(error));
  }

  static deleteContractor(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    ContractorDAO
      ['deleteContractor'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateContractor(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _userId = req["user"]._id;
    let _contractor = req.body;
    let _attachment= req["files"].attachment;

    ContractorDAO
      ['updateContractor'](_id, _userId, _contractor, _attachment)
      .then(contractor => res.status(201).json(contractor))
      .catch(error => res.status(400).json(error));
  }

  static activationContractor(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _active = req.body.active;

    ContractorDAO
      ['activationContractor'](_id, _active)
      .then(contractor => res.status(201).json(contractor))
      .catch(error => res.status(400).json(error));
  }
}
