import * as express from 'express';
import AttachmentDAO from '../dao/attachment-dao';

export class AttachmentController {
  static getAll(req: express.Request, res: express.Response):void {
      AttachmentDAO
        ['getAll']()
        .then(developments => res.status(200).json(developments))
        .catch(error => res.status(400).json(error));
  }

  static createAttachment(req: express.Request, res: express.Response):void {
      let _attachment = req.body;
      // _attachment.created_by = req.user._id;
      _attachment.files = req['files']['files'];

      AttachmentDAO
        ['createAttachment'](_attachment)
        .then(development => res.status(201).json(development))
        .catch(error => res.status(400).json(error));
  }

  static deleteAttachment(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    AttachmentDAO
      ['deleteAttachment'](_id)
      .then((msg) => res.status(200).json(msg))
      .catch(error => res.status(400).json(error));
  }

  static updateAttachment(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _attachment = req.body;

    AttachmentDAO
      ['updateAttachment'](_id, _attachment)
      .then(development => res.status(201).json(development))
      .catch(error => res.status(400).json(error));
  }
}
