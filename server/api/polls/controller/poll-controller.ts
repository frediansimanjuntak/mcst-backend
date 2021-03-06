import * as express from 'express';
import PollDAO from '../dao/poll-dao';

export class PollController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      PollDAO
        ['getAll'](_developmentId)
        .then(polls => res.status(200).json(polls))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PollDAO
        ['getById'](_id)
        .then(polls => res.status(200).json(polls))
        .catch(error => res.status(400).json(error));
  }

  static createPoll(req: express.Request, res: express.Response):void {
      let _poll = req.body;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;

      PollDAO
        ['createPoll'](_poll, _userId, _developmentId)
        .then(poll => res.status(201).json(poll))
        .catch(error => res.status(400).json(error));
  }

  static deletePoll(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PollDAO
        ['deletePoll'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updatePoll(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _poll = req.body;

      PollDAO
        ['updatePoll'](_id, _poll)
        .then(poll => res.status(201).json(poll))
        .catch(error => res.status(400).json(error));
  }

  static addVotePoll(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _userId = req["user"]._id;
      let _poll = req.body;

      PollDAO
        ['addVotePoll'](_id, _userId, _poll)
        .then(poll => res.status(201).json(poll))
        .catch(error => res.status(400).json(error));
  }

  static startPoll(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PollDAO
        ['startPoll'](_id)
        .then(poll => res.status(201).json(poll))
        .catch(error => res.status(400).json(error));
  }

  static stopPoll(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      PollDAO
        ['stopPoll'](_id)
        .then(poll => res.status(201).json(poll))
        .catch(error => res.status(400).json(error));
  }

  static stopAllPollToday(req: express.Request, res: express.Response):void {

      PollDAO
        ['stopAllPollToday']()
        .then(poll => res.status(201).json(poll))
        .catch(error => res.status(400).json(error));
  }
}
