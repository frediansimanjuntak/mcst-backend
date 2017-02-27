/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import * as Promise from 'bluebird';
import User from '../api/user/dao/user-dao';

User
  .find({})
  .then(() => {
    User.create({
          provider: 'local',
          username: 'master',
          password: 'master',
          email: 'master@master.com',
          role: 'master',
          active: true
        })
    .then(() => {
      console.log('finished populating users');
    });
  });

