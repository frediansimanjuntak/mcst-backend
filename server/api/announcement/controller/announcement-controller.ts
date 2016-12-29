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
      let _annoncement = req.body;

      AnnouncementDAO
        ['createAnnouncement'](_annoncement)
        .then(annoncement => res.status(201).json(annoncement))
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
    let _annoncement = req.body;

    AnnouncementDAO
      ['updateAnnouncement'](_id, _annoncement)
      .then(_annoncement => res.status(201).json(_annoncement))
      .catch(error => res.status(400).json(error));
  }

  static publishAnnouncement(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _annoncement = req.body;

    AnnouncementDAO
      ['publishAnnouncement'](_id, _annoncement)
      .then(_annoncement => res.status(201).json(_annoncement))
      .catch(error => res.status(400).json(error));
  }
}
