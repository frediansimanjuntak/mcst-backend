// / <reference path="../typings/index.d.ts" />

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'production')
    require('newrelic');

import * as express from 'express';
import * as os from 'os';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import config from './config/environment/index';
import {AWSConfig} from './global/aws.service';
import {GlobalService} from './global/global.service';
import {RoutesConfig} from './config/routes.conf';
import {DBConfig} from './config/db.conf';
import {Routes} from './routes/index';
import {Cron} from './cron/index';

var PORT = process.env.PORT || 5000;
const app = express();

if(config.seedDB) { require('./config/seed'); }

require('./config/express').default(app);
RoutesConfig.init(app);
DBConfig.init();
Cron.init();
// DBConfig.listenTo();
GlobalService.init();
GlobalService.initGlobalFunction();
AWSConfig.init();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
  next()
})

Routes.init(app, express.Router());


const opts = {
  key: fs.readFileSync(__dirname + '/../server/cert/server.key'),
  cert: fs.readFileSync(__dirname + '/../server/cert/server.crt')
}

var server = http.createServer(app)
var io = require('socket.io')(server);

export class socketIo{
  static notif(data){
    let body:any = data;    
    let userId = body.user;
    io.on('connect', onConnect);
    function onConnect(socket){
      socket.emit('notification_'+userId, { message: 'You get new notification', type: body.type, referenceId: body.reference_id});
    }
  }
}


// if(http){
  // run using http
// http.createServer(app)
server.listen(PORT, () => {
       console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
       console.log(`enviroment: ${process.env.NODE_ENV}`);
     });
// }
// if(https){
//   // run using https
// https.createServer(opts, app)
//      .listen(PORT, () => {
//        console.log(`up and running @: ${os.hostname()} on port: ${PORT}`);
//        console.log(`enviroment: ${process.env.NODE_ENV}`);
//      });
// }



