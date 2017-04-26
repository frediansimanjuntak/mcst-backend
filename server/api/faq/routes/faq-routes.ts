"use strict";

import * as express from 'express';
import {FaqController} from '../controller/faq-controller';
import * as auth from '../../../auth/auth-service';

export class FaqRoutes {
	static init(router: express.Router) {
		router
			.route('/faqs')
			.get(FaqController.getAll)
			.post(auth.isAuthenticated(), auth.hasRole('admin'), FaqController.createFaq);

		router
			.route('/faqs/:id')
			.get(FaqController.getById)
			.delete(auth.isAuthenticated(), auth.hasRole('admin'), FaqController.deleteFaq);

		router
			.route('/faqs/filter/:filter')
			.get(FaqController.getByFilter)

		router
			.route('/faqs/update/:id')
			.put(auth.isAuthenticated(), auth.hasRole('admin'), FaqController.updateFaq);
	}
}
