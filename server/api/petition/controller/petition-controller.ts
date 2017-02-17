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
      let _attachment = req["files"].attachment;
      let _userId = req["user"]._id;
      let _developmentId= req["user"].default_development;

      PetitionDAO
        ['createPetition'](_petition, _userId, _developmentId, _attachment)
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
      let _attachment = req["files"].attachment;
      let _userId= req["user"]._id;

      PetitionDAO
        ['updatePetition'](_id, _userId, _petition, _attachment)
        .then(_petition => res.status(201).json(_petition))
        .catch(error => res.status(400).json(error));
  }

  static archieve(req: express.Request, res: express.Response):void {
      let _arrayId = req.body;

      PetitionDAO
        ['archieve']( _arrayId)
        .then(_userid => res.status(201).json(_userid))
        .catch(error => res.status(400).json(error));
  }

  static unarchieve(req: express.Request, res: express.Response):void {    
      let _arrayId = req.body;

      PetitionDAO
        ['unarchieve'](_arrayId)
        .then(_userid => res.status(201).json(_userid))
        .catch(error => res.status(400).json(error));
  }
}
