import * as express from 'express';
import NotificationDAO from '../dao/notification-dao';

export class NotificationController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      NotificationDAO
        ['getAll'](_developmentId)
        .then(notifications => res.status(200).json(notifications))
        .catch(error => res.status(400).json(error));
  }

  static getOwnNotification(req: express.Request, res: express.Response):void {
      let _userId = req.params.userId;

      NotificationDAO
        ['getOwnNotification'](_userId)
        .then(notifications => res.status(200).json(notifications))
        .catch(error => res.status(400).json(error));
  }

  static getOwnUnreadNotification(req: express.Request, res: express.Response):void {
      let _userId = req.params.userId;

      NotificationDAO
        ['getOwnUnreadNotification'](_userId)
        .then(notifications => res.status(200).json(notifications))
        .catch(error => res.status(400).json(error));
  }

  static createNotification(req: express.Request, res: express.Response):void {
      let _notification = req.body;
      let _idUser = req["user"]._id;
      
      NotificationDAO
        ['createNotification'](_idUser, _notification)
        .then(notification => res.status(201).json(notification))
        .catch(error => res.status(400).json(error));
  }

  static deleteNotification(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    NotificationDAO
      ['deleteNotification'](_id)
      .then((msg) => res.status(200).json(msg))
      .catch(error => res.status(400).json(error));
  }

  static readNotification(req: express.Request, res: express.Response):void {
    let _userId = req.params.userId;
    let _arrayId = req.body._ids;

    NotificationDAO
      ['readNotification'](_userId, _arrayId)
      .then(message => res.status(201).json(message))
      .catch(error => res.status(400).json(error));
  }

  static updateNotification(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _notification = req.body;

    NotificationDAO
      ['updateNotification'](_id, _notification)
      .then(notification => res.status(201).json(notification))
      .catch(error => res.status(400).json(error));
  }
}
