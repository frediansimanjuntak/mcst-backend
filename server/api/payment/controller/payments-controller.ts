import * as express from 'express';
import PaymentDAO from '../dao/payments-dao';

export class PaymentsController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      PaymentDAO
        ['getAll'](_developmentId)
        .then(payments => res.status(200).json(payments))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentDAO
        ['getById'](_id)
        .then(payment => res.status(200).json(payment))
        .catch(error => res.status(400).json(error));
  }

  static getByOwnPaymentReceiver(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;
      let _userId = req["user"]._id;

      PaymentDAO
        ['getByOwnPaymentReceiver'](_userId, _developmentId)
        .then(payments => res.status(200).json(payments))
        .catch(error => res.status(400).json(error));
  }

  static createPayments(req: express.Request, res: express.Response):void {
    
      let _payments = req.body;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;
      let _attachment = req["files"];

      PaymentDAO
        ['createPayments'](_payments, _userId, _developmentId, _attachment)
        .then(payment => res.status(201).json(payment))
        .catch(error => res.status(400).json(error));
  }

  static deletePayments(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentDAO
        ['deletePayments'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updatePayments(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _userId = req["user"]._id;
      let _payments = req.body;
      let _attachment = req["files"];

      PaymentDAO
        ['updatePayments'](_id, _userId, _payments, _attachment)
        .then(payment => res.status(201).json(payment))
        .catch(error => res.status(400).json(error));
  }
}
