import * as express from 'express';
import LostfoundDAO from '../dao/lost_found-dao';

export class LostfoundController {
  static getAll(req: express.Request, res: express.Response):void {
      LostfoundDAO
        ['getAll']()
        .then(lostfounds => res.status(200).json(lostfounds))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      LostfoundDAO
        ['getById'](_id)
        .then(lostfounds => res.status(200).json(lostfounds))
        .catch(error => res.status(400).json(error));
  }

  static createLostfound(req: express.Request, res: express.Response):void {
      let _lostfound = req.body;
      let _attachment = req["files"].photo;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;      

      LostfoundDAO
        ['createLostfound'](_lostfound, _userId, _developmentId, _attachment)
        .then(lostfound => res.status(201).json(lostfound))
        .catch(error => res.status(400).json(error));
  }

  static deleteLostfound(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    LostfoundDAO
      ['deleteLostfound'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateLostfound(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _lostfound = req.body;
    let _attachment = req["files"].attachment;
    let _userId = req["user"]._id;

    LostfoundDAO
      ['updateLostfound'](_id, _userId, _lostfound, _attachment)
      .then(lostfound => res.status(201).json(lostfound))
      .catch(error => res.status(400).json(error));
  } 

  static archieveLostfound(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    LostfoundDAO
      ['archieveLostfound'](_id)
      .then(lostfound => res.status(201).json(lostfound))
      .catch(error => res.status(400).json(error));
  }
}
