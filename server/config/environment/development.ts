'use strict';
import * as Promise from 'bluebird';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
export default {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/mcst-backend',
    options: {
      promiseLibrary: Promise
    }
  },
  awsBucket: 'mcst-app',
  // Mailgun api key and domain
  mailgun: {
    apiKey: "key-20ff0e5ffdc1bb87f94edc511b5e4c25",
    domain: "sandbox48d4e1febd4742f2b66e2b74f8237175.mailgun.org"
  },

  // Seed database on startup
  seedDB: true

};
