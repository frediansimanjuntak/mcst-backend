import * as express from 'express';
import UserDAO from '../dao/user-dao';
var passport = require('passport');

export class UserController {

  static index(req: express.Request, res: express.Response):void {
      UserDAO
        ['index']()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json(error));
  }

  static userAll(req: express.Request, res: express.Response):void {
      UserDAO
        ['userAll']()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json(error));
  }

  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;
      UserDAO
        ['getAll'](_developmentId)
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json(error));
  }

  static me(req: express.Request, res: express.Response):void {
      let _userId = req["user"]._id;      
      UserDAO
        ['me'](_userId)
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      UserDAO
        ['getById'](_id)
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json(error));
  }

  static createUser(req: express.Request, res: express.Response):void {
      let _user = req.body;
      let _developmentId = req["user"].default_development;
      UserDAO
        ['createUser'](_user, _developmentId)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static createUserSuperAdmin(req: express.Request, res: express.Response):void {
      let _user = req.body;
      UserDAO
        ['createUserSuperAdmin'](_user)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static createUsers(req: express.Request, res: express.Response):void {
      let _user = req.body;
      UserDAO
        ['createUsers'](_user)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static InputUserInLandlordOrTenant(req: express.Request, res: express.Response):void {
      let _user = req.body;
      UserDAO
        ['InputUserInLandlordOrTenant'](_user)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static deleteUser(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _development = req.body;
      UserDAO
        ['deleteUser'](_id, _development)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static resendVerificationUser(req: express.Request, res: express.Response):void {
      let _userId = req["user"]._id;
      let _body = req.body;
      UserDAO
        ['resendVerificationUser'](_userId, _body)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static verifiedUser(req: express.Request, res: express.Response):void {
      let _userId = req["user"]._id;
      let _body = req.body; 
      UserDAO
        ['verifiedUser'](_userId, _body)
        .then(user => res.status(201).json(user))
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

  static updateUsers(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _user = req.body;
      UserDAO
        ['updateUser'](_id, _user)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static activationUser(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      UserDAO
        ['activationUser'](_id)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static unActiveUser(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      UserDAO
        ['unActiveUser'](_id)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static decodeToken(req: express.Request, res: express.Response):void {
      let _data = req.body;
      UserDAO
        ['decodeToken'](_data)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static refreshToken(req: express.Request, res: express.Response):void {
      let _authorization = req.headers.authorization;
      UserDAO
        ['refreshToken'](_authorization)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static addTokenNotif(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _data = req.body;
      UserDAO
        ['addTokenNotif'](_id, _data)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }

  static deleteTokenNotif(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _data = req.body;
      UserDAO
        ['deleteTokenNotif'](_id, _data)
        .then(user => res.status(201).json(user))
        .catch(error => res.status(400).json(error));
  }
}
