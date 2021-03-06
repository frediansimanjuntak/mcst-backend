import * as express from 'express';
import BookingDAO from '../dao/booking-dao';

export class BookingController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      BookingDAO
        ['getAll'](_developmentId)
        .then(bookings => res.status(200).json(bookings))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      BookingDAO
        ['getById'](_id)
        .then(bookings => res.status(200).json(bookings))
        .catch(error => res.status(400).json(error));
  }

  static getOwn(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;
      let _userId = req["user"]._id;

      BookingDAO
        ['getOwn'](_userId, _developmentId)
        .then(bookings => res.status(200).json(bookings))
        .catch(error => res.status(400).json(error));
  }

  static createBooking(req: express.Request, res: express.Response):void {
      let _booking = req.body;
      let _attachment = req["files"];
      let _userId= req["user"]._id;      
      let _developmentId= req["user"].default_development;

      BookingDAO
        ['createBooking'](_booking, _userId, _developmentId, _attachment)
        .then(booking => res.status(201).json(booking))
        .catch(error => res.status(400).json(error));
  }

  static deleteBooking(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      BookingDAO
        ['deleteBooking'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateBooking(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _booking = req.body;

      BookingDAO
        ['updateBooking'](_id, _booking)
        .then(booking => res.status(201).json(booking))
        .catch(error => res.status(400).json(error));
  }
}
