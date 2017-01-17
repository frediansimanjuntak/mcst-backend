"use strict";

import * as express from 'express';
import {PollController} from '../controller/poll-controller';
import * as auth from '../../../auth/auth-service';

export class PollRoutes {
    static init(router: express.Router) {
      router
        .route('/api/polls')
        .get(auth.isAuthenticated(), PollController.getAll)
        .post(auth.isAuthenticated(), PollController.createPoll);

      router
        .route('/api/polls/:id')
        .get(auth.isAuthenticated(), PollController.getById)
        .delete(auth.isAuthenticated(), PollController.deletePoll);

      router
        .route('/api/polls/update/:id')
        .post(auth.isAuthenticated(), PollController.updatePoll);

      router
        .route('/api/polls/vote/:id')
        .post(auth.isAuthenticated(), PollController.addVotePoll);
    }
}
