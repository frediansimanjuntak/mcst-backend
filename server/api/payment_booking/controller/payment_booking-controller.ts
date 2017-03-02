import * as express from 'express';
import PaymentBookingDAO from '../dao/payment_booking-dao';

export class PaymentBookingController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      PaymentBookingDAO
        ['getAll'](_developmentId)
        .then(paymentbookings => res.status(200).json(paymentbookings))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentBookingDAO
        ['getById'](_id)
        .then(paymentbookings => res.status(200).json(paymentbookings))
        .catch(error => res.status(400).json(error));
  }

  static createPaymentBooking(req: express.Request, res: express.Response):void {
    
      let _paymentbooking = req.body;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;
      let _attachment = req["files"].payment_proof;

      PaymentBookingDAO
        ['createPaymentBooking'](_paymentbooking, _userId, _developmentId, _attachment)
        .then(paymentbooking => res.status(201).json(paymentbooking))
        .catch(error => res.status(400).json(error));
  }

  static deletePaymentBooking(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PaymentBookingDAO
        ['deletePaymentBooking'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updatePaymentBooking(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _userId = req["user"]._id;
      let _paymentbooking = req.body;
      let _attachment = req["files"].payment_proof;

      PaymentBookingDAO
        ['updatePaymentBooking'](_id, _userId, _paymentbooking, _attachment)
        .then(_paymentbooking => res.status(201).json(_paymentbooking))
        .catch(error => res.status(400).json(error));
  }
}
