import * as express from 'express';
import ContractDAO from '../../contract/dao/contract-dao';

export class ContractNoteController {
  static getAllContractNote(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      ContractDAO
        ['getAllContractNote'](_id)
        .then(contractnotes => res.status(200).json(contractnotes))
        .catch(error => res.status(400).json(error));
  }

  static getByIdContractNote(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _idcontractnote = req.params.idcontractnote;

      ContractDAO
        ['getByIdContractNote'](_id, _idcontractnote)
        .then(contractnotes => res.status(200).json(contractnotes))
        .catch(error => res.status(400).json(error));
  }

  static createContractNote(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _contractnote = req.body;
      let _attachment = req.files.attachment;
      let _userId = req.user._id;

      ContractDAO
        ['createContractNote'](_id, _userId, _contractnote, _attachment)
        .then(contract => res.status(201).json(contract))
        .catch(error => res.status(400).json(error));
  }

  static deleteContractNote(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _idcontractnote = req.params.idcontractnote;

    ContractDAO
      ['deleteContractNote'](_id, _idcontractnote)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateContractNote(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _idcontractnote = req.params.idcontractnote;
    let _contractnote = req.body;    
    let _attachment = req.files.attachment;
    let _userId = req.user._id;

    ContractDAO
      ['updateContractNote'](_id, _idcontractnote, _userId, _contractnote, _attachment)
      .then(contract => res.status(201).json(contract))
      .catch(error => res.status(400).json(error));
  }

}
