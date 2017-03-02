import * as express from 'express';
import PaymentreminderDAO from '../dao/payment_reminder-dao';

export class PaymentReminderController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      PaymentreminderDAO
        ['getAll'](_developmentId)
        .then(paymentreminders => res.status(200).json(paymentreminders))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentreminderDAO
        ['getById'](_id)
        .then(paymentreminders => res.status(200).json(paymentreminders))
        .catch(error => res.status(400).json(error));
  }

  static createPaymentReminder(req: express.Request, res: express.Response):void {
      let _paymentreminder = req.body;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;

      PaymentreminderDAO
        ['createPaymentReminder'](_paymentreminder, _userId, _developmentId)
        .then(paymentreminder => res.status(201).json(paymentreminder))
        .catch(error => res.status(400).json(error));
  }

  static deletePaymentReminder(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentreminderDAO
        ['deletePaymentReminder'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updatePaymentReminder(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _paymentreminder = req.body;

      PaymentreminderDAO
        ['updatePaymentReminder'](_id, _paymentreminder)
        .then(paymentreminder => res.status(201).json(paymentreminder))
      .catch(error => res.status(400).json(error));
  } 

  static publishPaymentReminder(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentreminderDAO
        ['publishPaymentReminder'](_id)
        .then(paymentreminder => res.status(201).json(paymentreminder))
      .catch(error => res.status(400).json(error));
  } 
}
