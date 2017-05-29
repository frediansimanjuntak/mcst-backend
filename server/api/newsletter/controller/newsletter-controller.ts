import * as express from 'express';
import DevelopmentDAO from '../../development/dao/development-dao';

export class NewsletterController {

  static getByIdNewsletter(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idnewsletter = req.params.idnewsletter;
      DevelopmentDAO
        ['getByIdNewsletter'](_name_url, _idnewsletter)
        .then(newsletters => res.status(200).json(newsletters))
        .catch(error => res.status(400).json(error));
  }

  static getNewsletter(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      DevelopmentDAO
        ['getNewsletter'](_name_url)
        .then(newsletters => res.status(200).json(newsletters))
        .catch(error => res.status(400).json(error));
  }

  static releaseNewsletter(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _userId = req["user"]._id;
      let _idnewsletter = req.params.idnewsletter;

      DevelopmentDAO         
        ['releaseNewsletter'](_name_url, _userId, _idnewsletter)
        .then(newsletter => res.status(201).json(newsletter))
        .catch(error => res.status(400).json(error));   
  }
  
  static createNewsletter(req: express.Request, res: express.Response):void {
      let _newsletter= req.body;
      let _attachment = req["files"];      
      let _name_url = req.params.name_url;
      let _userId = req["user"]._id;

      DevelopmentDAO         
        ['createNewsletter'](_name_url, _newsletter, _userId, _attachment)
        .then(newsletter => res.status(201).json(newsletter))
        .catch(error => res.status(400).json(error));   }

  static deleteNewsletter(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idnewsletter = req.params.idnewsletter;

      DevelopmentDAO
        ['deleteNewsletter'](_name_url, _idnewsletter)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateNewsletter(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idnewsletter = req.params.idnewsletter;
      let _attachment = req["files"];  
      let _userId = req["user"]._id; 
      let _newsletter= req.body;

      DevelopmentDAO
        ['updateNewsletter'](_name_url, _idnewsletter, _userId, _newsletter, _attachment)
        .then(newsletter => res.status(201).json(newsletter))
        .catch(error => res.status(400).json(error));
  }
}
