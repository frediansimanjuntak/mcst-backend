import * as express from 'express';
import PetitionDAO from '../dao/petition-dao';

export class PetitionController {
  static getAll(req: express.Request, res: express.Response):void {
      PetitionDAO
        ['getAll']()
        .then(petitions => res.status(200).json(petitions))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PetitionDAO
        ['getById'](_id)
        .then(petitions => res.status(200).json(petitions))
        .catch(error => res.status(400).json(error));
  }

  static createPetition(req: express.Request, res: express.Response):void {
      let _petition = req.body;

      PetitionDAO
        ['createPetition'](_petition)
        .then(petition => res.status(201).json(petition))
        .catch(error => res.status(400).json(error));
  }

  static deletePetition(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    PetitionDAO
      ['deletePetition'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updatePetition(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _petition = req.body;

    PetitionDAO
      ['updatePetition'](_id, _petition)
      .then(_petition => res.status(201).json(_petition))
      .catch(error => res.status(400).json(error));
  }
}
