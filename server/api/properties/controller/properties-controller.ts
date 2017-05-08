import * as express from 'express';
// import PropertiesDAO from '../dao/properties-dao';
import DevelopmentDAO from '../../development/dao/development-dao';

export class PropertiesController {

//Property  
  static getByIdProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['getByIdProperties'](_name_url, _idproperties)
        .then(properties => res.status(200).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static getProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;

      DevelopmentDAO
        ['getProperties'](_name_url)
        .then(properties => res.status(200).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static createProperties(req: express.Request, res: express.Response):void {
      let _properties = req.body;
      let _name_url = req.params.name_url;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;

      DevelopmentDAO
        ['createProperties'](_name_url, _userId, _developmentId, _properties)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static deleteProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['deleteProperties'](_name_url,_idproperties)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static deleteLandlord(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['deleteLandlord'](_name_url, _idproperties)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

    static changeLandlord(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;
      let _landlord = req.body;

      DevelopmentDAO
        ['changeLandlord'](_name_url, _idproperties, _landlord)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;
      let _properties = req.body;

      DevelopmentDAO
        ['updateProperties'](_name_url, _idproperties, _properties)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static generateCodeProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;
      let _properties = req.body;

      DevelopmentDAO
        ['generateCodeProperties'](_name_url, _idproperties, _properties)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static getOwnerVehicleByLicensePlat(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _license_plate = req.params.license_plate;

      DevelopmentDAO
        ['getOwnerVehicleByLicensePlat'](_name_url, _license_plate)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static deleteCodeProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;
      let _properties = req.body;

      DevelopmentDAO
        ['deleteCodeProperties'](_name_url, _idproperties, _properties)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

//Tenant
  static getTenantProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['getTenantProperties'](_name_url, _idproperties)
        .then(properties => res.status(200).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static getByIdTenantProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idtenant = req.params.idtenant;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['getByIdTenantProperties'](_name_url, _idproperties, _idtenant)
        .then(properties => res.status(200).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static createTenantProperties(req: express.Request, res: express.Response):void {
      let _tenant = req.body;
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['createTenantProperties'](_name_url, _idproperties, _tenant)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static deleteTenantProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idtenant = req.params.idtenant;
      let _idproperties = req.params.idproperties;
      let _tenant = req.body;
      let _development = req["user"].default_development;

      DevelopmentDAO
        ['deleteTenantProperties'](_name_url, _idtenant, _idproperties, _tenant, _development)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static updateTenantProperties(req: express.Request, res: express.Response):void {
      let _tenant = req.body;
      let _name_url = req.params.name_url;
      let _idtenant = req.params.idtenant;

      DevelopmentDAO
        ['updateTenantProperties'](_name_url, _idtenant, _tenant)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  //Register Vehicle
  static getRegisterVehicleProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['getRegisterVehicleProperties'](_name_url, _idproperties)
        .then(properties => res.status(200).json(properties))
        .catch(error => res.status(400).json(error));
    }

  static getByIdRegisterVehicleProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idregistervehicle = req.params.idregistervehicle;
      let _idproperties = req.params.idproperties;
      
      DevelopmentDAO
        ['getByIdRegisterVehicleProperties'](_name_url, _idproperties, _idregistervehicle)
        .then(properties => res.status(200).json(properties))
        .catch(error => res.status(400).json(error));
    }

  static createRegisterVehicleProperties(req: express.Request, res: express.Response):void {
      let _registervehicle = req.body;
      let _name_url = req.params.name_url;
      let _idproperties = req.params.idproperties;
      let _userId = req["user"]._id;
      let _attachment = req["files"].document;

      DevelopmentDAO
        ['createRegisterVehicleProperties'](_name_url, _idproperties, _userId, _registervehicle, _attachment)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static deleteRegisterVehicleProperties(req: express.Request, res: express.Response):void {
      let _name_url = req.params.name_url;
      let _idregistervehicle = req.params.idregistervehicle;
      let _idproperties = req.params.idproperties;

      DevelopmentDAO
        ['deleteRegisterVehicleProperties'](_name_url, _idregistervehicle, _idproperties)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }

  static updateRegisterVehicleProperties(req: express.Request, res: express.Response):void {
      let _registervehicle = req.body;
      let _name_url = req.params.name_url;
      let _idregistervehicle = req.params.idregistervehicle;
      let _userId = req["user"]._id;
      let _attachment = req["files"].document;

      DevelopmentDAO
        ['updateRegisterVehicleProperties'](_name_url, _idregistervehicle, _userId, _registervehicle, _attachment)
        .then(properties => res.status(201).json(properties))
        .catch(error => res.status(400).json(error));
  }
}
