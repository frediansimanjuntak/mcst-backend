import * as express from 'express';
import UserDAO from '../../user/dao/user-dao';

export class SettingController {

	static getDetailUser(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      UserDAO
        ['getDetailUser'](_id)
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json(error));
  	}

	static settingDetailUser(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _user = req.body;

    UserDAO
      ['settingDetailUser'](_id, _user)
      .then(user => res.status(201).json(user))
      .catch(error => res.status(400).json(error));
  	}  	

  static settingsocialProfile(req: express.Request, res: express.Response):void {
    let _userId = req["user"].id;
    let _user = req.body;

    UserDAO
      ['settingsocialProfile'](_userId, _user)
      .then(user => res.status(201).json(user))
      .catch(error => res.status(400).json(error));
  }

  static getAllSocialProfile(req: express.Request, res: express.Response):void {

    UserDAO
      ['getAllSocialProfile']()
      .then(user => res.status(201).json(user))
      .catch(error => res.status(400).json(error));
  }

  static getOwnSocialProfile(req: express.Request, res: express.Response):void {
    let _userId = req["user"].id;

    UserDAO
      ['getOwnSocialProfile'](_userId)
      .then(user => res.status(201).json(user))
      .catch(error => res.status(400).json(error));
  } 
}