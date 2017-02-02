import * as express from 'express';
import IncidentDAO from '../dao/incident-dao';

export class IncidentController {
  static getAll(req: express.Request, res: express.Response):void {
      IncidentDAO
        ['getAll']()
        .then(incidents => res.status(200).json(incidents))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      IncidentDAO
        ['getById'](_id)
        .then(incidents => res.status(200).json(incidents))
        .catch(error => res.status(400).json(error));
  }

  static createIncident(req: express.Request, res: express.Response):void {
      let _incident = req.body;
      let _attachment = req["files"].attachment;
      let _userId= req["user"]._id;
      let _developmentId= req["user"].default_development;
      
      IncidentDAO
        ['createIncident'](_incident, _userId, _developmentId, _attachment)
        .then(incident => res.status(201).json(incident))
        .catch(error => res.status(400).json(error));
  }

  static deleteIncident(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    IncidentDAO
      ['deleteIncident'](_id)
      .then(() => res.status(200).ebnd())
      .catch(error => res.status(400).json(error));
  }

  static statusIncident(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    IncidentDAO
      ['statusIncident'](_id)
      .then(_incident => res.status(201).json(_incident))
      .catch(error => res.status(400).json(error));
  }

  static updateIncident(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _incident = req.body;
    let _attachment = req["files"].attachment;
    let _userId= req["user"]._id;

    IncidentDAO
      ['updateIncident'](_id,_userId, _incident, _attachment)
      .then(_incident => res.status(201).json(_incident))
      .catch(error => res.status(400).json(error));
  }

  static starred(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _starred_by = req.body.starred_by;

    IncidentDAO
      ['starred'](_id, _starred_by)
      .then(_userid => res.status(201).json(_userid))
      .catch(error => res.status(400).json(error));
  }

  static unstarred(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _starred_by = req.body.starred_by;

    IncidentDAO
      ['unstarred'](_id, _starred_by)
      .then(_userid => res.status(201).json(_userid))
      .catch(error => res.status(400).json(error));
  }

  static archieve(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    IncidentDAO
      ['archieve'](_id)
      .then(_userid => res.status(201).json(_userid))
      .catch(error => res.status(400).json(error));
  }

  static unarchieve(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    IncidentDAO
      ['unarchieve'](_id)
      .then(_userid => res.status(201).json(_userid))
      .catch(error => res.status(400).json(error));
  }
}
