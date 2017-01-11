import * as express from 'express';
// import PropertiesDAO from '../dao/properties-dao';
import DevelopmentDAO from '../../development/dao/development-dao';

export class PropertiesController {
  // static getAll(req: express.Request, res: express.Response):void {
  //     PropertiesDAO
  //       ['getAll']()
  //       .then(propertiess => res.status(200).json(propertiess))
  //       .catch(error => res.status(400).json(error));
  // }

  static getByIdProperties(req: express.Request, res: express.Response):void {
        let _id = req.params.id;
        let _idproperties = req.params.idproperties;
        DevelopmentDAO
          ['getByIdProperties'](_id, _idproperties)
          .then(properties => res.status(200).json(properties))
          .catch(error => res.status(400).json(error));
    }

  static getProperties(req: express.Request, res: express.Response):void {
        let _id = req.params.id;
        DevelopmentDAO
          ['getProperties'](_id)
          .then(properties => res.status(200).json(properties))
          .catch(error => res.status(400).json(error));
    }

  static createProperties(req: express.Request, res: express.Response):void {
      let _properties = req.body;
      let _id = req.params.id;

      DevelopmentDAO
        ['createProperties'](_id, _properties)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static createTenantProperties(req: express.Request, res: express.Response):void {
      let _properties = req.body;
      let _id = req.params.id;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['createTenantProperties'](_id, _idproperties, _properties)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static deleteTenantProperties(req: express.Request, res: express.Response):void {
      let _properties = req.body;
      let _id = req.params.id;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['deleteTenantProperties'](_id, _idproperties, _properties)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static deleteProperties(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _idproperties = req.params.idproperties;

    DevelopmentDAO
      ['deleteProperties'](_id,_idproperties)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateProperties(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _idproperties = req.params.idproperties;
    let _properties = req.body;

    DevelopmentDAO
      ['updateProperties'](_id, _idproperties, _properties)
      .then(properties => res.status(201).json(properties))
      .catch(error => res.status(400).json(error));
  }
}
