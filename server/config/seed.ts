/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/dao/user-dao';


User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      username: 'master',
      password: 'master',
      email: 'master@master.com',
      role: 'master'
    }, {
      provider: 'local',
      role: 'super admin',
      name: 'SuperAdmin',
      email: 'superadmin@super.com',
      password: 'superadmin'
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
