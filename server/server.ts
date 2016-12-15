/// <reference path="../typings/index.d.ts" />

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'production')
    require('newrelic');

import * as express from 'express';
import * as os from 'os';
import * as https from 'https';
import * as fs from 'fs';
import config from './config/environment/index';
import {RoutesConfig} from './config/routes.conf';
import {DBConfig} from './config/db.conf';
import {Routes} from './routes/index';

var PORT = process.env.PORT || 3000;
const app = express();

RoutesConfig.init(app);
DBConfig.init();
Routes.init(app, express.Router());


const opts = {
  key: fs.readFileSync(__dirname + '/../server/cert/server.key'),
  cert: fs.readFileSync(__dirname + '/../server/cert/server.crt')
}

https.createServer(opts, app)
     .listen(PORT, () => {
       console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
       console.log(`enviroment: ${process.env.NODE_ENV}`);
     });
