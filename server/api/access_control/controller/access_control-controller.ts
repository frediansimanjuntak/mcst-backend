import * as express from 'express';
import AccessControlDAO from '../dao/access_control-dao';

export class AccessControlController {
  static getAll(req: express.Request, res: express.Response):void {
      AccessControlDAO
        ['getAll']()
        .then(annoncements => res.status(200).json(annoncements))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      AccessControlDAO
        ['getById'](_id)
        .then(annoncements => res.status(200).json(annoncements))
        .catch(error => res.status(400).json(error));
  }

  static createAccessControl(req: express.Request, res: express.Response):void {
      let _accesscontrol = req.body;

      AccessControlDAO
        ['createAccessControl'](_accesscontrol)
        .then(accesscontrol => res.status(201).json(accesscontrol))
        .catch(error => res.status(400).json(error));
  }

  static deleteAccessControl(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    AccessControlDAO
      ['deleteAccessControl'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateAccessControl(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _accesscontrol = req.body;

    AccessControlDAO
      ['updateAccessControl'](_id, _accesscontrol)
      .then(_accesscontrol => res.status(201).json(_accesscontrol))
      .catch(error => res.status(400).json(error));
  }
}
