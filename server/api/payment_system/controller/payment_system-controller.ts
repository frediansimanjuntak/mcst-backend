import * as express from 'express';
import PaymentsystemDAO from '../dao/payment_system-dao';

export class PaymentSystemController {
  static getAll(req: express.Request, res: express.Response):void {
      PaymentsystemDAO
        ['getAll']()
        .then(paymentsystems => res.status(200).json(paymentsystems))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentsystemDAO
        ['getById'](_id)
        .then(paymentsystems => res.status(200).json(paymentsystems))
        .catch(error => res.status(400).json(error));
  }

  static createPaymentSystem(req: express.Request, res: express.Response):void {
      let _paymentsystem = req.body;
      let _userId = req.user._id;
      let _developmentId = req.user.default_development;

      PaymentsystemDAO
        ['createPaymentSystem'](_paymentsystem, _userId, _developmentId)
        .then(paymentsystem => res.status(201).json(paymentsystem))
        .catch(error => res.status(400).json(error));
  }

  static deletePaymentSystem(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentsystemDAO
        ['deletePaymentSystem'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updatePaymentSystem(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _paymentsystem = req.body;

      PaymentsystemDAO
        ['updatePaymentSystem'](_id, _paymentsystem)
        .then(paymentsystem => res.status(201).json(paymentsystem))
      .catch(error => res.status(400).json(error));
  } 

  static publishPaymentSystem(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentsystemDAO
        ['publishPaymentSystem'](_id)
        .then(paymentsystem => res.status(201).json(paymentsystem))
      .catch(error => res.status(400).json(error));
  } 

}
