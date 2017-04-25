import * as express from 'express';
import HobbiesDAO from '../dao/hobbies-dao';

export class HobbiesController {
  static getAll(req: express.Request, res: express.Response):void {
      HobbiesDAO   
        ['getAll']()
        .then(hobbies => res.status(200).json(hobbies))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      
      HobbiesDAO
        ['getById'](_id)
        .then(hobbies => res.status(200).json(hobbies))
        .catch(error => res.status(400).json(error));
  }

  static createHobbies(req: express.Request, res: express.Response):void {
      let _data = req.body;

      HobbiesDAO
        ['createHobbies'](_data)
        .then(hobby => res.status(201).json(hobby))
        .catch(error => res.status(400).json(error));
  }

  static deleteHobbies(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      HobbiesDAO
        ['deleteHobbies'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateHobbies(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _data = req.body;

      HobbiesDAO
        ['updateHobbies'](_id, _data)
        .then(hobby => res.status(201).json(hobby))
        .catch(error => res.status(400).json(error));
  }
}
