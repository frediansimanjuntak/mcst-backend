import * as express from 'express';
import ContractDAO from '../dao/contract-dao';

export class ContractController {
  static getAll(req: express.Request, res: express.Response):void {
      ContractDAO
        ['getAll']()
        .then(contracts => res.status(200).json(contracts))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      ContractDAO
        ['getById'](_id)
        .then(contracts => res.status(200).json(contracts))
        .catch(error => res.status(400).json(error));
  }

  static createContract(req: express.Request, res: express.Response):void {
      let _contract = req.body;
      let _attachment = req.files.attachment;
      let _userId = req.user._id;
      let _developmentId = req.user._id;

      ContractDAO
        ['createContract'](_contract, _userId, _developmentId, _attachment)
        .then(contract => res.status(201).json(contract))
        .catch(error => res.status(400).json(error));
  }

  static deleteContract(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    ContractDAO
      ['deleteContract'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateContract(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _contract = req.body;
    let _attachment = req.files.attachment;
    let _userId = req.user._id;

    ContractDAO
      ['updateContract'](_id, _userId, _contract, _attachment)
      .then(contract => res.status(201).json(contract))
      .catch(error => res.status(400).json(error));
  }

}
