import * as express from 'express';
import CompanyDAO from '../dao/company-dao';


export class CompanyController {
  static getAll(req: express.Request, res: express.Response):void {
      CompanyDAO
        ['getAll']()
        .then(companies => res.status(200).json(companies))
        .catch(error => res.status(400).json(error));
  }

  static getAllNameCompany(req: express.Request, res: express.Response):void {
      CompanyDAO
        ['getAllNameCompany']()
        .then(companies => res.status(200).json(companies))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      CompanyDAO
        ['getById'](_id)
        .then(companies => res.status(200).json(companies))
        .catch(error => res.status(400).json(error));
  }

  static createCompany(req: express.Request, res: express.Response):void {
      let _company = req.body;
      let _userId = req["user"]._id;

      CompanyDAO
        ['createCompany'](_company, _userId)
        .then(company => res.status(201).json(company))
        .catch(error => res.status(400).json(error));
  }

  static deleteCompany(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      CompanyDAO
        ['deleteCompany'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateCompany(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _company = req.body;
      let _attachment = req["files"].attachment;
      let _userId = req["user"]._id;

      CompanyDAO
        ['updateCompany'](_id, _userId, _company, _attachment)
        .then(company => res.status(201).json(company))
        .catch(error => res.status(400).json(error));
  }

  static addEmployeeCompany(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _employee = req.body.employee;

      CompanyDAO
        ['addEmployeeCompany'](_id, _employee)
        .then(company => res.status(201).json(company))
        .catch(error => res.status(400).json(error));
  }

  static removeEmployeeCompany(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _employee = req.body.employee;

      CompanyDAO
        ['removeEmployeeCompany'](_id, _employee)
        .then(company => res.status(201).json(company))
        .catch(error => res.status(400).json(error));
  }

  static activationCompany(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _company = req.body;

      CompanyDAO
        ['activationCompany'](_id, _company)
        .then(company => res.status(201).json(company))
        .catch(error => res.status(400).json(error));
  }
}
