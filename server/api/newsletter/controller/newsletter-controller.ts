import * as express from 'express';
import NewsletterDAO from '../dao/newsletter-dao';

export class NewsletterController {
  static getAll(req: express.Request, res: express.Response):void {
      NewsletterDAO
        ['getAll']()
        .then(newsletters => res.status(200).json(newsletters))
        .catch(error => res.status(400).json(error));
  }

  static createNewsletter(req: express.Request, res: express.Response):void {
      let _newsletter = req.body;

      NewsletterDAO
        ['createNewsletter'](_newsletter)
        .then(newsletter => res.status(201).json(newsletter))
        .catch(error => res.status(400).json(error));
  }

  static deleteNewsletter(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    NewsletterDAO
      ['deleteNewsletter'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateNewsletter(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _newsletter = req.body;

    NewsletterDAO
      ['updateNewsletter'](_id, _newsletter)
      .then(newsletter => res.status(201).json(newsletter))
      .catch(error => res.status(400).json(error));
  }
}
