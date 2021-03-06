import * as express from 'express';

export class Routes {
   static init(app: express.Application, router: express.Router) {   
     app.use('/', router);
     app.use('/auth', require('../auth').default);
     app.use('/api/v1', require('../api/v1/index').default);
     }	
}
 