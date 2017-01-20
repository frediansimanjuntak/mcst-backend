import * as express from 'express';
import QuotationDAO from '../dao/quotation-dao';

export class QuotationController {
  static getAll(req: express.Request, res: express.Response):void {
      QuotationDAO
        ['getAll']()
        .then(quotations => res.status(200).json(quotations))
        .catch(error => res.status(400).json(error));
  }

  static getById(req: express.Request, res: express.Response):void {
      let _id = req.params.id;

      QuotationDAO
        ['getById'](_id)
        .then(quotations => res.status(200).json(quotations))
        .catch(error => res.status(400).json(error));
  }

  static createQuotation(req: express.Request, res: express.Response):void {
      let _quotation = req.body;
      _quotation.files=req.files;
      let _userId = req.user._id;
      let _developmentId = req.user.default_development;

      QuotationDAO
        ['createQuotation'](_quotation, _userId, _developmentId)
        .then(quotation => res.status(201).json(quotation))
        .catch(error => res.status(400).json(error));
  }

  static deleteQuotation(req: express.Request, res: express.Response):void {
    let _id = req.params.id;

    QuotationDAO
      ['deleteQuotation'](_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }

  static updateQuotation(req: express.Request, res: express.Response):void {
    let _id = req.params.id;
    let _quotation = req.body;
    _quotation.files=req.files;
    let _userId = req.user._id;

    QuotationDAO
      ['updateQuotation'](_id, _userId, _quotation)
      .then(quotation => res.status(201).json(quotation))
      .catch(error => res.status(400).json(error));
  }

}
