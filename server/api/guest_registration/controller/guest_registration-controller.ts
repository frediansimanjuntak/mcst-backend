import * as express from 'express';
import GuestDAO from '../dao/guest_registration-dao';

export class GuestController {
  static getAll(req: express.Request, res: express.Response):void {
      GuestDAO
        ['getAll']()
        .then(guests => res.status(200).json(guests))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      GuestDAO
        ['getById'](_id)
        .then(guests => res.status(200).json(guests))
        .catch(error => res.status(400).json(error));
  }

  static createGuest(req: express.Request, res: express.Response):void {
      let _guest = req.body;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;

      GuestDAO
        ['createGuest'](_guest, _userId, _developmentId)
        .then(guest => res.status(201).json(guest))
        .catch(error => res.status(400).json(error));
  }

  static deleteGuest(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      GuestDAO
        ['deleteGuest'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateGuest(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _guest = req.body;

      GuestDAO
        ['updateGuest'](_id, _guest)
        .then(guest => res.status(201).json(guest))
        .catch(error => res.status(400).json(error));
  }

  static checkInGuest(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _userId = req["user"]._id;

      GuestDAO
        ['checkInGuest'](_id, _userId)
        .then(guest => res.status(201).json(guest))
        .catch(error => res.status(400).json(error));
  }  

  static checkOutGuest(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _userId = req["user"]._id;

      GuestDAO
        ['checkOutGuest'](_id, _userId)
        .then(guest => res.status(201).json(guest))
        .catch(error => res.status(400).json(error));
  }
}
