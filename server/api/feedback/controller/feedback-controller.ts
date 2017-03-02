import * as express from 'express';
import FeedbackDAO from '../dao/feedback-dao';

export class FeedbackController {
  static getAll(req: express.Request, res: express.Response):void {
      let _developmentId = req["user"].default_development;

      FeedbackDAO
        ['getAll'](_developmentId)
        .then(feedbacks => res.status(200).json(feedbacks))
        .catch(error => res.status(400).json(error));
  }

  static getAllPublish(req: express.Request, res: express.Response):void {
      FeedbackDAO
        ['getAllPublish']()
        .then(feedbacks => res.status(200).json(feedbacks))
        .catch(error => res.status(400).json(error));
  }

  static getAllUnPublish(req: express.Request, res: express.Response):void {
      FeedbackDAO
        ['getAllUnPublish']()
        .then(feedbacks => res.status(200).json(feedbacks))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      FeedbackDAO
        ['getById'](_id)
        .then(feedbacks => res.status(200).json(feedbacks))
        .catch(error => res.status(400).json(error));
  }

  static createFeedback(req: express.Request, res: express.Response):void {
      let _feedback = req.body;
      let _userId = req["user"]._id;
      let _developmentId = req["user"].default_development;

      FeedbackDAO
        ['createFeedback'](_feedback, _userId, _developmentId)
        .then(feedback => res.status(201).json(feedback))
        .catch(error => res.status(400).json(error));
  }

  static deleteFeedback(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      FeedbackDAO
        ['deleteFeedback'](_id)
        .then(() => res.status(200).end())
        .catch(error => res.status(400).json(error));
  }

  static updateFeedback(req: express.Request, res: express.Response):void {
      let _id = req.params.id;
      let _feedback = req.body;

      FeedbackDAO
        ['updateFeedback'](_id, _feedback)
        .then(feedback => res.status(201).json(feedback))
        .catch(error => res.status(400).json(error));
  } 

  static replyFeedback(req: express.Request, res: express.Response):void {
      let _reply = req.body.reply;
      let _userId = req["user"]._id;
      let _id = req.params.id;

      FeedbackDAO
        ['replyFeedback'](_id, _userId, _reply)
        .then(feedback => res.status(201).json(feedback))
        .catch(error => res.status(400).json(error));
  } 

  static publishFeedback(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      FeedbackDAO
        ['publishFeedback'](_id)
        .then(feedback => res.status(201).json(feedback))
        .catch(error => res.status(400).json(error));
  }

  static archieveFeedback(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      FeedbackDAO
        ['archieveFeedback'](_id)
        .then(feedback => res.status(201).json(feedback))
        .catch(error => res.status(400).json(error));
  }
}
