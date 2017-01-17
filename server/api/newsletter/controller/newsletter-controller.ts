import * as express from 'express';
import DevelopmentDAO from '../../development/dao/development-dao';

export class NewsletterController {

  static getByIdNewsletter(req: express.Request, res: express.Response):void {
      let _namedevelopment = req.params.namedevelopment;
      let _idnewsletter = req.params.idnewsletter;
      DevelopmentDAO
        ['getByIdNewsletter'](_namedevelopment, _idnewsletter)
        .then(newsletters => res.status(200).json(newsletters))
        .catch(error => res.status(400).json(error));
  }

  static getNewsletter(req: express.Request, res: express.Response):void {
      let _namedevelopment = req.params.namedevelopment;
      DevelopmentDAO
        ['getNewsletter'](_namedevelopment)
        .then(newsletters => res.status(200).json(newsletters))
        .catch(error => res.status(400).json(error));
  }

  static releaseNewsletter(req: express.Request, res: express.Response):void {
      let _namedevelopment = req.params.namedevelopment;
      let _userId = req.user._id;
      let _idnewsletter = req.params.idnewsletter;

      DevelopmentDAO         
        ['releaseNewsletter'](_namedevelopment,_idnewsletter, _userId)
        .then(newsletter => res.status(201).json(newsletter))
        .catch(error => res.status(400).json(error));   
  }
  
  static createNewsletter(req: express.Request, res: express.Response):void {
      let _newsletter= req.body;
      _newsletter.files = req.files;
      let _namedevelopment = req.params.namedevelopment;
      let _userId = req.user._id;

      DevelopmentDAO         
        ['createNewsletter'](_namedevelopment,_newsletter, _userId)
        .then(newsletter => res.status(201).json(newsletter))
        .catch(error => res.status(400).json(error));   }

  static deleteNewsletter(req: express.Request, res: express.Response):void {
    let _namedevelopment = req.params.namedevelopment;
    let _idnewsletter = req.params.idnewsletter;

    DevelopmentDAO
      ['deleteNewsletter'](_namedevelopment, _idnewsletter)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateNewsletter(req: express.Request, res: express.Response):void {
    let _namedevelopment = req.params.namedevelopment;
    let _idnewsletter = req.params.idnewsletter;
    let _newsletter= req.body;

    DevelopmentDAO
      ['updateNewsletter'](_namedevelopment, _idnewsletter, _newsletter)
      .then(newsletter => res.status(201).json(newsletter))
      .catch(error => res.status(400).json(error));
  }
}
