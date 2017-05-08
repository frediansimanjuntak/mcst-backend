import * as express from 'express';
import VehicleDAO from '../dao/vehicle-dao';

export class VehicleController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      VehicleDAO
        ['getAll'](_developmentId)
        .then(vehicles => res.status(200).json(vehicles))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      VehicleDAO
        ['getById'](_id)
        .then(vehicle => res.status(200).json(vehicle))
        .catch(error => res.status(400).json(error));
  }

  static getByProperty(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      VehicleDAO
        ['getByProperty'](_id)
        .then(vehicles => res.status(200).json(vehicles))
        .catch(error => res.status(400).json(error));
  }

  static getByLicensePlate(req: express.Request, res: express.Response):void {
      let _license = req.params.license;

      VehicleDAO
        ['getByLicensePlate'](_license)
        .then(vehicle => res.status(200).json(vehicle))
        .catch(error => res.status(400).json(error));
  }

  static getByOwner(req: express.Request, res: express.Response):void {
      let _owner = req.params.owner;

      VehicleDAO
        ['getByOwner'](_owner)
        .then(vehicles => res.status(200).json(vehicles))
        .catch(error => res.status(400).json(error));
  }

  static createVehicle(req: express.Request, res: express.Response):void {
      let _lostfound = req.body;
      let _attachment = req["files"].document;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;      

      VehicleDAO
        ['createVehicle'](_lostfound, _userId, _developmentId, _attachment)
        .then(vehicle => res.status(201).json(vehicle))
        .catch(error => res.status(400).json(error));
  }

  static deleteVehicle(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    VehicleDAO
      ['deleteVehicle'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateVehicle(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _lostfound = req.body;
    let _attachment = req["files"].document;
    let _userId = req["user"]._id;

    VehicleDAO
      ['updateVehicle'](_id, _userId, _lostfound, _attachment)
      .then(vehicle => res.status(201).json(vehicle))
      .catch(error => res.status(400).json(error));
  } 
}
