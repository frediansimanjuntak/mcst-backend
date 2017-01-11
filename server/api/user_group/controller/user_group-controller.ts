import * as express from 'express';
import UserGroupDAO from '../dao/user_group-dao';

export class UserGroupController {
  static getAll(req: express.Request, res: express.Response):void {
      UserGroupDAO
        ['getAll']()
        .then(user_groups => res.status(200).json(user_groups))
        .catch(error => res.status(400).json(error));
  }

  static createUserGroup(req: express.Request, res: express.Response):void {
      let _userGroup = req.body;

      UserGroupDAO
        ['createUserGroup'](_userGroup)
        .then(user_group => res.status(201).json(user_group))
        .catch(error => res.status(400).json(error));
  }

  static deleteUserGroup(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    UserGroupDAO
      ['deleteUserGroup'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateUserGroup(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _userGroup = req.body;

    UserGroupDAO
      ['updateUserGroup'](_id, _userGroup)
      .then(user_group => res.status(201).json(user_group))
      .catch(error => res.status(400).json(error));
  }

  static addUser(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _userGroup = req.body;

    UserGroupDAO
      ['addUser'](_id, _userGroup)
      .then(user_group => res.status(201).json(user_group))
      .catch(error => res.status(400).json(error));
  }

  static deleteUser(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _userGroup = req.body;

    UserGroupDAO
      ['deleteUser'](_id, _userGroup)
      .then(user_group => res.status(201).json(user_group))
      .catch(error => res.status(400).json(error));
  }
}
