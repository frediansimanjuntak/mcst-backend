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
      let _userId = req.user._id;
      let _developmentId= req.user.default_development;

      AnnouncementDAO
        ['createAnnouncement'](_annoncement, _userId, _developmentId)
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
    let _sticky = req.body.sticky;
    let _valid_till = req.body.valid_till;
    let _userId = req.user._id;

    AnnouncementDAO
      ['publishAnnouncement'](_id, _userId, _sticky, _valid_till)
      .then(_annoncement => res.status(201).json(_annoncement))
      .catch(error => res.status(400).json(error));
  }
}
