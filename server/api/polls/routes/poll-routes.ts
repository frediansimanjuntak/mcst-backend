"use strict";

import * as express from 'express';
import {PollController} from '../controller/poll-controller';
import * as auth from '../../../auth/auth-service';

export class PollRoutes {
    static init(router: express.Router) {
      router
        .route('/polls')
        .get(auth.isAuthenticated(), PollController.getAll)
        .post(auth.isAuthenticated(), PollController.createPoll);

      router
        .route('/polls/:id')
        .get(auth.isAuthenticated(), PollController.getById)
        .delete(auth.isAuthenticated(), PollController.deletePoll);

      router
        .route('/polls/update/:id')
        .post(auth.isAuthenticated(), PollController.updatePoll);

      router
        .route('/polls/vote/:id')
        .post(auth.isAuthenticated(), PollController.addVotePoll);

      router
        .route('/polls/start_poll/:id')
        .post(auth.isAuthenticated(), PollController.startPoll);

      router
        .route('/polls/outcome_poll/:id')
        .get(auth.isAuthenticated(), PollController.outcomePoll);
    }
}
