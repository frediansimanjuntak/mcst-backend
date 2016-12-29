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
}