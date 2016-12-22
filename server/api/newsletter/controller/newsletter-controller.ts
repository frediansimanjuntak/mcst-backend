import * as express from 'express';
import NewsletterDAO from '../dao/newsletter-dao';
import DevelopmentDAO from '../../development/dao/development-dao';


export class NewsletterController {
  static getAll(req: express.Request, res: express.Response):void {
      NewsletterDAO
        ['getAll']()
        .then(newsletters => res.status(200).json(newsletters))
        .catch(error => res.status(400).json(error));
  }

  static getByIdNewsletter(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _idnewsletter = req.params.idnewsletter;
      DevelopmentDAO
        ['getByIdNewsletter'](_id, _idnewsletter)
        .then(newsletters => res.status(200).json(newsletters))
        .catch(error => res.status(400).json(error));
  }

  static getNewsletter(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      DevelopmentDAO
        ['getNewsletter'](_id)
        .then(newsletters => res.status(200).json(newsletters))
        .catch(error => res.status(400).json(error));
  }


  static updateGetById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      NewsletterDAO
        ['updateGetById'](_id)
        .then(newsletters => res.status(200).json(newsletters))
        .catch(error => res.status(400).json(error));
  }

  static createNewsletter(req: express.Request, res: express.Response):void {
      let _newsletter= req.body;
      let _id = req.params.id;

      DevelopmentDAO         
        ['createNewsletter'](_id,_newsletter)
        .then(newsletter => res.status(201).json(newsletter))
        .catch(error => res.status(400).json(error));   }

  static deleteNewsletter(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _idnewsletter = req.params.idnewsletter;

    DevelopmentDAO
      ['deleteNewsletter'](_id, _idnewsletter)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateNewsletter(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _title = req.body.title;
    let _description = req.body.description;
    let _type = req.body.type;
    let _attachment = req.body.attachment;
    let _released = req.body.released;
    let _pinned = req.body.pinned;
    let _released_by = req.body.released_by;
    let _release_at = req.body.release_at;

    DevelopmentDAO
      ['updateNewsletter'](_id, _title, _description, _type, _attachment, _released, _pinned, _released_by, )
      .then(title => res.status(201).json(title))
      .catch(error => res.status(400).json(error));
  }
}
