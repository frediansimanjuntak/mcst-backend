import * as express from 'express';
import FaqDAO from '../dao/faq-dao';

export class FaqController {
	static getAll(req: express.Request, res: express.Response):void {
		FaqDAO
		['getAll']()
		.then(faqs => res.status(200).json(faqs))
		.catch(error => res.status(400).json(error));
	}

	static getById(req: express.Request, res: express.Response):void {
		let _id = req.params.id;
		FaqDAO
		['getById'](_id)
		.then(faqs => res.status(200).json(faqs))
		.catch(error => res.status(400).json(error));
	}

	static getByFilter(req: express.Request, res: express.Response):void {
		let _filter = req.params.filter;
		FaqDAO
		['getByFilter'](_filter)
		.then(faqs => res.status(200).json(faqs))
		.catch(error => res.status(400).json(error));
	}

	static createFaq(req: express.Request, res: express.Response):void {
		let _faqs = req.body;
		let _created_by = req["user"]._id;
		FaqDAO
		['createFaq'](_faqs, _created_by)
		.then(faqs => res.status(201).json(faqs))
		.catch(error => res.status(400).json(error));
	}

	static deleteFaq(req: express.Request, res: express.Response):void {
		let _id = req.params.id;
		FaqDAO
		['deleteFaq'](_id)
		.then(() => res.status(200).end())
		.catch(error => res.status(400).json(error));
	}

	static updateFaq(req: express.Request, res: express.Response):void {
		let _id = req.params.id;
		let _faqs = req.body;

		FaqDAO
		['updateFaq'](_id, _faqs)
		.then(faqs => res.status(201).json(faqs))
		.catch(error => res.status(400).json(error));
	}
}