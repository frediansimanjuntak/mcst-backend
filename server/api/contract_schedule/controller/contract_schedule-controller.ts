import * as express from 'express';
import ContractDAO from '../../contract/dao/contract-dao';

export class ContractScheduleController {
  static getAllContractSchedule(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      ContractDAO
        ['getAllContractSchedule'](_id)
        .then(contractschedules => res.status(200).json(contractschedules))
        .catch(error => res.status(400).json(error));
  }

  static getByIdContractSchedule(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _idcontractschedule = req.params.idcontractschedule;

      ContractDAO
        ['getByIdContractSchedule'](_id, _idcontractschedule)
        .then(contractschedules => res.status(200).json(contractschedules))
        .catch(error => res.status(400).json(error));
  }

  static createContractSchedule(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _contractschedule = req.body;

      ContractDAO
        ['createContractSchedule'](_id, _contractschedule)
        .then(contractschedule => res.status(201).json(contractschedule))
        .catch(error => res.status(400).json(error));
  }

  static deleteContractSchedule(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _idcontractschedule = req.params.idcontractschedule;

    ContractDAO
      ['deleteContractSchedule'](_id, _idcontractschedule)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateContractSchedule(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _idcontractschedule = req.params.idcontractschedule;
    let _contractnotice = req.body;   

    ContractDAO
      ['updateContractSchedule'](_id, _idcontractschedule, _contractnotice)
      .then(contract => res.status(201).json(contract))
      .catch(error => res.status(400).json(error));
  }
}
