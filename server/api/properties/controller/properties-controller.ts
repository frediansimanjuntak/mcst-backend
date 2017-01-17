import * as express from 'express';
// import PropertiesDAO from '../dao/properties-dao';
import DevelopmentDAO from '../../development/dao/development-dao';

export class PropertiesController {

//Property  
  static getByIdProperties(req: express.Request, res: express.Response):void {
        let _namedevelopment = req.params.namedevelopment;
        let _idproperties = req.params.idproperties;
        DevelopmentDAO
          ['getByIdProperties'](_namedevelopment, _idproperties)
          .then(properties => res.status(200).json(properties))
          .catch(error => res.status(400).json(error));
    }

  static getProperties(req: express.Request, res: express.Response):void {
        let _namedevelopment = req.params.namedevelopment;
        DevelopmentDAO
          ['getProperties'](_namedevelopment)
          .then(properties => res.status(200).json(properties))
          .catch(error => res.status(400).json(error));
    }

  static createProperties(req: express.Request, res: express.Response):void {
      let _properties = req.body;
      let _namedevelopment = req.params.namedevelopment;

      DevelopmentDAO
        ['createProperties'](_namedevelopment, _properties)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static deleteProperties(req: express.Request, res: express.Response):void {
    let _namedevelopment = req.params.namedevelopment;
    let _idproperties = req.params.idproperties;

    DevelopmentDAO
      ['deleteProperties'](_namedevelopment,_idproperties)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateProperties(req: express.Request, res: express.Response):void {
    let _namedevelopment = req.params.namedevelopment;
    let _idproperties = req.params.idproperties;
    let _properties = req.body;

    DevelopmentDAO
      ['updateProperties'](_namedevelopment, _idproperties, _properties)
      .then(properties => res.status(201).json(properties))
      .catch(error => res.status(400).json(error));
  }

//Tenant
  static getTenantProperties(req: express.Request, res: express.Response):void {
        let _namedevelopment = req.params.namedevelopment;
        let _idproperties = req.params.idproperties;
        DevelopmentDAO
          ['getTenantProperties'](_namedevelopment, _idproperties)
          .then(properties => res.status(200).json(properties))
          .catch(error => res.status(400).json(error));
    }

  static getByIdTenantProperties(req: express.Request, res: express.Response):void {
        let _namedevelopment = req.params.namedevelopment;
        let _idtenant = req.params.idtenant;
        let _idproperties = req.params.idproperties;
        DevelopmentDAO
          ['getByIdTenantProperties'](_namedevelopment, _idproperties, _idtenant)
          .then(properties => res.status(200).json(properties))
          .catch(error => res.status(400).json(error));
    }

  static createTenantProperties(req: express.Request, res: express.Response):void {
      let _tenant = req.body;
      let _namedevelopment = req.params.namedevelopment;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['createTenantProperties'](_namedevelopment, _idproperties, _tenant)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static deleteTenantProperties(req: express.Request, res: express.Response):void {
      let _namedevelopment = req.params.namedevelopment;
      let _idtenant = req.params.idtenant;

      DevelopmentDAO
        ['deleteTenantProperties'](_namedevelopment, _idtenant)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static updateTenantProperties(req: express.Request, res: express.Response):void {
      let _tenant = req.body;
      let _namedevelopment = req.params.namedevelopment;
      let _idtenant = req.params.idtenant;

      DevelopmentDAO
        ['updateTenantProperties'](_namedevelopment, _idtenant, _tenant)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }
}
