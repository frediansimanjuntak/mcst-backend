import * as express from 'express';
import UserDAO from '../dao/user-dao';

export class UserController {
  static getAll(req: express.Request, res: express.Response):void {
      UserDAO
        ['getAll']()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json(error));
  }

  static createUser(req: express.Request, res: express.Response):void {
      let _user = req.body;

      UserDAO
        ['createUser'](_user)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static deleteUser(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    UserDAO
      ['deleteUser'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateUser(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _user = req.body;

    UserDAO
      ['updateUser'](_id, _user)
      .then(user => res.status(201).json(user))
      .catch(error => res.status(400).json(error));
  }
}
