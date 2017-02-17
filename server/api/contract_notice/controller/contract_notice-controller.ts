import * as express from 'express';
import ContractDAO from '../../contract/dao/contract-dao';

export class ContractNoticeController {
  static getAllContractNotice(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      ContractDAO
        ['getAllContractNotice'](_id)
        .then(contractnotices => res.status(200).json(contractnotices))
        .catch(error => res.status(400).json(error));
  }

  static getByIdContractNotice(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _idcontractnotice = req.params.idcontractnotice;

      ContractDAO
        ['getByIdContractNotice'](_id, _idcontractnotice)
        .then(contractnotices => res.status(200).json(contractnotices))
        .catch(error => res.status(400).json(error));
  }

  static createContractNotice(req: express.Request, res: express.Response):void {
    console.log(req["files"])
      let _id = req.params.id;
      let _contractnotice = req.body;
      let _attachment = req["files"].attachment;
      let _userId = req["user"]._id;

      ContractDAO
        ['createContractNotice'](_id, _userId, _contractnotice, _attachment)
        .then(contract => res.status(201).json(contract))
        .catch(error => res.status(400).json(error));
  }

  static deleteContractNotice(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _idcontractnotice = req.params.idcontractnotice;

      ContractDAO
        ['deleteContractNotice'](_id, _idcontractnotice)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateContractNotice(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _idcontractnotice = req.params.idcontractnotice;
      let _contractnotice = req.body;    
      let _attachment = req["files"].attachment;
      let _userId = req["user"]._id;

      ContractDAO
        ['updateContractNotice'](_id, _idcontractnotice, _userId, _contractnotice, _attachment)
        .then(contract => res.status(201).json(contract))
        .catch(error => res.status(400).json(error));
  }

  static publishContractNotice(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _idcontractnotice = req.params.idcontractnotice;

      ContractDAO
        ['publishContractNotice'](_id, _idcontractnotice)
        .then(contractnotices => res.status(200).json(contractnotices))
        .catch(error => res.status(400).json(error));
  }

}
