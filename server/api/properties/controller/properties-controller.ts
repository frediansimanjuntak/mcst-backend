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
        let _userId=req.user._id;
        let _developmentId=req.user.default_development;

        DevelopmentDAO
          ['createProperties'](_namedevelopment, _userId, _developmentId, _properties)
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

  //Register Vehicle
  static getRegisterVehicleProperties(req: express.Request, res: express.Response):void {
        let _namedevelopment = req.params.namedevelopment;
        let _idproperties = req.params.idproperties;
        DevelopmentDAO
          ['getRegisterVehicleProperties'](_namedevelopment, _idproperties)
          .then(properties => res.status(200).json(properties))
          .catch(error => res.status(400).json(error));
    }

  static getByIdRegisterVehicleProperties(req: express.Request, res: express.Response):void {
        let _namedevelopment = req.params.namedevelopment;
        let _idregistervehicle = req.params.idregistervehicle;
        let _idproperties = req.params.idproperties;
        DevelopmentDAO
          ['getByIdRegisterVehicleProperties'](_namedevelopment, _idproperties, _idregistervehicle)
          .then(properties => res.status(200).json(properties))
          .catch(error => res.status(400).json(error));
    }

  static createRegisterVehicleProperties(req: express.Request, res: express.Response):void {
        let _registervehicle = req.body;
        let _namedevelopment = req.params.namedevelopment;
        let _idproperties = req.params.idproperties;

        DevelopmentDAO
          ['createRegisterVehicleProperties'](_namedevelopment, _idproperties, _registervehicle)
          .then(properties => res.status(201).json(properties))
          .catch(error => res.status(400).json(error));
  }

  static deleteRegisterVehicleProperties(req: express.Request, res: express.Response):void {
        let _namedevelopment = req.params.namedevelopment;
        let _idregistervehicle = req.params.idregistervehicle;

        DevelopmentDAO
          ['deleteRegisterVehicleProperties'](_namedevelopment, _idregistervehicle)
          .then(properties => res.status(201).json(properties))
          .catch(error => res.status(400).json(error));
  }

  static updateRegisterVehicleProperties(req: express.Request, res: express.Response):void {
        let _registervehicle = req.body;
        let _namedevelopment = req.params.namedevelopment;
        let _idregistervehicle = req.params.idregistervehicle;

        DevelopmentDAO
          ['updateRegisterVehicleProperties'](_namedevelopment, _idregistervehicle, _registervehicle)
          .then(properties => res.status(201).json(properties))
          .catch(error => res.status(400).json(error));
  }
}
