import * as express from 'express';
// import NewsletterDAO from '../dao/newsletter-dao';
import DevelopmentDAO from '../../development/dao/development-dao';
import AttachmentDAO from '../../attachment/dao/attachment-dao';


export class NewsletterController {
  // static getAll(req: express.Request, res: express.Response):void {
  //     NewsletterDAO
  //       ['getAll']()
  //       .then(newsletters => res.status(200).json(newsletters))
  //       .catch(error => res.status(400).json(error));
  // }

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


  // static updateGetById(req: express.Request, res: express.Response):void {
  //     let _id = req.params.id;
  //     NewsletterDAO
  //       ['updateGetById'](_id)
  //       .then(newsletters => res.status(200).json(newsletters))
  //       .catch(error => res.status(400).json(error));
  // }

  static releaseNewsletter(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _userId = req.user._id;
      let _idnewsletter = req.params.idnewsletter;

      DevelopmentDAO         
        ['releaseNewsletter'](_id,_idnewsletter, _userId)
        .then(newsletter => res.status(201).json(newsletter))
        .catch(error => res.status(400).json(error));   
  }

  
  static createNewsletter(req: express.Request, res: express.Response):void {
      let _newsletter= req.body;
      _newsletter.files = req.files;
      let _id = req.params.id;
      let _userId = req.user._id;

      DevelopmentDAO         
        ['createNewsletter'](_id,_newsletter, _userId)
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
    let _idnewsletter = req.params.idnewsletter;
    let _newsletter= req.body;

    DevelopmentDAO
      ['updateNewsletter'](_id, _idnewsletter, _newsletter)
      .then(newsletter => res.status(201).json(newsletter))
      .catch(error => res.status(400).json(error));
  }
}
