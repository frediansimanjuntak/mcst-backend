import * as express from 'express';
import ContactDirectoryDAO from '../dao/contact_directory-dao';

export class ContactDiretoryController {
  static getAll(req: express.Request, res: express.Response):void {
      let _development = req["user"].default_development;

      ContactDirectoryDAO   
        ['getAll'](_development)
        .then(contacts => res.status(200).json(contacts))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      
      ContactDirectoryDAO
        ['getById'](_id)
        .then(contact => res.status(200).json(contact))
        .catch(error => res.status(400).json(error));
  }

  static createContactDirectory(req: express.Request, res: express.Response):void {
      let _data = req.body;

      ContactDirectoryDAO
        ['createContactDirectory'](_data)
        .then(contact => res.status(201).json(contact))
        .catch(error => res.status(400).json(error));
  }

  static deleteContactDirectory(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      ContactDirectoryDAO
        ['deleteContactDirectory'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateContactDirectory(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _data = req.body;

      ContactDirectoryDAO
        ['updateContactDirectory'](_id, _data)
        .then(contact => res.status(201).json(contact))
        .catch(error => res.status(400).json(error));
  }
}
