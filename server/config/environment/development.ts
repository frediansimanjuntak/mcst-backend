'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
export default {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/mcst-backend'
  },
  awsBucket: 'mcst-app',

  // Seed database on startup
  seedDB: false

};
