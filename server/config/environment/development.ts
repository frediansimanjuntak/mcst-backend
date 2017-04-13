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
  awsUrl: 's3-ap-southeast-1.amazonaws.com',
  // Mailgun api key and domain
  mailgun: {
    apiKey: 'key-82295c366bc190610da171f7c83b2a2a',
    domain: 'sandbox505d981851714539987a1dd93d687e51.mailgun.org'
  },

  // Seed database on startup
  seedDB: true

};
