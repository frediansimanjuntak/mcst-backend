import * as express from 'express';
import AnnouncementDAO from '../dao/announcement-dao';

export class AnnouncementController {
  static getAll(req: express.Request, res: express.Response):void {
      AnnouncementDAO
        ['getAll']()
        .then(annoncements => res.status(200).json(annoncements))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      AnnouncementDAO
        ['getById'](_id)
        .then(annoncements => res.status(200).json(annoncements))
        .catch(error => res.status(400).json(error));
  }

  static createAnnouncement(req: express.Request, res: express.Response):void {
      let _announcement = req.body;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;

      AnnouncementDAO
        ['createAnnouncement'](_announcement, _userId, _developmentId)
        .then(announcement => res.status(201).json(announcement))
        .catch(error => res.status(400).json(error));
  }

  static deleteAnnouncement(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      AnnouncementDAO
        ['deleteAnnouncement'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateAnnouncement(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _announcement = req.body;

      AnnouncementDAO
        ['updateAnnouncement'](_id, _announcement)
        .then(announcement => res.status(201).json(announcement))
        .catch(error => res.status(400).json(error));
  }

  static publishAnnouncement(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _announcement = req.body;
      let _userId = req["user"]._id;

      AnnouncementDAO
        ['publishAnnouncement'](_id, _userId, _announcement)
        .then(_annoncement => res.status(201).json(_annoncement))
        .catch(error => res.status(400).json(error));
  }
}
